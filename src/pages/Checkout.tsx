import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Smartphone, DollarSign, Package, Truck, Tag } from 'lucide-react';
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
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [dadosPedido, setDadosPedido] = useState<DadosPedido | null>(null);
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState<any>(null);
  const [cep, setCep] = useState('');
  const [frete, setFrete] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Dados pessoais
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');

  useEffect(() => {
    const dados = localStorage.getItem('dadosPedido');
    if (!dados) {
      toast.error('Nenhum produto selecionado');
      navigate('/produtos');
      return;
    }
    setDadosPedido(JSON.parse(dados));

    // Preencher dados do usuário se logado
    if (user?.email) {
      setEmail(user.email);
    }
  }, [navigate, user]);

  const aplicarCupom = async () => {
    if (!cupom.trim()) return;

    try {
      const { data, error } = await supabase
        .from('cupons')
        .select('*')
        .eq('codigo', cupom.toUpperCase())
        .eq('ativo', true)
        .single();

      if (error || !data) {
        toast.error('Cupom inválido ou expirado');
        return;
      }

      // Verificar data de expiração
      if (data.data_expiracao && new Date(data.data_expiracao) < new Date()) {
        toast.error('Cupom expirado');
        return;
      }

      setCupomAplicado(data);
      toast.success(`Cupom aplicado! Desconto de ${data.desconto_percentual || data.desconto_fixo}${data.desconto_percentual ? '%' : ' reais'}`);
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);
      toast.error('Erro ao verificar cupom');
    }
  };

  const calcularFrete = () => {
    if (cep.length === 8) {
      // Por enquanto, valor fixo para teste
      setFrete(15.00);
      toast.success('Frete calculado!');
    } else {
      toast.error('CEP deve ter 8 dígitos');
    }
  };

  const calcularDesconto = () => {
    if (!cupomAplicado || !dadosPedido) return 0;
    
    if (cupomAplicado.desconto_percentual) {
      return (dadosPedido.total * cupomAplicado.desconto_percentual) / 100;
    }
    
    return cupomAplicado.desconto_fixo || 0;
  };

  const desconto = calcularDesconto();
  const subtotal = dadosPedido ? dadosPedido.total - desconto : 0;
  const total = subtotal + frete;

  const finalizarPedido = async () => {
    if (!dadosPedido || !nome || !email || !telefone || !endereco || !formaPagamento) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('pedidos')
        .insert({
          user_id: user?.id || null,
          produto: dadosPedido.produto,
          cor: dadosPedido.cor,
          tamanho: dadosPedido.tamanho,
          preco: dadosPedido.preco,
          quantidade: dadosPedido.quantidade,
          cupom: cupomAplicado?.codigo || null,
          desconto,
          frete,
          subtotal: total,
          nome,
          email,
          telefone,
          endereco: `${endereco}, ${cidade} - ${estado}`,
          forma_pagamento: formaPagamento,
          status: 'Pendente'
        });

      if (error) throw error;

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
          <Button 
            variant="ghost" 
            onClick={() => navigate('/produtos')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Produtos
          </Button>
          <h1 className="text-3xl font-bold text-center mb-2">Finalizar Pedido</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Resumo do Pedido */}
          <div className="lg:col-span-1 space-y-6">
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
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {dadosPedido.total.toFixed(2)}</span>
                  </div>
                  
                  {desconto > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto:</span>
                      <span>-R$ {desconto.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span>{frete > 0 ? `R$ ${frete.toFixed(2)}` : 'A calcular'}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cupom de Desconto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Cupom de Desconto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite o cupom"
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value.toUpperCase())}
                    disabled={!!cupomAplicado}
                  />
                  <Button 
                    onClick={aplicarCupom} 
                    disabled={!!cupomAplicado}
                    variant="outline"
                  >
                    Aplicar
                  </Button>
                </div>
                {cupomAplicado && (
                  <Badge variant="secondary" className="w-full justify-center">
                    Cupom {cupomAplicado.codigo} aplicado!
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Calcular Frete */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Calcular Frete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="CEP (somente números)"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    maxLength={8}
                  />
                  <Button onClick={calcularFrete} variant="outline">
                    Calcular
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário de Dados */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle>Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="endereco">Endereço Completo *</Label>
                  <Input
                    id="endereco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, número, complemento"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      placeholder="Sua cidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado *</Label>
                    <Select value={estado} onValueChange={setEstado}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forma de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant={formaPagamento === 'pix' ? 'default' : 'outline'}
                    onClick={() => setFormaPagamento('pix')}
                    className="h-20 flex-col space-y-2"
                  >
                    <Smartphone className="w-6 h-6" />
                    <span>PIX</span>
                  </Button>
                  <Button
                    variant={formaPagamento === 'debito' ? 'default' : 'outline'}
                    onClick={() => setFormaPagamento('debito')}
                    className="h-20 flex-col space-y-2"
                  >
                    <CreditCard className="w-6 h-6" />
                    <span>Débito</span>
                  </Button>
                  <Button
                    variant={formaPagamento === 'credito' ? 'default' : 'outline'}
                    onClick={() => setFormaPagamento('credito')}
                    className="h-20 flex-col space-y-2"
                  >
                    <DollarSign className="w-6 h-6" />
                    <span>Crédito</span>
                  </Button>
                </div>
                {formaPagamento && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {formaPagamento === 'pix' && 'Pagamento instantâneo via PIX. Desconto de 5% no valor total.'}
                    {formaPagamento === 'debito' && 'Pagamento à vista no cartão de débito.'}
                    {formaPagamento === 'credito' && 'Parcelamento em até 12x sem juros no cartão de crédito.'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Botão Finalizar */}
            <Button 
              onClick={finalizarPedido}
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Finalizar Pedido'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}