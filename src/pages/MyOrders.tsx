import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import GlobalHeader from '@/components/GlobalHeader';
import { Calendar, Package, Eye } from 'lucide-react';

interface Order {
  id: string;
  product_name: string;
  product_description: string | null;
  total_amount: number;
  status: string;
  order_date: string;
  created_at: string;
}

const MyOrders = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getOrdersData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Tabela orders não existe ainda, mas mantemos a estrutura para futura implementação
      setOrders([]);
      setLoading(false);
    };

    getOrdersData();
  }, [navigate, toast]);

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
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <GlobalHeader />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Meus Pedidos</h1>
          <p className="text-muted-foreground">Acompanhe todos os seus pedidos aqui</p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando seus pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Você ainda não possui pedidos</h3>
              <p className="text-muted-foreground mb-6">
                Que tal criar seu primeiro quadro personalizado?
              </p>
              <Button onClick={() => navigate('/')}>
                Criar Meu Primeiro Quadro
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Pedido #{order.id.slice(0, 8)}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.order_date)}
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <h3 className="font-semibold mb-1">{order.product_name}</h3>
                      {order.product_description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {order.product_description}
                        </p>
                      )}
                      <p className="text-lg font-bold text-accent">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/meus-pedidos/${order.id}`)}
                        className="w-full md:w-auto"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;