# LMS Project — Part 18: Security Hardening

**Goal:** A focused audit-and-fix pass across the whole app before deployment (Part 19). This isn't new features — it's tightening what already exists.

---

## 1. Input Validation

Every API route currently does ad-hoc "if field missing, return error" checks. Standardize with **zod**:

1. `npm install zod`
2. Define a schema per route body next to the route (or in a `src/lib/validation/` folder if you prefer grouping) — e.g. `registerSchema`, `checkoutSchema`, `courseCreateSchema`, `reviewSchema`.
3. At the top of each route handler: `const parsed = schema.safeParse(body); if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);` — this replaces scattered manual `if (!name || !email...)` checks with one consistent, harder-to-forget-a-field pattern.
4. Prioritize the routes that accept the most "interesting" input first: auth (register/login/reset-password), checkout, reviews, questions, admin course/lesson creation. Simple GET-only routes with no body don't need this.

---

## 2. Rate Limiting

Focus on the routes most worth protecting: `/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password` (brute-force and enumeration-spam targets).

- Simplest option with no new infra: an in-memory sliding-window counter keyed by IP (via `req.headers.get('x-forwarded-for')`) in a small `src/lib/rateLimit.ts` — acceptable for a course project on a single Vercel deployment, with the known limitation that it resets on cold starts and doesn't share state across serverless instances.
- If you want it to actually work correctly in a real serverless deployment: use **Upstash Redis** (`@upstash/ratelimit` + `@upstash/redis`, free tier) instead — persistent, shared across instances. Recommended if time allows; the in-memory version is a documented, explicit compromise otherwise.
- Limit: something like 10 requests per 15 minutes per IP on the auth routes. Return 429 with a clear "too many attempts, try again later" message.

---

## 3. Security Headers

### `next.config.mjs` (update)
Add a `headers()` function returning, for all routes:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (prevents this app being iframed for clickjacking)
- `Referrer-Policy: strict-origin-when-cross-origin`
- A basic `Content-Security-Policy` — this one needs care: it must allow Stripe's checkout domain, Vercel Blob's video domain, and any email/image CDN domains you actually use, or you'll silently break checkout/video. Start permissive (`default-src 'self'; frame-src https://checkout.stripe.com; media-src 'self' https://*.public.blob.vercel-storage.com;` etc., adjusted to your actual domains) and test the whole app end-to-end after adding it, before tightening further.

---

## 4. XSS & Injection Review

- Confirm nowhere in the codebase uses `dangerouslySetInnerHTML` with user-supplied content (reviews, questions, course descriptions) — React's default JSX rendering already escapes text content, which is why Parts 7/8 explicitly avoided any HTML rendering for those fields. Just verify no shortcut was taken anywhere.
- Confirm all Mongoose queries use the schema/query builder (`Model.find({ field: value })`) rather than raw `$where` or string-interpolated queries — this codebase already does this correctly throughout, this is a verification step, not a rewrite.

---

## 5. Secrets & Config Audit

- Confirm `.env.local` is genuinely git-ignored in the real repo (`.gitignore` already lists `.env*.local` — verify with `git status` after touching that file that git doesn't see it as trackable).
- **Rotate the MongoDB Atlas password** that appeared in plaintext in your `full_project_dump.md` (flagged in the roadmap file) if you haven't already.
- Confirm `STRIPE_SECRET_KEY` is a **test** key (`sk_test_...`) throughout development — swapping to a live key only happens deliberately at real deployment, never checked into any file.
- Double check `JWT_SECRET` in `.env.local`/production is a long random value, not the literal `dev_jwt_super_secret_key...` placeholder currently in the dump — generate a fresh one (`openssl rand -base64 48`) for anything beyond local dev.

---

## 6. Verification Checklist

1. `npm run build` / `npm run lint` — zero errors.
2. Submit invalid data to a zod-validated route (e.g. checkout with a garbage `courseId`, register with a malformed email) → confirm a clean 400 with a useful message, not a 500 stack trace.
3. Hammer the login route with 15+ rapid failed attempts → confirm rate limiting kicks in with a 429.
4. Re-run the full manual verification flows from Parts 4/5/7/8 (checkout, review, question) after adding the CSP header → confirm nothing silently broke (this is the most likely regression point in this whole part).
5. Confirm `git status` shows `.env.local` as ignored, not tracked.
6. Screenshot: a validation error response, a rate-limit 429 response, and the security headers visible in browser DevTools' Network tab for the homepage request.

## 7. Git & Push

Suggested commits: `feat(validation): zod schemas on auth, checkout, review, question routes`, `feat(security): rate limiting on auth routes`, `feat(security): CSP and security headers`, `chore(security): rotate dev secrets and audit gitignore`. Update README roadmap.

Report back before Part 19 (Deployment).
