import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const AuthRedirect = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkProfileAndRedirect = async () => {
      if (loading) return;
      
      if (!user) {
        navigate('/');
        return;
      }

      try {
        // Check if profile exists
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking profile:', error);
          navigate('/perfil');
          return;
        }

        // Check if profile has required data
        const hasCompleteProfile = profile && 
          profile.full_name && 
          profile.cpf_cnpj && 
          profile.cep && 
          profile.address && 
          profile.number && 
          profile.neighborhood && 
          profile.city && 
          profile.state && 
          profile.phone;

        if (hasCompleteProfile) {
          navigate('/');
        } else {
          navigate('/perfil');
        }
      } catch (error) {
        console.error('Error during profile check:', error);
        navigate('/perfil');
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