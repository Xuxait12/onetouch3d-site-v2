

## Plan: Replace `supabase.functions.invoke` with direct `fetch` in PixPayment.tsx

**File: `src/components/payment/PixPayment.tsx`** (lines 66-97)

Replace the `supabase.functions.invoke('create-payment', ...)` call and its error handling with a direct `fetch` to the Edge Function URL, using the anon key from the Supabase client config and the session's access token.

**Changes:**

1. Replace lines 66-97 with:
   - Direct `fetch('https://azaqhsxlsqrvltcsmgve.supabase.co/functions/v1/create-payment', ...)` with `POST` method
   - Headers: `Content-Type`, `Authorization` (Bearer token from session), `apikey` (the existing `SUPABASE_PUBLISHABLE_KEY` from `client.ts`)
   - Body: same payload (pedido_id, payment_method_id, amount, payer)
   - Parse response with `response.json()`
   - Check `!response.ok` for HTTP errors, then check `!data.success` for business errors
   - Log response details for debugging

The apikey will use the real anon key already in the codebase: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6YXFoc3hsc3Fydmx0Y3NtZ3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjcwODgsImV4cCI6MjA4ODYwMzA4OH0.KmiAg0gisYq6nVnJgFMNqv1SHcsOQf04OaOY_HQJR4w`

