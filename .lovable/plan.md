

## Plano: Corrigir erros de TypeScript por mudança de schema do banco

O novo `types.ts` reflete um banco com colunas renomeadas e tabelas removidas. Abaixo está o mapeamento e os arquivos afetados.

### Mapeamento de colunas

**Profiles (antigo → novo):**
- `full_name` → `nome_completo`
- `phone` → `telefone`
- `birth_date` → `data_nascimento`
- `address` → `endereco`
- `number` → `numero`
- `complement` → `complemento`
- `neighborhood` → `bairro`
- `city` → `cidade`
- `state` → `estado`
- `person_type` → `tipo_pessoa`
- `country` → `pais`
- `is_admin` → **não existe** (precisará de abordagem alternativa, ex: tabela `user_roles`)
- `ponto_referencia` → **não existe** (remover referências)

**Pedidos (antigo → novo):**
- `numero_pedido` → **não existe** (usar `id` truncado)
- `data_pedido` → `created_at`
- `subtotal` → `preco_total`
- `total` → `preco_final`
- `frete` → `shipping_cost`
- `desconto` → `desconto_cupom` + `desconto_pix`
- `forma_pagamento` → `metodo_pagamento`
- `status` → `status_pagamento` / `status_producao`
- `payment_status` → `status_pagamento`
- `payment_approved_at` → **não existe** (remover)
- `payment_method_type` → `metodo_pagamento`
- `cupom_aplicado` → `cupom_id`

**Cupons:** `coupons` → `cupons`, `code` → `codigo`, `active` → `ativo`, `discount_type` → `tipo`, `discount_value` → `valor`, `page`/`valid_from`/`valid_until` → **não existem**

**`itens_pedido`** → **não existe** (remover todas as referências; o novo schema embute item no pedido via `modalidade_id`, `tamanho_id`, `tipo_moldura_id`, `quantidade`, `preco_unitario`)

---

### Arquivos a corrigir (12 arquivos)

1. **`src/components/CouponSection.tsx`** — Trocar `from('coupons')` por `from('cupons')`, atualizar nomes de colunas (`code`→`codigo`, `active`→`ativo`, `discount_type`→`tipo`, `discount_value`→`valor`), remover validações de `page`, `valid_from`, `valid_until`.

2. **`src/components/AuthRedirect.tsx`** — Renomear colunas do select de profiles: `full_name`→`nome_completo`, `address`→`endereco`, `number`→`numero`, `neighborhood`→`bairro`, `city`→`cidade`, `state`→`estado`, `phone`→`telefone`.

3. **`src/pages/Auth.tsx`** — Mesmo mapeamento de colunas de profiles no select e na verificação de completude.

4. **`src/pages/Profile.tsx`** — Atualizar todos os campos de leitura e escrita (upsert) do profile para os novos nomes.

5. **`src/pages/Checkout.tsx`** — Atualizar selects/upserts de profiles; atualizar insert em `pedidos` (usar novos campos); remover insert em `itens_pedido`; ajustar o payload do pedido para os novos campos (`preco_unitario`, `preco_total`, `preco_final`, `modalidade_id`, `tamanho_id`, `tipo_moldura_id`, `metodo_pagamento`, `status_pagamento`, `status_producao`, etc.).

6. **`src/pages/Confirmacao.tsx`** — Remover fetch de `itens_pedido`; atualizar interface `OrderDetails` para usar novos campos de `pedidos`; ajustar renderização.

7. **`src/pages/ConfirmacaoWhatsapp.tsx`** — Atualizar leitura/escrita de profiles; atualizar insert em `pedidos` com novos campos; remover insert em `itens_pedido`.

8. **`src/pages/OrderDetails.tsx`** — Remover fetch de `itens_pedido`; remover check de `is_admin`; atualizar colunas de `pedidos` e `profiles`.

9. **`src/pages/AdminPanel.tsx`** — Remover check de `is_admin` (substituir por consulta a `user_roles` ou outra abordagem); atualizar selects de `pedidos` e `profiles` para novos nomes de colunas; atualizar interfaces.

10. **`src/pages/MyOrders.tsx`** — Atualizar referências a `numero_pedido`, `total`, `status`, `data_pedido` para os novos nomes (`preco_final`, `status_pagamento`, `created_at`).

11. **`src/hooks/useOrderStatus.ts`** — Trocar `payment_status`→`status_pagamento`, remover `payment_approved_at`, `payment_method_type`→`metodo_pagamento`.

12. **`src/lib/validation.ts`** — Atualizar `profileSchema` e `orderSchema` para refletir os novos nomes de campos. Remover `orderItemSchema` (sem `itens_pedido`).

### Nota sobre `is_admin`

O novo schema não tem `is_admin` em profiles. Será necessário criar uma abordagem alternativa. A solução recomendada é usar uma tabela `user_roles` conforme boas práticas de segurança, ou temporariamente usar um campo/função RPC no Supabase. Para não bloquear a correção, substituirei as checagens de `is_admin` por uma função helper que consulta uma tabela `user_roles` (se existir) ou retorna `false`.

### Nota sobre Edge Functions (Supabase)

Os arquivos em `supabase/functions/` também usam colunas antigas, mas como rodam no Deno e não são compilados pelo TypeScript do projeto, **não causam erros de build**. Podem ser corrigidos em um segundo momento.

