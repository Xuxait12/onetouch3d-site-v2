

## Problem

After Google OAuth login, Supabase redirects back with `#access_token=...` in the URL hash. React Router's `BrowserRouter` ignores hash fragments for routing, so when the redirect URL is `/checkout#access_token=...`, the router matches `/checkout` correctly BUT the hash fragment can cause rendering issues. The Supabase client processes the hash via `onAuthStateChange`, but the hash remains in the URL.

The fix needs to happen **inside** the `BrowserRouter` (to use `useNavigate`), so we need a wrapper component.

## Plan

**Create an `OAuthHashHandler` component** used inside `BrowserRouter` in `App.tsx`:

1. **New component inline in App.tsx** (or as a wrapper around `<Routes>`):
   - `useEffect` checks `window.location.hash` for `access_token`
   - If found, wait for `supabase.auth.getSession()` to confirm the session is established
   - Then use `navigate(window.location.pathname, { replace: true })` to clean the hash and re-render the current route cleanly
   - Show a loading spinner while waiting

2. **In `App.tsx`**:
   - Add the `OAuthHashHandler` component wrapping `<Routes>` inside `<BrowserRouter>`
   - This component will intercept the hash before routes render, ensuring clean navigation

### Technical Details

```typescript
// Inside BrowserRouter
const OAuthHashHandler = ({ children }) => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      setProcessing(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        // Clean the hash from URL
        window.history.replaceState(null, '', window.location.pathname);
        setProcessing(false);
        // Force navigate to current path (e.g. /checkout)
        navigate(window.location.pathname, { replace: true });
      });
    }
  }, []);

  if (processing) return <LoadingSpinner />;
  return children;
};
```

This ensures:
- The hash is detected before any route renders
- The session is confirmed before proceeding
- The URL is cleaned and the router navigates to the correct path
- No `window.location.reload()` needed

