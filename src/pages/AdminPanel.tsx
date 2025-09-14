import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Home, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Search, 
  CalendarIcon, 
  Filter, 
  ChevronDown, 
  ChevronsRight, 
  TrendingUp,
  Activity,
  Package,
  Bell,
  Moon,
  Sun,
  User
} from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Verificar autenticação e autorização
  useEffect(() => {
    console.log('Admin Panel - Estado da autenticação:', { user: user?.email, loading });
    
    if (!loading) {
      if (!user) {
        console.log('Admin Panel - Usuário não logado, redirecionando para /auth');
        navigate('/auth');
        return;
      }
      
      if (user.email !== 'onetouch3dbrasil@gmail.com') {
        console.log('Admin Panel - Email não autorizado:', user.email);
        toast({
          title: "Acesso restrito",
          description: "Apenas administradores autorizados podem acessar este painel.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      console.log('Admin Panel - Acesso autorizado para:', user.email);
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
    { title: 'Dashboard', icon: Home, key: 'dashboard' },
    { title: 'Pedidos', icon: ShoppingCart, key: 'orders' },
    { title: 'Clientes', icon: Users, key: 'customers' },
    { title: 'Relatórios', icon: FileText, key: 'reports' },
    { title: 'Configurações', icon: Settings, key: 'settings' },
  ];

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const getSidebarComponent = () => (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'w-64' : 'w-16'
      } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm`}
    >
      <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
              <svg
                width="20"
                height="auto"
                viewBox="0 0 50 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-white"
              >
                <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
                <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
              </svg>
            </div>
            {sidebarOpen && (
              <div className={`transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                <div>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    OneTouch3D
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Painel Admin
                  </span>
                </div>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </div>

      <div className="space-y-1 mb-8">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveSection(item.key)}
            className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
              activeSection === item.key
                ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <div className="grid h-full w-12 place-content-center">
              <item.icon className="h-4 w-4" />
            </div>
            
            {sidebarOpen && (
              <span className={`text-sm font-medium transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                {item.title}
              </span>
            )}
          </button>
        ))}
      </div>

      {sidebarOpen && (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Conta
          </div>
          <button
            onClick={handleLogout}
            className="relative flex h-11 w-full items-center rounded-md transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <div className="grid h-full w-12 place-content-center">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      )}

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <div className="flex items-center p-3">
          <div className="grid size-10 place-content-center">
            <ChevronsRight
              className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {sidebarOpen && (
            <span className={`text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              Ocultar
            </span>
          )}
        </div>
      </button>
    </nav>
  );

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {getSidebarComponent()}
        
        <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {sidebarItems.find(item => item.key === activeSection)?.title || 'Dashboard'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Bem-vindo ao painel administrativo da OneTouch3D
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
              <button className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {activeSection === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Pedidos Este Mês</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{monthlyStats.totalOrders}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+8% do mês passado</p>
                  </div>
                  
                  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Valor Total Este Mês</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">R$ {monthlyStats.totalValue.toFixed(2)}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12% do mês passado</p>
                  </div>
                  
                  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Total de Clientes</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{monthlyStats.totalCustomers}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+5% esta semana</p>
                  </div>

                  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Produtos Vendidos</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{orders.length}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+3 esta semana</p>
                  </div>
                </div>
                
                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Orders */}
                  <div className="lg:col-span-2">
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Últimos Pedidos</h3>
                        <button 
                          onClick={() => setActiveSection('orders')}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          Ver todos
                        </button>
                      </div>
                      <div className="space-y-4">
                        {loadingData ? (
                          <div className="text-center py-8">Carregando...</div>
                        ) : (
                          orders.slice(0, 5).map((order) => (
                            <div key={order.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  Pedido {order.numero_pedido}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {order.profiles.full_name} - R$ {Number(order.total).toFixed(2)}
                                </p>
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                {new Date(order.data_pedido).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Estatísticas Rápidas</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conversão</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">3.2%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Pedidos Entregues</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Satisfação Cliente</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">94%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Status dos Pedidos</h3>
                      <div className="space-y-3">
                        {['Pendente', 'Confirmado', 'Enviado', 'Entregue'].map((status, i) => (
                          <div key={i} className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{status}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {orders.filter(order => order.status.toLowerCase() === status.toLowerCase()).length}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="space-y-6">
                {/* Filtros e Busca */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                  <div className="space-y-4">
                    {/* Busca Rápida */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        placeholder="Buscar por número do pedido ou nome do cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    
                    {/* Filtros */}
                    <div className="flex flex-wrap gap-4">
                      {/* Filtro de Status */}
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
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
                        <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
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
                              <button
                                className={cn(
                                  "justify-start text-left font-normal h-10 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm",
                                  !customStartDate && "text-gray-500"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {customStartDate ? format(customStartDate, "dd/MM/yyyy", { locale: pt }) : "Data inicial"}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={customStartDate}
                                onSelect={setCustomStartDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          
                          <span className="text-gray-500">até</span>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                className={cn(
                                  "justify-start text-left font-normal h-10 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm",
                                  !customEndDate && "text-gray-500"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {customEndDate ? format(customEndDate, "dd/MM/yyyy", { locale: pt }) : "Data final"}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={customEndDate}
                                onSelect={setCustomEndDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Listagem de Pedidos */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Pedidos ({filteredOrders.length})
                    </h3>
                  </div>
                  <div className="p-6">
                    {loadingData ? (
                      <div className="text-center py-8">Carregando...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left py-3 font-medium text-gray-600 dark:text-gray-400">Pedido</th>
                              <th className="text-left py-3 font-medium text-gray-600 dark:text-gray-400">Cliente</th>
                              <th className="text-left py-3 font-medium text-gray-600 dark:text-gray-400">E-mail</th>
                              <th className="text-left py-3 font-medium text-gray-600 dark:text-gray-400">Valor</th>
                              <th className="text-left py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                              <th className="text-left py-3 font-medium text-gray-600 dark:text-gray-400">Pagamento</th>
                              <th className="text-left py-3 font-medium text-gray-600 dark:text-gray-400">Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrders.map((order) => (
                              <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{order.numero_pedido}</td>
                                <td className="py-3 text-gray-900 dark:text-gray-100">{order.profiles.full_name}</td>
                                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{order.profiles.email}</td>
                                <td className="py-3 font-medium text-gray-900 dark:text-gray-100">R$ {Number(order.total).toFixed(2)}</td>
                                <td className="py-3">
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                </td>
                                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{order.forma_pagamento}</td>
                                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(order.data_pedido).toLocaleDateString('pt-BR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        {filteredOrders.length === 0 && (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Nenhum pedido encontrado com os filtros aplicados.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'customers' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Clientes ({filteredProfiles.length})
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <Input
                          placeholder="Buscar por nome ou e-mail..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    </div>
                    
                    {loadingData ? (
                      <div className="text-center py-8">Carregando...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left py-3 font-medium text-gray-600 dark:text-gray-400">Nome</th>
                              <th className="text-left py-3 font-medium text-gray-600 dark:text-gray-400">E-mail</th>
                              <th className="text-left py-3 font-medium text-gray-600 dark:text-gray-400">Telefone</th>
                              <th className="text-left py-3 font-medium text-gray-600 dark:text-gray-400">Pedidos</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProfiles.map((profile) => (
                              <tr key={profile.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{profile.full_name}</td>
                                <td className="py-3 text-gray-900 dark:text-gray-100">{profile.email}</td>
                                <td className="py-3 text-gray-600 dark:text-gray-400">{profile.phone || '-'}</td>
                                <td className="py-3">
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                    {profile.order_count || 0} pedidos
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        {filteredProfiles.length === 0 && (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Nenhum cliente encontrado.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'reports' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Pedidos Este Mês</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{monthlyStats.totalOrders}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+8% do mês passado</p>
                  </div>
                  
                  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Valor Total Este Mês</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">R$ {monthlyStats.totalValue.toFixed(2)}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12% do mês passado</p>
                  </div>
                  
                  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Total de Clientes</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{monthlyStats.totalCustomers}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+5% esta semana</p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resumo Geral</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Status dos Pedidos</h4>
                        <div className="space-y-3">
                          {['pendente', 'confirmado', 'processando', 'enviado', 'entregue', 'cancelado'].map((status) => {
                            const count = orders.filter(order => order.status.toLowerCase() === status).length;
                            const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                            return (
                              <div key={status} className="flex items-center justify-between">
                                <span className="capitalize text-gray-600 dark:text-gray-400">{status}</span>
                                <div className="flex items-center gap-3">
                                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full" 
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-gray-100 w-8">{count}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Formas de Pagamento</h4>
                        <div className="space-y-3">
                          {['PIX', 'Cartão de Crédito', 'Boleto'].map((payment) => {
                            const count = orders.filter(order => 
                              order.forma_pagamento.toLowerCase().includes(payment.toLowerCase())
                            ).length;
                            const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                            return (
                              <div key={payment} className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">{payment}</span>
                                <div className="flex items-center gap-3">
                                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-green-500 h-2 rounded-full" 
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-gray-100 w-8">{count}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Configurações</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Configurações futuras serão adicionadas aqui.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;