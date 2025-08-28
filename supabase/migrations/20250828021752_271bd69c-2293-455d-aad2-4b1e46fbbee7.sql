-- Create usuarios table for user data storage
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  cpf TEXT NOT NULL,
  telefone TEXT,
  rua TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cep TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on usuarios
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Policies for usuarios table
CREATE POLICY "Users can view their own data" ON public.usuarios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data" ON public.usuarios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON public.usuarios
  FOR UPDATE USING (auth.uid() = user_id);

-- Drop existing pedidos table and recreate with new structure
DROP TABLE IF EXISTS public.pedidos;

CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  variacao_id UUID NOT NULL REFERENCES public.variacoes(id),
  quantidade INTEGER NOT NULL DEFAULT 1,
  valor_total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pedidos
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Policies for pedidos table
CREATE POLICY "Users can view their own orders" ON public.pedidos
  FOR SELECT USING (
    usuario_id IN (
      SELECT id FROM public.usuarios WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own orders" ON public.pedidos
  FOR INSERT WITH CHECK (
    usuario_id IN (
      SELECT id FROM public.usuarios WHERE user_id = auth.uid()
    )
  );

-- Add trigger for updated_at on usuarios
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();