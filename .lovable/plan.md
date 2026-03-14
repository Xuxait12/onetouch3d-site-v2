

## Fix: PIX Payment Error Handling in PixPayment.tsx

**Root cause**: When `supabase.functions.invoke('create-payment')` returns an error, the current code only checks `response.data.error` for the message, but:
1. The Supabase client wraps non-2xx responses in a `FunctionsHttpError` object — the actual error body is in `response.error.context` or needs `response.error.message`
2. The edge function may return `message` instead of `error` in its response body
3. No `console.error` logging, so the real error is invisible

**Changes in `src/components/payment/PixPayment.tsx`** (lines 56-108):

1. **Add detailed console logging** — log `response.error`, `response.data`, and any caught exceptions so the real error is visible in dev tools

2. **Improve error extraction from `response.error`** — when `supabase.functions.invoke` fails, extract the message from:
   - `response.error.message` (FunctionsHttpError message)
   - `response.data?.error` or `response.data?.message` (parsed response body)
   - Fall back to the generic message only if nothing else is available

3. **Add `data.message` check** on line 84 — change `data?.error || 'Erro ao criar pagamento PIX'` to `data?.message || data?.error || 'Erro ao criar pagamento PIX'`

4. **Improve the catch block** (lines 100-108) — log full error details with `console.error` including the error stack

Single file change, focused on error visibility and correct field extraction.

