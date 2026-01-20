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
import CouponSection from "@/components/CouponSection";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Eye, EyeOff, Loader2, Package, Clock } from "lucide-react";
import { ShippingOptions } from "@/components/ShippingOptions";
import { isValidCep } from "@/utils/cepValidator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { FcGoogle } from 'react-icons/fc';
import { PaymentBrick } from "@/components/payment/PaymentBrick";
import { PixPayment } from "@/components/payment/PixPayment";
import { profileSchema, orderSchema, orderItemSchema, getValidationErrors } from "@/lib/validation";
import { z } from "zod";

const Checkout = () => {
  const navigate = useNavigate();
  const { state: cart, clearCart, calculateShipping, selectShippingOption } = useCart();
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
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Payment flow states
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing'>('form');
  const [createdPedidoId, setCreatedPedidoId] = useState<string | null>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'pix' | 'credit_card' | 'debit_card' | null>(null);
  const [payerData, setPayerData] = useState<{
    email: string;
    first_name: string;
    last_name: string;
    identification: { type: string; number: string };
  } | null>(null);
  
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // Shipping state
  const [shippingCep, setShippingCep] = useState(cart?.cep || "");
  
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
  
  // Refs for delivery address fields
  const deliveryCepRef = useRef<HTMLInputElement>(null);
  const deliveryAddressRef = useRef<HTMLInputElement>(null);
  const deliveryNumberRef = useRef<HTMLInputElement>(null);
  const deliveryComplementRef = useRef<HTMLInputElement>(null);
  const deliveryNeighborhoodRef = useRef<HTMLInputElement>(null);
  const deliveryCityRef = useRef<HTMLInputElement>(null);
  const deliveryStateRef = useRef<HTMLInputElement>(null);
  const deliveryReferenceRef = useRef<HTMLInputElement>(null);
  
  const subtotal = cart?.total || 0;
  const frete = cart?.frete || 0;
  const cupomDesconto = cart?.cupomDesconto || 0;
  const isPixPayment = selectedPaymentType === "pix" || paymentMethod === "pix";
  const pixDiscount = isPixPayment ? (subtotal - cupomDesconto) * 0.05 : 0;
  const total = subtotal + frete - cupomDesconto - pixDiscount;

  // Determine current page from referrer or cart items
  const getCurrentPage = (): string => {
    // Check localStorage for last visited store page
    const lastStorePage = localStorage.getItem('lastStorePage');
    if (lastStorePage) {
      return lastStorePage;
    }
    
    // Try to detect from cart items
    if (cart?.items && cart.items.length > 0) {
      const firstItemName = cart.items[0].nome?.toLowerCase() || '';
      if (firstItemName.includes('ciclismo')) return 'ciclismo';
      if (firstItemName.includes('triathlon')) return 'triathlon';
      if (firstItemName.includes('viagem')) return 'viagem';
      if (firstItemName.includes('corrida')) return 'corrida';
    }
    
    return 'all'; // Default to 'all' if we can't determine
  };
  
  const currentStorePage = getCurrentPage();

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
        if (cepRef.current) cepRef.current.value = profile.cep || '';
        if (addressRef.current) addressRef.current.value = profile.address || '';
        if (numberRef.current) numberRef.current.value = profile.number || '';
        if (complementRef.current) complementRef.current.value = profile.complement || '';
        if (neighborhoodRef.current) neighborhoodRef.current.value = profile.neighborhood || '';
        if (cityRef.current) cityRef.current.value = profile.city || '';
        if (stateRef.current) stateRef.current.value = profile.state || '';
        
        setPersonType(profile.person_type || 'fisica');
      }
    } catch (error) {
      // Error loading profile - fail silently
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
          description: `Logado como ${loginEmail} — campos do checkout preenchidos`,
        });
        setShowInlineLogin(false);
        setLoginEmail("");
        setLoginPassword("");
        // Auto-load profile data after login
        setTimeout(() => loadProfileData(), 100);
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para criar sua conta.",
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "A confirmação de senha deve ser igual à senha.",
      });
      return;
    }

    setLoginLoading(true);
    
    try {
      // Create user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/checkout`
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao criar conta",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        // Create profile data
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: data.user.id,
            full_name: signupData.fullName,
            email: signupData.email,
            phone: '',
            cpf_cnpj: '',
            birth_date: '1990-01-01',
            cep: '',
            address: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            person_type: 'fisica'
          });

        if (profileError) {
          // Profile creation error - non-critical
        }

        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Seus dados foram preenchidos no checkout — complete as informações restantes.",
        });
        
        setShowInlineLogin(false);
        setSignupData({ fullName: '', email: '', password: '', confirmPassword: '' });
        
        // Auto-load profile data after signup
        setTimeout(() => loadProfileData(), 100);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
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
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar seus dados. Tente novamente.",
      });
    }
  };

  const handleSaveDeliveryAddress = async () => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para salvar o endereço de entrega.",
        });
        return;
      }

      // Get delivery address values
      const deliveryCep = deliveryCepRef.current?.value;
      const deliveryAddress = deliveryAddressRef.current?.value;
      const deliveryNumber = deliveryNumberRef.current?.value;
      const deliveryNeighborhood = deliveryNeighborhoodRef.current?.value;
      const deliveryCity = deliveryCityRef.current?.value;
      const deliveryState = deliveryStateRef.current?.value;

      // Validate required delivery address fields
      if (!deliveryCep || !deliveryAddress || !deliveryNumber || !deliveryNeighborhood || !deliveryCity || !deliveryState) {
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios (*) do endereço de entrega",
        });
        return;
      }

      toast({
        title: "Endereço de entrega salvo!",
        description: "O endereço de entrega foi salvo e será usado no pedido.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o endereço de entrega. Tente novamente.",
      });
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    toast({
      title: "Pagamento aprovado!",
      description: "Seu pedido foi confirmado.",
    });

    // Clear cart
    clearCart();

    // Navigate to confirmation page
    if (createdPedidoId) {
      navigate(`/confirmacao?pedido=${createdPedidoId}`);
    }
  };

  const handlePaymentError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "Erro no pagamento",
      description: error.message || "Tente novamente.",
    });

    // Reset to form step to allow retry
    setPaymentStep('form');
    setIsSubmitting(false);
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

    if (!cart?.selectedShippingOption) {
      toast({
        variant: "destructive",
        title: "Frete não selecionado",
        description: "Calcule o frete e selecione uma opção de envio para continuar.",
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

    if (!selectedPaymentType && !paymentMethod) {
      toast({
        variant: "destructive",
        title: "Forma de pagamento",
        description: "Selecione uma forma de pagamento para continuar.",
      });
      return;
    }

    // Validate payment method values
    const paymentValue = selectedPaymentType || paymentMethod;
    if (!["pix", "credit_card", "debit_card", "debito", "credito"].includes(paymentValue)) {
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
        description: "Faça login ou crie sua conta para prosseguir com o pedido.",
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

      // Prepare shipping address
      let shippingAddress = '';
      if (differentAddress) {
        // Use delivery address if provided
        const deliveryCep = deliveryCepRef.current?.value;
        const deliveryAddress = deliveryAddressRef.current?.value;
        const deliveryNumber = deliveryNumberRef.current?.value;
        const deliveryComplement = deliveryComplementRef.current?.value;
        const deliveryNeighborhood = deliveryNeighborhoodRef.current?.value;
        const deliveryCity = deliveryCityRef.current?.value;
        const deliveryState = deliveryStateRef.current?.value;
        const deliveryReference = deliveryReferenceRef.current?.value;
        
        if (deliveryCep && deliveryAddress && deliveryNumber && deliveryNeighborhood && deliveryCity && deliveryState) {
          shippingAddress = `${deliveryAddress}, ${deliveryNumber}${deliveryComplement ? ', ' + deliveryComplement : ''}, ${deliveryNeighborhood}, ${deliveryCity} - ${deliveryState}, CEP: ${deliveryCep}${deliveryReference ? ', Ref: ' + deliveryReference : ''}`;
        }
      }
      
      // If no delivery address or incomplete, use profile address
      if (!shippingAddress) {
        shippingAddress = `${address}, ${number}${complementRef.current?.value ? ', ' + complementRef.current.value : ''}, ${neighborhood}, ${city} - ${state}, CEP: ${cep}${pontoReferenciaRef.current?.value ? ', Ref: ' + pontoReferenciaRef.current.value : ''}`;
      }

      // Validate order data with zod schema
      const orderData = {
        subtotal: roundedSubtotal,
        frete: roundedFrete,
        desconto: roundedDesconto,
        total: roundedTotal,
        forma_pagamento: selectedPaymentType || paymentMethod || 'pix',
        shipping_address: shippingAddress.substring(0, 500), // Limit length
        cupom_aplicado: cart.cupomCode?.substring(0, 50) || null,
      };

      try {
        orderSchema.parse(orderData);
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const errors = getValidationErrors(validationError);
          throw new Error(`Dados do pedido inválidos: ${errors.join(', ')}`);
        }
        throw validationError;
      }

      // Validate order items
      const orderItemsData = cart.items.map(item => ({
        produto_nome: (item.nome || '').substring(0, 200),
        moldura_tipo: (item.cor || '').substring(0, 100),
        tamanho: (item.tamanho || '').substring(0, 50),
        quantidade: item.quantidade,
        valor_unitario: Math.round(item.precoUnitario * 100) / 100,
        subtotal: Math.round(item.subtotal * 100) / 100
      }));

      try {
        orderItemsData.forEach(item => orderItemSchema.parse(item));
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const errors = getValidationErrors(validationError);
          throw new Error(`Dados dos itens inválidos: ${errors.join(', ')}`);
        }
        throw validationError;
      }

      // Create order in pedidos table with status aguardando_pagamento
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          user_id: user.id,
          subtotal: orderData.subtotal,
          frete: orderData.frete,
          desconto: orderData.desconto,
          total: orderData.total,
          status: 'aguardando_pagamento',
          forma_pagamento: orderData.forma_pagamento,
          shipping_address: orderData.shipping_address,
          cupom_aplicado: orderData.cupom_aplicado,
          shipping_method: cart.selectedShippingOption?.name || null,
          shipping_company: cart.selectedShippingOption?.company.name || null,
          shipping_service_id: cart.selectedShippingOption?.id || null,
          shipping_delivery_time: cart.selectedShippingOption?.custom_delivery_time || null,
          shipping_metadata: cart.selectedShippingOption ? JSON.parse(JSON.stringify(cart.selectedShippingOption)) : null
        })
        .select()
        .single();

      if (pedidoError) {
        if (pedidoError.message.includes('row-level security') || pedidoError.message.includes('permission')) {
          throw new Error('Não foi possível salvar seu pedido (permissão). Tente fazer login novamente.');
        }
        throw pedidoError;
      }

      // Create order items in itens_pedido table
      const orderItems = orderItemsData.map(item => ({
        pedido_id: pedido.id,
        ...item
      }));

      const { error: itemsError } = await supabase
        .from('itens_pedido')
        .insert(orderItems);

      if (itemsError) {
        try {
          await supabase
            .from('pedidos')
            .delete()
            .eq('id', pedido.id);
        } catch {
          // Cleanup failed - non-critical
        }
        throw itemsError;
      }

      // Don't send email yet - will be sent after payment approval
      // Don't clear cart yet - will be cleared after successful payment

      // Show success message
      toast({
        title: "Pedido criado!",
        description: "Agora prossiga com o pagamento.",
      });

      // Store pedido ID and payer data, then advance to payment step
      const fullName = fullNameRef.current?.value || '';
      const nameParts = fullName.split(' ');
      setPayerData({
        email: emailRef.current?.value || user?.email || '',
        first_name: nameParts[0] || 'Cliente',
        last_name: nameParts.slice(1).join(' ') || '',
        identification: {
          type: personType === 'fisica' ? 'CPF' : 'CNPJ',
          number: documentRef.current?.value || '',
        },
      });
      setCreatedPedidoId(pedido.id);
      setPaymentStep('processing');

    } catch (error) {
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
                <p className="text-base sm:text-lg">
                  <span className="text-foreground font-medium">Já tem cadastro?</span>{' '}
                  <button
                    type="button"
                    className="text-blue-600 underline hover:text-blue-800 transition-colors font-semibold"
                    onClick={() => setShowInlineLogin((v) => !v)}
                  >
                    Clique aqui para fazer login
                  </button>
                </p>
              </div>

              {showInlineLogin && (
                <div className="border-t border-border/30 pt-4">
                  {/* Tabs for Login/Signup */}
                  <div className="flex mb-4 border-b">
                    <button
                      type="button"
                      className={`px-4 py-2 font-medium ${
                        authTab === 'login'
                          ? 'border-b-2 border-black text-black'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setAuthTab('login')}
                    >
                      Entrar
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 font-medium ${
                        authTab === 'signup'
                          ? 'border-b-2 border-black text-black'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setAuthTab('signup')}
                    >
                      Criar Conta
                    </button>
                  </div>

                  {/* Login Tab */}
                  {authTab === 'login' && (
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
                         <div className="relative">
                           <Input
                             id="loginPassword"
                             type={showLoginPassword ? "text" : "password"}
                             value={loginPassword}
                             onChange={(e) => setLoginPassword(e.target.value)}
                             required
                             disabled={loginLoading}
                             className="pr-10"
                           />
                           <button
                             type="button"
                             className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                             onClick={() => setShowLoginPassword(!showLoginPassword)}
                           >
                             {showLoginPassword ? (
                               <EyeOff className="h-4 w-4" />
                             ) : (
                               <Eye className="h-4 w-4" />
                             )}
                           </button>
                         </div>
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
                    </form>
                  )}

                  {/* Signup Tab */}
                  {authTab === 'signup' && (
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div>
                        <Label htmlFor="signupFullName">Nome Completo *</Label>
                        <Input
                          id="signupFullName"
                          type="text"
                          value={signupData.fullName}
                          onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                          disabled={loginLoading}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="signupEmail">E-mail *</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          disabled={loginLoading}
                        />
                      </div>
                      
                       <div>
                         <Label htmlFor="signupPassword">Senha * (min. 6 caracteres)</Label>
                         <div className="relative">
                           <Input
                             id="signupPassword"
                             type={showSignupPassword ? "text" : "password"}
                             value={signupData.password}
                             onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                             required
                             disabled={loginLoading}
                             minLength={6}
                             className="pr-10"
                           />
                           <button
                             type="button"
                             className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                             onClick={() => setShowSignupPassword(!showSignupPassword)}
                           >
                             {showSignupPassword ? (
                               <EyeOff className="h-4 w-4" />
                             ) : (
                               <Eye className="h-4 w-4" />
                             )}
                           </button>
                         </div>
                       </div>
                      
                       <div>
                         <Label htmlFor="signupConfirmPassword">Confirmar Senha *</Label>
                         <div className="relative">
                           <Input
                             id="signupConfirmPassword"
                             type={showSignupConfirmPassword ? "text" : "password"}
                             value={signupData.confirmPassword}
                             onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                             required
                             disabled={loginLoading}
                             className="pr-10"
                           />
                           <button
                             type="button"
                             className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                             onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                           >
                             {showSignupConfirmPassword ? (
                               <EyeOff className="h-4 w-4" />
                             ) : (
                               <Eye className="h-4 w-4" />
                             )}
                           </button>
                         </div>
                       </div>
                      
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          className="flex-1 bg-black hover:bg-black/90 text-white"
                          disabled={loginLoading}
                        >
                          {loginLoading ? "Criando conta..." : "Criar Conta"}
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
                    </form>
                  )}
                  
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                      onClick={() => setShowInlineLogin(false)}
                    >
                      Cancelar
                    </button>
                  </div>
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
                   <div className="space-y-4 mt-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <Label htmlFor="deliveryCep">CEP *</Label>
                         <Input ref={deliveryCepRef} id="deliveryCep" type="text" placeholder="00000-000" required />
                       </div>
                       
                       <div>
                         <Label htmlFor="deliveryAddress">Endereço *</Label>
                         <Input ref={deliveryAddressRef} id="deliveryAddress" type="text" required />
                       </div>
                       
                       <div>
                         <Label htmlFor="deliveryNumber">Número *</Label>
                         <Input ref={deliveryNumberRef} id="deliveryNumber" type="text" required />
                       </div>
                       
                       <div>
                         <Label htmlFor="deliveryComplement">Complemento</Label>
                         <Input ref={deliveryComplementRef} id="deliveryComplement" type="text" />
                       </div>
                       
                       <div>
                         <Label htmlFor="deliveryNeighborhood">Bairro *</Label>
                         <Input ref={deliveryNeighborhoodRef} id="deliveryNeighborhood" type="text" required />
                       </div>
                       
                       <div>
                         <Label htmlFor="deliveryCity">Cidade *</Label>
                         <Input ref={deliveryCityRef} id="deliveryCity" type="text" required />
                       </div>
                       
                       <div>
                         <Label htmlFor="deliveryState">Estado *</Label>
                         <Input ref={deliveryStateRef} id="deliveryState" type="text" required />
                       </div>

                       <div>
                         <Label htmlFor="deliveryReference">Ponto de referência</Label>
                         <Input ref={deliveryReferenceRef} id="deliveryReference" type="text" placeholder="Ex: próximo ao supermercado" />
                       </div>
                     </div>
                     
                     <Button 
                       onClick={handleSaveDeliveryAddress} 
                       className="bg-black hover:bg-black/90 text-white"
                     >
                       Salvar endereço de entrega
                     </Button>
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

                  {/* Cupom de Desconto */}
                  <div className="mb-6">
                    <CouponSection currentPage={currentStorePage} subtotal={subtotal} />
                  </div>
                  
                  {/* Totais */}
                  <div className="space-y-3 border-t border-border/30 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-foreground">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    {cupomDesconto > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cupom aplicado:</span>
                        <span className="text-red-600 font-medium">- R$ {cupomDesconto.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Frete{cart?.selectedShippingOption ? ` (${cart.selectedShippingOption.name})` : ''}:
                      </span>
                      <span className="text-muted-foreground">R$ {frete.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {cart?.selectedShippingOption && (
                      <div className="text-xs text-muted-foreground">
                        Prazo: {cart.selectedShippingOption.custom_delivery_time} dias úteis
                      </div>
                    )}
                    
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

              {paymentStep === 'form' ? (
                <>
                  {/* Calcular Frete */}
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Calcular Frete</h3>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Digite seu CEP (ex: 01310-100)"
                        value={shippingCep}
                        onChange={(e) => setShippingCep(e.target.value)}
                        className="flex-1"
                        maxLength={9}
                      />
                      <Button
                        onClick={async () => {
                          if (!shippingCep || !isValidCep(shippingCep)) {
                            toast({
                              variant: "destructive",
                              title: "CEP inválido",
                              description: "Digite um CEP válido com 8 dígitos"
                            });
                            return;
                          }
                          await calculateShipping(shippingCep);
                        }}
                        variant="outline"
                        className="px-6"
                        disabled={cart?.isCalculatingShipping}
                      >
                        {cart?.isCalculatingShipping ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Calculando...
                          </>
                        ) : (
                          "Calcular"
                        )}
                      </Button>
                    </div>

                    {cart?.shippingError && (
                      <p className="text-red-600 text-sm mt-2">{cart.shippingError}</p>
                    )}

                    {cart?.shippingOptions && cart.shippingOptions.length > 0 && (
                      <div className="mt-4">
                        <ShippingOptions
                          options={cart.shippingOptions}
                          selectedOption={cart.selectedShippingOption}
                          onSelect={selectShippingOption}
                          isLoading={cart.isCalculatingShipping}
                        />
                      </div>
                    )}

                    {cart?.selectedShippingOption && (
                      <div className="text-sm text-green-600 font-medium mt-3 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Frete selecionado: {cart.selectedShippingOption.name} - R$ {Number(cart.selectedShippingOption.custom_price).toFixed(2).replace('.', ',')}
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ({cart.selectedShippingOption.custom_delivery_time} dias úteis)
                        </span>
                      </div>
                    )}

                    {!cart?.selectedShippingOption && (
                      <p className="text-xs text-orange-600 mt-2">
                        * Calcule e selecione o frete antes de finalizar a compra
                      </p>
                    )}
                  </Card>

                  {/* Formas de Pagamento */}
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Formas de Pagamento</h3>

                    <RadioGroup value={selectedPaymentType || paymentMethod} onValueChange={(value) => {
                      setSelectedPaymentType(value as any);
                      setPaymentMethod(value);
                    }}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="cursor-pointer">
                          PIX <span className="text-green-600 font-medium">(5% de desconto)</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="debit_card" id="debit_card" />
                        <Label htmlFor="debit_card" className="cursor-pointer">Cartão de Débito</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card" className="cursor-pointer">Cartão de Crédito</Label>
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

                  {/* Botão Continuar */}
                  <Button
                    onClick={handleFinalizePurchase}
                    className="w-full bg-black hover:bg-black/90 text-white py-4 text-lg font-medium"
                    disabled={!acceptTerms || (!selectedPaymentType && !paymentMethod) || isSubmitting || !user || !cart?.selectedShippingOption}
                  >
                    {isSubmitting ? "Criando pedido..." : "Continuar para Pagamento"}
                  </Button>

                  {!user && (
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      É necessário fazer login para finalizar a compra
                    </p>
                  )}
                </>
              ) : (
                <>
                  {/* Payment Processing Step */}
                  <Card className="p-6">
                    {selectedPaymentType === 'pix' && createdPedidoId && payerData && (
                      <PixPayment
                        pedidoId={createdPedidoId}
                        amount={total}
                        payer={payerData}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    )}

                    {(selectedPaymentType === 'credit_card' || selectedPaymentType === 'debit_card') && createdPedidoId && payerData && (
                      <PaymentBrick
                        pedidoId={createdPedidoId}
                        amount={total}
                        payer={payerData}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    )}
                  </Card>

                  {/* Botão Voltar */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPaymentStep('form');
                      setCreatedPedidoId(null);
                    }}
                    className="w-full"
                  >
                    Voltar para alterar forma de pagamento
                  </Button>
                </>
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