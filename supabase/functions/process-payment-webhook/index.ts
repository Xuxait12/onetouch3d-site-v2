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

async function validateWebhookSignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string
): Promise<boolean> {
  if (!xSignature || !xRequestId) {
    return false;
  }

  const secret = Deno.env.get("MERCADO_PAGO_WEBHOOK_SECRET");
  if (!secret) {
    return true;
  }

  try {
    const parts = xSignature.split(",");
    const tsMatch = parts.find((p) => p.startsWith("ts="));
    const v1Match = parts.find((p) => p.startsWith("v1="));

    if (!tsMatch || !v1Match) {
      return false;
    }

    const ts = tsMatch.split("=")[1];
    const receivedHash = v1Match.split("=")[1];

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

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

    const calculatedHash = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return calculatedHash === receivedHash;
  } catch {
    return false;
  }
}

async function fetchPaymentDetails(paymentId: string): Promise<any> {
  const isProduction = Deno.env.get("ENVIRONMENT") === "production";
  const accessToken = isProduction
    ? Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN_PROD")
    : Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");

  if (!accessToken) {
    throw new Error("Token de acesso não configurado");
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
    throw new Error(`Falha ao buscar pagamento: ${response.statusText} - ${error}`);
  }

  return await response.json();
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const webhookPayload: WebhookPayload = await req.json();

    const xSignature = req.headers.get("x-signature");
    const xRequestId = req.headers.get("x-request-id");

    const isValid = await validateWebhookSignature(
      xSignature,
      xRequestId,
      webhookPayload.data.id
    );

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Assinatura inválida" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    await supabase
      .from("payment_webhooks")
      .insert({
        payment_id: webhookPayload.data.id,
        event_type: webhookPayload.type,
        event_data: webhookPayload,
        signature: xSignature,
        request_id: xRequestId,
        processed: false,
      });

    if (webhookPayload.type !== "payment") {
      return new Response(
        JSON.stringify({ message: "Webhook recebido mas não processado" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const paymentDetails = await fetchPaymentDetails(webhookPayload.data.id);

    const pedidoId = paymentDetails.metadata?.pedido_id;
    if (!pedidoId) {
      await supabase
        .from("payment_webhooks")
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
          error_message: "Sem pedido_id nos metadados",
        })
        .eq("payment_id", webhookPayload.data.id);

      return new Response(
        JSON.stringify({ error: "Sem pedido_id nos metadados do pagamento" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .select("*")
      .eq("id", pedidoId)
      .single();

    if (pedidoError || !pedido) {
      await supabase
        .from("payment_webhooks")
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
          error_message: `Pedido não encontrado: ${pedidoId}`,
        })
        .eq("payment_id", webhookPayload.data.id);

      return new Response(
        JSON.stringify({ error: "Pedido não encontrado" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

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
      throw updateError;
    }

    await supabase
      .from("payment_webhooks")
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        pedido_id: pedidoId,
      })
      .eq("payment_id", webhookPayload.data.id);

    if (paymentDetails.status === "approved") {
      try {
        await supabase.functions.invoke("send-order-confirmation", {
          body: {
            pedido_id: pedidoId,
            payment_confirmed: true,
          },
        });
      } catch {
        // Email não é crítico para o processamento do webhook
      }
    }

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
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro interno do servidor",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
