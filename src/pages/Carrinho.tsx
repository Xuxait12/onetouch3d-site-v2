import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { Minus, Plus, X } from "lucide-react";

const Carrinho = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      type: "caixa-alta",
      color: "preta-branca",
      size: "33x33cm",
      price: 294.50,
      quantity: 1,
      image: "/lovable-uploads/519a0914-d9b2-4031-8781-87e125ccc763.png",
      title: "Quadro Caixa Alta"
    }
  ]);
  
  const [cupom, setCupom] = useState("");
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState(0);
  const [cupomAplicado, setCupomAplicado] = useState(false);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleAplicarCupom = () => {
    if (cupom.toLowerCase() === "desconto10") {
      setCupomAplicado(true);
      console.log("Cupom aplicado:", cupom);
    }
  };

  const handleCalcularFrete = () => {
    if (cep) {
      const freteCalculado = 15.90; // Valor exemplo
      setFrete(freteCalculado);
      console.log("Frete calculado para CEP:", cep);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const desconto = cupomAplicado ? subtotal * 0.1 : 0;
  const total = subtotal - desconto + frete;

  const getProductDescription = (item: any) => {
    const typeLabel = item.type === "caixa-alta" ? "Caixa Alta" : "Caixa Baixa";
    const colorLabel = item.color === "preta-branca" ? "Preta/Branca" : 
                      item.color === "preta" ? "Preta" : "Branca";
    return `${typeLabel} / ${item.size} / ${colorLabel}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
        <GlobalHeader />
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-8">Seu Carrinho</h1>
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <p className="text-lg text-muted-foreground mb-6">Seu carrinho está vazio</p>
              <Button 
                onClick={() => window.history.back()}
                className="bg-black hover:bg-black/90 text-white"
              >
                Continuar Comprando
              </Button>
            </div>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
      <GlobalHeader />
      
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Título */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground">Seu Carrinho</h1>
          </div>

          {/* Container Principal */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Coluna Esquerda - Lista de Produtos */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Lista de Produtos */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.id} className="p-4 relative">
                      <div className="flex gap-4 items-start">
                        {/* Imagem */}
                        <div className="w-20 h-20 flex-shrink-0">
                          <img 
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        
                        {/* Detalhes do Produto */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {getProductDescription(item)}
                          </p>
                          <p className="text-green-600 font-medium">
                            R$ {item.price.toFixed(2).replace('.', ',')}
                          </p>
                          
                          {/* Controles de Quantidade */}
                          <div className="flex items-center gap-3 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <span className="ml-4 font-medium">
                              Subtotal: R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Botão Remover */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="absolute top-2 right-2 w-8 h-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Aplicar Cupom */}
                <Card className="p-4">
                  <Label className="text-base font-medium mb-3 block">Aplicar Cupom</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Digite o código do cupom"
                      value={cupom}
                      onChange={(e) => setCupom(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleAplicarCupom}
                      variant="outline"
                      className="px-6"
                    >
                      Aplicar
                    </Button>
                  </div>
                  {cupomAplicado && (
                    <p className="text-green-600 text-sm mt-2">✓ Cupom aplicado com sucesso!</p>
                  )}
                </Card>

                {/* Calcular Frete */}
                <Card className="p-4">
                  <Label className="text-base font-medium mb-3 block">Calcular Frete</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Digite seu CEP"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleCalcularFrete}
                      variant="outline"
                      className="px-6"
                    >
                      Calcular
                    </Button>
                  </div>
                  {frete > 0 && (
                    <p className="text-green-600 text-sm mt-2">
                      Frete: R$ {frete.toFixed(2).replace('.', ',')}
                    </p>
                  )}
                </Card>
              </div>

              {/* Coluna Direita - Resumo do Carrinho */}
              <div className="lg:col-span-1">
                <Card className="p-6 bg-muted/30 border-2">
                  <h3 className="text-xl font-semibold mb-4">Resumo do Carrinho</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    {cupomAplicado && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto (10%):</span>
                        <span>- R$ {desconto.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span>R$ {frete.toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">R$ {total.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-6 bg-black hover:bg-black/90 text-white py-3 text-lg font-medium"
                    onClick={() => console.log("Finalizar compra")}
                  >
                    Finalizar Compra
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <GlobalFooter />
    </div>
  );
};

export default Carrinho;