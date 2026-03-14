import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const [status, setStatus] = useState("Autenticando...");

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (data?.session && !error) { doRedirect(); return; }
          if (error) console.error("[AuthCallback] Code exchange error:", error.message);
        }

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
            if (data?.session && !error) { doRedirect(); return; }
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) { doRedirect(); return; }

        setStatus("Erro na autenticação. Redirecionando...");
        setTimeout(() => { window.location.href = "/auth"; }, 2000);
      } catch (err) {
        console.error("[AuthCallback] Error:", err);
        setStatus("Erro na autenticação. Redirecionando...");
        setTimeout(() => { window.location.href = "/auth"; }, 2000);
      }
    };

    const doRedirect = () => {
      // Restore cart from backup if it exists (preserved before OAuth redirect)
      const cartBackup = localStorage.getItem('cart_backup');
      if (cartBackup) {
        localStorage.setItem('cart', cartBackup);
        localStorage.removeItem('cart_backup');
      }
      const redirectTo = localStorage.getItem("auth_redirect_to") || "/checkout";
      localStorage.removeItem("auth_redirect_to");
      window.location.href = redirectTo;
    };

    processCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="text-muted-foreground text-sm">{status}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
