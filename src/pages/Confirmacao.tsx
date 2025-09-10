import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, Package, Clock } from "lucide-react";

interface OrderDetails {
  id: string;
  numero_pedido?: string;
  data_pedido: string;
  subtotal: number;
  frete: number;
  desconto: number;
  total: number;
  status: string;
  forma_pagamento: string;
}

interface OrderItem {
  id: string;
  produto_nome: string;
  moldura_tipo: string;
  tamanho: string;
  quantidade: number;
  valor_unitario: number;
  subtotal: number;
}

const Confirmacao = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const pedidoId = searchParams.get('pedido');

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!pedidoId || !user) {
        navigate('/');
        return;
      }

      try {
        // Load order details
        const { data: order, error: orderError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('id', pedidoId)
          .eq('user_id', user.id)
          .single();

        if (orderError) {
          throw orderError;
        }

        // Load order items
        const { data: items, error: itemsError } = await supabase
          .from('itens_pedido')
          .select('*')
          .eq('pedido_id', pedidoId);

        if (itemsError) {
          throw itemsError;
        }

        setOrderDetails(order);
        setOrderItems(items || []);
      } catch (error) {
        console.error('Error loading order:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [pedidoId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
        <GlobalHeader />
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Carregando detalhes do pedido...</p>
            </div>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
        <GlobalHeader />
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">Pedido não encontrado</h1>
              <p className="text-lg text-muted-foreground mb-6">O pedido solicitado não foi encontrado.</p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-black hover:bg-black/90 text-white"
              >
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      pix: 'PIX',
      debit: 'Cartão de Débito', 
      credit: 'Cartão de Crédito'
    };
    return methods[method] || method;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
      <GlobalHeader />
      
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">🎉 Pedido realizado com sucesso!</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Seu pedido nº <span className="font-bold text-foreground">{orderDetails.numero_pedido}</span> foi registrado.
            </p>
            <div className="flex items-center justify-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-orange-600 font-medium">Status: {orderDetails.status}</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Detalhes do Pedido
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <span className="text-muted-foreground">Data do Pedido:</span>
                    <p className="font-medium">{formatDate(orderDetails.data_pedido)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Forma de Pagamento:</span>
                    <p className="font-medium">{formatPaymentMethod(orderDetails.forma_pagamento)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <h4 className="font-semibold mb-4">Itens do Pedido</h4>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground">{item.produto_nome}</h5>
                        <p className="text-sm text-muted-foreground">
                          {item.tamanho} / {item.moldura_tipo} / Qtd: {item.quantidade}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          R$ {item.valor_unitario.toFixed(2).replace('.', ',')} cada
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-foreground">
                          R$ {item.subtotal.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Resumo Financeiro</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-foreground">R$ {orderDetails.subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete:</span>
                    <span className="text-foreground">R$ {orderDetails.frete.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  {orderDetails.desconto > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Desconto:</span>
                      <span className="text-red-600 font-medium">- R$ {orderDetails.desconto.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-border/30 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-foreground">Total:</span>
                      <span className="text-xl font-bold text-green-600">
                        R$ {orderDetails.total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button 
              onClick={() => window.location.href = "/corrida#nossa-loja"}
              variant="outline"
              className="px-8 py-3"
            >
              Voltar à Loja
            </Button>
            <Button 
              onClick={() => navigate('/meus-pedidos')}
              className="bg-black hover:bg-black/90 text-white px-8 py-3"
            >
              Meus Pedidos
            </Button>
          </div>
        </div>
      </div>
      
      <GlobalFooter />
    </div>
  );
};

export default Confirmacao;