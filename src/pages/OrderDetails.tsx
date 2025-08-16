import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import Header from '@/components/Header';
import { Calendar, Package, ArrowLeft, CreditCard } from 'lucide-react';

interface Order {
  id: string;
  product_name: string;
  product_description: string | null;
  total_amount: number;
  status: string;
  order_date: string;
  created_at: string;
  updated_at: string;
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
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

      if (!id) {
        navigate('/meus-pedidos');
        return;
      }

      try {
        const { data: orderData, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          toast({
            title: "Erro",
            description: "Pedido não encontrado.",
            variant: "destructive",
          });
          navigate('/meus-pedidos');
        } else {
          setOrder(orderData);
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro inesperado. Tente novamente.",
          variant: "destructive",
        });
        navigate('/meus-pedidos');
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [id, navigate, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'paid':
        return 'Pago';
      case 'shipped':
        return 'Enviado';
      case 'completed':
        return 'Concluído';
      case 'canceled':
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
        <Header />
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
      <Header />
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
                Pedido #{order.id.slice(0, 8)}
              </h1>
              <p className="text-muted-foreground">
                Detalhes completos do seu pedido
              </p>
            </div>
            <Badge className={getStatusColor(order.status)} variant="secondary">
              {getStatusText(order.status)}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Informações do Produto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{order.product_name}</h3>
                {order.product_description && (
                  <p className="text-muted-foreground mt-2">
                    {order.product_description}
                  </p>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Valor Total:</span>
                  <span className="text-2xl font-bold text-accent">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Cronologia do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Data do Pedido
                  </label>
                  <p className="text-lg">{formatDate(order.order_date)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Última Atualização
                  </label>
                  <p className="text-lg">{formatDate(order.updated_at)}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <label className="text-sm font-medium text-muted-foreground">
                  Status Atual
                </label>
                <div className="mt-2">
                  <Badge className={getStatusColor(order.status)} variant="secondary">
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Informações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
                
                <div className="flex justify-between items-center font-bold text-lg pt-4 border-t">
                  <span>Total:</span>
                  <span className="text-accent">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;