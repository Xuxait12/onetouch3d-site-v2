

## Plan: Fix 3 Checkout Issues

### File: `src/pages/Checkout.tsx`

**Issue 1 - Flash of Home content**

The current code (lines 172-184) has two separate checks: first `authLoading` shows a spinner, then a `useEffect` redirects when `!user`. Between `authLoading` becoming false and the redirect executing, the full checkout renders briefly.

**Fix**: After the `authLoading` spinner check (line 178-184), add a second early return for `!user` that also shows a spinner. This prevents any checkout content from rendering while the redirect is in progress.

```tsx
// Line ~184, after the authLoading check:
if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
```

**Issue 2 - PaymentBrick not initializing**

The `PaymentBrick` component (line 152) and `App.tsx` (line 42) both read `import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY`, but this env var is not configured in the project secrets. The key exists hardcoded in `src/config.ts` as `config.mercadoPagoPublicKey` but is never used by these components.

**Fix**: In `PaymentBrick.tsx`, replace `import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY` with `config.mercadoPagoPublicKey` from `src/config.ts` (import config). The `initMercadoPago` in `App.tsx` also needs to fall back to `config.mercadoPagoPublicKey`.

Changes:
- `App.tsx` line 42: `const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || config.mercadoPagoPublicKey;` (add config import)
- `PaymentBrick.tsx` line 152: same fallback pattern

**Issue 3 - Error on "Continuar para Pagamento"**

The order insert (lines 550-552) uses placeholder UUIDs `'00000000-0000-0000-0000-000000000000'` for `modalidade_id`, `tamanho_id`, `tipo_moldura_id`. These likely fail foreign key constraints. Cart items now have these real IDs from the previous implementation.

**Fix**:
- Use the first cart item's `modalidade_id`, `tamanho_id`, `tipo_moldura_id` if available, falling back to null (not placeholder UUIDs)
- Add detailed `console.error` logging in the catch block (line 591-604) to log the full error object
- Also log `pedidoError` details when order insert fails

```tsx
// Lines 549-552 replacement:
modalidade_id: firstItem.modalidade_id || null,
tamanho_id: firstItem.tamanho_id || null,
tipo_moldura_id: firstItem.tipo_moldura_id || null,
```

```tsx
// Line 591 catch block - add console.error:
console.error('Erro ao finalizar compra:', error);
```

```tsx
// Line 558 pedidoError block - add console.error:
console.error('Erro ao criar pedido:', pedidoError);
```

### Summary of files modified

| File | Change |
|------|--------|
| `src/pages/Checkout.tsx` | 1) Add `!user` early return with spinner after authLoading check. 2) Use real cart item IDs instead of placeholder UUIDs. 3) Add console.error logging. |
| `src/components/payment/PaymentBrick.tsx` | Import config and fallback to `config.mercadoPagoPublicKey` |
| `src/App.tsx` | Import config and fallback to `config.mercadoPagoPublicKey` for `initMercadoPago` |

