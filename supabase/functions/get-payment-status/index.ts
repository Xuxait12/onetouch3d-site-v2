import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StatusRequest {
  payment_id?: string;
  pedido_id?: string;
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

    const { payment_id, pedido_id }: StatusRequest = await req.json();

    if (!payment_id && !pedido_id) {
      throw new Error("Either payment_id or pedido_id is required");
    }

    let paymentId = payment_id;

    if (pedido_id && !paymentId) {
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .select("payment_id")
        .eq("id", pedido_id)
        .single();

      if (pedidoError || !pedido || !pedido.payment_id) {
        throw new Error("Pedido não encontrado ou sem pagamento associado");
      }

      paymentId = pedido.payment_id;
    }

    if (!paymentId) {
      throw new Error("Nenhum payment_id disponível");
    }

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
      throw new Error(`Erro na API do Mercado Pago: ${response.statusText} - ${error}`);
    }

    const paymentData = await response.json();

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

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: paymentData.id,
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        payment_method: paymentData.payment_method_id,
        transaction_amount: paymentData.transaction_amount,
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
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro interno do servidor",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
