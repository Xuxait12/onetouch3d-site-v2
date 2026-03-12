import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let handled = false;

    const handleRedirect = (hasSession: boolean) => {
      if (handled) return;
      handled = true;
      if (hasSession) {
        const redirectTo = localStorage.getItem("auth_redirect_to") || "/checkout";
        localStorage.removeItem("auth_redirect_to");
        navigate(redirectTo, { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
    };

    // Verifica sessão existente imediatamente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) handleRedirect(true);
    });

    // Escuta o evento SIGNED_IN (disparado quando detectSessionInUrl conclui o PKCE exchange)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        handleRedirect(true);
      }
    });

    // Timeout de segurança: 8 segundos
    const timeout = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleRedirect(!!session);
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
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
