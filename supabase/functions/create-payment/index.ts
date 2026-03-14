import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

interface PaymentRequest {
  pedido_id: string;
  payment_method_id: string;
  amount: number;
  token?: string;
  installments?: number;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    identification?: {
      type: string;
      number: string;
    };
  };
}

interface MercadoPagoPaymentResponse {
  id: number | string;
  status: string;
  status_detail: string;
  payment_type_id: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    };
  };
  [key: string]: any;
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

    const paymentRequest: PaymentRequest = await req.json();

    if (
      !paymentRequest.pedido_id ||
      !paymentRequest.payment_method_id ||
      !paymentRequest.amount
    ) {
      throw new Error("Campos obrigatórios faltando");
    }

    // Validate pedido_id format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(paymentRequest.pedido_id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'ID do pedido inválido' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate amount is positive and within reasonable limits
    if (paymentRequest.amount <= 0 || paymentRequest.amount > 1000000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valor do pagamento inválido' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify ownership: user must own the order
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .select("*")
      .eq("id", paymentRequest.pedido_id)
      .eq("user_id", user.id) // Only allow payment for own orders
      .single();

    if (pedidoError || !pedido) {
      return new Response(
        JSON.stringify({ success: false, error: 'Pedido não encontrado ou acesso não autorizado' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // O valor total do pedido já inclui o desconto PIX quando aplicável
    // Não aplicar desconto novamente aqui para evitar desconto duplicado
    const expectedAmount = pedido.preco_final ?? pedido.total;

    const amountDifference = Math.abs(expectedAmount - paymentRequest.amount);

    if (amountDifference > 0.02) {
      console.log(`Validação de valor: esperado=${expectedAmount}, recebido=${paymentRequest.amount}, diferença=${amountDifference}`);
      throw new Error("Valor do pagamento inválido");
    }

    const isProduction = Deno.env.get("ENVIRONMENT") === "production";
    const accessToken = isProduction
      ? Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN_PROD")
      : Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");

    console.log(`[create-payment] ENVIRONMENT=${Deno.env.get("ENVIRONMENT")}, isProduction=${isProduction}, hasToken=${!!accessToken}, tokenPrefix=${accessToken?.substring(0, 10)}`);

    if (!accessToken) {
      throw new Error("Token de acesso não configurado");
    }

    const webhookUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/process-payment-webhook`;

    let paymentBody: any;

    if (paymentRequest.payment_method_id === "pix") {
      paymentBody = {
        transaction_amount: Math.round(paymentRequest.amount * 100) / 100,
        description: `Pedido #${pedido.numero_pedido || pedido.id}`,
        payment_method_id: "pix",
        payer: {
          email: paymentRequest.payer.email,
          first_name: paymentRequest.payer.first_name || "Cliente",
          last_name: paymentRequest.payer.last_name || "",
          identification: paymentRequest.payer.identification,
        },
        notification_url: webhookUrl,
        metadata: {
          pedido_id: paymentRequest.pedido_id,
        },
      };
    } else {
      if (!paymentRequest.token) {
        throw new Error("Token do cartão é obrigatório");
      }

      paymentBody = {
        token: paymentRequest.token,
        transaction_amount: Math.round(paymentRequest.amount * 100) / 100,
        description: `Pedido #${pedido.numero_pedido || pedido.id}`,
        payment_method_id: paymentRequest.payment_method_id,
        installments: paymentRequest.installments || 1,
        payer: {
          email: paymentRequest.payer.email,
          identification: paymentRequest.payer.identification,
        },
        notification_url: webhookUrl,
        metadata: {
          pedido_id: paymentRequest.pedido_id,
        },
      };
    }

    console.log(`[create-payment] Chamando API do Mercado Pago, method=${paymentRequest.payment_method_id}, amount=${paymentRequest.amount}`);
    const mpController = new AbortController();
    const mpTimeout = setTimeout(() => mpController.abort(), 25000);

    let mpResponse: Response;
    try {
      mpResponse = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify(paymentBody),
        signal: mpController.signal,
      });
    } finally {
      clearTimeout(mpTimeout);
    }
    console.log(`[create-payment] Resposta MP: status=${mpResponse.status}`);

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      let error: any = {};
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText };
      }

      const errorMessage =
        error.message ||
        error.error ||
        error.cause?.[0]?.description ||
        "Erro ao processar pagamento";

      throw new Error(errorMessage);
    }

    const paymentData: MercadoPagoPaymentResponse = await mpResponse.json();

    const updateData: any = {
      payment_id: String(paymentData.id),
      payment_status: paymentData.status,
      payment_method_type: paymentData.payment_type_id,
      payment_method_id: paymentData.payment_method_id,
      installments: paymentData.installments || 1,
      payment_metadata: paymentData,
    };

    if (
      paymentRequest.payment_method_id === "pix" &&
      paymentData.point_of_interaction?.transaction_data
    ) {
      updateData.pix_qr_code =
        paymentData.point_of_interaction.transaction_data.qr_code_base64;
      updateData.pix_qr_code_text =
        paymentData.point_of_interaction.transaction_data.qr_code;
      updateData.pix_ticket_url =
        paymentData.point_of_interaction.transaction_data.ticket_url;
    }

    if (paymentData.status === "approved") {
      updateData.status = "pago";
      updateData.payment_approved_at = new Date().toISOString();
    } else if (paymentData.status === "rejected") {
      updateData.status = "rejeitado";
    }

    await supabase
      .from("pedidos")
      .update(updateData)
      .eq("id", paymentRequest.pedido_id)
      .eq("user_id", user.id); // Double-check ownership on update

    if (paymentData.status === "approved") {
      try {
        await supabase.functions.invoke("send-order-confirmation", {
          body: {
            pedido_id: paymentRequest.pedido_id,
            payment_confirmed: true,
          },
        });
      } catch {
        // Email não é crítico
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: paymentData.id,
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        payment_method: paymentData.payment_method_id,
        ...(paymentRequest.payment_method_id === "pix" &&
          paymentData.point_of_interaction?.transaction_data && {
            qr_code: paymentData.point_of_interaction.transaction_data.qr_code,
            qr_code_base64:
              paymentData.point_of_interaction.transaction_data.qr_code_base64,
            ticket_url:
              paymentData.point_of_interaction.transaction_data.ticket_url,
          }),
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
        error: error.message || "Erro interno",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});