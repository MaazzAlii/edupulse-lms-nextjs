# LMS Project — Part 4: Payments & Checkout

**Goal:** Wire real Stripe Checkout into the existing "Enroll" button (currently disabled with "Payments & enrollment coming in Part 4" on `src/app/courses/[id]/page.tsx`). By the end of this part, a logged-in student can click Enroll, pay with a real Stripe test card, and land on a success page. Actually granting course access happens in Part 5 — this part is strictly "get money from student to Stripe and back."

**Do not build yet:** the webhook that marks an enrollment as Paid, lesson unlocking, "My Courses," progress tracking, invoices/emails. Those are Part 5+.

---

## 1. Prerequisites

1. Create a free Stripe account if you don't have one, stay in **test mode**.
2. From the Stripe dashboard, copy your test **Secret key** (`sk_test_...`).
3. Add to `.env.local` and `.env.example` (key name only in the example file):
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   (`STRIPE_WEBHOOK_SECRET` gets added in Part 5, not needed yet.)
4. `npm install stripe` (server SDK only — no client SDK needed since we're using Stripe-hosted Checkout, not Stripe Elements).

---

## 2. Backend — Stripe Client & Checkout Session

### `src/lib/stripe.ts`
Instantiate a single shared Stripe client using `STRIPE_SECRET_KEY`, pinned to a recent API version. Throw a clear error at call time (not at import time) if the key is missing, matching the pattern in `videoUpload.ts`.

### `POST /api/checkout/route.ts`
- Requires authentication (`getAuthUserFromRequest`) — 401 if not logged in.
- Body: `{ courseId }`.
- Look up the course. 404 if it doesn't exist or `isPublished` is false.
- **Reject if the user already has a `Paid` Enrollment for this course** — return 400 with a clear message ("You already own this course") rather than letting them pay twice. Query `Enrollment.findOne({ user, course, paymentStatus: 'Paid' })`.
- **Free courses (`price === 0`)**: skip Stripe entirely — create/upsert an Enrollment directly with `paymentStatus: 'Paid'`, `amount: 0`, and return a `redirectUrl` straight to the course player instead of a Stripe URL. This keeps the free-course path simple and doesn't force a $0 Stripe session.
- **Paid courses**: create a Stripe Checkout Session:
  - `mode: 'payment'`
  - `line_items`: one line item, `price_data` built inline from the course's `title` and `price` (converted to the smallest currency unit — cents — `Math.round(course.price * 100)`), `currency: 'usd'`.
  - `success_url`: `${NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url`: `${NEXT_PUBLIC_APP_URL}/courses/${course._id}?checkout=cancelled`
  - `metadata: { userId: user._id.toString(), courseId: course._id.toString() }` — this is how the webhook in Part 5 will know what to enroll, since Stripe doesn't know about your database.
  - `customer_email`: the user's email, so Stripe pre-fills it.
  - Also **upsert a `Pending` Enrollment now** (`findOneAndUpdate({ user, course }, { amount: course.price, paymentStatus: 'Pending', stripeSessionId: session.id }, { upsert: true })`) — this gives you a row to update later and lets you show "payment pending" state if the student abandons checkout and comes back.
- Return `{ success: true, redirectUrl: session.url }` (or the free-course redirect URL).

---

## 3. Frontend

### `src/app/courses/[id]/page.tsx` (update)
Replace the disabled Enroll button:
- If the user isn't logged in, the button links to `/login?redirect=/courses/[id]`.
- If logged in and not yet enrolled, clicking it calls `POST /api/checkout` with `{ courseId }`, then does `window.location.href = redirectUrl` on success. Show a loading state on the button while the request is in flight (Stripe's hosted page can take a second to spin up).
- Show a clear inline error if checkout creation fails (e.g. "You already own this course" — link to `/learn/...` instead in that case).

### `src/app/checkout/success/page.tsx`
A simple confirmation page. Reads `session_id` from the query string, shows a "Payment received, processing your enrollment..." message with a spinner, and polls `GET /api/enrollments/me?courseId=...` (build a minimal version of this now, or stub it — the full version lands in Part 5) every 2 seconds until it sees `paymentStatus: 'Paid'`, then shows a success state with a link into the course. If it doesn't confirm within ~15 seconds, show "Still processing — refresh in a moment" rather than spinning forever (webhooks can occasionally lag).

### `src/app/courses/[id]/page.tsx` — cancel state
If the URL has `?checkout=cancelled`, show a small dismissible banner: "Checkout cancelled — you were not charged."

---

## 4. Edge Cases & Gotchas

- **Don't trust the client.** The success page polling your own DB (not trusting a query param) is intentional — anyone could hand-craft a `success_url` visit without paying. Actual enrollment only ever gets set to `Paid` by the webhook (Part 5) verifying Stripe's signature, never by this checkout route or the success page.
- **Currency/price assumption**: this spec assumes `course.price` is in whole USD dollars, matching how it's currently displayed. If you want a different currency, change the `currency` field and displayed `$` symbols together.
- **Re-checkout on `Pending`**: if a user abandons checkout and clicks Enroll again, the upsert on `{ user, course }` will overwrite the old `stripeSessionId` with the new one — that's correct, the old session is dead anyway.

---

## 5. Verification Checklist

1. `npm run build` and `npm run lint` — zero errors.
2. Using a Stripe test card (`4242 4242 4242 4242`, any future expiry, any CVC, any ZIP):
   - As a logged-in student, click Enroll on a paid course → confirm you land on Stripe's real hosted checkout page showing the correct course title and price.
   - Complete payment → confirm redirect to `/checkout/success` (it's fine if it doesn't yet confirm "Paid" — that's Part 5 — but it shouldn't error).
   - Click the browser back button from Stripe's checkout page (or use Stripe's "back" link) → confirm you land on `/courses/[id]?checkout=cancelled` with the cancellation banner, and you were not charged (check the Stripe dashboard's test payments list).
   - Try enrolling in a free course (`price: 0`, create one via admin if you don't have one) → confirm it skips Stripe entirely.
3. Screenshot: the Enroll button, the real Stripe checkout page, the success page, and the cancelled banner.

## 6. Git & Push

Suggested commits: `feat(payments): stripe client and checkout session route`, `feat(courses): wire real enroll button to checkout`, `feat(checkout): success and cancel pages`. Update `README.md` roadmap row for Part 4 to ⏳ In Progress (flip to ✅ once Part 5's webhook makes the full purchase flow real).

Report back with repo state before Part 5 (Enrollment Engine & Webhook), which is what actually grants access.
