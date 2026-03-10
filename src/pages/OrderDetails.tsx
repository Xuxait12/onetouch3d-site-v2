import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, User, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { getStatusText, getStatusColor, getPaymentMethodText } from "@/utils/orderUtils";

interface Order {
  id: string;
  created_at: string;
  status_pagamento: string;
  status_producao: string;
  preco_total: number;
  shipping_cost: number | null;
  desconto_cupom: number | null;
  desconto_pix: number | null;
  preco_final: number;
  preco_unitario: number;
  quantidade: number;
  metodo_pagamento: string | null;
  shipping_address: string | null;
  profiles: {
    nome_completo: string;
    email: string;
    telefone: string | null;
    cpf_cnpj: string | null;
    endereco: string | null;
    numero: string | null;
    complemento: string | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
    cep: string | null;
  };
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!id || !user) return;

      try {
        // Load order - filter by user_id for regular users
        const { data: orderData, error: orderError } = await supabase
          .from('pedidos')
          .select(`
            *,
            profiles!inner(nome_completo, email, telefone, cpf_cnpj, endereco, numero, complemento, bairro, cidade, estado, cep)
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (orderError) throw orderError;

        setOrder(orderData);
      } catch (error) {
        console.error('Error loading order details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [id, user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
        <GlobalHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-muted-foreground">Carregando detalhes do pedido...</p>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
        <GlobalHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Pedido não encontrado</h1>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  const totalDesconto = (order.desconto_cupom || 0) + (order.desconto_pix || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
      <GlobalHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Pedido #{order.id.slice(0, 8)}
                  </CardTitle>
                  <Badge className={getStatusColor(order.status_pagamento)}>
                    {getStatusText(order.status_pagamento)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Data:</span>
                      <p className="font-medium">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pagamento:</span>
                      <p className="font-medium">{getPaymentMethodText(order.metodo_pagamento || '')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Item do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-start p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">Quadro Personalizado</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantidade: {order.quantidade}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R$ {order.preco_total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {order.preco_unitario.toFixed(2)} cada
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Dados do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p className="font-medium">{order.profiles.nome_completo}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">E-mail:</span>
                    <p className="font-medium">{order.profiles.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefone:</span>
                    <p className="font-medium">{order.profiles.telefone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CPF/CNPJ:</span>
                    <p className="font-medium">{order.profiles.cpf_cnpj}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Endereço de Cadastro:</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.profiles.endereco}, {order.profiles.numero}
                      {order.profiles.complemento && `, ${order.profiles.complemento}`}
                      <br />
                      {order.profiles.bairro}, {order.profiles.cidade} - {order.profiles.estado}
                      <br />
                      CEP: {order.profiles.cep}
                    </p>
                  </div>
                  
                  {order.shipping_address && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Endereço de Entrega:</h4>
                        <p className="text-sm text-muted-foreground">
                          {order.shipping_address}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>R$ {order.preco_total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete:</span>
                    <span>R$ {(order.shipping_cost || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desconto:</span>
                    <span>-R$ {totalDesconto.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>R$ {order.preco_final.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
};

export default OrderDetails;
