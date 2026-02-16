

# Auditoria Completa: Autenticacao e Seguranca -- OneTouch3D

---

## A) Rotas e Guardas (Routing)

| Rota | Publica? | Guarda / Redirect | Arquivo |
|---|---|---|---|
| `/auth` | Sim (publica) | Se ja logado, redireciona para `/auth-redirect` via `getSession()` no `useEffect` | `src/pages/Auth.tsx` (linhas 25-34) |
| `/confirmacao-whatsapp` | Sim (publica) | Mostra tela auth se nao logado; apos login, abre modal de dados | `src/pages/ConfirmacaoWhatsapp.tsx` (linhas 60-93) |
| `/auth-redirect` | Sim (publica) | Verifica perfil completo: se completo vai para `/`, se incompleto vai para `/perfil`, se nao logado vai para `/` | `src/components/AuthRedirect.tsx` |
| `/recuperar-senha` | Sim (publica) | Nenhum redirect automatico | `src/pages/ForgotPassword.tsx` |
| `/redefinir-senha` | Sim (publica) | Verifica sessao valida; se invalida, redireciona para `/auth` | `src/pages/ResetPassword.tsx` (linhas 22-36) |
| `/perfil` | Protegida (client-side) | Se nao logado, redireciona para `/auth` via `getSession()` | `src/pages/Profile.tsx` (linhas 34-41) |
| `/meus-pedidos` | Protegida (client-side) | Se nao logado, redireciona para `/auth` via `getSession()` | `src/pages/MyOrders.tsx` (linhas 30-37) |
| `/meus-pedidos/:id` | Protegida (client-side) | Se nao logado, `<Navigate to="/auth" />` | `src/pages/OrderDetails.tsx` (linhas 109-112) |
| `/checkout` | Sem guarda explicita | Tem login inline, mas nao redireciona se nao logado | `src/pages/Checkout.tsx` |
| `/painel` | Protegida (client-side) | Verifica login + `is_admin` na tabela `profiles` | `src/pages/AdminPanel.tsx` (linhas 66-96) |

**Problema encontrado**: Nenhuma rota usa um componente de "guarda" centralizado (ProtectedRoute). Cada pagina implementa sua propria verificacao, o que pode levar a inconsistencias.

---

## B) Implementacao do Auth no Frontend

### B.1 -- signUp (com emailRedirectTo)
```typescript
// src/pages/Auth.tsx, linha 150
supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth-redirect`
  }
});
```

### B.2 -- signInWithPassword
```typescript
// src/pages/Auth.tsx, linha 87
supabase.auth.signInWithPassword({ email, password });

// src/pages/ConfirmacaoWhatsapp.tsx, linha 178
supabase.auth.signInWithPassword({ email, password });
```

### B.3 -- Login com Google (OAuth)
```typescript
// src/pages/Auth.tsx, linha 194
supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${window.location.origin}/auth-redirect` }
});

// src/pages/ConfirmacaoWhatsapp.tsx, linha 278
supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${window.location.origin}/confirmacao-whatsapp` }
});
```
**Nota**: A memoria menciona um `isCustomDomain()` + `skipBrowserRedirect` para o dominio de producao, mas esse codigo NAO foi encontrado no codebase atual. Isso pode significar que o Google OAuth pode falhar no dominio `onetouch3d.com.br` se o Lovable auth-bridge interferir.

### B.4 -- resetPasswordForEmail
```typescript
// src/pages/ForgotPassword.tsx, linha 33
supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/redefinir-senha`,
});
```

### B.5 -- updateUser (redefinicao de senha)
```typescript
// src/pages/ResetPassword.tsx, linha 60
supabase.auth.updateUser({ password: password });
```

### B.6 -- Verificacao de "Perfil Completo"
Implementada em `Auth.tsx` (linhas 37-72) e `AuthRedirect.tsx` (linhas 24-49).
**Criterio**: Os 9 campos obrigatorios sao: `full_name`, `cpf_cnpj`, `cep`, `address`, `number`, `neighborhood`, `city`, `state`, `phone`. Todos devem existir e nao ser strings vazias.

### B.7 -- getSession() vs getUser()
**ALERTA**: O projeto usa `supabase.auth.getSession()` em TODOS os lugares para decisoes de autenticacao. Nunca usa `supabase.auth.getUser()`. Isso e menos seguro porque `getSession()` le do armazenamento local (pode ser manipulado), enquanto `getUser()` valida o token no servidor.

**Locais afetados**:
- `Auth.tsx` linha 28
- `ConfirmacaoWhatsapp.tsx` linha 67
- `Profile.tsx` linha 36
- `MyOrders.tsx` linha 32
- `AuthRedirect.tsx` linha 46 (via `useAuth` que tambem usa `getSession`)

---

## C) Supabase Auth Settings (Checar no Painel)

| Item | Status |
|---|---|
| Email confirmations | **Precisa checar no painel**: Authentication > Providers > Email. Se estiver ON, o fluxo normal exige confirmacao, mas o fluxo WhatsApp a bypassa via Admin API. |
| Site URL | **Precisa checar**: Authentication > URL Configuration. Deve ser `https://onetouch3d.com.br` |
| Redirect URLs permitidas | **Precisa checar**: Devem incluir `https://onetouch3d.com.br/auth-redirect`, `https://onetouch3d.com.br/confirmacao-whatsapp`, `https://onetouch3d.com.br/redefinir-senha`, e as URLs de preview do Lovable. |
| Google Provider | **Precisa checar**: Authentication > Providers > Google. Verificar Client ID, Secret, e que as URIs de callback incluem o dominio de producao. |
| Politica de senha | Linter detectou: **Leaked password protection esta DESABILITADA**. |
| OTP Expiry | Linter detectou: **OTP expiry excede o limite recomendado**. Checar em Authentication > Settings. |
| Postgres version | Linter detectou: **Patches de seguranca disponiveis**. Atualizar o Postgres. |
| Templates de email | **Precisa checar**: Authentication > Email Templates. Os links de confirmacao e recuperacao devem apontar para `onetouch3d.com.br`. |

---

## D) Edge Function do WhatsApp (CRITICO)

### D.1 -- Funcao: `create-whatsapp-user`
**Arquivo**: `supabase/functions/create-whatsapp-user/index.ts`

### D.2 -- Parametros recebidos
Recebe via POST JSON: `{ email, password }`. Apenas esses dois campos.

### D.3 -- Validacao de quem pode chamar
**ALERTA CRITICO**: A funcao NAO possui NENHUMA validacao de autorizacao:
- Sem verificacao de token/header de autorizacao
- Sem captcha
- Sem rate limiting
- Sem secret/API key customizada
- Sem allowlist de IPs
- O `config.toml` nao define `verify_jwt` para esta funcao (usa o default)

**Qualquer pessoa pode chamar esta funcao** com qualquer email/senha e criar usuarios confirmados automaticamente, bypassing a confirmacao por email.

### D.4 -- Uso da Admin API
Sim, usa `supabase.auth.admin.createUser()` com `email_confirm: true` (skip confirmacao) e `supabase.auth.admin.listUsers()`.
O `SUPABASE_SERVICE_ROLE_KEY` e acessado via `Deno.env.get()` -- correto, apenas server-side.

**Porem**: A funcao faz `signInWithPassword` via admin client para obter sessao. Isso retorna tokens de sessao completos na resposta, que sao entao definidos no cliente via `setSession()`.

### D.5 -- Riscos especificos
1. **Criacao em massa**: Sem rate limit, um script pode criar milhares de contas.
2. **Enumeracao de usuarios**: `listUsers()` e chamado para verificar se usuario existe, e a resposta diferencia "usuario existe" de "usuario novo".
3. **Bypass de confirmacao**: Por design, mas qualquer atacante pode usar isso.

### D.6 -- Logs e monitoramento
- Edge Function logs: Supabase Dashboard > Edge Functions > `create-whatsapp-user` > Logs
- Postgres logs: Analytics query
- Nao ha monitoramento de alertas configurado

---

## E) Banco de Dados e RLS

### E.1 -- Tabelas com dados do cliente

| Tabela | RLS? | Policies | Colunas PII |
|---|---|---|---|
| `profiles` | Sim | SELECT: `true` (qualquer um le). INSERT: `auth.uid() = user_id`. UPDATE: `auth.uid() = user_id`. DELETE: nao permitido. | `full_name`, `cpf_cnpj`, `email`, `phone`, `cep`, `address`, `number`, `neighborhood`, `city`, `state`, `birth_date` |
| `pedidos` | Sim | SELECT: `true` (qualquer um le). INSERT: `auth.uid() = user_id`. UPDATE: `auth.uid() = user_id`. DELETE: nao permitido. | `shipping_address`, `payment_metadata` (contem CPF, telefone, CEP) |
| `itens_pedido` | Sim | SELECT: `true` (qualquer um le). INSERT/UPDATE: verificam dono do pedido via JOIN. DELETE: nao permitido. | Nenhuma diretamente |
| `payment_webhooks` | Sim | ALL: `false` (bloqueado). SELECT para admins via `profiles.is_admin`. | `event_data` (pode conter dados de pagamento) |
| `coupons` | Sim | SELECT: `true`. Sem INSERT/UPDATE/DELETE. | Nenhuma |
| `atualizar` | **Sim, mas SEM policies** | Nenhuma policy definida (linter flagou) | Nenhuma |

### E.2 -- ALERTAS CRITICOS DE RLS

**RISCO ALTO -- SELECT publico em `profiles`**: A policy de SELECT usa `true`, significando que QUALQUER usuario anonimo pode ler TODOS os perfis, incluindo CPF, telefone, endereco, nome completo de TODOS os clientes.

**RISCO ALTO -- SELECT publico em `pedidos`**: Qualquer usuario pode ler TODOS os pedidos de TODOS os clientes.

**RISCO ALTO -- SELECT publico em `itens_pedido`**: Qualquer usuario pode ler todos os itens de pedido.

**RISCO MEDIO -- `is_admin` na tabela `profiles`**: O campo `is_admin` esta na tabela `profiles` que o proprio usuario pode fazer UPDATE. Um usuario autenticado poderia teoricamente se tornar admin alterando seu proprio perfil. A policy de UPDATE permite `auth.uid() = user_id` sem restringir colunas.

**RISCO MEDIO -- `atualizar`**: Tabela com RLS habilitado mas sem policies -- efetivamente bloqueia todos os acessos, mas pode causar problemas se for necessaria.

---

## F) Sessao, Cookies e Armazenamento

### F.1 -- Armazenamento do token
```typescript
// src/integrations/supabase/client.ts
auth: {
  storage: localStorage,
  persistSession: true,
  autoRefreshToken: true,
}
```
Tokens sao armazenados em `localStorage`. Isso e padrao do Supabase, mas vulneravel a XSS.

### F.2 -- Protecao contra XSS
- `dangerouslySetInnerHTML` encontrado apenas em `src/components/ui/chart.tsx` (componente de biblioteca shadcn/ui, risco baixo pois renderiza CSS gerado internamente).
- Nao ha CSP (Content Security Policy) configurada (ver secao G).

### F.3 -- Logout completo
Sim, implementado em multiplos locais:
- `GlobalHeader.tsx`: `signOut()` via `useAuth` hook
- `ConfirmacaoWhatsapp.tsx`: `signOut()` + reset de todos os estados + `navigate('/', { replace: true })`
- `useAuth.tsx`: `supabase.auth.signOut()` que limpa a sessao do Supabase (e consequentemente o localStorage)

---

## G) Headers e Seguranca Web (Infra)

O projeto e hospedado na infraestrutura Lovable/Vite. **Nao ha configuracao de headers de seguranca** no codebase:

| Header | Status |
|---|---|
| Content-Security-Policy (CSP) | **Nao configurado** |
| X-Frame-Options / frame-ancestors | **Nao configurado** |
| Strict-Transport-Security (HSTS) | Depende do CDN/hosting |
| Referrer-Policy | **Nao configurado** |
| Permissions-Policy | **Nao configurado** |

**CSP sugerida (inicial, compativel com GTM/Facebook/MercadoPago)**:
```text
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval'
  https://www.googletagmanager.com
  https://www.google-analytics.com
  https://connect.facebook.net
  https://sdk.mercadopago.com
  https://http2.mlstatic.com;
style-src 'self' 'unsafe-inline'
  https://fonts.googleapis.com;
font-src 'self'
  https://fonts.gstatic.com;
img-src 'self' data: blob:
  https://*.supabase.co
  https://www.facebook.com
  https://www.google-analytics.com;
connect-src 'self'
  https://*.supabase.co
  wss://*.supabase.co
  https://www.google-analytics.com
  https://viacep.com.br
  https://api.mercadopago.com;
frame-src
  https://sdk.mercadopago.com
  https://www.mercadopago.com.br;
```
**Nota**: Esta CSP deve ser aplicada via meta tag no `index.html` ou via headers no CDN/hosting. Precisa ser testada antes de ir para producao.

---

## H) Plano de Testes (E2E)

| # | Cenario | Passos | Resultado Esperado |
|---|---|---|---|
| 1 | Cadastro com email (confirmacao) | Ir para `/auth` > tab Cadastrar > preencher email/senha > clicar Cadastrar | Toast "Verifique seu email" (se confirmacao ON) ou login direto (se OFF) |
| 2 | Login com senha errada | Ir para `/auth` > tab Entrar > email valido, senha errada > clicar Entrar | Toast "Email ou senha incorretos" |
| 3 | Reenvio de confirmacao | Ir para `/auth` > tab Cadastrar > inserir mesmo email | Depende da config do Supabase; verificar se reenvia ou mostra erro |
| 4 | Recuperar senha | Ir para `/recuperar-senha` > inserir email > clicar enviar | Toast "Email enviado" + email recebido com link para `/redefinir-senha` |
| 5 | Redefinir senha | Clicar link do email > chegar em `/redefinir-senha` > preencher nova senha > confirmar | Toast "Senha redefinida" + redirect para `/auth` |
| 6 | Login Google | Ir para `/auth` > clicar "Continuar com Google" > autorizar | Redirect para `/auth-redirect` > checar perfil > `/` ou `/perfil` |
| 7 | Fluxo WhatsApp completo | Ir para `/confirmacao-whatsapp` > cadastrar email/senha via edge function > preencher modal com dados > clicar "Salvar dados" | QR Code PIX exibido, pedido criado no banco com status `aguardando_pagamento` e origem `whatsapp` |
| 8 | Acesso protegido sem login | Acessar `/perfil`, `/meus-pedidos`, `/painel` sem estar logado | Redirect para `/auth` |
| 9 | Acesso ao painel admin sem ser admin | Logar com usuario comum > acessar `/painel` | Redirect para `/` com toast de acesso negado |
| 10 | Isolamento de pedidos | Logar como usuario A > acessar `/meus-pedidos` | Deve ver apenas pedidos do usuario A (ATENCAO: RLS atual permite ver todos) |

---

## I) Saida Final

### I.1 -- Lista de Riscos

| Prioridade | Risco | Impacto | Correcao Sugerida |
|---|---|---|---|
| **ALTA** | RLS SELECT `true` em `profiles` -- todos os dados pessoais (CPF, endereco, telefone) de todos os clientes sao acessiveis publicamente | Vazamento massivo de PII, violacao de LGPD | Alterar policy para `auth.uid() = user_id` no SELECT, ou usar funcao security definer para admin |
| **ALTA** | RLS SELECT `true` em `pedidos` -- todos os pedidos visiveis publicamente | Vazamento de dados financeiros e de compras | Alterar policy para `auth.uid() = user_id` no SELECT, com excecao para admins via funcao |
| **ALTA** | RLS SELECT `true` em `itens_pedido` | Expoe detalhes de compras de outros usuarios | Alterar para verificar dono do pedido via JOIN |
| **ALTA** | Edge function `create-whatsapp-user` sem NENHUMA protecao | Criacao ilimitada de contas, enumeracao de emails, abuso | Adicionar: (1) captcha ou secret header, (2) rate limiting, (3) remover `listUsers()` |
| **ALTA** | `is_admin` na tabela `profiles` com UPDATE permitido pelo proprio usuario | Escalacao de privilegio: usuario pode se tornar admin | Mover `is_admin` para tabela separada `user_roles` com RLS restrito, ou bloquear UPDATE do campo `is_admin` via trigger/policy |
| **MEDIA** | Uso exclusivo de `getSession()` para decisoes de autenticacao | Token local pode ser manipulado | Usar `getUser()` para verificacoes sensíveis (admin check, operacoes criticas) |
| **MEDIA** | Leaked password protection desabilitada | Usuarios podem usar senhas ja vazadas em data breaches | Habilitar em Authentication > Settings no Supabase Dashboard |
| **MEDIA** | OTP expiry longo demais | Tokens de recuperacao/confirmacao ficam validos por tempo excessivo | Reduzir para 5-10 minutos em Authentication > Settings |
| **MEDIA** | Postgres com patches de seguranca pendentes | Vulnerabilidades conhecidas nao corrigidas | Atualizar Postgres via Supabase Dashboard |
| **MEDIA** | Sem CSP configurada | Maior superficie de ataque para XSS | Implementar CSP conforme sugerido na secao G |
| **BAIXA** | Sem guarda de rota centralizado | Inconsistencia na protecao de rotas, facil de esquecer em novas paginas | Criar componente `ProtectedRoute` reutilizavel |
| **BAIXA** | `isCustomDomain()` e `skipBrowserRedirect` mencionados em memoria mas nao encontrados no codigo | Google OAuth pode falhar no dominio de producao | Verificar se o codigo foi removido e se OAuth funciona em `onetouch3d.com.br` |
| **BAIXA** | `dangerouslySetInnerHTML` em chart.tsx | Risco minimo (componente de UI library, sem input do usuario) | Nenhuma acao necessaria |

### I.2 -- Ajustes de UX

| Item | Descricao |
|---|---|
| Mensagem de erro genérica | No login com senha errada, a mensagem "Email ou senha incorretos" e boa. Manter assim (nao diferenciar email inexistente de senha errada). |
| Redirect apos Google OAuth | Verificar que no dominio de producao o redirect funciona corretamente (testar `onetouch3d.com.br`). |
| Fluxo WhatsApp sem "Esqueci minha senha" | Na pagina `/confirmacao-whatsapp` nao ha link para recuperar senha. Se o usuario ja tem conta mas esqueceu a senha, fica preso. |
| Fechar modal WhatsApp | O botao "Fechar" faz logout e manda para home. Considerar se isso e desejavel ou se o usuario deveria permanecer logado. |
| Checkout sem login | A pagina de checkout nao redireciona usuarios nao logados, permitindo que preencham o formulario inteiro antes de descobrir que precisam logar. |

### I.3 -- Checklist Manual no Supabase Dashboard

Acesse: `https://supabase.com/dashboard/project/wzjfofufvrtzhmkismyh`

1. [ ] **Authentication > Providers > Email**: Verificar se "Confirm email" esta ON ou OFF
2. [ ] **Authentication > Providers > Google**: Verificar Client ID, Secret, e callback URLs
3. [ ] **Authentication > URL Configuration**: Verificar Site URL (`https://onetouch3d.com.br`) e Redirect URLs permitidas
4. [ ] **Authentication > Settings**: Verificar OTP expiry time (reduzir para 300-600 segundos)
5. [ ] **Authentication > Settings**: Habilitar "Leaked password protection"
6. [ ] **Authentication > Email Templates**: Verificar que os links apontam para `onetouch3d.com.br` e nao para URLs de preview
7. [ ] **Settings > Database**: Verificar se ha upgrade de Postgres disponivel e aplicar
8. [ ] **Authentication > Rate Limits**: Verificar limites de tentativas de login e signup
9. [ ] **Edge Functions > create-whatsapp-user > Logs**: Verificar se ha chamadas suspeitas ou em massa

