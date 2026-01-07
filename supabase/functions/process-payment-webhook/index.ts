import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-signature, x-request-id",
};

interface WebhookPayload {
  action: string;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: string;
  user_id: string;
}

/**
 * Validate webhook signature from Mercado Pago
 * Uses HMAC SHA-256 to verify the webhook is authentic
 */
async function validateWebhookSignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string
): Promise<boolean> {
  if (!xSignature || !xRequestId) {
    console.warn("Missing signature headers");
    return false;
  }

  const secret = Deno.env.get("MERCADO_PAGO_WEBHOOK_SECRET");
  if (!secret) {
    console.warn("MERCADO_PAGO_WEBHOOK_SECRET not configured - skipping validation");
    return true; // Allow in development if secret not set
  }

  try {
    // Parse x-signature header
    // Format: "ts=1234567890,v1=hash_value"
    const parts = xSignature.split(",");
    const tsMatch = parts.find((p) => p.startsWith("ts="));
    const v1Match = parts.find((p) => p.startsWith("v1="));

    if (!tsMatch || !v1Match) {
      console.error("Invalid signature format");
      return false;
    }

    const ts = tsMatch.split("=")[1];
    const receivedHash = v1Match.split("=")[1];

    // Build manifest string as per MP docs
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    // Calculate HMAC SHA-256
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(manifest)
    );

    // Convert to hex string
    const calculatedHash = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const isValid = calculatedHash === receivedHash;
    if (!isValid) {
      console.error("Signature validation failed:", {
        calculated: calculatedHash,
        received: receivedHash,
      });
    }

    return isValid;
  } catch (error) {
    console.error("Error validating signature:", error);
    return false;
  }
}

/**
 * Fetch payment details from Mercado Pago API
 */
async function fetchPaymentDetails(paymentId: string): Promise<any> {
  const isProduction = Deno.env.get("ENVIRONMENT") === "production";
  const accessToken = isProduction
    ? Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN_PROD")
    : Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");

  if (!accessToken) {
    throw new Error("Mercado Pago access token not configured");
  }

  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch payment: ${response.statusText} - ${error}`);
  }

  return await response.json();
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get webhook payload
    const webhookPayload: WebhookPayload = await req.json();
    console.log("Webhook received:", {
      type: webhookPayload.type,
      action: webhookPayload.action,
      payment_id: webhookPayload.data.id,
    });

    // Get signature headers
    const xSignature = req.headers.get("x-signature");
    const xRequestId = req.headers.get("x-request-id");

    // Validate signature (security)
    const isValid = await validateWebhookSignature(
      xSignature,
      xRequestId,
      webhookPayload.data.id
    );

    if (!isValid) {
      console.error("Invalid webhook signature - possible fraud attempt");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Log webhook for audit
    const { error: logError } = await supabase
      .from("payment_webhooks")
      .insert({
        payment_id: webhookPayload.data.id,
        event_type: webhookPayload.type,
        event_data: webhookPayload,
        signature: xSignature,
        request_id: xRequestId,
        processed: false,
      });

    if (logError) {
      console.error("Error logging webhook:", logError);
      // Continue processing even if logging fails
    }

    // Process only payment-related webhooks
    if (webhookPayload.type !== "payment") {
      console.log("Ignoring non-payment webhook");
      return new Response(
        JSON.stringify({ message: "Webhook received but not processed" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Fetch full payment details from Mercado Pago
    const paymentDetails = await fetchPaymentDetails(webhookPayload.data.id);
    console.log("Payment details fetched:", {
      id: paymentDetails.id,
      status: paymentDetails.status,
      status_detail: paymentDetails.status_detail,
    });

    // Find associated pedido using metadata or payment_id
    const pedidoId = paymentDetails.metadata?.pedido_id;
    if (!pedidoId) {
      console.error("No pedido_id in payment metadata");
      // Still mark as processed to avoid retries
      await supabase
        .from("payment_webhooks")
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
          error_message: "No pedido_id in metadata",
        })
        .eq("payment_id", webhookPayload.data.id);

      return new Response(
        JSON.stringify({ error: "No pedido_id in payment metadata" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Get pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .select("*")
      .eq("id", pedidoId)
      .single();

    if (pedidoError || !pedido) {
      console.error("Pedido not found:", pedidoId);
      await supabase
        .from("payment_webhooks")
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
          error_message: `Pedido not found: ${pedidoId}`,
        })
        .eq("payment_id", webhookPayload.data.id);

      return new Response(
        JSON.stringify({ error: "Pedido not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Determine new status based on payment status
    let newStatus = pedido.status;
    if (paymentDetails.status === "approved") {
      newStatus = "pago";
    } else if (
      paymentDetails.status === "rejected" ||
      paymentDetails.status === "cancelled"
    ) {
      newStatus = "rejeitado";
    } else if (paymentDetails.status === "in_process" || paymentDetails.status === "pending") {
      newStatus = "aguardando_pagamento";
    }

    // Update pedido with payment status
    const { error: updateError } = await supabase
      .from("pedidos")
      .update({
        payment_status: paymentDetails.status,
        status: newStatus,
        payment_approved_at:
          paymentDetails.status === "approved"
            ? new Date().toISOString()
            : null,
        payment_metadata: paymentDetails,
        webhook_received_at: new Date().toISOString(),
      })
      .eq("id", pedidoId);

    if (updateError) {
      console.error("Error updating pedido:", updateError);
      throw updateError;
    }

    console.log("Pedido updated successfully:", {
      pedido_id: pedidoId,
      new_status: newStatus,
      payment_status: paymentDetails.status,
    });

    // Mark webhook as processed
    await supabase
      .from("payment_webhooks")
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        pedido_id: pedidoId,
      })
      .eq("payment_id", webhookPayload.data.id);

    // If payment approved, send confirmation email
    if (paymentDetails.status === "approved") {
      try {
        console.log("Sending confirmation email...");
        await supabase.functions.invoke("send-order-confirmation", {
          body: {
            pedido_id: pedidoId,
            payment_confirmed: true,
          },
        });
        console.log("Confirmation email sent");
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Don't throw - email is not critical for webhook processing
      }
    }

    // IMPORTANT: Return 200 within 22 seconds to avoid MP retries
    return new Response(
      JSON.stringify({
        success: true,
        pedido_id: pedidoId,
        payment_status: paymentDetails.status,
        order_status: newStatus,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error processing webhook:", error);

    // IMPORTANT: Even on error, return 200 to prevent infinite retries
    // We've logged the error in the database
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
        // Note: We return 200 to prevent MP from retrying
        // Check payment_webhooks table for actual errors
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Return 200 to avoid retries
      }
    );
  }
});
