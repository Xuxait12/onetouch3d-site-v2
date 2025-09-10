import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import GlobalHeader from '@/components/GlobalHeader';
import { Calendar, Package, ArrowLeft, CreditCard } from 'lucide-react';

interface Order {
  id: string;
  product_name: string;
  product_description: string | null;
  total_amount: number;
  status: string;
  order_date: string;
  created_at: string;
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

const OrderDetails = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getOrderDetails = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      if (!orderId) {
        navigate('/meus-pedidos');
        return;
      }

      try {
        // Buscar dados do pedido
        const { data: pedido, error: pedidoError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('id', orderId)
          .eq('user_id', session.user.id)
          .single();

        if (pedidoError) {
          console.error('Error fetching order:', pedidoError);
          toast({
            variant: "destructive",
            title: "Pedido não encontrado",
            description: "O pedido solicitado não foi encontrado.",
          });
          navigate('/meus-pedidos');
          return;
        }

        // Buscar itens do pedido
        const { data: itens, error: itensError } = await supabase
          .from('itens_pedido')
          .select('*')
          .eq('pedido_id', orderId);

        if (itensError) {
          console.error('Error fetching order items:', itensError);
        }

        // Mapear os dados para o formato esperado
        const mappedOrder = {
          id: (pedido as any).id,
          product_name: `Quadro Personalizado`,
          product_description: `${(pedido as any).numero_pedido || 'Pedido #' + (pedido as any).id.slice(0, 8)}`,
          total_amount: (pedido as any).total,
          status: (pedido as any).status,
          order_date: (pedido as any).data_pedido,
          created_at: (pedido as any).created_at
        };

        setOrder(mappedOrder);
        setOrderItems(itens || []);
      } catch (error) {
        console.error('Error fetching order data:', error);
        navigate('/meus-pedidos');
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [orderId, navigate, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pago':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'enviado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concluido':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'pago':
        return 'Pago';
      case 'enviado':
        return 'Enviado';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  if (!user || loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <GlobalHeader />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando detalhes do pedido...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <GlobalHeader />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/meus-pedidos')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Meus Pedidos
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {order.product_description}
              </h1>
              <p className="text-muted-foreground">
                Detalhes completos do seu pedido
              </p>
            </div>
            <Badge className={`px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Informações do Pedido */}
          <Card className="border border-border/50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-muted/20 to-muted/30">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Package className="w-5 h-5" />
                Informações do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">{order.product_name}</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground font-medium">Data do Pedido:</span>
                      <p className="font-semibold">{formatDate(order.order_date)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">Status:</span>
                      <div className="mt-1">
                        <Badge className={`px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-4">Resumo Financeiro</h3>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-foreground font-medium">Total do Pedido:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Itens do Pedido */}
          {orderItems.length > 0 && (
            <Card className="border border-border/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-muted/20 to-muted/30">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="w-5 h-5" />
                  Itens do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-4 bg-muted/20 rounded-lg border border-border/30">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-foreground">{item.produto_nome}</h4>
                        <p className="text-muted-foreground mt-1">
                          {item.tamanho} / {item.moldura_tipo} / Quantidade: {item.quantidade}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          R$ {item.valor_unitario.toFixed(2).replace('.', ',')} cada
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg text-foreground">
                          R$ {item.subtotal.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;