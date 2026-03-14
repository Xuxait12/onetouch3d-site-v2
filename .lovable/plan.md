

## Fix: Change `status_producao` value in Checkout.tsx

**Problem**: Line 562 sets `status_producao: 'aguardando'`, but the database constraint requires `'aguardando_fotos'`.

**Fix** in `src/pages/Checkout.tsx` line 562:
- Change `status_producao: 'aguardando'` → `status_producao: 'aguardando_fotos'`

Single line change, one file.

