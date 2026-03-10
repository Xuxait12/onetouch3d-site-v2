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
import { getStatusText, getStatusColor, formatDate, formatPrice } from "@/utils/orderUtils";

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

      try {
        const { data: pedidos, error } = await supabase
          .from('pedidos')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
          toast({
            variant: "destructive",
            title: "Erro ao carregar pedidos",
            description: "Não foi possível carregar seus pedidos. Tente novamente.",
          });
          setOrders([]);
        } else {
          const mappedOrders = pedidos?.map((pedido: any) => ({
            id: pedido.id,
            product_name: `Quadro Personalizado`,
            product_description: `Pedido #${pedido.id.slice(0, 8)}`,
            total_amount: pedido.preco_final,
            status: pedido.status_pagamento,
            order_date: pedido.created_at,
            created_at: pedido.created_at
          })) || [];
          
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    getOrdersData();
  }, [navigate, toast]);

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
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="bg-gradient-to-r from-muted/20 to-muted/30 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        {order.product_description}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.order_date)}
                      </div>
                    </div>
                    <Badge className={`px-3 py-1 rounded-full border font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">{order.product_name}</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button
                        variant="default"
                        onClick={() => navigate(`/meus-pedidos/${order.id}`)}
                        className="w-full bg-black hover:bg-black/90 text-white font-medium py-3 transition-all duration-200"
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
