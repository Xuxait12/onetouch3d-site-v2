

## Ajustes Pontuais de UX/Copy em 3 Paginas

### 1) Pagina `/auth` -- Redirecionamento pos-login

**Arquivo**: `src/pages/Auth.tsx`

**O que muda**:
- Adicionar suporte a query param `?returnTo=` na URL. Quando o usuario vem de outra pagina (ex: checkout), o `returnTo` e preservado.
- Na funcao `checkProfileAndRedirect`: se perfil completo E existe `returnTo`, redirecionar para `returnTo` em vez de `/`. Se perfil incompleto, manter redirect para `/perfil`.
- No `useEffect` inicial (linha 28): se ja logado, verificar `returnTo` antes de mandar para `/auth-redirect`.
- No `handleGoogleSignIn`: incluir `returnTo` no `redirectTo` do OAuth para preservar a origem.

**Nenhuma mudanca estrutural** -- apenas leitura de query param e ajuste do destino do `navigate()`.

---

### 2) Pagina `/checkout` -- Ajustes de copy, aba default e botao Google

**Arquivo**: `src/pages/Checkout.tsx`

**Mudanca 1 -- Copy do gatilho** (linha 806):
- De: `"Clique aqui para fazer login"`
- Para: `"Entrar"`
- O texto completo fica: "Ja tem cadastro? Entrar"

**Mudanca 2 -- Aba padrao** (linha 39):
- De: `useState<'login' | 'signup'>('login')`
- Para: `useState<'login' | 'signup'>('signup')`
- Quando o usuario abre a area de auth no checkout, a aba "Criar Conta" vem selecionada por padrao.

**Mudanca 3 -- Botao Google na aba signup** (linha 999-1000):
- De: `"Entrar com Google"`
- Para: `"Criar conta com o Google"`

**Mudanca 4 -- Distincao visual da aba ativa** (linhas 817-835):
- Aba ativa: adicionar `bg-muted/50 rounded-t-md` alem do `border-b-2 border-black`
- Aba inativa: manter `text-gray-500`
- Pequeno ajuste CSS, sem redesign.

---

### 3) Pagina `/confirmacao-whatsapp` -- Aba padrao + texto contextual

**Arquivo**: `src/pages/ConfirmacaoWhatsapp.tsx`

**Mudanca 1 -- Aba padrao** (linha 520):
- De: `<Tabs defaultValue="signin">`
- Para: `<Tabs defaultValue="signup">`
- A aba "Cadastrar" vem selecionada por padrao.

**Mudanca 2 -- Texto contextual** (linha 498-500):
- Substituir o `CardDescription` atual ("Entre ou crie sua conta") por:
```
"Este link foi enviado via WhatsApp para finalizar seu pedido e gerar o pagamento via PIX."
```
- Manter abaixo um subtexto menor: "Crie sua conta ou entre para continuar."

---

### Resumo tecnico das alteracoes

| Arquivo | Tipo de mudanca | Linhas afetadas |
|---|---|---|
| `src/pages/Auth.tsx` | Leitura de `returnTo` query param + ajuste no destino do navigate | ~10 linhas modificadas |
| `src/pages/Checkout.tsx` | Copy de 2 textos + default de aba + CSS de aba ativa | ~8 linhas modificadas |
| `src/pages/ConfirmacaoWhatsapp.tsx` | Default de aba + texto contextual no header | ~5 linhas modificadas |

### O que NAO sera alterado
- Nenhuma rota, componente base, schema do Supabase ou logica principal
- Nenhuma integracao com Supabase (auth, perfil, salvamento)
- Nenhum estilo global ou identidade visual
- Fluxo do WhatsApp (edge function, modal, QR Code) permanece identico
- Responsividade existente mantida

