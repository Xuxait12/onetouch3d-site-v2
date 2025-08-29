import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, User, MapPin, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface DadosPedido {
  produto: string;
  produtoId: string;
  cor: string;
  tamanho: string;
  preco: number;
  quantidade: number;
  total: number;
  imagemUrl: string;
  variacaoId: string;
}

interface UserData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const [dadosPedido, setDadosPedido] = useState<DadosPedido | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Dados do usuário
  const [userData, setUserData] = useState<UserData>({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  useEffect(() => {
    // Redirect to auth if not logged in
    if (!user) {
      navigate('/auth');
      return;
    }

    const dados = localStorage.getItem('dadosPedido');
    if (!dados) {
      toast.error('Nenhum produto selecionado');
      navigate('/');
      return;
    }
    setDadosPedido(JSON.parse(dados));

    // Load user data from database
    loadUserData();
  }, [navigate, user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar dados do usuário:', error);
        return;
      }

      if (data) {
        setUserData({
          nome: data.nome || '',
          email: data.email || user.email || '',
          cpf: data.cpf || '',
          telefone: data.telefone || '',
          rua: data.rua || '',
          numero: data.numero || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          cidade: data.cidade || '',
          estado: data.estado || '',
          cep: data.cep || ''
        });
      } else {
        // Set email from auth if no user data exists
        setUserData(prev => ({
          ...prev,
          email: user.email || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const updateUserData = (field: keyof UserData, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const finalizarPedido = async () => {
    const { nome, email, cpf, rua, numero, bairro, cidade, estado, cep } = userData;
    
    if (!dadosPedido || !nome || !email || !cpf || !rua || !numero || !bairro || !cidade || !estado || !cep) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setLoading(true);

    try {
      // First, save or update user data
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let usuarioId;

      if (existingUser) {
        // Update existing user
        const { error: updateError } = await supabase
          .from('usuarios')
          .update(userData)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
        usuarioId = existingUser.id;
      } else {
        // Create new user record
        const { data: newUser, error: insertError } = await supabase
          .from('usuarios')
          .insert({
            user_id: user.id,
            ...userData
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        usuarioId = newUser.id;
      }

      // Create the order
      const { error: orderError } = await supabase
        .from('pedidos')
        .insert({
          usuario_id: usuarioId,
          variacao_id: dadosPedido.variacaoId,
          quantidade: dadosPedido.quantidade,
          valor_total: dadosPedido.total,
          status: 'Pendente'
        });

      if (orderError) throw orderError;

      toast.success('Pedido realizado com sucesso!');
      localStorage.removeItem('dadosPedido');
      navigate('/pedido-confirmado');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast.error('Erro ao finalizar pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  if (!dadosPedido) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Loja
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">Finalizar Pedido</h1>
          <p className="text-center text-muted-foreground">
            Logado como: {user?.email}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Formulário de Dados */}
          <div className="space-y-6">

            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={userData.nome}
                      onChange={(e) => updateUserData('nome', e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => updateUserData('email', e.target.value)}
                      placeholder="seu@email.com"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={userData.cpf}
                      onChange={(e) => updateUserData('cpf', formatCPF(e.target.value))}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={userData.telefone}
                      onChange={(e) => updateUserData('telefone', formatPhone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="rua">Rua *</Label>
                    <Input
                      id="rua"
                      value={userData.rua}
                      onChange={(e) => updateUserData('rua', e.target.value)}
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero">Número *</Label>
                    <Input
                      id="numero"
                      value={userData.numero}
                      onChange={(e) => updateUserData('numero', e.target.value)}
                      placeholder="123"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={userData.complemento}
                      onChange={(e) => updateUserData('complemento', e.target.value)}
                      placeholder="Apto, sala, casa..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input
                      id="bairro"
                      value={userData.bairro}
                      onChange={(e) => updateUserData('bairro', e.target.value)}
                      placeholder="Nome do bairro"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      value={userData.cidade}
                      onChange={(e) => updateUserData('cidade', e.target.value)}
                      placeholder="Sua cidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado *</Label>
                    <Select value={userData.estado} onValueChange={(value) => updateUserData('estado', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      value={userData.cep}
                      onChange={(e) => updateUserData('cep', formatCEP(e.target.value))}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Resumo do Pedido */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-3">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {dadosPedido.imagemUrl ? (
                      <img 
                        src={`https://wzjfofufvrtzhmkismyh.supabase.co/storage/v1/object/public/produtos/${dadosPedido.imagemUrl}`}
                        alt={dadosPedido.produto}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 opacity-30" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{dadosPedido.produto === 'caixa_alta' ? 'Caixa Alta' : 'Caixa Baixa'}</h3>
                    <p className="text-sm text-muted-foreground">Cor: {dadosPedido.cor}</p>
                    <p className="text-sm text-muted-foreground">Tamanho: {dadosPedido.tamanho}</p>
                    <p className="text-sm text-muted-foreground">Qtd: {dadosPedido.quantidade}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>R$ {dadosPedido.total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Botão Finalizar */}
                <Button 
                  onClick={finalizarPedido}
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Processando...' : 'Finalizar Compra'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}