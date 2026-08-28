# LMS Project — Part 16: Automated Testing (Playwright)

**Goal:** `playwright` is already a devDependency in `package.json` from the original scaffold — this part actually uses it. A small but real e2e suite covering the app's critical paths, runnable in CI or before any future deploy.

---

## 1. Setup

1. `npx playwright install` (downloads browser binaries — do this once).
2. `npx playwright init` if no config exists yet, or hand-write `playwright.config.ts`: `baseURL: 'http://localhost:3000'`, `webServer` block that runs `npm run dev` automatically before tests and tears it down after (so `npx playwright test` is a single command, no manual server juggling).
3. Tests need a **real, seeded test database** — do not run these against your primary dev data (tests will create/delete real documents). Either point `MONGO_URI` at a separate `edupulse_lms_test` database via a `.env.test.local`, or write a `beforeAll` that seeds and a `afterAll` that cleans up specific test-tagged documents (e.g. emails prefixed `e2e-test-`). Prefer the separate test database — much safer against accidentally wiping real data.

---

## 2. Test Suites

Put these under `tests/e2e/`:

### `auth.spec.ts`
- Register a new account with a unique email (timestamp-suffixed to avoid collisions across runs) → lands on `/dashboard`.
- Log out → redirected/logged-out state confirmed.
- Log back in with the same credentials → succeeds.
- Attempt registering the same email again → clear error shown, no crash.
- Attempt visiting `/dashboard` while logged out → redirected to `/login`.

### `catalog-and-checkout.spec.ts`
- Browse the public catalog, use search/filter/sort (Part 12) → confirm results update.
- Open a course detail page, click Enroll on a paid course → confirm redirect to Stripe's checkout domain (`checkout.stripe.com`).
- **Note**: fully automating a Stripe test-card payment inside Playwright is possible (Stripe's checkout page is a real page you can fill in) but flaky and slow for a course project — it's fine to stop this specific test at "redirected to Stripe correctly" and cover the post-payment state (webhook → enrollment → unlock) with a lower-level integration test instead (see below), rather than a full browser-driven Stripe payment in every CI run.

### `admin-crud.spec.ts`
- Log in as a seeded admin test account.
- Create a category, create a course under it, publish it → confirm it now appears in the public catalog.
- Edit the course, unpublish it → confirm it disappears from the public catalog (still reachable directly by admin, still 404 for the public — matching the Part 2 spec's original behavior).
- Delete the category attempt while a course still references it → confirm the orphan-protection error from Part 2 actually fires.

### `enrollment-guard.spec.ts` (integration-style, not full browser)
Rather than driving a real Stripe payment through the browser, directly call your own `POST /api/webhooks/stripe`-adjacent internal logic in a test setup step (or, simpler: directly manipulate the test DB to set an Enrollment to `Paid` for a seeded test user/course pair), then use Playwright to confirm the **application-level effect**: that user can now see the locked lesson's real video, and a different, non-enrolled test user still cannot.

---

## 3. Scripts

Add to `package.json`:
```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

---

## 4. Edge Cases & Gotchas

- **Flaky tests are worse than no tests** — if the Stripe checkout redirect test is unreliable in CI (external domain, network variance), keep it but don't block your submission checklist on it being 100% green every run; the goal is meaningful coverage of your own app's logic, not testing Stripe's uptime.
- **Test data isolation**: reusing the same email across repeated local test runs will hit the "email already registered" case from Part 1 and fail for the wrong reason — always generate unique emails per run (`e2e-${Date.now()}@test.com`).

---

## 5. Verification Checklist

1. `npx playwright test` — all suites pass locally against the seeded test database.
2. Deliberately break one thing (e.g. temporarily comment out the auth redirect on `/dashboard`) → confirm the relevant test actually fails, proving the test isn't a false-positive no-op. Revert after confirming.
3. Screenshot/paste the terminal output of a full green `npx playwright test` run.

## 6. Git & Push

Suggested commits: `test: playwright config and test database setup`, `test: auth flow e2e suite`, `test: catalog, checkout redirect, and admin crud suites`, `test: enrollment guard integration test`. Update README with a "Testing" section documenting how to run `npm run test:e2e`.

Report back before Part 17 (SEO, Performance & Accessibility).
