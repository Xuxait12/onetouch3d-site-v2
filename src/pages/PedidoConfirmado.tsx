import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';

export default function PedidoConfirmado() {
  const navigate = useNavigate();

  useEffect(() => {
    // Limpar dados do pedido do localStorage se ainda existirem
    localStorage.removeItem('dadosPedido');
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Ícone de Sucesso */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Título e Mensagem */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Pedido Confirmado!
            </h1>
            <p className="text-xl text-muted-foreground">
              Obrigado pela sua compra! Seu pedido foi recebido com sucesso.
            </p>
          </div>

          {/* Card de Informações */}
          <Card className="text-left">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Próximos Passos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Confirmação por E-mail</h3>
                    <p className="text-sm text-muted-foreground">
                      Você receberá um e-mail de confirmação com os detalhes do seu pedido em alguns minutos.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Processamento</h3>
                    <p className="text-sm text-muted-foreground">
                      Nosso time começará a produzir seu quadro personalizado em até 2 dias úteis.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Entrega</h3>
                    <p className="text-sm text-muted-foreground">
                      Você receberá o código de rastreamento e seu pedido será entregue em 7-10 dias úteis.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Importantes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Informações Importantes</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Para pagamentos via PIX, você receberá as instruções por e-mail</li>
              <li>• Para cartão, o processamento será feito automaticamente</li>
              <li>• Dúvidas? Entre em contato conosco pelo WhatsApp</li>
            </ul>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')} 
              className="flex items-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
            
            <Button 
              onClick={() => navigate('/produtos')} 
              variant="outline"
              className="flex items-center"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continuar Comprando
            </Button>
          </div>

          {/* Contato */}
          <div className="border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Alguma dúvida? Entre em contato conosco através do{' '}
              <a 
                href="https://api.whatsapp.com/send?phone=5511999999999&text=Olá! Tenho uma dúvida sobre meu pedido."
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}