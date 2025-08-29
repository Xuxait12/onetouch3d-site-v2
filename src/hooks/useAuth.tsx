import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Usuario {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string | null;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  usuario: Usuario | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados do usuário na tabela usuarios
  const fetchUsuario = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return;
      }
      
      if (data) {
        setUsuario(data);
        // Salvar no localStorage para persistência
        localStorage.setItem('usuario_dados', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session) {
          // Redirecionar para checkout após login bem-sucedido
          window.location.href = '/checkout';
          return;
        }
        
        if (session?.user) {
          // Buscar dados do usuário na tabela usuarios
          setTimeout(() => {
            fetchUsuario(session.user.id);
          }, 0);
        } else {
          // Limpar dados do usuário ao sair
          setUsuario(null);
          localStorage.removeItem('usuario_dados');
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Tentar carregar dados do localStorage primeiro
        const dadosSalvos = localStorage.getItem('usuario_dados');
        if (dadosSalvos) {
          setUsuario(JSON.parse(dadosSalvos));
        }
        // Buscar dados atualizados do banco
        fetchUsuario(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Limpar dados locais
    setUsuario(null);
    localStorage.removeItem('usuario_dados');
  };

  const value = {
    user,
    usuario,
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};