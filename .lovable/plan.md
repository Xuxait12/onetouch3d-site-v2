

## Plan: Update OAuth redirectTo in Checkout.tsx

**Single change** on line 372 of `src/pages/Checkout.tsx`:

Change `redirectTo` from:
```
`${window.location.origin}/checkout`
```
to:
```
`${window.location.origin}/auth/callback`
```

No other modifications needed.

