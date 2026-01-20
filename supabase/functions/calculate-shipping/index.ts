import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  tamanho: string;
  quantidade: number;
  subtotal: number;
}

interface CalculateShippingRequest {
  cep_destino: string;
  items: CartItem[];
}

interface ProductDimensions {
  width: number;
  height: number;
  length: number;
  weight: number;
}

const FRAME_DIMENSIONS: Record<string, ProductDimensions> = {
  "33x33cm": { width: 38, height: 10, length: 38, weight: 1.90 },
  "33x43cm": { width: 38, height: 10, length: 48, weight: 2.30 },
  "37x48cm": { width: 45, height: 10, length: 55, weight: 3.10 },
  "43x43cm": { width: 48, height: 10, length: 48, weight: 3.00 },
  "43x53cm": { width: 48, height: 10, length: 58, weight: 3.50 },
  "43x63cm": { width: 58, height: 10, length: 78, weight: 3.90 },
  "53x53cm": { width: 58, height: 10, length: 78, weight: 4.40 },
  "53x73cm": { width: 58, height: 10, length: 78, weight: 5.40 },
  "63x83cm": { width: 68, height: 10, length: 88, weight: 6.80 },
  "83x103cm": { width: 88, height: 10, length: 108, weight: 9.10 }
};

function getProductDimensions(tamanho: string): ProductDimensions {
  const dimensions = FRAME_DIMENSIONS[tamanho];
  if (!dimensions) {
    console.warn(`Dimensões não encontradas para tamanho: ${tamanho}. Usando dimensões padrão.`);
    return { width: 38, height: 10, length: 38, weight: 1.90 };
  }
  return dimensions;
}

const FALLBACK_SHIPPING = {
  id: 0,
  name: "Frete padrão",
  price: 15.90,
  custom_price: 15.90,
  discount: "0%",
  currency: "R$",
  delivery_time: 7,
  custom_delivery_time: 7,
  delivery_range: {
    min: 5,
    max: 10
  },
  company: {
    id: 0,
    name: "Correios",
    picture: "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png"
  },
  packages: []
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cep_destino, items }: CalculateShippingRequest = await req.json();

    const cepLimpo = cep_destino.replace(/\D/g, '');
    if (!cepLimpo || !/^\d{8}$/.test(cepLimpo)) {
      throw new Error("CEP inválido. Digite um CEP válido com 8 dígitos.");
    }

    if (!items || items.length === 0) {
      throw new Error("Carrinho vazio. Adicione produtos antes de calcular o frete.");
    }

    const cepOrigin = Deno.env.get("MELHOR_ENVIO_CEP_ORIGEM");
    const environment = Deno.env.get("ENVIRONMENT") || "development";
    const isProduction = environment === "production";
    const allowedServices = Deno.env.get("MELHOR_ENVIO_SERVICES");

    let token = isProduction
      ? Deno.env.get("MELHOR_ENVIO_TOKEN_PROD")
      : Deno.env.get("MELHOR_ENVIO_TOKEN_SANDBOX");

    if (!token) {
      token = Deno.env.get("MELHOR_ENVIO_TOKEN_SANDBOX") || Deno.env.get("MELHOR_ENVIO_TOKEN_PROD");
    }

    console.log("[calculate-shipping] v3 - Configuração:", {
      environment,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      hasCepOrigin: !!cepOrigin,
      allowedServices: allowedServices || "all"
    });

    if (!token) {
      console.error("Token do Melhor Envio não configurado. Verifique os secrets: MELHOR_ENVIO_TOKEN_SANDBOX ou MELHOR_ENVIO_TOKEN_PROD");
      return new Response(
        JSON.stringify({
          success: true,
          options: [FALLBACK_SHIPPING],
          fallback: true,
          message: "Usando frete padrão. Entre em contato para mais informações."
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }

    if (!cepOrigin) {
      console.error("CEP de origem não configurado");
      throw new Error("Configuração de frete incompleta. Entre em contato.");
    }

    const baseApiUrl = isProduction
      ? "https://melhorenvio.com.br/api/v2"
      : "https://sandbox.melhorenvio.com.br/api/v2";

    const enabledServiceIds: string | null = allowedServices || null;

    if (enabledServiceIds) {
      console.log("[calculate-shipping] Filtrando por serviços configurados:", enabledServiceIds);
    } else {
      console.log("[calculate-shipping] Nenhum filtro de serviços - API retornará todos disponíveis (serviços não contratados virão com erro e serão filtrados)");
    }

    const products = items.map((item, index) => {
      const dimensions = getProductDimensions(item.tamanho);
      return {
        id: `${index}`,
        width: dimensions.width,
        height: dimensions.height,
        length: dimensions.length,
        weight: dimensions.weight,
        insurance_value: item.subtotal,
        quantity: item.quantidade
      };
    });

    const totalValue = items.reduce((sum, item) => sum + item.subtotal, 0);

    console.log("[calculate-shipping] Calculando frete", {
      cep_destino: cepLimpo,
      cep_origem: cepOrigin,
      num_items: items.length,
      total_weight: products.reduce((sum, p) => sum + (p.weight * p.quantity), 0),
      insurance_value: totalValue,
      environment: isProduction ? "production" : "sandbox"
    });

    const payload: any = {
      from: {
        postal_code: cepOrigin
      },
      to: {
        postal_code: cepLimpo
      },
      products: products,
      options: {
        receipt: false,
        own_hand: false,
        insurance_value: totalValue
      }
    };

    if (enabledServiceIds) {
      payload.services = enabledServiceIds;
      console.log("[calculate-shipping] Filtrando por serviços:", enabledServiceIds);
    }

    const apiUrl = `${baseApiUrl}/me/shipment/calculate`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response;
    try {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "User-Agent": "E-commerce Quadros 3D (contato@exemplo.com)"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error("[calculate-shipping] Erro na requisição:", fetchError.message);

      if (fetchError.name === "AbortError") {
        return new Response(
          JSON.stringify({
            success: true,
            options: [FALLBACK_SHIPPING],
            fallback: true,
            message: "Tempo de resposta excedido. Usando frete padrão."
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200
          }
        );
      }

      throw new Error("Não foi possível conectar ao serviço de frete. Tente novamente.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[calculate-shipping] Erro da API:", response.status, errorText);

      if (response.status === 401 || response.status === 403) {
        console.error("Token inválido ou expirado");
        return new Response(
          JSON.stringify({
            success: true,
            options: [FALLBACK_SHIPPING],
            fallback: true,
            message: "Serviço de frete temporariamente indisponível."
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200
          }
        );
      }

      throw new Error(`Erro ao calcular frete: ${errorText}`);
    }

    const shippingOptions = await response.json();

    const optionsWithError = shippingOptions.filter((opt: any) => opt.error);
    const availableOptions = shippingOptions.filter((opt: any) => !opt.error);

    if (optionsWithError.length > 0) {
      console.log("[calculate-shipping] Serviços não disponíveis (com erro):",
        optionsWithError.map((o: any) => ({
          id: o.id,
          name: o.name,
          error: o.error
        }))
      );
    }

    if (availableOptions.length === 0) {
      console.warn("[calculate-shipping] Nenhuma opção disponível após filtrar erros");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nenhuma opção de frete disponível para este CEP. Entre em contato para verificar disponibilidade."
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    availableOptions.sort((a: any, b: any) => Number(a.custom_price) - Number(b.custom_price));

    console.log("[calculate-shipping] Opções disponíveis:", {
      total_retornado: shippingOptions.length,
      com_erro: optionsWithError.length,
      disponiveis: availableOptions.length,
      servicos: availableOptions.map((o: any) => o.name),
      mais_barato: `R$ ${Number(availableOptions[0].custom_price).toFixed(2)}`,
      mais_rapido: `${Math.min(...availableOptions.map((o: any) => o.custom_delivery_time))} dias`
    });

    return new Response(
      JSON.stringify({
        success: true,
        options: availableOptions
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error: any) {
    console.error("[calculate-shipping] Erro:", error.message);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro ao calcular frete. Tente novamente."
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
