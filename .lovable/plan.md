

## Two Payment Fixes

### 1. `src/config.ts`
Change `mercadoPagoPublicKey` from production key to test key:
`"APP_USR-17f27d57-2bae-4add-a003-4ad4f440bb75"` → `"TEST-1455da45-8f64-4757-b86d-1ca8d58d8af4"`

### 2. `src/components/payment/PaymentBrick.tsx`
Line 89 — add `data.message` check before `data.error`:
`throw new Error(data.error || 'Erro ao processar pagamento')` → `throw new Error(data.message || data.error || 'Erro ao processar pagamento')`

Two files, two single-line changes.

