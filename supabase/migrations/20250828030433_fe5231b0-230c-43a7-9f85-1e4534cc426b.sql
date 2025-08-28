-- Criar a tabela usuarios
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  provedor TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ultimo_login TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela usuarios
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Política para usuários visualizarem seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados"
ON public.usuarios
FOR SELECT
USING (auth.uid() = id);

-- Política para usuários atualizarem seus próprios dados
CREATE POLICY "Usuários podem atualizar seus próprios dados"
ON public.usuarios
FOR UPDATE
USING (auth.uid() = id);

-- Função para lidar com novos usuários e logins
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir ou atualizar na tabela usuarios
  INSERT INTO public.usuarios (id, nome, email, provedor, criado_em, ultimo_login)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
    NEW.created_at,
    now()
  )
  ON CONFLICT (id)
  DO UPDATE SET
    ultimo_login = now(),
    nome = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', usuarios.nome),
    email = NEW.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função em novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();