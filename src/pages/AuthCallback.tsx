import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // 1. Tenta ler tokens do hash (implicit flow)
        const hash = window.location.hash;
        if (hash && hash.includes("access_token")) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (data.session && !error) {
              const redirectTo = localStorage.getItem("auth_redirect_to") || "/checkout";
              localStorage.removeItem("auth_redirect_to");
              navigate(redirectTo, { replace: true });
              return;
            }
          }
        }

        // 2. Tenta trocar código PKCE (fallback)
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (data.session && !error) {
            const redirectTo = localStorage.getItem("auth_redirect_to") || "/checkout";
            localStorage.removeItem("auth_redirect_to");
            navigate(redirectTo, { replace: true });
            return;
          }
        }

        // 3. Verifica se sessão já existe (processada por detectSessionInUrl)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const redirectTo = localStorage.getItem("auth_redirect_to") || "/checkout";
          localStorage.removeItem("auth_redirect_to");
          navigate(redirectTo, { replace: true });
          return;
        }

        // Nenhuma sessão encontrada
        navigate("/auth", { replace: true });
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/auth", { replace: true });
      }
    };

    processCallback();
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
