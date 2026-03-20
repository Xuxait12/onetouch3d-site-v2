

## Plan: Replace `supabase.functions.invoke` with direct `fetch()` in PaymentBrick.tsx

### Problem
`supabase.functions.invoke('create-payment')` causes `ERR_CONNECTION_CLOSED`. The PixPayment component already uses direct `fetch()` successfully.

### Change
In `src/components/payment/PaymentBrick.tsx`, lines 71-84, replace the `supabase.functions.invoke` call with the same `fetch()` pattern from PixPayment.tsx:

1. Get session via `await supabase.auth.getSession()`
2. Throw if no session
3. Call `fetch()` directly to the edge function URL with explicit `Authorization` and `apikey` headers
4. Check `response.ok` and parse error body if not
5. Parse JSON response as `data`
6. Keep all existing logic for `approved`, `rejected`, `in_process` unchanged (lines 94-140)

### Technical Details

Replace lines 71-92 with:

```typescript
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  throw new Error('Usuário não autenticado. Faça login novamente.');
}

const response = await fetch(
  'https://azaqhsxlsqrvltcsmgve.supabase.co/functions/v1/create-payment',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6YXFoc3hsc3Fydmx0Y3NtZ3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjcwODgsImV4cCI6MjA4ODYwMzA4OH0.KmiAg0gisYq6nVnJgFMNqv1SHcsOQf04OaOY_HQJR4w',
    },
    body: JSON.stringify({
      pedido_id: pedidoId,
      payment_method_id: formData.payment_method_id,
      token: formData.token,
      installments: formData.installments || 1,
      amount: amount,
      payer: {
        email: formData.payer?.email || payer.email,
        identification: formData.payer?.identification || payer.identification,
      },
    }),
  }
);

if (!response.ok) {
  const errorBody = await response.json().catch(() => ({}));
  throw new Error(errorBody?.error || errorBody?.message || `Erro HTTP ${response.status}`);
}

const data = await response.json();

if (!data.success) {
  throw new Error(data.message || data.error || 'Erro ao processar pagamento');
}
```

Single file change, no other modifications needed.

