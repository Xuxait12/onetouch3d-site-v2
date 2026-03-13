

## Plan: Switch to PKCE flow and update auth handling

Three targeted changes, no other modifications:

### 1. `src/integrations/supabase/client.ts` (lines 16-17)
- Change `detectSessionInUrl: true` → `detectSessionInUrl: false`
- Change `flowType: "implicit"` → `flowType: "pkce"`

### 2. `src/pages/AuthCallback.tsx` — full file replacement
- Remove `useNavigate` dependency, use `useState` for status message
- Keep same logic (PKCE code exchange → implicit hash → fallback session check)
- Extract `doRedirect()` helper that reads/clears `auth_redirect_to` from localStorage
- On error: show message and redirect to `/auth` after 2s timeout
- Use `data?.session` (optional chaining) instead of `data.session`

### 3. `src/pages/Checkout.tsx` (lines 172-177)
Replace the redirect `useEffect` to use `supabase.auth.getSession()` as a double-check before redirecting, and use `window.location.href` instead of `navigate()`:
```typescript
useEffect(() => {
  if (!authLoading && !user) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = "/auth?returnTo=/checkout";
      }
    });
  }
}, [authLoading, user]);
```

