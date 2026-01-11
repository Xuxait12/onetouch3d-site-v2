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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pedido_id }: OrderData = await req.json();

    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .select("*")
      .eq("id", pedido_id)
      .single();

    if (pedidoError || !pedido) {
      throw new Error("Pedido não encontrado");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", pedido.user_id)
      .single();

    if (profileError || !profile) {
      throw new Error("Perfil do cliente não encontrado");
    }

    const { data: itens, error: itensError } = await supabase
      .from("itens_pedido")
      .select("*")
      .eq("pedido_id", pedido_id);

    if (itensError) {
      throw new Error("Erro ao buscar itens do pedido");
    }

    const dataFormatada = new Date(pedido.data_pedido).toLocaleDateString("pt-BR");

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

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmação do Pedido</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">OneTouch3D</h1>
            <p style="color: #f1f5f9; margin: 10px 0 0 0; font-size: 16px;">Confirmação do seu pedido</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Olá, ${profile.full_name}! Obrigado por sua compra na OneTouch3D.</h2>

            <p style="font-size: 16px; margin-bottom: 25px;">
              Seu pedido nº <strong style="color: #667eea;">${pedido.numero_pedido}</strong> foi registrado com sucesso e já está em processamento.
            </p>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Resumo do Pedido</h3>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Número do pedido:</span>
                <span style="font-weight: 600; color: #1f2937;">${pedido.numero_pedido}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Data do pedido:</span>
                <span style="color: #1f2937;">${dataFormatada}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Status atual:</span>
                <span style="background: #fbbf24; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${pedido.status.toUpperCase()}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Forma de pagamento:</span>
                <span style="color: #1f2937;">${pedido.forma_pagamento}</span>
              </div>

              ${pedido.shipping_address ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Endereço de entrega:</span>
                <span style="color: #1f2937; text-align: right; max-width: 60%;">${pedido.shipping_address}</span>
              </div>
              ` : ''}
            </div>

            ${itens && itens.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Produtos</h3>

              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f8fafc; border-bottom: 2px solid #e5e7eb;">
                    <th style="padding: 12px 0; text-align: left; color: #374151; font-weight: 600;">Produto</th>
                    <th style="padding: 12px 0; text-align: center; color: #374151; font-weight: 600;">Qtd</th>
                    <th style="padding: 12px 0; text-align: right; color: #374151; font-weight: 600;">Valor Unit.</th>
                    <th style="padding: 12px 0; text-align: right; color: #374151; font-weight: 600;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itensHtml}
                </tbody>
              </table>
            </div>
            ` : ''}

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Resumo Financeiro</h3>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Subtotal:</span>
                <span style="color: #1f2937;">R$ ${pedido.subtotal.toFixed(2)}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Frete:</span>
                <span style="color: #1f2937;">R$ ${pedido.frete.toFixed(2)}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #6b7280;">Desconto:</span>
                <span style="color: #1f2937;">R$ ${pedido.desconto.toFixed(2)}</span>
              </div>

              <div style="border-top: 2px solid #e5e7eb; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 18px; font-weight: 600; color: #1f2937;">Total:</span>
                  <span style="font-size: 24px; font-weight: bold; color: #667eea;">R$ ${pedido.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <p style="margin: 0 0 10px 0;">
                Você pode acompanhar este e outros pedidos acessando sua conta na página <strong>"Meus Pedidos"</strong>.
              </p>
              <p style="margin: 0 0 10px 0; color: #6b7280;">
                Qualquer dúvida, fale com a gente pelo WhatsApp ou e-mail <strong>contato@onetouch3d.com.br</strong>
              </p>
              <p style="margin: 0; font-weight: 600; color: #667eea;">
                Obrigado por confiar na OneTouch3D!
              </p>
            </div>

          </div>

          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
            <p style="margin: 0;">
              © 2024 OneTouch3D - Transformando suas conquistas em arte
            </p>
          </div>

        </body>
      </html>
    `;

    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Novo Pedido - Admin</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">NOVO PEDIDO - ADMIN</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">Pedido nº ${pedido.numero_pedido}</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Novo pedido recebido</h2>

            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #dc2626;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Dados do Pedido</h3>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">ID do Usuário:</span>
                <span style="font-weight: 600; color: #1f2937;">${pedido.user_id}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Número do pedido:</span>
                <span style="font-weight: 600; color: #1f2937;">${pedido.numero_pedido}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Data/Hora:</span>
                <span style="color: #1f2937;">${new Date(pedido.data_pedido).toLocaleString("pt-BR")}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Status inicial:</span>
                <span style="background: #fbbf24; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${pedido.status.toUpperCase()}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Forma de pagamento:</span>
                <span style="color: #1f2937;">${pedido.forma_pagamento}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Total:</span>
                <span style="font-weight: 600; color: #dc2626; font-size: 18px;">R$ ${pedido.total.toFixed(2)}</span>
              </div>

              ${pedido.shipping_address ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Endereço de entrega:</span>
                <span style="color: #1f2937; text-align: right; max-width: 60%;">${pedido.shipping_address}</span>
              </div>
              ` : ''}
            </div>

            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Dados do Cliente</h3>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Nome:</span>
                <span style="color: #1f2937;">${profile.full_name}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">E-mail:</span>
                <span style="color: #1f2937;">${profile.email}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Telefone:</span>
                <span style="color: #1f2937;">${profile.phone}</span>
              </div>

              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Documento:</span>
                <span style="color: #1f2937;">${profile.cpf_cnpj}</span>
              </div>
            </div>

            ${itens && itens.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Produtos</h3>

              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f8fafc; border-bottom: 2px solid #e5e7eb;">
                    <th style="padding: 12px 0; text-align: left; color: #374151; font-weight: 600;">Produto</th>
                    <th style="padding: 12px 0; text-align: center; color: #374151; font-weight: 600;">Qtd</th>
                    <th style="padding: 12px 0; text-align: right; color: #374151; font-weight: 600;">Valor Unit.</th>
                    <th style="padding: 12px 0; text-align: right; color: #374151; font-weight: 600;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itensHtml}
                </tbody>
              </table>
            </div>
            ` : ''}

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Resumo Financeiro</h3>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Subtotal:</span>
                <span style="color: #1f2937;">R$ ${pedido.subtotal.toFixed(2)}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Frete:</span>
                <span style="color: #1f2937;">R$ ${pedido.frete.toFixed(2)}</span>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #6b7280;">Desconto:</span>
                <span style="color: #1f2937;">R$ ${pedido.desconto.toFixed(2)}</span>
              </div>

              <div style="border-top: 2px solid #e5e7eb; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 18px; font-weight: 600; color: #1f2937;">Total:</span>
                  <span style="font-size: 24px; font-weight: bold; color: #dc2626;">R$ ${pedido.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "OneTouch3D <contato@onetouch3d.com.br>",
      to: [profile.email],
      subject: `Confirmação do seu pedido nº ${pedido.numero_pedido}`,
      html: emailHtml,
    });

    await resend.emails.send({
      from: "OneTouch3D <contato@onetouch3d.com.br>",
      to: ["contato@onetouch3d.com.br"],
      subject: `[ADMIN] Novo pedido nº ${pedido.numero_pedido} - ${profile.full_name}`,
      html: adminEmailHtml,
    });

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
