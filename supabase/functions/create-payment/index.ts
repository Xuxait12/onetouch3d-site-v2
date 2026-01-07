import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

    const paymentRequest: PaymentRequest = await req.json();
    console.log("Payment request received:", {
      pedido_id: paymentRequest.pedido_id,
      payment_method_id: paymentRequest.payment_method_id,
      amount: paymentRequest.amount,
    });

    if (
      !paymentRequest.pedido_id ||
      !paymentRequest.payment_method_id ||
      !paymentRequest.amount
    ) {
      throw new Error(
        "Missing required fields: pedido_id, payment_method_id, amount"
      );
    }

    // Get pedido to validate amount (SECURITY: never trust frontend values)
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .select("*")
      .eq("id", paymentRequest.pedido_id)
      .single();

    if (pedidoError || !pedido) {
      throw new Error(`Pedido not found: ${paymentRequest.pedido_id}`);
    }

    // SECURITY: Validate that the amount matches the pedido total
    const expectedAmount =
      paymentRequest.payment_method_id === "pix"
        ? Math.round(pedido.total * 0.95 * 100) / 100 // 5% discount for PIX with rounding
        : pedido.total;

    const amountDifference = Math.abs(expectedAmount - paymentRequest.amount);
    console.log("Amount validation:", {
      pedido_total: pedido.total,
      expected: expectedAmount,
      received: paymentRequest.amount,
      difference: amountDifference,
      is_pix: paymentRequest.payment_method_id === "pix",
    });

    if (amountDifference > 0.02) {
      // Increased tolerance to 0.02 for rounding
      console.error("Amount mismatch detected!", {
        expected: expectedAmount,
        received: paymentRequest.amount,
        difference: amountDifference,
      });
      throw new Error(
        `Amount validation failed - expected R$ ${expectedAmount}, got R$ ${paymentRequest.amount}`
      );
    }

    // Get access token from environment (auto-detect sandbox vs production)
    const isProduction = Deno.env.get("ENVIRONMENT") === "production";
    const accessToken = isProduction
      ? Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN_PROD")
      : Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");

    if (!accessToken) {
      throw new Error("Mercado Pago access token not configured");
    }

    // Get webhook URL (will be configured separately)
    const webhookUrl = `${Deno.env.get(
      "SUPABASE_URL"
    )}/functions/v1/process-payment-webhook`;

    // Build payment body based on payment method
    let paymentBody: any;

    if (paymentRequest.payment_method_id === "pix") {
      // PIX Payment
      paymentBody = {
        transaction_amount: Math.round(paymentRequest.amount * 100) / 100,
        description: `Pedido #${pedido.numero_pedido || pedido.id}`,
        payment_method_id: "pix",
        payer: {
          email: paymentRequest.payer.email,
          first_name: paymentRequest.payer.first_name || "Cliente",
          last_name: paymentRequest.payer.last_name || "OneTouch3D",
          identification: paymentRequest.payer.identification,
        },
        notification_url: webhookUrl,
        metadata: {
          pedido_id: paymentRequest.pedido_id,
          integration: "supabase-edge-function",
        },
      };
    } else {
      // Credit/Debit Card Payment
      if (!paymentRequest.token) {
        throw new Error("Card token is required for card payments");
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
          integration: "supabase-edge-function",
        },
      };
    }

    console.log("Creating payment in Mercado Pago...");

    // Call Mercado Pago API to create payment
    const mpResponse = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID(), // Prevent duplicate payments
      },
      body: JSON.stringify(paymentBody),
    });

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error("Mercado Pago API error (raw):", errorText);

      let error: any = {};
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText };
      }

      console.error("Mercado Pago API error (parsed):", error);

      // Extract detailed error message
      const errorMessage =
        error.message ||
        error.error ||
        error.cause?.[0]?.description ||
        mpResponse.statusText ||
        "Unknown Mercado Pago error";

      throw new Error(`Mercado Pago: ${errorMessage}`);
    }

    const paymentData: MercadoPagoPaymentResponse = await mpResponse.json();
    console.log("Payment created successfully:", {
      payment_id: paymentData.id,
      status: paymentData.status,
      payment_type: paymentData.payment_type_id,
    });

    // Update pedido with payment information
    const updateData: any = {
      payment_id: String(paymentData.id),
      payment_status: paymentData.status,
      payment_method_type: paymentData.payment_type_id,
      payment_method_id: paymentData.payment_method_id,
      installments: paymentData.installments || 1,
      payment_metadata: paymentData,
    };

    // If PIX, save QR code data
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

    // Update status based on payment result
    if (paymentData.status === "approved") {
      updateData.status = "pago";
      updateData.payment_approved_at = new Date().toISOString();
    } else if (paymentData.status === "rejected") {
      updateData.status = "rejeitado";
    }
    // else: keep status as 'aguardando_pagamento' for pending payments

    const { error: updateError } = await supabase
      .from("pedidos")
      .update(updateData)
      .eq("id", paymentRequest.pedido_id);

    if (updateError) {
      console.error("Error updating pedido:", updateError);
      // Don't throw - payment was created successfully
      // Webhook will handle status update if this fails
    }

    // If payment was immediately approved, send confirmation email
    if (paymentData.status === "approved") {
      try {
        await supabase.functions.invoke("send-order-confirmation", {
          body: {
            pedido_id: paymentRequest.pedido_id,
            payment_confirmed: true,
          },
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Don't throw - email is not critical
      }
    }

    // Return payment data to frontend
    return new Response(
      JSON.stringify({
        success: true,
        payment_id: paymentData.id,
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        payment_method: paymentData.payment_method_id,
        // PIX specific data
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
    console.error("Error in create-payment function:", error);
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
