import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/checkout`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Não foi possível fazer login com Google.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToOrder = () => {
    // TODO: Navigate to order finalization page (to be created later)
    toast({
      title: "Em desenvolvimento",
      description: "A página de finalização do pedido será criada em breve.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Resumo do Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Produto Selecionado</CardTitle>
                  <CardDescription>
                    Detalhes do produto escolhido na nossa loja
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src="/lovable-uploads/premium-frame.jpg"
                      alt="Produto selecionado"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Moldura Premium Personalizada</h3>
                    <p className="text-muted-foreground mt-2">
                      Moldura única com medalha, mapa 3D da rota e detalhes da sua corrida.
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">Preço:</span>
                      <span className="text-2xl font-bold text-primary">R$ 199,90</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      ou 12x de R$ 16,66 sem juros
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Authentication and Checkout */}
            <div className="space-y-6">
              {!user ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Faça login para continuar</CardTitle>
                    <CardDescription>
                      Entre com sua conta para finalizar o pedido
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
                    >
                      <img 
                        src="/lovable-uploads/google-logo.png" 
                        alt="Google" 
                        className="w-5 h-5 mr-2"
                      />
                      {loading ? "Carregando..." : "Continuar com Google"}
                    </Button>
                    
                    <div className="text-center text-sm text-muted-foreground">
                      Ao fazer login, você concorda com nossos termos de uso
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Usuário logado</CardTitle>
                    <CardDescription>
                      Olá, {user.email}! Você já está logado.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-700 font-medium">Login realizado com sucesso</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleProceedToOrder}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Finalizar Pedido
                    </Button>
                    
                    <div className="text-center text-sm text-muted-foreground">
                      Próximo passo: informações de entrega e pagamento
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ 199,90</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">R$ 199,90</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Checkout;