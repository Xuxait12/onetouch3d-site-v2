-- Create pedidos table for storing orders
CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  data_pedido TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pendente',
  subtotal NUMERIC(10,2) NOT NULL,
  frete NUMERIC(10,2) NOT NULL DEFAULT 0,
  desconto NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  forma_pagamento TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itens_pedido table for storing order items
CREATE TABLE public.itens_pedido (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  produto_nome TEXT NOT NULL,
  moldura_tipo TEXT NOT NULL,
  tamanho TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  valor_unitario NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_pedido ENABLE ROW LEVEL SECURITY;

-- Create policies for pedidos
CREATE POLICY "Users can view their own orders"
ON public.pedidos
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON public.pedidos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
ON public.pedidos
FOR UPDATE
USING (auth.uid() = user_id);

-- Create policies for itens_pedido
CREATE POLICY "Users can view their own order items"
ON public.itens_pedido
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.pedidos
    WHERE pedidos.id = itens_pedido.pedido_id
    AND pedidos.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own order items"
ON public.itens_pedido
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pedidos
    WHERE pedidos.id = itens_pedido.pedido_id
    AND pedidos.user_id = auth.uid()
  )
);

-- Add constraints for status values
ALTER TABLE public.pedidos ADD CONSTRAINT check_status 
CHECK (status IN ('pendente', 'pago', 'enviado', 'cancelado'));

-- Add constraints for forma_pagamento values
ALTER TABLE public.pedidos ADD CONSTRAINT check_forma_pagamento 
CHECK (forma_pagamento IN ('pix', 'debito', 'credito'));

-- Add trigger for updating updated_at
CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_pedidos_user_id ON public.pedidos(user_id);
CREATE INDEX idx_pedidos_status ON public.pedidos(status);
CREATE INDEX idx_itens_pedido_pedido_id ON public.itens_pedido(pedido_id);