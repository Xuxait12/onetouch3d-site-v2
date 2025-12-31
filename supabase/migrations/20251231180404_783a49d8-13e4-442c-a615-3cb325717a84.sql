-- Adicionar campo para armazenar o cupom aplicado no pedido
ALTER TABLE public.pedidos 
ADD COLUMN cupom_aplicado TEXT;