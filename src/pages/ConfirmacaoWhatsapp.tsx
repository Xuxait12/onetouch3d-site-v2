import { config } from "@/config";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import pixQrCode from '@/assets/pix-qrcode.png';
import googleLogo from '@/assets/google-logo.png';
import onetouchLogo from '@/assets/onetouch-logo.png';

const MODALIDADES = ['Corrida', 'Ciclismo', 'Triatlo', 'Viagem'];
const TAMANHOS = ['33x33cm', '33x43cm', '37x48cm', '43x43cm', '43x53cm', '43x63cm', '53x53cm', '53x73cm'];
const PIX_KEY = '54999921515';

const ConfirmacaoWhatsapp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const [modalidade, setModalidade] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [complemento, setComplemento] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Helper to load profile data into form
  const loadProfileIntoForm = (profile: any) => {
    if (profile) {
      setNomeCompleto(profile.nome_completo || '');
      setTelefone(profile.telefone || '');
      setCpf(profile.cpf_cnpj || '');
      setCep(profile.cep || '');
      setRua(profile.endereco || '');
      setNumero(profile.numero || '');
      setBairro(profile.bairro || '');
      setCidade(profile.cidade || '');
      setEstado(profile.estado || '');
      setComplemento(profile.complemento || '');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        setEmail(session.user.email || '');
        setShowModal(true);

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        loadProfileIntoForm(profile);
      }
    };
    checkAuth();
  }, []);

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      return digits.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
    }
    return digits.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleCepChange = async (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    const digits = value.replace(/\D/g, '');
    if (digits.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setRua(data.logradouro || '');
          setBairro(data.bairro || '');
          setCidade(data.localidade || '');
          setEstado(data.uf || '');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleAuthSuccess = async (user: { id: string; email?: string }) => {
    setIsAuthenticated(true);
    setUserId(user.id);
    setEmail(user.email || '');
    setShowModal(true);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    loadProfileIntoForm(profile);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Erro no login", description: error.message.includes('Invalid login credentials') ? "Email ou senha incorretos." : error.message, variant: "destructive" });
      } else if (data.user) {
        toast({ title: "Login realizado!", description: "Bem-vindo de volta!" });
        await handleAuthSuccess(data.user);
      }
    } catch (error) {
      toast({ title: "Erro", description: "Erro inesperado. Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        'https://wzjfofufvrtzhmkismyh.supabase.co/functions/v1/create-whatsapp-user',
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }
      );
      const data = await response.json();
      if (!response.ok) {
        toast({ title: "Erro no cadastro", description: data.error || 'Erro ao criar conta', variant: "destructive" });
        return;
      }
      if (data.session) {
        await supabase.auth.setSession({ access_token: data.session.access_token, refresh_token: data.session.refresh_token });
        toast({ title: "Cadastro realizado!", description: "Bem-vindo!" });
        await handleAuthSuccess(data.user);
      } else {
        toast({ title: "Erro", description: "Sessão não retornada. Tente fazer login.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Erro inesperado. Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${config.siteUrl}/confirmacao-whatsapp` }
      });
      if (error) {
        toast({ title: "Erro no login com Google", description: error.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Erro inesperado. Tente novamente.", variant: "destructive" });
    }
  };

  const handleCancel = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setShowModal(false);
    setUserId(null);
    setModalidade(''); setTamanho(''); setNomeCompleto(''); setTelefone('');
    setCpf(''); setCep(''); setRua(''); setNumero('');
    setBairro(''); setCidade(''); setEstado(''); setComplemento('');
    setConfirmado(false);
  };

  const isFormValid = () => {
    return modalidade && tamanho && nomeCompleto.trim() && email.trim() && telefone.trim() && cpf.trim() && cep.trim() && rua.trim() && numero.trim() && bairro.trim() && cidade.trim() && estado.trim() && confirmado;
  };

  const handleSaveOrder = async () => {
    if (!userId || savingOrder) return;
    setSavingOrder(true);
    try {
      const cpfClean = cpf.replace(/\D/g, '');
      const telefoneClean = telefone.replace(/\D/g, '');
      const cepClean = cep.replace(/\D/g, '');

      if (cpfClean.length < 11) {
        toast({ title: "Erro de validação", description: `CPF inválido (${cpfClean.length} dígitos, mínimo 11)`, variant: "destructive" });
        setSavingOrder(false); return;
      }
      if (telefoneClean.length < 10) {
        toast({ title: "Erro de validação", description: `Telefone inválido (${telefoneClean.length} dígitos, mínimo 10)`, variant: "destructive" });
        setSavingOrder(false); return;
      }
      if (cepClean.length !== 8) {
        toast({ title: "Erro de validação", description: `CEP inválido (${cepClean.length} dígitos, deve ter 8)`, variant: "destructive" });
        setSavingOrder(false); return;
      }

      const enderecoCompleto = `${rua}, ${numero}${complemento ? `, ${complemento}` : ''} - ${bairro}, ${cidade}/${estado} - CEP: ${cep}`;

      // Update profile with new column names
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          nome_completo: nomeCompleto,
          email: email,
          telefone: telefone,
          cpf_cnpj: cpf,
          cep: cep,
          endereco: rua,
          numero: numero,
          complemento: complemento,
          bairro: bairro,
          cidade: cidade,
          estado: estado,
          data_nascimento: '1990-01-01'
        }, { onConflict: 'user_id' });

      if (profileError) {
        const isDuplicate = profileError.code === '23505' && profileError.message?.includes('cpf_cnpj');
        toast({
          title: isDuplicate ? "CPF/CNPJ duplicado" : "Erro ao salvar perfil",
          description: isDuplicate
            ? "Este CPF/CNPJ já está cadastrado. Se você já tem uma conta, faça login."
            : profileError.message,
          variant: "destructive",
        });
        setSavingOrder(false); return;
      }

      // Create order with new schema - need modalidade_id, tamanho_id, tipo_moldura_id
      // For WhatsApp flow, we use placeholder IDs since the actual product config will be set later
      const orderPayload = {
        user_id: userId,
        preco_unitario: 0,
        preco_total: 0,
        preco_final: 0,
        status_pagamento: 'pendente',
        status_producao: 'aguardando',
        metodo_pagamento: 'pix',
        canal_venda: 'whatsapp',
        shipping_address: enderecoCompleto || 'Endereço não informado',
        // These need valid UUIDs from the DB - use a placeholder approach
        modalidade_id: '00000000-0000-0000-0000-000000000000',
        tamanho_id: '00000000-0000-0000-0000-000000000000',
        tipo_moldura_id: '00000000-0000-0000-0000-000000000000',
        observacao: `Modalidade: ${modalidade}, Tamanho: ${tamanho} (via WhatsApp)`,
      };

      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert(orderPayload)
        .select()
        .single();

      if (pedidoError) {
        toast({ title: "Erro ao criar pedido", description: `${pedidoError.message}`, variant: "destructive" });
        setSavingOrder(false); return;
      }

      setShowSuccess(true);
      toast({ title: "Sucesso!", description: "Cadastro realizado com sucesso." });
    } catch (error) {
      toast({ title: "Erro inesperado", description: error instanceof Error ? error.message : "Erro ao salvar dados. Tente novamente.", variant: "destructive" });
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-8">
      {showThankYou && (
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img src={onetouchLogo} alt="OneTouch3D" className="h-10 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">Muito obrigado! 😊</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setShowModal(true)} className="w-full">Ver QR Code / PIX novamente</Button>
            <Button variant="outline" className="w-full" onClick={async () => {
              try {
                await navigator.clipboard.writeText(PIX_KEY);
                toast({ title: "Chave PIX copiada!", description: `Chave: ${PIX_KEY}` });
              } catch {
                toast({ title: "Erro ao copiar", description: "Tente copiar manualmente: " + PIX_KEY, variant: "destructive" });
              }
            }}>
              Copiar chave PIX
            </Button>
          </CardContent>
        </Card>
      )}

      {!isAuthenticated && !showThankYou && (
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img src={onetouchLogo} alt="OneTouch3D" className="h-10 mx-auto mb-2" />
            <CardDescription className="text-sm">
              Este link foi enviado via WhatsApp para finalizar seu pedido e gerar o pagamento via PIX.
            </CardDescription>
            <p className="text-xs text-muted-foreground mt-1">Crie sua conta ou entre para continuar.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={loading}>
                <img src={googleLogo} alt="Google" className="w-4 h-4 mr-2" />
                Continuar com Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Ou continue com email</span>
                </div>
              </div>

              <Tabs defaultValue="signup" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Entrar</TabsTrigger>
                  <TabsTrigger value="signup">Cadastrar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required className="pr-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
                    <div className="text-center">
                      <Link to="/recuperar-senha" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Esqueci minha senha?</Link>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha</Label>
                      <div className="relative">
                        <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required className="pr-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Senha</Label>
                      <div className="relative">
                        <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="Confirme sua senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="pr-10" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>{loading ? "Cadastrando..." : "Cadastrar"}</Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showModal} onOpenChange={open => {
        if (!open) {
          if (showThankYou) { setShowModal(false); }
          else { handleCancel(); }
        }
      }}>
        <DialogContent className={`max-w-lg max-h-[90vh] overflow-y-auto ${!showThankYou ? '[&>button]:hidden' : ''}`}>
          {!showSuccess ? (
            <div className="space-y-6">
              <div className="text-center">
                <img src={onetouchLogo} alt="OneTouch3D" className="h-10 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Finalize seu cadastro para darmos andamento ao seu quadro personalizado.</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Dados do Quadro</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modalidade">Modalidade *</Label>
                    <Select value={modalidade} onValueChange={setModalidade}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{MODALIDADES.map(mod => <SelectItem key={mod} value={mod}>{mod}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tamanho">Tamanho *</Label>
                    <Select value={tamanho} onValueChange={setTamanho}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{TAMANHOS.map(tam => <SelectItem key={tam} value={tam}>{tam}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Dados do Cliente</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="nomeCompleto">Nome completo *</Label>
                    <Input id="nomeCompleto" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} placeholder="Seu nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailModal">E-mail *</Label>
                    <Input id="emailModal" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input id="telefone" value={telefone} onChange={e => setTelefone(formatPhone(e.target.value))} placeholder="(99) 99999-9999" maxLength={15} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input id="cpf" value={cpf} onChange={e => setCpf(formatCpf(e.target.value))} placeholder="000.000.000-00" maxLength={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Endereço de Entrega</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input id="cep" value={cep} onChange={e => handleCepChange(e.target.value)} placeholder="00000-000" maxLength={9} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="rua">Rua *</Label>
                      <Input id="rua" value={rua} onChange={e => setRua(e.target.value)} placeholder="Nome da rua" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número *</Label>
                      <Input id="numero" value={numero} onChange={e => setNumero(e.target.value)} placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input id="bairro" value={bairro} onChange={e => setBairro(e.target.value)} placeholder="Nome do bairro" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input id="cidade" value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Nome da cidade" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado *</Label>
                      <Input id="estado" value={estado} onChange={e => setEstado(e.target.value)} placeholder="UF" maxLength={2} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento (opcional)</Label>
                    <Input id="complemento" value={complemento} onChange={e => setComplemento(e.target.value)} placeholder="Apto, bloco, etc." />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="confirmado" checked={confirmado} onCheckedChange={checked => setConfirmado(checked === true)} />
                  <label htmlFor="confirmado" className="text-sm cursor-pointer">Confirmo que os dados estão corretos</label>
                </div>
                <Button onClick={handleSaveOrder} disabled={!isFormValid() || savingOrder} className="w-full">
                  {savingOrder ? "Salvando..." : "Salvar dados"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="h-12 w-12 text-primary" />
                <h2 className="text-xl font-semibold">Cadastro realizado com sucesso.</h2>
              </div>
              <div className="bg-background p-4 rounded-lg inline-block mx-auto border">
                <img src={pixQrCode} alt="QR Code PIX" className="w-[200px] h-auto" />
              </div>
              <div className="text-sm text-muted-foreground space-y-3 text-left">
                <p>Escaneie o QR CODE acima e adicione o valor da sua compra.</p>
                <p>Ou, se preferir:</p>
                <p>Copie a <strong>CHAVE PIX – celular {PIX_KEY}</strong> e em seguida adicione o valor da compra.</p>
                <p className="text-xs">Ambas as opções estão em nome de <strong>Luciano Spader – Banco Mercado Pago</strong></p>
              </div>
              {!showThankYou && (
                <Button variant="outline" onClick={() => { setShowModal(false); setShowThankYou(true); }} className="mt-4">Fechar</Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfirmacaoWhatsapp;
