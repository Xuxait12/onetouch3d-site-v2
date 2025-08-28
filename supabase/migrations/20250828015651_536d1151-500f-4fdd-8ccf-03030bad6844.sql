-- Criar tabela de produtos
CREATE TABLE public.produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL CHECK (nome IN ('caixa_alta', 'caixa_baixa')),
  descricao TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de variações (cores, tamanhos, preços)
CREATE TABLE public.variacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  cor TEXT NOT NULL,
  tamanho TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  imagem_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(produto_id, cor, tamanho)
);

-- Criar tabela de pedidos
CREATE TABLE public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  produto TEXT NOT NULL,
  cor TEXT NOT NULL,
  tamanho TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  cupom TEXT,
  desconto DECIMAL(10,2) DEFAULT 0,
  frete DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  endereco TEXT NOT NULL,
  forma_pagamento TEXT,
  status TEXT NOT NULL DEFAULT 'Pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de cupons
CREATE TABLE public.cupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  desconto_percentual DECIMAL(5,2),
  desconto_fixo DECIMAL(10,2),
  ativo BOOLEAN DEFAULT true,
  data_expiracao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cupons ENABLE ROW LEVEL SECURITY;

-- Políticas para produtos (público para leitura)
CREATE POLICY "Produtos são públicos" 
ON public.produtos FOR SELECT 
USING (true);

-- Políticas para variações (público para leitura)
CREATE POLICY "Variações são públicas" 
ON public.variacoes FOR SELECT 
USING (true);

-- Políticas para pedidos (usuários podem ver apenas seus pedidos)
CREATE POLICY "Usuários podem inserir pedidos" 
ON public.pedidos FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Usuários podem ver seus pedidos" 
ON public.pedidos FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Políticas para cupons (público para leitura)
CREATE POLICY "Cupons são públicos para leitura" 
ON public.cupons FOR SELECT 
USING (true);

-- Inserir produtos base
INSERT INTO public.produtos (nome, descricao) VALUES 
('caixa_alta', 'Quadro personalizado para medalhas com moldura alta - ideal para exposição em parede com destaque especial para suas conquistas.'),
('caixa_baixa', 'Quadro personalizado para medalhas com moldura baixa - perfeito para exposição discreta e elegante de suas medalhas.');

-- Inserir variações para Caixa Alta
WITH produto_caixa_alta AS (
  SELECT id FROM public.produtos WHERE nome = 'caixa_alta'
)
INSERT INTO public.variacoes (produto_id, cor, tamanho, preco, imagem_url) 
SELECT 
  p.id,
  cores.cor,
  tamanhos.tamanho,
  tamanhos.preco,
  'caixa_alta_' || LOWER(REPLACE(cores.cor, '/', '_')) || '.jpg'
FROM produto_caixa_alta p
CROSS JOIN (VALUES 
  ('Preta'),
  ('Preta/Branca')
) AS cores(cor)
CROSS JOIN (VALUES 
  ('33x33cm', 129.90),
  ('33x43cm', 149.90),
  ('37x48cm', 169.90),
  ('43x43cm', 189.90),
  ('43x53cm', 219.90),
  ('43x63cm', 249.90),
  ('53x53cm', 279.90)
) AS tamanhos(tamanho, preco);

-- Inserir variações para Caixa Baixa
WITH produto_caixa_baixa AS (
  SELECT id FROM public.produtos WHERE nome = 'caixa_baixa'
)
INSERT INTO public.variacoes (produto_id, cor, tamanho, preco, imagem_url) 
SELECT 
  p.id,
  cores.cor,
  tamanhos.tamanho,
  tamanhos.preco,
  'caixa_baixa_' || LOWER(cores.cor) || '.jpg'
FROM produto_caixa_baixa p
CROSS JOIN (VALUES 
  ('Preta'),
  ('Branca')
) AS cores(cor)
CROSS JOIN (VALUES 
  ('33x33cm', 119.90),
  ('33x43cm', 139.90),
  ('37x48cm', 159.90),
  ('43x43cm', 179.90),
  ('43x53cm', 209.90),
  ('43x63cm', 239.90),
  ('53x53cm', 269.90)
) AS tamanhos(tamanho, preco);

-- Inserir alguns cupons de exemplo
INSERT INTO public.cupons (codigo, desconto_percentual, ativo) VALUES 
('PRIMEIRA10', 10.00, true),
('CORRIDA15', 15.00, true),
('MEDALHA20', 20.00, true);

-- Criar bucket para imagens dos produtos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('produtos', 'produtos', true);

-- Políticas para storage dos produtos
CREATE POLICY "Imagens dos produtos são públicas" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'produtos');

CREATE POLICY "Admins podem fazer upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'produtos');