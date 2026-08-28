# LMS Project — Part 5: Enrollment Engine, Webhook & Purchase Guard

**Goal:** Make payment actually mean something. A verified Stripe webhook flips the `Pending` Enrollment from Part 4 to `Paid`, locked lessons unlock for enrolled students, and students get a real "My Courses" page. This is the part that satisfies your task's "payment integration for course purchase" acceptance criterion end-to-end.

**Do not build yet:** progress tracking UI, certificates, reviews, admin analytics. Just: webhook → enrollment → unlocked access → my courses.

---

## 1. Prerequisites

1. Install the Stripe CLI locally (`brew install stripe/stripe-cli/stripe` or see stripe.com/docs/stripe-cli) — this is the only realistic way to test webhooks against `localhost`.
2. Run `stripe login`, then in a separate terminal (kept running alongside `npm run dev`): `stripe listen --forward-to localhost:3000/api/webhooks/stripe`. It prints a webhook signing secret (`whsec_...`).
3. Add that to `.env.local` and the key name to `.env.example`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## 2. Backend — Webhook

### `src/app/api/webhooks/stripe/route.ts`

This route has two hard requirements that differ from every other route in this codebase:

- **`export const runtime = 'nodejs'`** at the top of the file — the Stripe SDK's signature verification needs Node's crypto, not the Edge runtime.
- **Read the raw request body**, not parsed JSON. Use `await req.text()` to get the raw string, and pass that (plus the `stripe-signature` header and `STRIPE_WEBHOOK_SECRET`) into `stripe.webhooks.constructEvent()`. If you call `req.json()` first, signature verification will fail — Stripe signs the exact raw bytes.
- Wrap `constructEvent` in try/catch; on failure return `400` immediately with no further processing (this is Stripe rejecting a forged or malformed request).

Handle `event.type === 'checkout.session.completed'`:
- Pull `session.metadata.userId` and `session.metadata.courseId` (set in Part 4).
- `connectDB()`, then `Enrollment.findOneAndUpdate({ user: userId, course: courseId }, { paymentStatus: 'Paid', stripePaymentIntentId: session.payment_intent, amount: session.amount_total / 100 }, { new: true })`.
- If no matching Enrollment document exists (shouldn't normally happen since Part 4 upserts one first, but defend anyway), create one instead of failing silently.
- Return `200` quickly — Stripe retries on non-2xx, and retries on a handler that's already succeeded but responded slowly can create confusing duplicate-processing debugging later. Do the DB update, then respond; don't do anything slow (like sending email) synchronously in this handler yet — Part 14 will queue that separately.
- Ignore all other event types with a `200` (don't error on events you don't handle — Stripe sends many).

---

## 3. Backend — Purchase Guard

Update the lesson-gating logic from Part 3 in **both** places it currently exists:

### `src/app/api/courses/[id]/lessons/route.ts` (`GET`)
### `src/app/api/lessons/[id]/route.ts` (`GET`)

Current rule (Part 3): strip `videoUrl` unless `lesson.isPreview` or requester is admin.

**New rule**: strip `videoUrl` unless `lesson.isPreview` OR requester is admin OR requester has a `Paid` Enrollment for that lesson's course. Implement as a small shared helper, e.g. `src/lib/enrollmentGuard.ts` exporting `hasPaidAccess(userId, courseId): Promise<boolean>`, so both routes (and the player page) call the same logic instead of duplicating the Mongo query.

### `src/app/learn/[courseId]/[lessonId]/page.tsx` (update)
Replace the Part 3 placeholder ("unlocks after enrollment (Part 4)") with the real check: call `hasPaidAccess` (via a server component / API call) and render the real video player if true, the locked state with a working "Enroll now" link if false.

---

## 4. Backend — Enrollment Status API

### `GET /api/enrollments/me/route.ts`
- Requires auth.
- No query params: returns all of the current user's `Paid` enrollments, each populated with basic course info (title, slug, thumbnailUrl, category).
- `?courseId=...`: returns just that one enrollment (or `{ enrolled: false }` if none/still Pending) — this is what Part 4's success page polls.

---

## 5. Frontend — My Courses

### `src/app/my-courses/page.tsx`
- Protected route (same redirect-if-logged-out pattern as `/dashboard` from Part 1).
- Fetches `GET /api/enrollments/me`, renders a grid of enrolled courses (reuse the course card styling from the catalog), each linking into `/learn/[courseId]/[firstLessonId]`.
- Empty state: "You haven't enrolled in any courses yet" with a link back to the catalog.

### `src/components/Navbar.tsx` (update)
Add a "My Courses" link, shown only when `isAuthenticated`, next to the existing "My Learning"/Admin links from Part 1.

---

## 6. Edge Cases & Gotchas

- **Idempotency**: Stripe can send the same webhook event more than once (network retries). `findOneAndUpdate` is naturally idempotent here (setting `paymentStatus: 'Paid'` twice is harmless), so no extra dedup logic is required — but don't design the handler to do something non-idempotent (like incrementing a counter) without adding one.
- **Webhook secret mismatch**: if you switch between `stripe listen` sessions, the printed `whsec_...` changes each time you restart the CLI unless you use a fixed one from the dashboard. If signature verification starts failing after a restart, check `.env.local` matches the CLI's current output.
- **Never grant access from the success page or the checkout route.** Only the verified webhook flips `paymentStatus` to `Paid`. This is the actual security boundary for "did they pay."

---

## 7. Verification Checklist

1. `npm run build` / `npm run lint` — zero errors.
2. With `stripe listen` running in a separate terminal:
   - Complete a real test-card purchase → confirm the CLI terminal shows the forwarded event and your dev server logs a `200`.
   - Confirm the Enrollment document in MongoDB now shows `paymentStatus: 'Paid'` with a real `stripePaymentIntentId`.
   - Refresh `/checkout/success` → confirm it now shows the success state (not stuck polling).
   - Visit `/my-courses` → confirm the purchased course appears.
   - Visit the course's previously-locked lesson → confirm the real video now plays.
   - Log in as a **different** student who hasn't purchased → confirm that same lesson is still locked for them.
3. Screenshot: Stripe CLI showing a forwarded `checkout.session.completed` event, the Enrollment document in MongoDB Compass/Atlas showing `Paid`, `/my-courses` with the purchased course, and the unlocked lesson player.

## 8. Git & Push

Suggested commits: `feat(webhooks): stripe checkout.session.completed handler`, `feat(access): shared paid-enrollment guard for lessons`, `feat(dashboard): my-courses page and enrollment status api`. Flip Part 4 and Part 5 to ✅ in the README roadmap table — payment integration is now genuinely complete end-to-end, which satisfies your task's acceptance criterion.

Report back with repo state before Part 6 (Progress Tracking & Certificates) — or jump to Part 10 (Admin User Management) first if that's the more urgent remaining acceptance criterion for your deadline.
