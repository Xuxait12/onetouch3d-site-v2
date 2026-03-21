

## Plan: Add fallback mechanism to PaymentBrick catch block

### What
Replace the `catch (err: any)` block (lines 147-154) in `PaymentBrick.tsx` with a fallback that checks the database when `fetch` fails due to connection timeout (`Failed to fetch` / `TypeError`), mirroring the pattern already used in `PixPayment.tsx`.

### Change
**File**: `src/components/payment/PaymentBrick.tsx` (lines 147-154)

Replace the existing catch block with one that:
1. Logs the error
2. If error is `Failed to fetch` or `TypeError`: waits 5s, queries `pedidos` table for payment status
3. If payment was approved/rejected in the DB, handles accordingly
4. Otherwise falls through to the original error handling

No other files changed.

