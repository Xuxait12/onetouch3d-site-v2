import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, digite seu email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao enviar email de recuperação. Tente novamente.",
          variant: "destructive",
        });
      } else {
        setSubmitted(true);
        toast({
          title: "Email enviado!",
          description: "Se este e-mail estiver cadastrado, enviaremos um link de recuperação.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            OneTouch<span className="text-accent">3D</span>
          </CardTitle>
          <CardDescription>
            Recuperar senha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!submitted ? (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Digite seu email para receber as instruções de recuperação de senha.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar instruções"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Se este e-mail estiver cadastrado, enviaremos um link de recuperação.
              </p>
              <p className="text-sm text-muted-foreground">
                Verifique sua caixa de entrada e spam.
              </p>
            </div>
          )}
          
          <div className="text-center">
            <Link 
              to="/auth" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar para Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;