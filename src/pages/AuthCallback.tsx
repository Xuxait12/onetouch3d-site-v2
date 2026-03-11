import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const returnTo = searchParams.get("returnTo") || "/checkout";

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        subscription.unsubscribe();
        navigate(returnTo, { replace: true });
      } else if (event === "SIGNED_OUT") {
        subscription.unsubscribe();
        navigate("/auth", { replace: true });
      }
    });

    // Fallback: se já tem sessão, navega imediatamente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe();
        navigate(returnTo, { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
};

export default AuthCallback;
