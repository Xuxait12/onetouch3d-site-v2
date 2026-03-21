

## Plan: Two changes in ConfirmacaoWhatsapp.tsx

### Change 1: Expand `handleSignUp` else branch (lines 308-314)
Add auto-login fallback when signup returns a user but no session (email confirmation disabled scenario).

**Replace lines 308-314** with:
```typescript
      } else if (data.user) {
        if (data.session) {
          toast({ title: "Cadastro realizado!", description: "Bem-vindo!" });
          await handleAuthSuccess(data.user);
        } else {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (!signInError && signInData.user) {
            toast({ title: "Cadastro realizado!", description: "Bem-vindo!" });
            await handleAuthSuccess(signInData.user);
          } else {
            toast({ title: "Cadastro realizado!", description: "Verifique seu email para confirmar a conta." });
          }
        }
      }
```

### Change 2: Success modal closeable (lines 704-705)
- Line 704: Replace `onOpenChange={() => {}}` with `onOpenChange={(open) => { if (!open) setShowSuccessModal(false); }}`
- Line 705: Remove `onPointerDownOutside={e => e.preventDefault()}`

No other files changed.

