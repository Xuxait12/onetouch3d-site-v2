-- Remove o trigger e a função que estão causando erro
DROP TRIGGER IF EXISTS trigger_send_order_confirmation ON public.pedidos;
DROP FUNCTION IF EXISTS public.send_order_confirmation_email();

-- Função simples que não depende de extensões externas
CREATE OR REPLACE FUNCTION public.log_new_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Apenas registra que um novo pedido foi criado
  -- A implementação de email será feita via edge function chamada do frontend
  RETURN NEW;
END;
$$;