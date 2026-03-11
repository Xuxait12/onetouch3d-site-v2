import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Erro no callback OAuth:", error.message);
          navigate("/auth?error=oauth_failed", { replace: true });
          return;
        }

        if (session) {
          const redirectTo = localStorage.getItem("auth_redirect_to") || "/checkout";
          localStorage.removeItem("auth_redirect_to");
          navigate(redirectTo, { replace: true });
        } else {
          navigate("/auth", { replace: true });
        }
      } catch (err) {
        console.error("Erro inesperado no AuthCallback:", err);
        navigate("/auth", { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="text-muted-foreground text-sm">Autenticando...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
