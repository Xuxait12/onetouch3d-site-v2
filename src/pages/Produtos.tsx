import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Produto {
  id: string;
  nome: string;
  descricao: string;
}

interface Variacao {
  id: string;
  produto_id: string;
  cor: string;
  tamanho: string;
  preco: number;
  imagem_url: string;
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<string>('');
  const [corSelecionada, setCorSelecionada] = useState<string>('');
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    if (produtoSelecionado) {
      carregarVariacoes();
      setCorSelecionada('');
      setTamanhoSelecionado('');
    }
  }, [produtoSelecionado]);

  const carregarProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome');

      if (error) throw error;
      setProdutos(data || []);
      if (data && data.length > 0) {
        setProdutoSelecionado(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const carregarVariacoes = async () => {
    if (!produtoSelecionado) return;

    try {
      const { data, error } = await supabase
        .from('variacoes')
        .select('*')
        .eq('produto_id', produtoSelecionado)
        .order('cor, tamanho');

      if (error) throw error;
      setVariacoes(data || []);
    } catch (error) {
      console.error('Erro ao carregar variações:', error);
      toast.error('Erro ao carregar variações');
    }
  };

  const produto = produtos.find(p => p.id === produtoSelecionado);
  const coresDisponiveis = [...new Set(variacoes.map(v => v.cor))];
  const tamanhosDisponiveis = variacoes
    .filter(v => !corSelecionada || v.cor === corSelecionada)
    .map(v => ({ tamanho: v.tamanho, preco: v.preco }))
    .sort((a, b) => a.preco - b.preco);

  const variacaoSelecionada = variacoes.find(
    v => v.cor === corSelecionada && v.tamanho === tamanhoSelecionado
  );

  // Função para obter a imagem baseada no produto e cor selecionados (sincronizada com ProductSection)
  const getProductImage = () => {
    if (!produto || !corSelecionada) return null;
    
    if (produto.nome === 'caixa_alta' || produto.id === "5a270960-1e10-4367-9001-497727c6106b") {
      if (corSelecionada === "Preta") {
        return "/lovable-uploads/40be9b53-f271-490e-aaf6-e1fb313f84a6.png";
      } else if (corSelecionada === "Preta/Branca" || corSelecionada === "Preta/branca") {
        return "/lovable-uploads/433fbef2-a13f-4b22-8332-3e1083bb0e7e.png";
      }
      return "/lovable-uploads/433fbef2-a13f-4b22-8332-3e1083bb0e7e.png";
    } else {
      if (corSelecionada === "Branca") {
        return "/lovable-uploads/79a5fadb-f906-4fd2-95b4-80ae0e7dff65.png";
      } else if (corSelecionada === "Preta") {
        return "/lovable-uploads/f410345d-8605-4ce2-bbb3-7d9ce37ae9c7.png";
      }
      return "/lovable-uploads/f410345d-8605-4ce2-bbb3-7d9ce37ae9c7.png";
    }
  };

  const imagemProduto = getProductImage();
  const precoProduto = variacaoSelecionada?.preco || 0;
  const precoTotal = precoProduto * quantidade;

  const handleComprar = () => {
    if (!produtoSelecionado || !corSelecionada || !tamanhoSelecionado) {
      toast.error('Por favor, selecione todas as opções do produto');
      return;
    }

    const dadosPedido = {
      produto: produto?.nome,
      produtoId: produtoSelecionado,
      cor: corSelecionada,
      tamanho: tamanhoSelecionado,
      preco: precoProduto,
      quantidade,
      total: precoTotal,
      imagemUrl: imagemProduto,
      variacaoId: variacaoSelecionada?.id
    };

    localStorage.setItem('dadosPedido', JSON.stringify(dadosPedido));
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando produtos...</p>
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
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Home
          </Button>
          <h1 className="text-3xl font-bold text-center mb-2">COMPRANDO</h1>
          <p className="text-muted-foreground text-center">
            Escolha seu quadro personalizado para medalhas
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Imagem do Produto */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                 <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                   {imagemProduto ? (
                     <img 
                       src={imagemProduto}
                       alt={`${produto?.nome === 'caixa_alta' ? 'Caixa Alta' : 'Caixa Baixa'} - ${corSelecionada}`}
                       className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                       key={`${produto?.id}-${corSelecionada}`}
                       onError={(e) => {
                         // Fallback para imagem padrão em caso de erro
                         e.currentTarget.src = produto?.nome === 'caixa_alta' 
                           ? "/lovable-uploads/433fbef2-a13f-4b22-8332-3e1083bb0e7e.png"
                           : "/lovable-uploads/f410345d-8605-4ce2-bbb3-7d9ce37ae9c7.png";
                       }}
                     />
                   ) : (
                     <div className="text-center text-muted-foreground">
                       <ShoppingCart className="w-16 h-16 mx-auto mb-2 opacity-30" />
                       <p>Selecione as opções para ver a imagem</p>
                     </div>
                   )}
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Opções do Produto */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={produtoSelecionado} onValueChange={setProdutoSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map(produto => (
                      <SelectItem key={produto.id} value={produto.id}>
                        {produto.nome === 'caixa_alta' ? 'Caixa Alta' : 'Caixa Baixa'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {produto && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {produto.descricao}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cor da Moldura</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={corSelecionada} onValueChange={setCorSelecionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cor" />
                  </SelectTrigger>
                  <SelectContent>
                    {coresDisponiveis.map(cor => (
                      <SelectItem key={cor} value={cor}>
                        {cor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tamanho</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={tamanhoSelecionado} onValueChange={setTamanhoSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    {tamanhosDisponiveis.map(({ tamanho, preco }) => (
                      <SelectItem key={tamanho} value={tamanho}>
                        {tamanho} - R$ {preco.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quantidade</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={quantidade.toString()} 
                  onValueChange={(value) => setQuantidade(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Resumo e Compra */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Resumo do Pedido</span>
                  {precoProduto > 0 && (
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      R$ {precoTotal.toFixed(2)}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {produtoSelecionado && corSelecionada && tamanhoSelecionado ? (
                  <div className="space-y-2 text-sm">
                    <p><strong>Produto:</strong> {produto?.nome === 'caixa_alta' ? 'Caixa Alta' : 'Caixa Baixa'}</p>
                    <p><strong>Cor:</strong> {corSelecionada}</p>
                    <p><strong>Tamanho:</strong> {tamanhoSelecionado}</p>
                    <p><strong>Quantidade:</strong> {quantidade}</p>
                    <p><strong>Preço unitário:</strong> R$ {precoProduto.toFixed(2)}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Selecione todas as opções para ver o resumo
                  </p>
                )}

                <Button 
                  onClick={handleComprar}
                  className="w-full" 
                  size="lg"
                  disabled={!produtoSelecionado || !corSelecionada || !tamanhoSelecionado}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comprar Agora
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}