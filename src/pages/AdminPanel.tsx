import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ShoppingCart, Users, FileText, Settings, LogOut, Search, Menu, CalendarIcon, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  numero_pedido: string;
  data_pedido: string;
  total: number;
  status: string;
  forma_pagamento: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  order_count?: number;
}

const AdminPanel = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [periodFilter, setPeriodFilter] = useState('todos');
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();

  // Verificar autenticação e autorização
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      if (user.email !== 'onetouch3dbrasil@gmail.com') {
        toast({
          title: "Acesso restrito",
          description: "Apenas administradores autorizados podem acessar este painel.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
    }
  }, [user, loading, navigate, toast]);

  // Carregar dados dos pedidos
  const loadOrders = async () => {
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          id,
          numero_pedido,
          data_pedido,
          total,
          status,
          forma_pagamento,
          profiles!inner(
            full_name,
            email
          )
        `)
        .order('data_pedido', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pedidos.",
        variant: "destructive",
      });
    }
    setLoadingData(false);
  };

  // Carregar dados dos clientes
  const loadProfiles = async () => {
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .order('full_name');

      if (error) throw error;
      
      // Contar pedidos por cliente
      const profilesWithCount = await Promise.all(
        (data || []).map(async (profile) => {
          const { count } = await supabase
            .from('pedidos')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);
          
          return {
            ...profile,
            order_count: count || 0
          };
        })
      );

      setProfiles(profilesWithCount);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro", 
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (user?.email === 'onetouch3dbrasil@gmail.com') {
      loadOrders();
      loadProfiles();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmado':
        return 'bg-blue-100 text-blue-800';
      case 'processando':
        return 'bg-purple-100 text-purple-800';
      case 'enviado':
        return 'bg-green-100 text-green-800';
      case 'entregue':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredOrders = () => {
    let filtered = orders.filter(order =>
      order.numero_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtro por status
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(order => order.status.toLowerCase() === statusFilter);
    }

    // Filtro por período
    if (periodFilter !== 'todos') {
      const now = new Date();
      let startDate: Date;
      let endDate = now;

      switch (periodFilter) {
        case '7dias':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'mes':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'personalizado':
          if (customStartDate && customEndDate) {
            startDate = customStartDate;
            endDate = customEndDate;
          } else {
            return filtered;
          }
          break;
        default:
          return filtered;
      }

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.data_pedido);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const filteredProfiles = profiles.filter(profile =>
    profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const monthlyStats = {
    totalOrders: orders.filter(order => {
      const orderDate = new Date(order.data_pedido);
      const currentMonth = new Date().getMonth();
      return orderDate.getMonth() === currentMonth;
    }).length,
    totalValue: orders
      .filter(order => {
        const orderDate = new Date(order.data_pedido);
        const currentMonth = new Date().getMonth();
        return orderDate.getMonth() === currentMonth;
      })
      .reduce((sum, order) => sum + Number(order.total), 0),
    totalCustomers: profiles.length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || user.email !== 'onetouch3dbrasil@gmail.com') {
    return null;
  }

  const sidebarItems = [
    { title: 'Dashboard', icon: FileText, key: 'dashboard' },
    { title: 'Pedidos', icon: ShoppingCart, key: 'orders' },
    { title: 'Clientes', icon: Users, key: 'customers' },
    { title: 'Relatórios', icon: FileText, key: 'reports' },
    { title: 'Configurações', icon: Settings, key: 'settings' },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="w-64">
          <SidebarContent>
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">OneTouch3D</h2>
              <p className="text-sm text-gray-600">Painel Administrativo</p>
            </div>
            
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.key)}
                        className={`w-full justify-start ${
                          activeSection === item.key 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleLogout}
                      className="w-full justify-start text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          {/* Header */}
          <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold text-gray-800">
                {sidebarItems.find(item => item.key === activeSection)?.title || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Bem-vindo, {user.email}
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Pedidos Este Mês
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {monthlyStats.totalOrders}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Valor Total Este Mês
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        R$ {monthlyStats.totalValue.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Total de Clientes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {monthlyStats.totalCustomers}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Últimos Pedidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingData ? (
                      <div className="text-center py-8">Carregando...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Pedido</th>
                              <th className="text-left py-2">Cliente</th>
                              <th className="text-left py-2">Valor</th>
                              <th className="text-left py-2">Status</th>
                              <th className="text-left py-2">Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(0, 10).map((order) => (
                              <tr key={order.id} className="border-b">
                                <td className="py-2 font-medium">{order.numero_pedido}</td>
                                <td className="py-2">{order.profiles.full_name}</td>
                                <td className="py-2">R$ {Number(order.total).toFixed(2)}</td>
                                <td className="py-2">
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                </td>
                                <td className="py-2">
                                  {new Date(order.data_pedido).toLocaleDateString('pt-BR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="space-y-6">
                {/* Filtros e Busca */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Busca Rápida */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar por número do pedido ou nome do cliente..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      {/* Filtros */}
                      <div className="flex flex-wrap gap-4">
                        {/* Filtro de Status */}
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-gray-500" />
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
                              <SelectItem value="pendente">Pendente</SelectItem>
                              <SelectItem value="confirmado">Confirmado</SelectItem>
                              <SelectItem value="processando">Processando</SelectItem>
                              <SelectItem value="enviado">Enviado</SelectItem>
                              <SelectItem value="entregue">Entregue</SelectItem>
                              <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Filtro de Período */}
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          <Select value={periodFilter} onValueChange={setPeriodFilter}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Período" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todos os períodos</SelectItem>
                              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                              <SelectItem value="mes">Mês atual</SelectItem>
                              <SelectItem value="personalizado">Personalizado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Seletor de Data Personalizada */}
                        {periodFilter === 'personalizado' && (
                          <div className="flex items-center gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-36 justify-start text-left font-normal",
                                    !customStartDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {customStartDate ? format(customStartDate, "dd/MM/yyyy", { locale: pt }) : "Data inicial"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={customStartDate}
                                  onSelect={setCustomStartDate}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>

                            <span className="text-gray-500">até</span>

                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-36 justify-start text-left font-normal",
                                    !customEndDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {customEndDate ? format(customEndDate, "dd/MM/yyyy", { locale: pt }) : "Data final"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={customEndDate}
                                  onSelect={setCustomEndDate}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        )}
                      </div>
                      
                      {/* Contador de resultados */}
                      <div className="text-sm text-gray-600">
                        {filteredOrders.length} pedido(s) encontrado(s)
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-0">
                    {loadingData ? (
                      <div className="text-center py-8">Carregando...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left py-3 px-4">Pedido</th>
                              <th className="text-left py-3 px-4">Cliente</th>
                              <th className="text-left py-3 px-4">E-mail</th>
                              <th className="text-left py-3 px-4">Valor</th>
                              <th className="text-left py-3 px-4">Pagamento</th>
                              <th className="text-left py-3 px-4">Status</th>
                              <th className="text-left py-3 px-4">Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrders.map((order) => (
                              <tr key={order.id} className="border-b">
                                <td className="py-3 px-4 font-medium">{order.numero_pedido}</td>
                                <td className="py-3 px-4">{order.profiles.full_name}</td>
                                <td className="py-3 px-4">{order.profiles.email}</td>
                                <td className="py-3 px-4">R$ {Number(order.total).toFixed(2)}</td>
                                <td className="py-3 px-4">{order.forma_pagamento}</td>
                                <td className="py-3 px-4">
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  {new Date(order.data_pedido).toLocaleDateString('pt-BR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'customers' && (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nome ou e-mail..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    {loadingData ? (
                      <div className="text-center py-8">Carregando...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left py-3 px-4">Nome</th>
                              <th className="text-left py-3 px-4">E-mail</th>
                              <th className="text-left py-3 px-4">Telefone</th>
                              <th className="text-left py-3 px-4">Pedidos</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProfiles.map((profile) => (
                              <tr key={profile.id} className="border-b">
                                <td className="py-3 px-4 font-medium">{profile.full_name}</td>
                                <td className="py-3 px-4">{profile.email}</td>
                                <td className="py-3 px-4">{profile.phone}</td>
                                <td className="py-3 px-4">
                                  <Badge variant="secondary">
                                    {profile.order_count} pedidos
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'reports' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Total de Pedidos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{orders.length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Valor Total Acumulado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        R$ {orders.reduce((sum, order) => sum + Number(order.total), 0).toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Pedidos Este Mês
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {monthlyStats.totalOrders}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Ticket Médio
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        R$ {orders.length > 0 
                          ? (orders.reduce((sum, order) => sum + Number(order.total), 0) / orders.length).toFixed(2)
                          : '0.00'
                        }
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Status dos Pedidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['pendente', 'confirmado', 'processando', 'enviado', 'entregue', 'cancelado'].map((status) => {
                        const count = orders.filter(order => order.status.toLowerCase() === status).length;
                        return (
                          <div key={status} className="text-center">
                            <div className="text-2xl font-bold">{count}</div>
                            <div className="text-sm text-gray-600 capitalize">{status}</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Configurações futuras serão adicionadas aqui.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;