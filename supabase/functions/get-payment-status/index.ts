import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StatusRequest {
  payment_id?: string;  // Get status by Mercado Pago payment ID
  pedido_id?: string;   // Or get status by pedido ID
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

    const { payment_id, pedido_id }: StatusRequest = await req.json();

    if (!payment_id && !pedido_id) {
      throw new Error("Either payment_id or pedido_id is required");
    }

    let paymentId = payment_id;

    // If pedido_id provided, get payment_id from database
    if (pedido_id && !paymentId) {
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .select("payment_id")
        .eq("id", pedido_id)
        .single();

      if (pedidoError || !pedido || !pedido.payment_id) {
        throw new Error("Pedido not found or no payment associated");
      }

      paymentId = pedido.payment_id;
    }

    if (!paymentId) {
      throw new Error("No payment_id available");
    }

    // Get access token
    const isProduction = Deno.env.get("ENVIRONMENT") === "production";
    const accessToken = isProduction
      ? Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN_PROD")
      : Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");

    if (!accessToken) {
      throw new Error("Mercado Pago access token not configured");
    }

    // Fetch payment status from Mercado Pago
    console.log("Fetching payment status:", paymentId);
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
      throw new Error(`Mercado Pago API error: ${response.statusText} - ${error}`);
    }

    const paymentData = await response.json();
    console.log("Payment status fetched:", {
      id: paymentData.id,
      status: paymentData.status,
      status_detail: paymentData.status_detail,
    });

    // Also update our database with latest status
    if (pedido_id || paymentData.metadata?.pedido_id) {
      const targetPedidoId = pedido_id || paymentData.metadata?.pedido_id;

      let newStatus = "aguardando_pagamento";
      if (paymentData.status === "approved") {
        newStatus = "pago";
      } else if (
        paymentData.status === "rejected" ||
        paymentData.status === "cancelled"
      ) {
        newStatus = "rejeitado";
      }

      await supabase
        .from("pedidos")
        .update({
          payment_status: paymentData.status,
          status: newStatus,
          payment_approved_at:
            paymentData.status === "approved"
              ? new Date().toISOString()
              : null,
          payment_metadata: paymentData,
        })
        .eq("id", targetPedidoId);
    }

    // Return simplified status info
    return new Response(
      JSON.stringify({
        success: true,
        payment_id: paymentData.id,
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        payment_method: paymentData.payment_method_id,
        transaction_amount: paymentData.transaction_amount,
        // Additional info that might be useful
        currency_id: paymentData.currency_id,
        date_created: paymentData.date_created,
        date_approved: paymentData.date_approved,
        date_last_updated: paymentData.date_last_updated,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error fetching payment status:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
