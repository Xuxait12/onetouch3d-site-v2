

## Plan: Replace `loadOrders` with separate queries in AdminPanel.tsx

### Problem
The current `loadOrders` uses `profiles!inner(...)` join which fails because `profiles.id` differs from `auth.users.id`.

### Change
**File**: `src/pages/AdminPanel.tsx` (lines 120-159)

Replace the entire `loadOrders` function with the user-provided version that:
1. Fetches pedidos separately (including `user_id`)
2. Collects unique `user_id`s
3. Fetches profiles by `user_id` using `.in()`
4. Builds a `profileMap` and merges profiles into orders
5. Falls back to a default "Sem perfil" object when no profile exists

No other files changed.

