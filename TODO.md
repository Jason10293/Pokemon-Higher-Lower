1. Frontend auth wiring (client + UI actions)

- Add a browser client helper: frontend/utils/supabase/client.ts using createBrowserClient from @supabase/ssr or @supabase/supabase-js.
- Update frontend/app/login/page.tsx:
  - Hook up the form to call supabase.auth.signInWithPassword.
  - Add error/success state and redirect on success (e.g., to /gamepage).
  - Add OAuth button handler for Google: supabase.auth.signInWithOAuth({ provider: "google" }).
- Update frontend/app/signup/page.tsx:
  - Hook up form to supabase.auth.signUp with email/password.
  - Validate password confirmation on client.
  - Add success message (“check your email”) and error state.
- Add session awareness:
  - Consider a small client hook or server component check that redirects signed‑in users away from /login and /signup.
  - Optional: add a user menu/logout button in a shared component (e.g., frontend/components/Header.tsx).

2. Supabase session management (server-side)

- Add middleware or route handler to refresh sessions using cookies:
  - Option A: Next.js middleware in frontend/middleware.ts using the Supabase SSR patterns.
  - Option B: In server components, use createClient() from frontend/utils/supabase/server.ts to check auth.getUser() and redirect.
- Ensure env vars are present:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

3. Backend auth validation (only if you want protected API routes)

- Add a middleware in backend/api or backend/handlers that:
  - Reads Authorization: Bearer <jwt> header.
  - Verifies JWT using Supabase JWKS or the SUPABASE_JWT_SECRET (server‑side).
  - Stashes user info in context.
- Protect routes that require auth (e.g., /cards/randomCard if you want to gate gameplay).
- If not needed yet, skip this step entirely and rely on frontend-only gating.

4. Docs & verification
   - Required env vars
   - Expected redirects and flows

- Manual verification list:
  - Sign up → email confirmation (if enabled) → sign in.
  - Sign in → redirect to game page.
  - Logout clears session and returns to public pages.

If you want, I can turn this into actual code changes starting with the frontend auth wiring in frontend/app/login/page.tsx and frontend/app/signup/page.tsx.
