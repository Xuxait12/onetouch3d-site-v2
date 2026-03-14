

## Fix: Add session check and explicit auth header to PIX payment

**File: `src/components/payment/PixPayment.tsx`** (lines 55-71)

Before calling `supabase.functions.invoke('create-payment')`, add:

1. **Session verification** — call `supabase.auth.getSession()`, log the session, and throw if no active session exists
2. **Explicit Authorization header** — pass `Authorization: Bearer ${session.access_token}` in the `headers` option of `supabase.functions.invoke`

This ensures the Edge Function receives a valid JWT even if the Supabase client's automatic header injection fails (e.g., expired/missing token).

Single file, ~8 lines added before the existing `invoke` call + adding `headers` to the call.

