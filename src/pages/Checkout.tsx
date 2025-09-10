import { useState, useRef, useEffect } from "react";
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
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { FcGoogle } from 'react-icons/fc';

const Checkout = () => {
  const navigate = useNavigate();
  const { state: cart, clearCart } = useCart();
  const { user } = useAuth();
  const [personType, setPersonType] = useState("fisica");
  const [differentAddress, setDifferentAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showInlineLogin, setShowInlineLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for form fields
  const fullNameRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);
  const cepRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const complementRef = useRef<HTMLInputElement>(null);
  const neighborhoodRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const pontoReferenciaRef = useRef<HTMLInputElement>(null);
  
  const subtotal = cart?.total || 0;
  const frete = cart?.frete || 0;
  const cupomDesconto = cart?.cupomDesconto || 0;
  const pixDiscount = paymentMethod === "pix" ? subtotal * 0.05 : 0;
  const total = subtotal + frete - cupomDesconto - pixDiscount;

  // Load profile data when user logs in
  const loadProfileData = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        // Fill form with saved data
        if (fullNameRef.current) fullNameRef.current.value = profile.full_name || '';
        if (documentRef.current) documentRef.current.value = profile.cpf_cnpj || '';
        if (birthDateRef.current) birthDateRef.current.value = profile.birth_date || '';
        if (phoneRef.current) phoneRef.current.value = profile.phone || '';
        if (emailRef.current) emailRef.current.value = profile.email || user.email || '';
        // ponto_referencia field is not in the profiles table, keep it empty
        
        setPersonType(profile.person_type || 'fisica');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Check for OAuth redirect and load profile data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromOauth = urlParams.get('from_oauth');
    
    if (fromOauth && user) {
      // Remove the parameter from URL
      window.history.replaceState({}, '', '/checkout');
      loadProfileData();
    } else if (user) {
      loadProfileData();
    }
  }, [user]);

  // If cart is empty, show empty state
  if (!cart?.items || cart.items.length === 0) {
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
                onClick={() => window.location.href = "/lp-corrida#nossa-loja"}
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

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: error.message,
        });
      } else {
        toast({
          title: "Login realizado!",
          description: "Você está logado e pode continuar sua compra.",
        });
        setShowInlineLogin(false);
        setLoginEmail("");
        setLoginPassword("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoginLoading(true);
      
      // Store current checkout state to preserve cart
      localStorage.setItem('checkoutState', JSON.stringify({
        cart: cart,
        timestamp: Date.now()
      }));
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/checkout?from_oauth=true`
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: error.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSaveData = async () => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para salvar os dados.",
        });
        return;
      }

      // Get form values
      const fullName = fullNameRef.current?.value;
      const document = documentRef.current?.value;
      const birthDate = birthDateRef.current?.value;
      const cep = cepRef.current?.value;
      const address = addressRef.current?.value;
      const number = numberRef.current?.value;
      const complement = complementRef.current?.value || null;
      const neighborhood = neighborhoodRef.current?.value;
      const city = cityRef.current?.value;
      const state = stateRef.current?.value;
      const phone = phoneRef.current?.value;
      const email = emailRef.current?.value;
      const pontoReferencia = pontoReferenciaRef.current?.value || null;

      // Validate required fields
      if (!fullName || !document || !birthDate || !cep || !address || !number || !neighborhood || !city || !state || !phone || !email) {
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios (*)",
        });
        return;
      }

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const profileData = {
        user_id: user.id,
        person_type: personType as 'fisica' | 'juridica',
        full_name: fullName,
        cpf_cnpj: document,
        birth_date: birthDate,
        country: 'Brasil',
        cep,
        address,
        number,
        complement,
        neighborhood,
        city,
        state,
        phone,
        email,
        ponto_referencia: pontoReferencia
      };

      let error;
      if (existingProfile) {
        // Update existing profile
        ({ error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', user.id));
      } else {
        // Create new profile
        ({ error } = await supabase
          .from('profiles')
          .insert([profileData]));
      }

      if (error) {
        throw error;
      }

      toast({
        title: "Dados salvos!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar seus dados. Tente novamente.",
      });
    }
  };

  const handleFinalizePurchase = async () => {
    // Prevent duplicate submissions
    if (isSubmitting) return;

    // Validate cart
    if (!cart?.items || cart.items.length === 0) {
      toast({
        variant: "destructive",
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho para continuar.",
      });
      return;
    }

    // Validate required form fields
    const fullName = fullNameRef.current?.value;
    const document = documentRef.current?.value;
    const cep = cepRef.current?.value;
    const address = addressRef.current?.value;
    const number = numberRef.current?.value;
    const neighborhood = neighborhoodRef.current?.value;
    const city = cityRef.current?.value;
    const state = stateRef.current?.value;
    const phone = phoneRef.current?.value;
    const email = emailRef.current?.value;

    if (!fullName || !document || !cep || !address || !number || !neighborhood || !city || !state || !phone || !email) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios (*).",
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        variant: "destructive",
        title: "Termos de compra",
        description: "Você deve aceitar os termos de compra para continuar.",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        variant: "destructive",
        title: "Forma de pagamento",
        description: "Selecione uma forma de pagamento para continuar.",
      });
      return;
    }

    // Validate payment method values
    if (!["pix", "debito", "credito"].includes(paymentMethod)) {
      toast({
        variant: "destructive",
        title: "Forma de pagamento inválida",
        description: "Selecione uma forma de pagamento válida.",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Login necessário",
        description: "Você precisa fazer login antes de finalizar a compra.",
      });
      setShowInlineLogin(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Round values to 2 decimal places before inserting
      const roundedSubtotal = Math.round(subtotal * 100) / 100;
      const roundedFrete = Math.round(frete * 100) / 100;
      const roundedDesconto = Math.round((cupomDesconto + pixDiscount) * 100) / 100;
      const roundedTotal = Math.round(total * 100) / 100;

      // Create order in pedidos table
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          user_id: user.id,
          subtotal: roundedSubtotal,
          frete: roundedFrete,
          desconto: roundedDesconto,
          total: roundedTotal,
          status: 'pendente',
          forma_pagamento: paymentMethod || 'teste'
        })
        .select()
        .single();

      if (pedidoError) {
        if (pedidoError.message.includes('row-level security') || pedidoError.message.includes('permission')) {
          throw new Error('Não foi possível salvar seu pedido (permissão). Tente fazer login novamente.');
        }
        throw pedidoError;
      }

      console.log('Order created with ID:', pedido.id);

      // Create order items in itens_pedido table
      const orderItems = cart.items.map(item => ({
        pedido_id: pedido.id,
        produto_nome: item.nome,
        moldura_tipo: item.cor,
        tamanho: item.tamanho,
        quantidade: item.quantidade,
        valor_unitario: Math.round(item.precoUnitario * 100) / 100,
        subtotal: Math.round(item.subtotal * 100) / 100
      }));

      const { error: itemsError } = await supabase
        .from('itens_pedido')
        .insert(orderItems);

      if (itemsError) {
        // Try to delete the order if items failed to insert
        try {
          await supabase
            .from('pedidos')
            .delete()
            .eq('id', pedido.id);
        } catch (deleteError) {
          console.error('Failed to cleanup order after items error:', deleteError);
        }
        throw itemsError;
      }

      console.log('Order items created:', orderItems.length, 'items');

      // Show success message with order status
      toast({
        title: "Pedido realizado com sucesso! Status: pendente",
        description: `Código do pedido: #${pedido.id}`,
      });

      // Clear cart
      clearCart();

      // Navigate to order tracking page
      navigate(`/confirmacao?pedido=${pedido.id}`);

    } catch (error) {
      console.error('Error creating order:', error);
      
      let errorMessage = "Não foi possível finalizar sua compra. Tente novamente.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao finalizar compra",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
      <GlobalHeader />
      
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Botão Voltar para o Carrinho */}
          <div className="mb-6">
            <Button 
              variant="outline"
              onClick={() => navigate('/carrinho')}
              className="flex items-center gap-2 hover:bg-muted/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o carrinho
            </Button>
          </div>

          {/* Título */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground">Finalizar Compra</h1>
          </div>

          {/* Login Section */}
          {!user && (
            <Card className="p-6">
              <div className="text-center mb-4">
                <p className="text-sm">
                  <span className="text-foreground">Já tem cadastro?</span>{' '}
                  <button
                    type="button"
                    className="text-blue-600 underline hover:text-blue-800 transition-colors"
                    onClick={() => setShowInlineLogin((v) => !v)}
                  >
                    Clique aqui para fazer login
                  </button>
                </p>
              </div>

              {showInlineLogin && (
                <div className="border-t border-border/30 pt-4">
                  <form onSubmit={handleInlineLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="loginEmail">E-mail</Label>
                      <Input
                        id="loginEmail"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        disabled={loginLoading}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="loginPassword">Senha</Label>
                      <Input
                        id="loginPassword"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        disabled={loginLoading}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-black hover:bg-black/90 text-white"
                        disabled={loginLoading}
                      >
                        {loginLoading ? "Entrando..." : "Entrar"}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleLogin}
                        disabled={loginLoading}
                        className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                      >
                        <FcGoogle className="w-4 h-4 mr-2" />
                        Entrar com Google
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                        onClick={() => setShowInlineLogin(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </Card>
          )}

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
                    <Input ref={fullNameRef} id="fullName" type="text" required />
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
                      ref={documentRef}
                      id="document" 
                      type="text" 
                      placeholder={personType === "fisica" ? "000.000.000-00" : "00.000.000/0000-00"}
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="birthDate">Data de Nascimento *</Label>
                    <Input ref={birthDateRef} id="birthDate" type="date" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">País *</Label>
                    <Input id="country" type="text" value="Brasil" readOnly />
                  </div>
                  
                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <Input ref={cepRef} id="cep" type="text" placeholder="00000-000" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Endereço *</Label>
                    <Input ref={addressRef} id="address" type="text" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="number">Número *</Label>
                    <Input ref={numberRef} id="number" type="text" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input ref={complementRef} id="complement" type="text" />
                  </div>
                  
                  <div>
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input ref={neighborhoodRef} id="neighborhood" type="text" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input ref={cityRef} id="city" type="text" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Input ref={stateRef} id="state" type="text" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input ref={phoneRef} id="phone" type="tel" placeholder="(00) 00000-0000" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input ref={emailRef} id="email" type="email" required />
                  </div>

                  <div>
                    <Label htmlFor="pontoReferencia">Ponto de referência</Label>
                    <Input ref={pontoReferenciaRef} id="pontoReferencia" type="text" placeholder="Ex: próximo ao supermercado" />
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
              <Card className="rounded-xl shadow-lg border border-border/50 lg:max-w-[350px] w-full">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Resumo do Pedido</h3>
                  
                  {/* Lista de Produtos */}
                  <div className="space-y-4 mb-6">
                    {cart?.items?.map((item, index) => (
                      <div key={item.id} className={`pb-4 ${index < (cart?.items?.length || 0) - 1 ? 'border-b border-border/30' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3">
                            <h4 className="font-semibold text-foreground text-sm break-words">
                              {item.nome}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.tamanho} / {item.cor} / Qtd: {item.quantidade}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-foreground text-sm">
                              R$ {item.subtotal.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Totais */}
                  <div className="space-y-3 border-t border-border/30 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-foreground">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    {cupomDesconto > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Desconto:</span>
                        <span className="text-red-600 font-medium">- R$ {cupomDesconto.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete:</span>
                      <span className="text-muted-foreground">R$ {frete.toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    {pixDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Desconto PIX (5%):</span>
                        <span className="text-red-600 font-medium">- R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-border/30 pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-foreground">Total:</span>
                        <span className="text-xl font-bold" style={{ color: '#1a7f37' }}>
                          R$ {total.toFixed(2).replace('.', ',')}
                        </span>
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
                    <RadioGroupItem value="debito" id="debito" />
                    <Label htmlFor="debito" className="cursor-pointer">Cartão de Débito</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credito" id="credito" />
                    <Label htmlFor="credito" className="cursor-pointer">Cartão de Crédito</Label>
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
                disabled={!acceptTerms || !paymentMethod || isSubmitting || !user}
              >
                {isSubmitting ? "Processando pedido..." : "Finalizar Compra"}
              </Button>
              
              {!user && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  É necessário fazer login para finalizar a compra
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <GlobalFooter />
    </div>
  );
};

export default Checkout;