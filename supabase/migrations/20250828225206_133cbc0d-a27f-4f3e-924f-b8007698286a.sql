-- Adicionar coluna provedor na tabela usuarios
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS provedor text;