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

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { payment_id, pedido_id }: StatusRequest = await req.json();

    if (!payment_id && !pedido_id) {
      throw new Error("Either payment_id or pedido_id is required");
    }

    // Validate pedido_id format (UUID) if provided
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (pedido_id && !uuidRegex.test(pedido_id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'ID do pedido inválido' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .single();

    const isAdmin = profile?.is_admin || false;

    let paymentId = payment_id;
    let targetPedidoId = pedido_id;

    if (pedido_id && !paymentId) {
      // Verify ownership when looking up by pedido_id
      let query = supabase
        .from("pedidos")
        .select("payment_id, user_id")
        .eq("id", pedido_id);
      
      // Non-admins can only access their own orders
      if (!isAdmin) {
        query = query.eq("user_id", user.id);
      }

      const { data: pedido, error: pedidoError } = await query.single();

      if (pedidoError || !pedido) {
        return new Response(
          JSON.stringify({ success: false, error: 'Pedido não encontrado ou acesso não autorizado' }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!pedido.payment_id) {
        throw new Error("Pedido sem pagamento associado");
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
      throw new Error(`Erro na API do Mercado Pago: ${response.statusText}`);
    }

    const paymentData = await response.json();

    if (targetPedidoId || paymentData.metadata?.pedido_id) {
      const updatePedidoId = targetPedidoId || paymentData.metadata?.pedido_id;

      // Verify ownership before updating
      let updateQuery = supabase
        .from("pedidos")
        .select("user_id")
        .eq("id", updatePedidoId);
      
      if (!isAdmin) {
        updateQuery = updateQuery.eq("user_id", user.id);
      }

      const { data: updatePedido, error: updateCheckError } = await updateQuery.single();

      if (!updateCheckError && updatePedido) {
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
          .eq("id", updatePedidoId);
      }
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