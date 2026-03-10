import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const AuthRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfileAndRedirect = async () => {
      if (loading) return;
      
      if (!user) {
        navigate('/');
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('nome_completo, cpf_cnpj, cep, endereco, numero, bairro, cidade, estado, telefone')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking profile:', error);
          navigate('/perfil');
          return;
        }

        const hasCompleteProfile = profile && 
          profile.nome_completo && profile.nome_completo.trim() !== '' &&
          profile.cpf_cnpj && profile.cpf_cnpj.trim() !== '' &&
          profile.cep && profile.cep.trim() !== '' &&
          profile.endereco && profile.endereco.trim() !== '' &&
          profile.numero && profile.numero.trim() !== '' &&
          profile.bairro && profile.bairro.trim() !== '' &&
          profile.cidade && profile.cidade.trim() !== '' &&
          profile.estado && profile.estado.trim() !== '' &&
          profile.telefone && profile.telefone.trim() !== '';

        if (hasCompleteProfile) {
          navigate(returnTo || '/');
        } else {
          navigate('/perfil');
        }
      } catch (error) {
        console.error('Error during profile check:', error);
        navigate('/perfil');
      } finally {
        setChecking(false);
      }
    };

    checkProfileAndRedirect();
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Verificando seus dados...</p>
      </div>
    </div>
  );
};

export default AuthRedirect;
