import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-signature, x-request-id",
};

async function fetchPaymentDetails(paymentId: string): Promise<any> {
  const isProduction = Deno.env.get("ENVIRONMENT") === "production";
  const accessToken = isProduction
    ? Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN_PROD")
    : Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
  if (!accessToken) throw new Error("Token nao configurado");
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Falha ao buscar pagamento: ${response.status}`);
  return await response.json();
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Suporta ambos formatos de webhook MP:
    // Novo: ?data.id=xxx&type=payment  (body JSON)
    // Antigo: ?id=xxx&topic=payment    (sem body ou body diferente)
    const url = new URL(req.url);
    const queryDataId = url.searchParams.get("data.id") || url.searchParams.get("id");
    const queryType = url.searchParams.get("type") || url.searchParams.get("topic");

    let paymentId: string | null = null;

    // Tentar ler body JSON
    try {
      const text = await req.text();
      if (text && text.trim().startsWith("{")) {
        const payload = JSON.parse(text);
        if (payload?.type === "payment" || payload?.type === "payment_intent") {
          paymentId = payload?.data?.id;
        }
      }
    } catch { /* body pode estar vazio */ }

    // Fallback para query params
    if (!paymentId && queryDataId && (queryType === "payment" || queryType === "payment_intent")) {
      paymentId = queryDataId;
    }

    if (!paymentId) {
      return new Response(JSON.stringify({ message: "Webhook recebido - tipo nao processavel" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }

    console.log("[WH] payment_id=" + paymentId);

    const paymentDetails = await fetchPaymentDetails(paymentId);
    const pedidoId = paymentDetails.metadata?.pedido_id;

    console.log("[WH] mp_status=" + paymentDetails.status + " pedido_id=" + pedidoId);

    if (!pedidoId) {
      return new Response(JSON.stringify({ error: "Sem pedido_id nos metadados" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }

    // Mapear status MP → valores aceitos pela constraint do banco
    // Constraint: 'pending' | 'approved' | 'rejected' | 'cancelled'
    let dbStatus = "pending";
    if (paymentDetails.status === "approved") dbStatus = "approved";
    else if (paymentDetails.status === "rejected") dbStatus = "rejected";
    else if (paymentDetails.status === "cancelled") dbStatus = "cancelled";

    const updateData: any = {
      payment_id: String(paymentId),
      payment_status: paymentDetails.status,
      status_pagamento: dbStatus,
      webhook_received_at: new Date().toISOString(),
    };

    if (paymentDetails.status === "approved") {
      updateData.payment_approved_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("pedidos")
      .update(updateData)
      .eq("id", pedidoId);

    if (updateError) console.error("[WH] DB update erro: " + updateError.message);
    else console.log("[WH] DB atualizado: pedido=" + pedidoId + " status=" + dbStatus);

    if (paymentDetails.status === "approved") {
      try {
        await supabase.functions.invoke("send-order-confirmation", {
          body: { pedido_id: pedidoId, payment_confirmed: true },
        });
      } catch { /* email nao critico */ }
    }

    return new Response(
      JSON.stringify({ success: true, pedido_id: pedidoId, payment_status: paymentDetails.status, db_status: dbStatus }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error: any) {
    console.error("[WH] ERRO: " + error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }
});
