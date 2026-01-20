ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS shipping_method TEXT,
  ADD COLUMN IF NOT EXISTS shipping_service_id INTEGER,
  ADD COLUMN IF NOT EXISTS shipping_company TEXT,
  ADD COLUMN IF NOT EXISTS shipping_delivery_time INTEGER,
  ADD COLUMN IF NOT EXISTS shipping_metadata JSONB;

COMMENT ON COLUMN public.pedidos.shipping_method IS 'Nome do método de envio (PAC, SEDEX, etc)';
COMMENT ON COLUMN public.pedidos.shipping_service_id IS 'ID do serviço no Melhor Envio';
COMMENT ON COLUMN public.pedidos.shipping_company IS 'Nome da transportadora (Correios, JadLog, etc)';
COMMENT ON COLUMN public.pedidos.shipping_delivery_time IS 'Prazo de entrega em dias úteis';
COMMENT ON COLUMN public.pedidos.shipping_metadata IS 'Dados completos da cotação de frete em JSON';
