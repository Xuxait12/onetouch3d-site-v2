

## Diagnosis

The 4 product pages **are correctly passing** `modalidade_id`, `tamanho_id`, and `tipo_moldura_id` via `addItem()`. The `CartItem` type also has these fields defined.

The problem is in **`src/pages/Checkout.tsx` lines 557-559**:

```ts
modalidade_id: cart.items[0]?.modalidade_id || null,
tamanho_id: cart.items[0]?.tamanho_id || null,
tipo_moldura_id: cart.items[0]?.tipo_moldura_id || null,
```

The DB column `modalidade_id` has a **NOT NULL** constraint, but `|| null` is used as fallback. This fails when:
- Cart items were added **before** the dynamic pricing implementation (old items in localStorage without these fields)
- The optional `?` on `CartItem` means TypeScript allows `undefined`, which becomes `null`

## Fix — `src/pages/Checkout.tsx`

**1. Add validation before order creation** (around line 530, before the `.insert()`):

Check that every cart item has the required IDs. If any item is missing them, show an error toast asking the user to re-add the product, and abort.

```ts
const missingIds = cart.items.some(i => !i.modalidade_id || !i.tamanho_id || !i.tipo_moldura_id);
if (missingIds) {
  toast({
    variant: "destructive",
    title: "Produto desatualizado",
    description: "Remova e adicione o produto novamente ao carrinho para continuar.",
  });
  setIsProcessing(false);
  return;
}
```

**2. Remove `|| null` fallback** on lines 557-559:

```ts
modalidade_id: cart.items[0].modalidade_id,
tamanho_id: cart.items[0].tamanho_id,
tipo_moldura_id: cart.items[0].tipo_moldura_id,
```

Since validation above guarantees these exist, the fallback is unnecessary and was masking the real issue.

Only **one file** changes: `src/pages/Checkout.tsx`.

