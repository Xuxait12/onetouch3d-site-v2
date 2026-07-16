import { config } from "@/config";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, Loader2, Copy, Plus, X } from 'lucide-react';
import pixQrCode from '@/assets/pix-qrcode.png';
import googleLogo from '@/assets/google-logo.png';
import onetouchLogo from '@/assets/onetouch-logo.png';

interface Modalidade {
  id: string;
  nome: string;
  slug: string;
}

interface Tamanho {
  id: string;
  nome: string;
  ordem: number;
}

interface PixConfig {
  pix_chave: string;
  pix_nome: string;
  pix_banco: string;
}

interface ItemQuadroState {
  id: string;
  modalidadeId: string;
  tamanhoId: string;
  tamanhos: Tamanho[];
  loadingTamanhos: boolean;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function novoItemQuadro(): ItemQuadroState {
  return { id: generateId(), modalidadeId: '', tamanhoId: '', tamanhos: [], loadingTamanhos: false };
}

// ============================================
// Bloco de seleção de um item (Modalidade + Tamanho)
// ============================================
function ItemQuadroBloco({
  item,
  index,
  modalidades,
  loadingModalidades,
  podeRemover,
  onChange,
  onRemove,
}: {
  item: ItemQuadroState;
  index: number;
  modalidades: Modalidade[];
  loadingModalidades: boolean;
  podeRemover: boolean;
  onChange: (item: ItemQuadroState) => void;
  onRemove: () => void;
}) {
  useEffect(() => {
    if (!item.modalidadeId) {
      onChange({ ...item, tamanhos: [], tamanhoId: '' });
      return;
    }
    onChange({ ...item, loadingTamanhos: true, tamanhoId: '' });
    (async () => {
      const { data: precos, error } = await supabase
        .from('precos')
        .select('tamanho_id')
        .eq('modalidade_id', item.modalidadeId)
        .eq('ativo', true);
      if (error || !precos) { onChange({ ...item, tamanhos: [], loadingTamanhos: false, tamanhoId: '' }); return; }
      const tamanhoIds = [...new Set(precos.map(p => p.tamanho_id))];
      if (tamanhoIds.length === 0) { onChange({ ...item, tamanhos: [], loadingTamanhos: false, tamanhoId: '' }); return; }
      const { data: tamData } = await supabase.from('tamanhos').select('id, nome, ordem').in('id', tamanhoIds).eq('ativo', true).order('ordem');
      onChange({ ...item, tamanhos: tamData || [], loadingTamanhos: false, tamanhoId: '' });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.modalidadeId]);

  return (
    <div className="space-y-3 pb-3 border-b last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Quadro {index + 1}</p>
        {podeRemover && (
          <button type="button" onClick={onRemove} className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10" aria-label="Remover quadro">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Modalidade</Label>
          <Select value={item.modalidadeId} onValueChange={v => onChange({ ...item, modalidadeId: v })} disabled={loadingModalidades}>
            <SelectTrigger><SelectValue placeholder={loadingModalidades ? "Carregando..." : "Selecione"} /></SelectTrigger>
            <SelectContent>{modalidades.map(m => (<SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Tamanho</Label>
          <Select value={item.tamanhoId} onValueChange={v => onChange({ ...item, tamanhoId: v })} disabled={!item.modalidadeId || item.loadingTamanhos}>
            <SelectTrigger><SelectValue placeholder={item.loadingTamanhos ? "Carregando..." : !item.modalidadeId ? "Escolha modalidade" : "Selecione"} /></SelectTrigger>
            <SelectContent>{item.tamanhos.map(t => (<SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>))}</SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

const ConfirmacaoWhatsapp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [loadingModalidades, setLoadingModalidades] = useState(false);
  const [pixConfig, setPixConfig] = useState<PixConfig | null>(null);

  // Lista de quadros (itens) do pedido — visual, cada um vira uma venda separada
  const [itensQuadro, setItensQuadro] = useState<ItemQuadroState[]>([novoItemQuadro()]);

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
  const [numerosPedidos, setNumerosPedidos] = useState<number[]>([]);
  const [itensComErro, setItensComErro] = useState<number>(0);
  const [showPedidoConfirmado, setShowPedidoConfirmado] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) return digits.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
    return digits.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
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
        if (!data.erro) { setRua(data.logradouro || ''); setBairro(data.bairro || ''); setCidade(data.localidade || ''); setEstado(data.uf || ''); }
      } catch (error) { console.error('Erro ao buscar CEP:', error); }
    }
  };

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

  const fetchModalidades = async () => {
    setLoadingModalidades(true);
    const { data, error } = await supabase.from('modalidades').select('id, nome, slug').eq('ativo', true).order('nome');
    if (!error && data) setModalidades(data);
    setLoadingModalidades(false);
  };

  const fetchPixConfig = async () => {
    const { data, error } = await supabase.from('configuracoes' as any).select('chave, valor').in('chave', ['pix_chave', 'pix_nome', 'pix_banco']);
    if (!error && data) {
      const cfg: any = {};
      (data as any[]).forEach((row: any) => { cfg[row.chave] = row.valor; });
      setPixConfig({ pix_chave: cfg.pix_chave || '', pix_nome: cfg.pix_nome || '', pix_banco: cfg.pix_banco || '' });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        setEmail(session.user.email || '');
        setShowFormModal(true);
        const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).maybeSingle();
        loadProfileIntoForm(profile);
      }
      setAuthChecking(false);
    };
    checkAuth();
    fetchModalidades();
  }, []);

  const handleAuthSuccess = async (user: { id: string; email?: string }) => {
    setIsAuthenticated(true);
    setUserId(user.id);
    setEmail(user.email || '');
    setShowFormModal(true);
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
    loadProfileIntoForm(profile);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { toast({ title: "Erro no login", description: error.message.includes('Invalid login credentials') ? "Email ou senha incorretos." : error.message, variant: "destructive" }); }
      else if (data.user) { toast({ title: "Login realizado!", description: "Bem-vindo de volta!" }); await handleAuthSuccess(data.user); }
    } catch { toast({ title: "Erro", description: "Erro inesperado. Tente novamente.", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) { toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" }); return; }
    if (password !== confirmPassword) { toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${config.siteUrl}/confirmacao-whatsapp` } });
      if (error) { toast({ title: "Erro no cadastro", description: error.message, variant: "destructive" }); }
      else if (data.user) {
        if (data.session) { toast({ title: "Cadastro realizado!", description: "Bem-vindo!" }); await handleAuthSuccess(data.user); }
        else {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (!signInError && signInData.user) { toast({ title: "Cadastro realizado!", description: "Bem-vindo!" }); await handleAuthSuccess(signInData.user); }
          else { toast({ title: "Cadastro realizado!", description: "Verifique seu email para confirmar a conta." }); }
        }
      }
    } catch { toast({ title: "Erro", description: "Erro inesperado. Tente novamente.", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    try {
      localStorage.setItem('auth_redirect_to', '/confirmacao-whatsapp');
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${config.siteUrl}/auth/callback`, skipBrowserRedirect: true } });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error: any) { toast({ title: "Erro ao entrar com Google", description: error.message, variant: "destructive" }); }
  };

  // --- Itens (quadros) ---
  const atualizarItemQuadro = (id: string, novo: ItemQuadroState) => {
    setItensQuadro(prev => prev.map(i => (i.id === id ? novo : i)));
  };
  const adicionarItemQuadro = () => setItensQuadro(prev => [...prev, novoItemQuadro()]);
  const removerItemQuadro = (id: string) => setItensQuadro(prev => prev.filter(i => i.id !== id));

  const isFormValid = () => {
    const itensValidos = itensQuadro.length > 0 && itensQuadro.every(i => i.modalidadeId && i.tamanhoId);
    return itensValidos && nomeCompleto.trim() && email.trim() &&
      telefone.trim() && cpf.trim() && cep.trim() && rua.trim() &&
      numero.trim() && bairro.trim() && cidade.trim() && estado.trim() && confirmado;
  };

  const handleConfirm = async () => {
    if (!userId || savingOrder) return;
    setSavingOrder(true);
    try {
      const cpfClean = cpf.replace(/\D/g, '');
      const telefoneClean = telefone.replace(/\D/g, '');
      const cepClean = cep.replace(/\D/g, '');

      if (cpfClean.length < 11) { toast({ title: "Erro de validação", description: "CPF inválido.", variant: "destructive" }); setSavingOrder(false); return; }
      if (telefoneClean.length < 10) { toast({ title: "Erro de validação", description: "Telefone inválido.", variant: "destructive" }); setSavingOrder(false); return; }
      if (cepClean.length !== 8) { toast({ title: "Erro de validação", description: "CEP inválido.", variant: "destructive" }); setSavingOrder(false); return; }

      const profileData = { user_id: userId, nome_completo: nomeCompleto, email, telefone, cpf_cnpj: cpf, cep, endereco: rua, numero, complemento, bairro, cidade, estado, data_nascimento: '1990-01-01' };

      // Mesmo padrão seguro do Checkout.tsx: busca por user_id (nunca por id).
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      let profileError = null;
      let profileId: string | null = existingProfile?.id ?? null;

      if (existingProfile) {
        const { error } = await supabase.from('profiles').update(profileData).eq('user_id', userId);
        profileError = error;
      } else {
        const { data: inserted, error } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'user_id' })
          .select('id')
          .single();
        profileError = error;
        profileId = inserted?.id ?? null;
      }

      if (profileError) {
        const isDuplicate = profileError.code === '23505' && profileError.message?.includes('cpf_cnpj');
        toast({ title: isDuplicate ? "CPF/CNPJ duplicado" : "Erro ao salvar perfil", description: isDuplicate ? "Este CPF/CNPJ já está cadastrado. Se você já tem uma conta, faça login." : profileError.message, variant: "destructive" });
        setSavingOrder(false);
        return;
      }

      if (!profileId) {
        toast({ title: "Erro", description: "Dados incompletos. Tente novamente.", variant: "destructive" });
        setSavingOrder(false);
        return;
      }

      // Cria uma venda por item da lista, sequencialmente, reaproveitando o mesmo profileId.
      // Se algum item falhar, os que já deram certo permanecem registrados; o restante é avisado no final.
      const numerosCriados: number[] = [];
      let falhas = 0;

      for (const item of itensQuadro) {
        const { data: molduraData } = await supabase
          .from('precos')
          .select('tipo_moldura_id')
          .eq('modalidade_id', item.modalidadeId)
          .eq('tamanho_id', item.tamanhoId)
          .eq('ativo', true)
          .limit(1)
          .single();

        const tipoMolduraId = molduraData?.tipo_moldura_id;
        if (!tipoMolduraId) { falhas++; continue; }

        const { data: vendaData, error: vendaError } = await supabase.functions.invoke('create-venda-manual', {
          body: {
            profile_id: profileId,
            modalidade_id: item.modalidadeId,
            tamanho_id: item.tamanhoId,
            tipo_moldura_id: tipoMolduraId,
          },
        });

        if (vendaError || !vendaData?.success) { falhas++; continue; }
        if (vendaData?.numero) numerosCriados.push(vendaData.numero);
      }

      setItensComErro(falhas);

      if (numerosCriados.length === 0) {
        toast({ title: "Erro ao criar pedido", description: "Nenhum item pôde ser registrado. Tente novamente.", variant: "destructive" });
        setSavingOrder(false);
        return;
      }

      setNumerosPedidos(numerosCriados);

      if (falhas > 0) {
        toast({ title: "Pedido parcialmente registrado", description: `${numerosCriados.length} item(ns) registrado(s), ${falhas} com erro. Fale com o suporte.`, variant: "destructive" });
      }

      // 4. Mostrar sucesso
      await fetchPixConfig();
      setShowFormModal(false);
      setShowSuccessModal(true);
      if (falhas === 0) toast({ title: "Sucesso!", description: "Pedido registrado. Efetue o pagamento via PIX." });
    } catch (error) {
      toast({ title: "Erro inesperado", description: error instanceof Error ? error.message : "Tente novamente.", variant: "destructive" });
    } finally {
      setSavingOrder(false);
    }
  };

  const copyPixKey = async () => {
    const key = pixConfig?.pix_chave || '';
    try { await navigator.clipboard.writeText(key); toast({ title: "Chave PIX copiada!", description: key }); }
    catch { toast({ title: "Erro ao copiar", description: `Copie manualmente: ${key}`, variant: "destructive" }); }
  };

  if (authChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  const renderAuthScreen = () => (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <img src={onetouchLogo} alt="OneTouch3D" className="h-10 mx-auto mb-2" loading="eager" fetchPriority="high" />
        <CardDescription className="text-sm">Este link foi enviado via WhatsApp para finalizar seu pedido e gerar o pagamento via PIX.</CardDescription>
        <p className="text-xs text-muted-foreground mt-1">Crie sua conta ou entre para continuar.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={loading}>
            <img src={googleLogo} alt="Google" className="w-4 h-4 mr-2" loading="eager" fetchPriority="high" />
            Continuar com Google
          </Button>
          <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Ou continue com email</span></div></div>
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="signin">Entrar</TabsTrigger><TabsTrigger value="signup">Cadastrar</TabsTrigger></TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div className="space-y-2"><Label htmlFor="password">Senha</Label><div className="relative"><Input id="password" type={showPassword ? "text" : "password"} placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required className="pr-10" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
                <div className="text-center"><Link to="/recuperar-senha" className="text-sm text-muted-foreground hover:text-foreground">Esqueci minha senha?</Link></div>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="signup-email">Email</Label><Input id="signup-email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div className="space-y-2"><Label htmlFor="signup-password">Senha</Label><div className="relative"><Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required className="pr-10" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                <div className="space-y-2"><Label htmlFor="confirm-password">Confirmar Senha</Label><div className="relative"><Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="Confirme sua senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="pr-10" /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Cadastrando..." : "Cadastrar"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );

  const renderFormModal = () => (
    <Dialog open={showFormModal} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" onPointerDownOutside={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Finalizar Pedido via WhatsApp</DialogTitle>
          <DialogDescription>Preencha os dados abaixo para confirmar seu pedido.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Dados do Quadro</h3>
            <div className="space-y-4">
              {itensQuadro.map((item, idx) => (
                <ItemQuadroBloco
                  key={item.id}
                  item={item}
                  index={idx}
                  modalidades={modalidades}
                  loadingModalidades={loadingModalidades}
                  podeRemover={itensQuadro.length > 1}
                  onChange={(novo) => atualizarItemQuadro(item.id, novo)}
                  onRemove={() => removerItemQuadro(item.id)}
                />
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={adicionarItemQuadro} className="w-full gap-2">
              <Plus className="h-3.5 w-3.5" /> Adicionar outro quadro
            </Button>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Dados Pessoais</h3>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Nome Completo</Label><Input value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} placeholder="Seu nome completo" /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input value={email} readOnly className="bg-muted/50" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Telefone</Label><Input value={telefone} onChange={e => setTelefone(formatPhone(e.target.value))} placeholder="(00) 00000-0000" maxLength={15} /></div>
                <div className="space-y-1.5"><Label>CPF/CNPJ</Label><Input value={cpf} onChange={e => setCpf(formatCpf(e.target.value))} placeholder="000.000.000-00" maxLength={18} /></div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Endereço</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label>CEP</Label><Input value={cep} onChange={e => handleCepChange(e.target.value)} placeholder="00000-000" maxLength={9} /></div>
                <div className="col-span-2 space-y-1.5"><Label>Rua</Label><Input value={rua} onChange={e => setRua(e.target.value)} placeholder="Rua / Avenida" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label>Número</Label><Input value={numero} onChange={e => setNumero(e.target.value)} placeholder="Nº" /></div>
                <div className="col-span-2 space-y-1.5"><Label>Complemento</Label><Input value={complemento} onChange={e => setComplemento(e.target.value)} placeholder="Apto, Bloco..." /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label>Bairro</Label><Input value={bairro} onChange={e => setBairro(e.target.value)} placeholder="Bairro" /></div>
                <div className="space-y-1.5"><Label>Cidade</Label><Input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Cidade" /></div>
                <div className="space-y-1.5"><Label>Estado</Label><Input value={estado} onChange={e => setEstado(e.target.value)} placeholder="UF" maxLength={2} /></div>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 pt-2">
            <Checkbox id="confirm" checked={confirmado} onCheckedChange={(checked) => setConfirmado(checked === true)} />
            <Label htmlFor="confirm" className="text-sm leading-tight cursor-pointer">Li e confirmo que todos os dados acima estão corretos.</Label>
          </div>
          <Button onClick={handleConfirm} className="w-full" disabled={!isFormValid() || savingOrder}>
            {savingOrder ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" /> Salvando...</>) : ("Confirmar")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderSuccessModal = () => (
    <Dialog open={showSuccessModal} onOpenChange={(open) => { if (!open) { setShowSuccessModal(false); setShowPedidoConfirmado(true); } }}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-xl"><CheckCircle className="h-6 w-6 text-accent" />Pedido Confirmado!</DialogTitle>
          <DialogDescription>Escaneie o QR Code abaixo no app do seu banco e digite o valor do{numerosPedidos.length > 1 ? 's' : ''} quadro{numerosPedidos.length > 1 ? 's' : ''}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <img src={pixQrCode} alt="QR Code PIX" className="mx-auto w-48 h-48 rounded-lg border" loading="lazy" />
          {pixConfig && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Chave PIX:</span><span className="font-medium">{pixConfig.pix_chave}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Nome:</span><span className="font-medium">{pixConfig.pix_nome}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Banco:</span><span className="font-medium">{pixConfig.pix_banco}</span></div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">O valor será informado pelo atendente via WhatsApp. Digite-o manualmente ao realizar o pagamento.</p>
          <Button onClick={copyPixKey} variant="outline" className="w-full"><Copy className="h-4 w-4 mr-2" /> Copiar chave PIX</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderPedidoConfirmadoModal = () => {
    const descricaoPedidos = numerosPedidos.length > 1
      ? `Seus pedidos #${numerosPedidos.join(', #')} foram registrados com sucesso. Assim que o pagamento PIX for identificado, você receberá a confirmação.`
      : numerosPedidos.length === 1
        ? `Seu pedido #${numerosPedidos[0]} foi registrado com sucesso. Assim que o pagamento PIX for identificado, você receberá a confirmação.`
        : 'Seu pedido foi registrado com sucesso. Assim que o pagamento PIX for identificado, você receberá a confirmação.';

    return (
      <Dialog open={showPedidoConfirmado} onOpenChange={(open) => { if (!open) setShowPedidoConfirmado(false); }}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-xl"><CheckCircle className="h-6 w-6 text-accent" />Pedido Confirmado!</DialogTitle>
            <DialogDescription>{descricaoPedidos}</DialogDescription>
          </DialogHeader>
          {itensComErro > 0 && (
            <p className="text-xs text-destructive">{itensComErro} item(ns) não foram registrados por erro técnico. Entre em contato com o suporte informando os números acima.</p>
          )}
          <Button onClick={() => { setShowPedidoConfirmado(false); navigate('/'); }} className="w-full mt-4">Voltar para o início</Button>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-8">
      {!isAuthenticated && renderAuthScreen()}
      {isAuthenticated && renderFormModal()}
      {renderSuccessModal()}
      {renderPedidoConfirmadoModal()}
    </div>
  );
};

export default ConfirmacaoWhatsapp;
