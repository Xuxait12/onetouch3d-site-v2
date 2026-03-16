import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, Package, Clock } from "lucide-react";
import { getPaymentMethodText } from "@/utils/orderUtils";

interface OrderDetails {
  id: string;
  numero_pedido?: number | null;
  created_at: string;
  preco_total: number;
  shipping_cost: number | null;
  desconto_cupom: number | null;
  desconto_pix: number | null;
  preco_final: number;
  status_pagamento: string;
  metodo_pagamento: string | null;
  quantidade: number;
  preco_unitario: number;
}

const Confirmacao = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  const pedidoId = searchParams.get('pedido');

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!pedidoId) {
        navigate('/');
        return;
      }

      try {
        let query = supabase
          .from('pedidos')
          .select('*')
          .eq('id', pedidoId);

        // If user is logged in, filter by user_id for security
        if (user) {
          query = query.eq('user_id', user.id);
        }

        const { data: order, error: orderError } = await query.single();

        if (orderError) {
          throw orderError;
        }

        setOrderDetails(order);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalDesconto = (orderDetails.desconto_cupom || 0) + (orderDetails.desconto_pix || 0);

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
              Seu pedido nº <span className="font-bold text-foreground">#{orderDetails.numero_pedido ?? orderDetails.id.slice(0, 8)}</span> foi registrado.
            </p>
            <div className="flex items-center justify-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-orange-600 font-medium">Status: {orderDetails.status_pagamento}</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Detalhes do Pedido
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <span className="text-muted-foreground">Data do Pedido:</span>
                    <p className="font-medium">{formatDate(orderDetails.created_at)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Forma de Pagamento:</span>
                    <p className="font-medium">{getPaymentMethodText(orderDetails.metodo_pagamento || '')}</p>
                  </div>
                </div>

                <h4 className="font-semibold mb-4">Item do Pedido</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-start p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium text-foreground">Quadro Personalizado</h5>
                      <p className="text-sm text-muted-foreground">
                        Qtd: {orderDetails.quantidade}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        R$ {orderDetails.preco_unitario.toFixed(2).replace('.', ',')} cada
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground">
                        R$ {orderDetails.preco_total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
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
                    <span className="text-foreground">R$ {orderDetails.preco_total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete:</span>
                    <span className="text-foreground">R$ {(orderDetails.shipping_cost || 0).toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  {totalDesconto > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Desconto:</span>
                      <span className="text-red-600 font-medium">- R$ {totalDesconto.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-border/30 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-foreground">Total:</span>
                      <span className="text-xl font-bold text-green-600">
                        R$ {orderDetails.preco_final.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Account Creation CTA for non-logged users */}
          {!user && (
            <Card className="p-5 mt-8 border-dashed border-muted-foreground/30">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Quer acompanhar seus pedidos online? Crie uma conta gratuita com o mesmo e-mail usado na compra.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="shrink-0"
                >
                  Criar Conta
                </Button>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button 
              onClick={() => window.location.href = "/corrida#nossa-loja"}
              variant="outline"
              className="px-8 py-3"
            >
              Voltar à Loja
            </Button>
            {user && (
              <Button 
                onClick={() => navigate('/meus-pedidos')}
                className="bg-black hover:bg-black/90 text-white px-8 py-3"
              >
                Meus Pedidos
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <GlobalFooter />
    </div>
  );
};

export default Confirmacao;
