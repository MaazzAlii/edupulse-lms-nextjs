# LMS Project — Part 19: Deployment to Vercel

**Goal:** Get a real, working, publicly-reachable deployment — this is the "Live demo URL" your task card explicitly lists as a required deliverable alongside the GitHub repo.

---

## 1. Vercel Project Setup

1. Import the GitHub repo into Vercel (vercel.com → Add New → Project → select the repo). Framework preset auto-detects Next.js — leave defaults.
2. In Project Settings → Environment Variables, add **every** variable from your final `.env.example`, with real production values:
   - `MONGO_URI` — either the same Atlas cluster (fine for a course project) or a separate production database/cluster if you want clean separation from dev test data.
   - `JWT_SECRET` — a fresh, long random value, different from your local dev secret.
   - `JWT_EXPIRE`
   - `BLOB_READ_WRITE_TOKEN` — Vercel's Storage tab can generate/link this automatically for the project.
   - `STRIPE_SECRET_KEY` — decide deliberately: keep test mode (`sk_test_...`) for a course-project demo (recommended, so graders/mentors can "purchase" with the 4242 test card without real money), or switch to live mode only if you specifically intend real transactions. Document whichever you choose in the README.
   - `STRIPE_WEBHOOK_SECRET` — **this must be regenerated for production**, see below.
   - `NEXT_PUBLIC_APP_URL` — your real Vercel URL (e.g. `https://your-app.vercel.app`).
   - `RESEND_API_KEY`, `EMAIL_FROM`
   - `CRON_SECRET`
3. Deploy.

---

## 2. Production Stripe Webhook

The `stripe listen` CLI tunnel from Part 5 only works for local dev — production needs a real webhook endpoint registered in the Stripe dashboard:

1. Stripe Dashboard → Developers → Webhooks → Add endpoint.
2. URL: `https://your-app.vercel.app/api/webhooks/stripe`.
3. Select event: `checkout.session.completed` (just this one, matching what the handler processes).
4. Stripe generates a **new** signing secret for this endpoint — copy it and set it as `STRIPE_WEBHOOK_SECRET` in Vercel's environment variables (it will be different from your local `whsec_...`). Redeploy after adding it (env var changes require a redeploy to take effect on already-built functions).

---

## 3. Vercel Cron (Part 9's notification cleanup)

Confirm `vercel.json`'s `crons` config deployed correctly (Vercel Project → Cron Jobs tab should show it scheduled). Cron jobs on the free/hobby tier have a minimum daily interval — the `0 0 * * *` schedule from Part 9 already fits that.

---

## 4. Post-Deploy Smoke Test

Do a full pass against the **live URL**, not localhost:
1. Register a new account, confirm the welcome email arrives.
2. Browse the catalog, open a course, watch a preview lesson.
3. Enroll in a paid course with the Stripe test card → confirm the webhook fires (check Stripe Dashboard → Webhooks → your endpoint → recent deliveries, should show a 200) and the lesson unlocks.
4. Check `/my-courses` / `/dashboard`, mark a lesson complete, get a certificate.
5. Log in as admin, confirm `/admin`, `/admin/users`, `/admin/analytics` all work.
6. Confirm `/sitemap.xml` and `/robots.txt` are reachable.

---

## 5. Edge Cases & Gotchas

- **Environment variable changes need a redeploy.** If something works locally but not in production, the very first thing to check is whether Vercel's env vars actually match `.env.example`'s full list and whether you redeployed after the last change.
- **Cold starts + MongoDB connection**: the cached-connection pattern in `src/lib/db.ts` from Part 1 already handles serverless warm/cold invocations correctly — no changes needed here, just worth knowing why the first request after idle time can feel slightly slower.
- **Custom domain (optional)**: if you want something nicer than `*.vercel.app` for your submission, Vercel's domain settings support it, but this is cosmetic — don't spend deadline time on it unless everything else above is done.

---

## 6. Verification Checklist

1. The full post-deploy smoke test in section 4, all steps passing against the real live URL.
2. Screenshot: the Stripe webhook dashboard showing successful (200) production deliveries, and the Vercel deployment dashboard showing a successful build.
3. Confirm the live URL loads correctly in an incognito window (rules out any "works because I'm logged in / have local cookies" false positive).

## 7. Git & Push

Nothing new to commit here beyond `vercel.json` if not already committed in Part 9. Update `README.md` with the live demo URL at the top, and flip every completed part in the roadmap table to ✅.

Report back with the live URL before Part 20 (Final QA & Submission).
