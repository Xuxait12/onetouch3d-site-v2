

## Plan: Improve error body logging for 400 responses

**File: `src/components/payment/PixPayment.tsx`** (lines 91-95)

The current code already catches non-ok responses and parses JSON, but the logging doesn't show the full raw body. Update to use `JSON.stringify(errorBody)` for complete visibility.

**Change:** Replace lines 91-95 with:
```typescript
if (!response.ok) {
  const errorBody = await response.json().catch(() => ({}));
  console.error('Erro da Edge Function (status ' + response.status + '):', JSON.stringify(errorBody, null, 2));
  throw new Error(errorBody?.error || errorBody?.message || `Erro HTTP ${response.status}`);
}
```

This ensures the full JSON error body is stringified and visible in the browser console, making it easy to diagnose exactly what the Edge Function returned.

