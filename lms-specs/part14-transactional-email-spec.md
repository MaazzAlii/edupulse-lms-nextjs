# LMS Project — Part 14: Transactional Email

**Goal:** Real emails for the two moments that matter most: welcome-on-register and order-confirmation-on-purchase. This part also lays the groundwork Part 15 (password reset) needs.

---

## 1. Prerequisites

Use **Resend** (simple API, generous free tier, first-class Next.js/Vercel support — much less setup than raw SMTP/Nodemailer for this scope):

1. Create a free Resend account, verify a sending domain (or use their shared test domain for development).
2. `npm install resend`
3. Add to `.env.local` / `.env.example`:
   ```
   RESEND_API_KEY=re_...
   EMAIL_FROM=EduPulse <onboarding@resend.dev>
   ```
   (swap `EMAIL_FROM` for your verified domain once you have one)

---

## 2. Backend

### `src/lib/email.ts`
A single `sendEmail({ to, subject, html })` wrapper around the Resend client. Catch and log errors **without throwing** — a failed email should never break the request that triggered it (registration/purchase must still succeed even if the email provider is briefly down). Log clearly enough that you'd notice a persistent failure in the Vercel function logs.

### Email templates
Keep these as plain functions returning an HTML string (no template engine dependency needed at this scale) in `src/lib/emailTemplates.ts`:
- `welcomeEmail(name)` — short, friendly, links to the catalog.
- `orderConfirmationEmail({ name, courseTitle, amount, date })` — looks like a receipt: course name, amount paid, date, a link into the course.

Reuse the existing design tokens' colors in the inline styles (email HTML needs inline styles, not Tailwind classes — external stylesheets don't work reliably in email clients) so it visually matches the app.

### Hook into existing routes
- `POST /api/auth/register` (Part 1): after successful user creation, call `sendEmail` with `welcomeEmail`.
- Part 5's Stripe webhook (`checkout.session.completed`): after marking the Enrollment `Paid`, call `sendEmail` with `orderConfirmationEmail`. This is the "invoice" piece your original roadmap mentioned for Part 4 — it's arriving here instead since it needed this email infrastructure first.

---

## 3. Edge Cases & Gotchas

- **Don't block the response on email sending taking a long time.** `await` it but keep the call itself simple/fast (Resend's API is quick); don't add retry loops here — if it fails, log and move on, don't hold up the checkout webhook response (Stripe expects a fast `200`).
- **Test-mode purchases still send real emails** if your Resend key is live — that's fine and expected during development, just be aware your own inbox will fill up with test order confirmations.

---

## 4. Verification Checklist

1. `npm run build` / `npm run lint` — zero errors.
2. Register a new test account → confirm a welcome email actually arrives (check Resend's dashboard logs if it doesn't show up in the inbox — spam folder is also worth checking during setup).
3. Complete a Stripe test purchase → confirm an order confirmation email arrives with the correct course name and amount.
4. Temporarily break `RESEND_API_KEY` (wrong value) and repeat both flows → confirm registration and purchase still succeed (the app doesn't crash), and the error is visible in your server logs.
5. Screenshot: the welcome email and order confirmation email as received, plus the Resend dashboard's send log.

## 5. Git & Push

Suggested commits: `feat(email): resend client and html templates`, `feat(auth): welcome email on registration`, `feat(webhooks): order confirmation email on paid enrollment`. Update README roadmap.

Report back before Part 15 (Password Reset & Account Security), which depends on this email setup.
