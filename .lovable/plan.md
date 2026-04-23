

## Plano: Hero dinâmico de campanha em /corrida

Implementar um sistema de campanhas que, quando ativo, substitui o `HeroSection` (vídeo) da página `/corrida` por um banner promocional configurável via Supabase.

---

### Passo 1 — Tabela `campanhas` (migration)

Campos:
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default `gen_random_uuid()` |
| `nome_prova` | text NOT NULL | ex: "Maratona de SP" |
| `foto_background` | text NOT NULL | URL do fundo |
| `imagem_quadro_1` | text NOT NULL | URL do quadro principal |
| `imagem_quadro_2` | text NULL | URL do segundo quadro (opcional) |
| `frase_personalizada` | text NOT NULL | título grande |
| `frase_secundaria` | text DEFAULT 'Eternize esse momento em um quadro personalizado.' | subtítulo |
| `mensagem_whatsapp` | text NULL | texto pré-preenchido do botão WhatsApp |
| `data_inicio` | timestamptz NOT NULL | início da vigência |
| `data_fim` | timestamptz NOT NULL | fim da vigência |
| `ativo` | boolean DEFAULT true | flag manual de kill-switch |
| `created_at` | timestamptz DEFAULT now() | |
| `updated_at` | timestamptz DEFAULT now() | trigger de update |

**RLS:**
- `SELECT` público (anon + authenticated) — landing page precisa ler
- `INSERT/UPDATE/DELETE` restrito a admins via `has_role(auth.uid(), 'admin')`

**Índice:** `(ativo, data_inicio, data_fim)` para a query de campanha ativa.

---

### Passo 2 — Hook `useCampanhaAtiva`

Novo arquivo `src/hooks/useCampanhaAtiva.tsx`:
- Usa React Query (`@tanstack/react-query`, já no projeto).
- Query: `campanhas` onde `ativo = true AND data_inicio <= now() AND data_fim >= now()`, ordenado por `data_inicio DESC`, limit 1.
- Retorna `{ campanha, isLoading }`.
- `staleTime` 5 min.

---

### Passo 3 — Componente `HeroSectionCampanha`

Novo `src/components/HeroSectionCampanha.tsx`:
- Layout responsivo similar ao `HeroSection` atual, mas com **imagem de fundo** (`foto_background`) em vez de vídeo.
- Conteúdo:
  - Título: `frase_personalizada` (mesma tipografia/animação letter-by-letter do `HeroSection`)
  - Subtítulo: `frase_secundaria`
  - Linha de âncora de preço (mantém padrão das landing pages — ver memória `hero-ancora-preco`)
  - Quadros (`imagem_quadro_1` e opcional `imagem_quadro_2`) sobrepostos com leve animação fade/float
  - CTA azul `#2563EB` (memória `botoes-acao`):
    - Se `mensagem_whatsapp` existir → abre `wa.me` com texto pré-preenchido
    - Senão → scroll para seção de produto (`#produto`), comportamento atual
- Overlay escuro sobre o background para legibilidade.
- Respeita `useReducedMotion`.

---

### Passo 4 — Integração em `/corrida`

Em `src/pages/Corrida.tsx`:
```tsx
const { campanha, isLoading } = useCampanhaAtiva();
// ...
{isLoading ? <HeroSkeleton /> : campanha ? <HeroSectionCampanha campanha={campanha} /> : <HeroSection />}
```
- `HeroSkeleton`: placeholder com mesma altura do hero para evitar layout shift.
- Nenhuma outra seção da página é alterada.

---

### Passo 5 — Tipos TypeScript

Após a migration, os tipos de `src/integrations/supabase/types.ts` serão regenerados automaticamente, expondo `Tables<'campanhas'>` para uso no hook e componente.

---

### Fora do escopo (a confirmar depois)

- **Painel admin para gerenciar campanhas** (criar/editar/ativar) — não mencionado nesta mensagem; pode ser feito em seguida via `AdminPanel.tsx` se desejado.
- **Replicação para `/ciclismo`, `/triathlon`, `/viagem`** — só `/corrida` foi pedido.
- **Upload de imagens via Storage** — por ora as URLs serão coladas direto na tabela (via SQL ou painel Supabase). Se quiser upload integrado, fica para uma segunda fase.

---

### Arquivos afetados

- **Novo:** migration SQL (tabela + RLS + índice + trigger updated_at)
- **Novo:** `src/hooks/useCampanhaAtiva.tsx`
- **Novo:** `src/components/HeroSectionCampanha.tsx`
- **Editado:** `src/pages/Corrida.tsx` (renderização condicional)

