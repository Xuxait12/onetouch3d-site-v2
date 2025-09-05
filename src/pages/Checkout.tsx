import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { state: cart } = useCart();
  const [personType, setPersonType] = useState("fisica");
  const [differentAddress, setDifferentAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const subtotal = cart.total;
  const frete = cart.frete;
  const cupomDesconto = cart.cupomDesconto;
  const pixDiscount = paymentMethod === "pix" ? subtotal * 0.05 : 0;
  const total = subtotal + frete - cupomDesconto - pixDiscount;

  // If cart is empty, show empty state
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
        <GlobalHeader />
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-8">Finalizar Compra</h1>
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-6">Seu carrinho está vazio. Voltar para a loja.</p>
              <Button 
                onClick={() => navigate("/corrida")}
                className="bg-black hover:bg-black/90 text-white"
              >
                Voltar para a Loja
              </Button>
            </div>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  const handleLoginClick = () => {
    console.log("Abrir modal de login");
    // Implementar modal de login
  };

  const handleSaveData = () => {
    console.log("Salvar dados do cliente");
  };

  const handleFinalizePurchase = () => {
    if (!acceptTerms) {
      alert("Você deve aceitar os termos de compra");
      return;
    }
    if (!paymentMethod) {
      alert("Selecione uma forma de pagamento");
      return;
    }
    console.log("Finalizar compra");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
      <GlobalHeader />
      
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Título */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground">Finalizar Compra</h1>
          </div>

          {/* Login rápido */}
          <div className="text-center mb-8">
            <button 
              onClick={handleLoginClick}
              className="text-blue-600 underline hover:text-blue-800 transition-colors"
            >
              Já tem cadastro? Clique aqui para fazer login.
            </button>
          </div>

          {/* Container Principal */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Coluna Esquerda - Formulários */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Formulário de Dados do Cliente */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">Dados do Cliente</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input id="fullName" type="text" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="personType">Tipo de Pessoa *</Label>
                    <Select value={personType} onValueChange={setPersonType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fisica">Pessoa Física</SelectItem>
                        <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="document">
                      {personType === "fisica" ? "CPF *" : "CNPJ *"}
                    </Label>
                    <Input 
                      id="document" 
                      type="text" 
                      placeholder={personType === "fisica" ? "000.000.000-00" : "00.000.000/0000-00"}
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="birthDate">Data de Nascimento *</Label>
                    <Input id="birthDate" type="date" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">País *</Label>
                    <Input id="country" type="text" value="Brasil" readOnly />
                  </div>
                  
                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <Input id="cep" type="text" placeholder="00000-000" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Endereço *</Label>
                    <Input id="address" type="text" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="number">Número *</Label>
                    <Input id="number" type="text" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" type="text" />
                  </div>
                  
                  <div>
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input id="neighborhood" type="text" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input id="city" type="text" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Input id="state" type="text" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input id="phone" type="tel" placeholder="(00) 00000-0000" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input id="email" type="email" required />
                  </div>
                </div>
                
                <Button onClick={handleSaveData} className="mt-6 bg-black hover:bg-black/90 text-white">
                  Salvar Dados
                </Button>
              </Card>

              {/* Endereço Diferente */}
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id="differentAddress" 
                    checked={differentAddress}
                    onCheckedChange={(checked) => setDifferentAddress(checked === true)}
                  />
                  <Label htmlFor="differentAddress">Entregar em um endereço diferente</Label>
                </div>
                
                {differentAddress && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="deliveryCep">CEP *</Label>
                      <Input id="deliveryCep" type="text" placeholder="00000-000" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryAddress">Endereço *</Label>
                      <Input id="deliveryAddress" type="text" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryNumber">Número *</Label>
                      <Input id="deliveryNumber" type="text" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryComplement">Complemento</Label>
                      <Input id="deliveryComplement" type="text" />
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryNeighborhood">Bairro *</Label>
                      <Input id="deliveryNeighborhood" type="text" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryCity">Cidade *</Label>
                      <Input id="deliveryCity" type="text" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryState">Estado *</Label>
                      <Input id="deliveryState" type="text" required />
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Coluna Direita - Resumo e Pagamento */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Resumo do Pedido */}
              <Card className="p-6 bg-muted/30 border-2">
                <h3 className="text-xl font-semibold mb-4">Resumo do Pedido</h3>
                
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.nome} - {item.tamanho} - {item.cor} (x{item.quantidade})</span>
                      <span>R$ {item.subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    {cupomDesconto > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto:</span>
                        <span>- R$ {cupomDesconto.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span>R$ {frete.toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    {pixDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto PIX (5%):</span>
                        <span>- R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">R$ {total.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Formas de Pagamento */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Formas de Pagamento</h3>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="cursor-pointer">
                      PIX <span className="text-green-600 font-medium">(5% de desconto)</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="debit" id="debit" />
                    <Label htmlFor="debit" className="cursor-pointer">Cartão de Débito</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="cursor-pointer">Cartão de Crédito</Label>
                  </div>
                </RadioGroup>
              </Card>

              {/* Aceite dos Termos */}
              <Card className="p-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                  />
                  <Label htmlFor="terms" className="cursor-pointer">
                    Li e aceito os termos de compra
                  </Label>
                </div>
              </Card>

              {/* Botão Finalizar */}
              <Button 
                onClick={handleFinalizePurchase}
                className="w-full bg-black hover:bg-black/90 text-white py-4 text-lg font-medium"
                disabled={!acceptTerms || !paymentMethod}
              >
                Finalizar Compra
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <GlobalFooter />
    </div>
  );
};

export default Checkout;