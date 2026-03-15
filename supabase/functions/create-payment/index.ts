import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Auth manual (verify_jwt=false, validamos aqui)
    const auth = req.headers.get("Authorization");
    if (!auth) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: authErr } = await sb.auth.getUser(auth.replace("Bearer ", ""));
    console.log("[CP] user=" + user?.id + " authErr=" + authErr?.message);
    if (authErr || !user) {
      return new Response(JSON.stringify({ success: false, error: "Invalid token" }), {
        status: 401, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    console.log("[CP] pedido=" + body.pedido_id + " method=" + body.payment_method_id + " amount=" + body.amount);

    if (!body.pedido_id || !body.payment_method_id || !body.amount) {
      throw new Error("Campos faltando");
    }

    // Buscar pedido — apenas colunas que existem na tabela
    const { data: pedido, error: pErr } = await sb
      .from("pedidos")
      .select("id, user_id, preco_final, status_pagamento")
      .eq("id", body.pedido_id)
      .eq("user_id", user.id)
      .single();

    console.log("[CP] pedido=" + !!pedido + " err=" + pErr?.message);
    if (pErr || !pedido) {
      return new Response(JSON.stringify({ success: false, error: "Pedido nao encontrado" }), {
        status: 403, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Validar valor
    const expected = pedido.preco_final;
    if (Math.abs(expected - body.amount) > 0.02) {
      throw new Error("Valor invalido: esperado " + expected);
    }

    // Token Mercado Pago
    const isProd = Deno.env.get("ENVIRONMENT") === "production";
    const token = isProd
      ? Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN_PROD")
      : Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");

    console.log("[CP] isProd=" + isProd + " hasToken=" + !!token);
    if (!token) throw new Error("Token MP nao configurado");

    // Sanitizar CPF/CNPJ (apenas dígitos)
    const cleanNum = (body.payer?.identification?.number || "").replace(/\D/g, "");
    const pid = cleanNum
      ? { type: body.payer?.identification?.type || "CPF", number: cleanNum }
      : undefined;

    const webhook = Deno.env.get("SUPABASE_URL") + "/functions/v1/process-payment-webhook";

    let mpBody: any;
    if (body.payment_method_id === "pix") {
      if (!pid) throw new Error("CPF obrigatorio para PIX");
      mpBody = {
        transaction_amount: Math.round(body.amount * 100) / 100,
        description: "Pedido " + pedido.id.substring(0, 8),
        payment_method_id: "pix",
        payer: {
          email: body.payer.email,
          first_name: body.payer.first_name || "Cliente",
          last_name: body.payer.last_name || "",
          identification: pid,
        },
        notification_url: webhook,
        metadata: { pedido_id: body.pedido_id },
      };
    } else {
      if (!body.token) throw new Error("Token cartao obrigatorio");
      mpBody = {
        token: body.token,
        transaction_amount: Math.round(body.amount * 100) / 100,
        description: "Pedido " + pedido.id.substring(0, 8),
        payment_method_id: body.payment_method_id,
        installments: body.installments || 1,
        payer: { email: body.payer.email, identification: pid },
        notification_url: webhook,
        metadata: { pedido_id: body.pedido_id },
      };
    }

    console.log("[CP] chamando MP...");
    const mpResp = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify(mpBody),
    });

    const mpText = await mpResp.text();
    console.log("[CP] MP status=" + mpResp.status);

    if (!mpResp.ok) {
      let e: any = {};
      try { e = JSON.parse(mpText); } catch { e = { message: mpText }; }
      throw new Error(e.message || e.error || e.cause?.[0]?.description || "Erro MP " + mpResp.status);
    }

    const pd = JSON.parse(mpText);
    console.log("[CP] MP id=" + pd.id + " status=" + pd.status);

    // Mapear status MP → valores aceitos pela constraint do banco
    // Constraint: 'pending' | 'approved' | 'rejected' | 'cancelled'
    let dbStatus = "pending";
    if (pd.status === "approved") dbStatus = "approved";
    else if (pd.status === "rejected") dbStatus = "rejected";
    else if (pd.status === "cancelled") dbStatus = "cancelled";

    const upd: any = {
      payment_id: String(pd.id),
      payment_status: pd.status,
      payment_method_type: pd.payment_type_id,
      payment_method_id: pd.payment_method_id,
      installments: pd.installments || 1,
      status_pagamento: dbStatus,
    };

    if (body.payment_method_id === "pix" && pd.point_of_interaction?.transaction_data) {
      upd.pix_qr_code = pd.point_of_interaction.transaction_data.qr_code_base64;
      upd.pix_qr_code_text = pd.point_of_interaction.transaction_data.qr_code;
      upd.pix_ticket_url = pd.point_of_interaction.transaction_data.ticket_url;
    }

    if (pd.status === "approved") {
      upd.payment_approved_at = new Date().toISOString();
    }

    console.log("[CP] atualizando DB... status=" + dbStatus);
    const { error: updErr } = await sb
      .from("pedidos")
      .update(upd)
      .eq("id", body.pedido_id)
      .eq("user_id", user.id);

    if (updErr) console.error("[CP] DB update ERRO: " + updErr.message + " code=" + updErr.code);
    else console.log("[CP] DB atualizado com sucesso");

    // Enviar email se aprovado
    if (pd.status === "approved") {
      try {
        await sb.functions.invoke("send-order-confirmation", {
          body: { pedido_id: body.pedido_id, payment_confirmed: true },
        });
      } catch { /* email nao critico */ }
    }

    const res: any = {
      success: true,
      payment_id: pd.id,
      status: pd.status,
      status_detail: pd.status_detail,
      payment_method: pd.payment_method_id,
    };

    if (body.payment_method_id === "pix" && pd.point_of_interaction?.transaction_data) {
      res.qr_code = pd.point_of_interaction.transaction_data.qr_code;
      res.qr_code_base64 = pd.point_of_interaction.transaction_data.qr_code_base64;
      res.ticket_url = pd.point_of_interaction.transaction_data.ticket_url;
    }

    console.log("[CP] respondendo success=true");
    return new Response(JSON.stringify(res), {
      headers: { ...cors, "Content-Type": "application/json" }, status: 200,
    });

  } catch (err: any) {
    console.error("[CP] ERRO: " + err.message);
    return new Response(JSON.stringify({ success: false, error: err.message || "Erro interno" }), {
      headers: { ...cors, "Content-Type": "application/json" }, status: 400,
    });
  }
});
