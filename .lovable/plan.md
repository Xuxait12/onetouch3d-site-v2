

## Plan: Update `handleGoogleSignIn` in Auth.tsx

Replace the current `handleGoogleSignIn` function (lines 174-190) with the provided version that adds `skipBrowserRedirect: true` and manually redirects via `window.location.href = data.url`.

**Single change in `src/pages/Auth.tsx`:**
- Replace the `handleGoogleSignIn` function body to use `skipBrowserRedirect: true` in the OAuth options and perform a manual redirect using the returned `data.url`
- No other changes to the file

