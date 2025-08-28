import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, LogOut } from 'lucide-react';

export default function FinalizarPedido() {
  const navigate = useNavigate();
  const { user, usuario, loading, signOut } = useAuth();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Finalizar Compra</CardTitle>
            <p className="text-muted-foreground">
              Bem-vindo! Complete suas informações para finalizar o pedido.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informações da Conta
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium min-w-[80px]">Nome:</span>
                  <span className="text-muted-foreground">
                    {usuario?.nome || user.user_metadata?.full_name || user.user_metadata?.name || 'Usuário'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="font-medium min-w-[80px]">E-mail:</span>
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/produtos')}
              >
                Voltar à Loja
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="text-muted-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}