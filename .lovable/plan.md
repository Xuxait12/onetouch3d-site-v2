

## Fix: Change `status_pagamento` value in Checkout.tsx

**Problem**: Line 561 sets `status_pagamento: 'pendente'`, but the database constraint only accepts `'pending'`, `'approved'`, `'rejected'`, `'cancelled'`.

**Fix** in `src/pages/Checkout.tsx` line 561:
- Change `status_pagamento: 'pendente'` → `status_pagamento: 'pending'`

Single line change, one file.

