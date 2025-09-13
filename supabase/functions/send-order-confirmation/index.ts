import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface OrderData {
  pedido_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Order confirmation email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pedido_id }: OrderData = await req.json();
    console.log("Processing order confirmation for pedido_id:", pedido_id);

    // Buscar dados do pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .select("*")
      .eq("id", pedido_id)
      .single();

    if (pedidoError || !pedido) {
      console.error("Erro ao buscar pedido:", pedidoError);
      throw new Error("Pedido não encontrado");
    }

    // Buscar perfil do cliente
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", pedido.user_id)
      .single();

    if (profileError || !profile) {
      console.error("Erro ao buscar perfil:", profileError);
      throw new Error("Perfil do cliente não encontrado");
    }

    // Buscar itens do pedido
    const { data: itens, error: itensError } = await supabase
      .from("itens_pedido")
      .select("*")
      .eq("pedido_id", pedido_id);

    if (itensError) {
      console.error("Erro ao buscar itens:", itensError);
      throw new Error("Erro ao buscar itens do pedido");
    }

    // Formatar data
    const dataFormatada = new Date(pedido.data_pedido).toLocaleDateString("pt-BR");

    // Montar lista de itens
    const itensHtml = itens?.map(item => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 0;">
          <div style="font-weight: 600; color: #1f2937;">${item.produto_nome}</div>
          <div style="font-size: 14px; color: #6b7280;">${item.moldura_tipo} - ${item.tamanho}</div>
        </td>
        <td style="padding: 12px 0; text-align: center; color: #6b7280;">${item.quantidade}</td>
        <td style="padding: 12px 0; text-align: right; color: #6b7280;">R$ ${item.valor_unitario.toFixed(2)}</td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #1f2937;">R$ ${item.subtotal.toFixed(2)}</td>
      </tr>
    `).join('') || '';

    // Template do e-mail
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmação de Pedido - OneTouch3D</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color:#f5f5f5; margin:0; padding:0;">
        <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          <!-- Cabeçalho -->
          <tr>
            <td style="background:#000000; padding:20px; text-align:center;">
              <img src="https://onetouch3d.com.br/logo.png" alt="OneTouch3D" style="max-height:60px;">
            </td>
          </tr>

          <!-- Título -->
          <tr>
            <td style="padding:30px 20px; text-align:center;">
              <h1 style="color:#333333; margin:0;">Seu pedido foi confirmado!</h1>
              <p style="color:#666666; margin-top:8px; font-size:14px;">
                Obrigado por escolher a <strong>OneTouch3D</strong>.
              </p>
            </td>
          </tr>

          <!-- Resumo do Pedido -->
          <tr>
            <td style="padding:20px;">
              <h2 style="color:#333333; font-size:18px; margin-bottom:10px;">Resumo do Pedido</h2>
              <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="border:1px solid #dddddd;">Número do Pedido</td>
                  <td style="border:1px solid #dddddd; font-weight:bold;">${pedido.numero_pedido}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #dddddd;">Data</td>
                  <td style="border:1px solid #dddddd;">${dataFormatada}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #dddddd;">Forma de Pagamento</td>
                  <td style="border:1px solid #dddddd;">${pedido.forma_pagamento}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #dddddd;">Status</td>
                  <td style="border:1px solid #dddddd; color:#ff9900;">${pedido.status.toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #dddddd;">Subtotal</td>
                  <td style="border:1px solid #dddddd;">R$ ${pedido.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #dddddd;">Frete</td>
                  <td style="border:1px solid #dddddd;">R$ ${pedido.frete.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #dddddd;">Desconto</td>
                  <td style="border:1px solid #dddddd;">R$ ${pedido.desconto.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #dddddd; font-weight:bold;">Total</td>
                  <td style="border:1px solid #dddddd; font-weight:bold; color:#28a745;">R$ ${pedido.total.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Detalhes do Cliente -->
          <tr>
            <td style="padding:20px;">
              <h2 style="color:#333333; font-size:18px; margin-bottom:10px;">Seus Dados</h2>
              <p style="margin:0; color:#555555;">Nome: <strong>${profile.full_name}</strong></p>
              <p style="margin:0; color:#555555;">E-mail: <strong>${profile.email}</strong></p>
              <p style="margin:0; color:#555555;">Telefone: <strong>${profile.phone}</strong></p>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="background:#f5f5f5; padding:20px; text-align:center; font-size:12px; color:#888888;">
              <p style="margin:0;">Em breve você receberá novidades sobre a produção do seu quadro personalizado.</p>
              <p style="margin:5px 0 0 0;">Equipe OneTouch3D</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Enviar e-mail
    const emailResponse = await resend.emails.send({
      from: "OneTouch3D <contato@onetouch3d.com.br>",
      to: [profile.email],
      subject: `Confirmação do seu pedido nº ${pedido.numero_pedido}`,
      html: emailHtml,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "E-mail de confirmação enviado com sucesso",
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Erro ao enviar e-mail de confirmação:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);