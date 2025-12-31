-- Criar tabela de cupons
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentual', 'fixo')),
  discount_value NUMERIC NOT NULL,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  page TEXT NOT NULL CHECK (page IN ('corrida', 'ciclismo', 'viagem', 'triathlon', 'all')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar índice no campo code para buscas rápidas
CREATE INDEX idx_coupons_code ON public.coupons(code);

-- Habilitar RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (apenas SELECT)
CREATE POLICY "Public can read active coupons"
ON public.coupons
FOR SELECT
USING (true);

-- Inserir cupom de teste TESTE10
INSERT INTO public.coupons (code, discount_type, discount_value, page, active, valid_from, valid_until)
VALUES (
  'TESTE10',
  'percentual',
  10,
  'all',
  true,
  now(),
  now() + interval '30 days'
);