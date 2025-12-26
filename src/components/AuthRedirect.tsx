import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const AuthRedirect = () => {
  const navigate = useNavigate();
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
        // Check if profile exists with complete data
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, cpf_cnpj, cep, address, number, neighborhood, city, state, phone')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking profile:', error);
          navigate('/perfil');
          return;
        }

        // Check if profile exists AND has all required fields filled
        const hasCompleteProfile = profile && 
          profile.full_name && profile.full_name.trim() !== '' &&
          profile.cpf_cnpj && profile.cpf_cnpj.trim() !== '' &&
          profile.cep && profile.cep.trim() !== '' &&
          profile.address && profile.address.trim() !== '' &&
          profile.number && profile.number.trim() !== '' &&
          profile.neighborhood && profile.neighborhood.trim() !== '' &&
          profile.city && profile.city.trim() !== '' &&
          profile.state && profile.state.trim() !== '' &&
          profile.phone && profile.phone.trim() !== '';

        if (hasCompleteProfile) {
          // Profile complete - go to home
          navigate('/');
        } else {
          // Profile incomplete or doesn't exist - go to profile page
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