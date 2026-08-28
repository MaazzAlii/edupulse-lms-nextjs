# LMS Project — Part 15: Password Reset & Account Security

**Goal:** A real "forgot password" flow using the email infrastructure from Part 14. Currently there's no recovery path if a student forgets their password — this closes that gap.

---

## 1. Data Model

### `src/models/User.ts` (update)
Add `resetPasswordToken` (String, default `undefined`, never returned by default queries — treat like `password`) and `resetPasswordExpire` (Date, default `undefined`).

---

## 2. Backend

### `POST /api/auth/forgot-password/route.ts`
- Body: `{ email }`.
- Look up the user. **Always return the same success response whether or not the email exists** ("If an account exists for that email, a reset link has been sent") — never reveal whether an email is registered, that's an account-enumeration leak.
- If the user exists: generate a random token (`crypto.randomBytes(32).toString('hex')`), store its **hash** (`crypto.createHash('sha256').update(token).digest('hex')`) in `resetPasswordToken` (never store the raw token — same principle as password hashing), set `resetPasswordExpire` to 15 minutes from now, save.
- Email the **raw** token as a link: `${NEXT_PUBLIC_APP_URL}/reset-password/${rawToken}`, via `sendEmail` from Part 14.

### `POST /api/auth/reset-password/[token]/route.ts`
- Hash the incoming `token` param the same way, look up `User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpire: { $gt: Date.now() } })`. If none found: 400, "This reset link is invalid or has expired."
- Body: `{ password }` (min 6 chars, same rule as registration).
- Set the new password (the schema's `pre('save')` hook already hashes it), clear `resetPasswordToken`/`resetPasswordExpire`, save.
- Sign a fresh JWT and set the auth cookie, same as login — log the user straight in after a successful reset rather than making them log in again separately.

---

## 3. Frontend

### `src/app/forgot-password/page.tsx`
Simple email-input form, calls the forgot-password route, shows the same generic success message regardless of outcome.

### `src/app/reset-password/[token]/page.tsx`
New-password form (with confirm-password field, client-side match check), calls the reset route, redirects to `/dashboard` on success (since the route logs them in). Show a clear "link expired, request a new one" state if the API returns the expiry error, with a link back to `/forgot-password`.

### `src/app/login/page.tsx` (update)
Add a "Forgot password?" link.

---

## 4. Edge Cases & Gotchas

- **Never store the raw reset token** anywhere (DB or logs) — only its hash, exactly like the password itself. The raw token only ever exists in the emailed link and briefly in memory while processing the reset request.
- **15-minute expiry is intentionally short** — this is a security control, don't extend it "for convenience" without thinking about the tradeoff.
- **Account enumeration**: double-check the forgot-password route genuinely takes the same code path (same response, same-ish timing) whether the email exists or not — an easy mistake is to `return` early with a different message when the user isn't found.

---

## 5. Verification Checklist

1. `npm run build` / `npm run lint` — zero errors.
2. Request a reset for a real registered email → confirm the email arrives with a working link, and the generic "if an account exists" message shows regardless.
3. Request a reset for a made-up email → confirm the same generic message (no error, no "email not found").
4. Use the reset link, set a new password → confirm you're logged in immediately and can log in again later with the new password (and NOT the old one).
5. Try reusing the same reset link a second time → confirm it's rejected (token was cleared after use).
6. Wait past 15 minutes (or manually backdate `resetPasswordExpire` in the DB for a faster test) → confirm an expired link is rejected with a clear message.
7. Screenshot: forgot-password form, the reset email, the reset-password form, and the expired-link message.

## 6. Git & Push

Suggested commits: `feat(schema): reset token fields on User`, `feat(api): forgot-password and reset-password routes`, `feat(auth): forgot/reset password pages`. Update README roadmap.

Report back before Part 16 (Automated Testing).
