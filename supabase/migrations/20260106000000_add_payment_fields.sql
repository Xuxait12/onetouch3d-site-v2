-- Migration: Add Mercado Pago payment fields to pedidos table and create payment_webhooks table
-- Created: 2026-01-06
-- Purpose: Support Mercado Pago integration with transparent checkout

-- =====================================================
-- 1. ADD PAYMENT FIELDS TO PEDIDOS TABLE
-- =====================================================

ALTER TABLE public.pedidos
  ADD COLUMN payment_id TEXT,                          -- ID do pagamento no Mercado Pago
  ADD COLUMN payment_status TEXT,                      -- Status do pagamento: approved, pending, rejected, etc
  ADD COLUMN payment_method_type TEXT,                 -- Tipo: credit_card, debit_card, pix
  ADD COLUMN payment_method_id TEXT,                   -- ID do método: visa, master, pix, etc
  ADD COLUMN installments INTEGER DEFAULT 1,           -- Número de parcelas (padrão 1)
  ADD COLUMN pix_qr_code TEXT,                         -- QR code base64 para PIX
  ADD COLUMN pix_qr_code_text TEXT,                    -- Código "Copia e Cola" para PIX
  ADD COLUMN pix_ticket_url TEXT,                      -- URL para abrir pagamento PIX no app
  ADD COLUMN payment_approved_at TIMESTAMP WITH TIME ZONE,  -- Data/hora de aprovação do pagamento
  ADD COLUMN payment_metadata JSONB,                   -- Dados completos da resposta do MP (para debug/auditoria)
  ADD COLUMN webhook_received_at TIMESTAMP WITH TIME ZONE;  -- Última vez que recebemos webhook do MP

-- =====================================================
-- 2. UPDATE STATUS CONSTRAINT
-- =====================================================

-- Remover constraint antiga de status
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_status_check;
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS check_status;

-- Adicionar nova constraint com status expandidos
ALTER TABLE public.pedidos ADD CONSTRAINT pedidos_status_check
  CHECK (status IN (
    'aguardando_pagamento',  -- Pedido criado, aguardando pagamento
    'pago',                  -- Pagamento confirmado
    'processando',           -- Em processamento/preparação
    'enviado',               -- Enviado para transporte
    'entregue',              -- Entregue ao cliente
    'cancelado',             -- Cancelado (usuário ou admin)
    'rejeitado'              -- Pagamento rejeitado pelo Mercado Pago
  ));

-- =====================================================
-- 3. CREATE PAYMENT_WEBHOOKS TABLE (AUDIT LOG)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.payment_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,  -- FK para pedidos (nullable pois nem sempre sabemos qual pedido no momento do webhook)
  payment_id TEXT NOT NULL,                                        -- ID do pagamento no MP
  event_type TEXT NOT NULL,                                        -- Tipo de evento: payment, merchant_order, etc
  event_data JSONB NOT NULL,                                       -- Payload completo do webhook
  signature TEXT,                                                  -- x-signature header (para validação)
  request_id TEXT,                                                 -- x-request-id header
  processed BOOLEAN DEFAULT false,                                 -- Se já foi processado
  processed_at TIMESTAMP WITH TIME ZONE,                           -- Quando foi processado
  error_message TEXT,                                              -- Mensagem de erro se falhou
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Índice para buscar pedidos por payment_id (usado no webhook)
CREATE INDEX IF NOT EXISTS idx_pedidos_payment_id ON public.pedidos(payment_id);

-- Índice para buscar por status de pagamento
CREATE INDEX IF NOT EXISTS idx_pedidos_payment_status ON public.pedidos(payment_status);

-- Índice para buscar webhooks por payment_id
CREATE INDEX IF NOT EXISTS idx_webhooks_payment_id ON public.payment_webhooks(payment_id);

-- Índice para buscar webhooks não processados (usado para retry)
CREATE INDEX IF NOT EXISTS idx_webhooks_processed ON public.payment_webhooks(processed);

-- Índice composto para buscar webhooks de um pedido específico
CREATE INDEX IF NOT EXISTS idx_webhooks_pedido_id ON public.payment_webhooks(pedido_id);

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.payment_webhooks ENABLE ROW LEVEL SECURITY;

-- Policy: Apenas service role pode acessar webhooks (segurança)
-- Usuários normais não devem ter acesso aos webhooks
CREATE POLICY "Webhooks são apenas para service role"
  ON public.payment_webhooks
  FOR ALL
  USING (false);  -- Nenhum usuário normal pode acessar

-- Policy: Admins podem ver webhooks (para debug)
CREATE POLICY "Admins podem ver webhooks"
  ON public.payment_webhooks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- =====================================================
-- 6. ADD HELPFUL COMMENTS
-- =====================================================

COMMENT ON COLUMN public.pedidos.payment_id IS 'ID do pagamento no Mercado Pago';
COMMENT ON COLUMN public.pedidos.payment_status IS 'Status retornado pelo MP: approved, pending, rejected, cancelled, etc';
COMMENT ON COLUMN public.pedidos.payment_method_type IS 'Tipo de pagamento: credit_card, debit_card, pix';
COMMENT ON COLUMN public.pedidos.pix_qr_code IS 'QR Code em base64 para pagamento PIX';
COMMENT ON COLUMN public.pedidos.pix_qr_code_text IS 'Código copia-e-cola do PIX';
COMMENT ON COLUMN public.pedidos.installments IS 'Número de parcelas (1 = à vista)';
COMMENT ON COLUMN public.pedidos.payment_metadata IS 'Resposta completa do Mercado Pago (JSON)';

COMMENT ON TABLE public.payment_webhooks IS 'Log de auditoria de webhooks recebidos do Mercado Pago';
COMMENT ON COLUMN public.payment_webhooks.processed IS 'Se o webhook já foi processado com sucesso';
COMMENT ON COLUMN public.payment_webhooks.signature IS 'Header x-signature do webhook (para validação HMAC)';
