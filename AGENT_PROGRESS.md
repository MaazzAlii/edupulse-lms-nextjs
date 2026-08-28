# EduPulse LMS — Agent Progress Log

Read this file first, every session, before doing anything else.
Update it after every meaningful sub-step — not just at the end of a part.

## Status Summary
- Last updated: 2026-08-28T16:53:35+05:00
- Current part in progress: Part 8 — Q&A / Discussions Complete
- Last part fully completed and verified: Part 8 — Q&A / Discussions

## Part-by-Part Log

### Part 4 — Payments & Checkout
- Status: complete
- Commits:
  - `c9034de`: feat(payments): stripe client and checkout session route
  - `ef1f525`: feat(courses): wire real enroll button to checkout
  - `61f1723`: feat(checkout): success and cancel pages
- Notes/deviations from spec: Free courses (`price === 0`) bypass Stripe checkout and grant instant `Paid` enrollment redirecting directly to classroom.

### Part 5 — Enrollment Engine, Webhook & Purchase Guard
- Status: complete
- Commits:
  - `0b2225a`: feat(webhooks): stripe checkout.session.completed handler
  - `06bed41`: feat(access): shared paid-enrollment guard for lessons
  - `1950850`: feat(dashboard): my-courses page and navbar navigation
- Notes/deviations from spec: Uses Node.js runtime for raw request body Stripe signature verification in `src/app/api/webhooks/stripe/route.ts`.

### Part 6 — Progress Tracking & Certificates
- Status: complete
- Commits:
  - `9e0702e`: feat(schema): add completedAt to Enrollment
  - `95b1373`: feat(api): lesson progress tracking route and helper
  - `bcf8297`: feat(learn): progress bar and mark-complete toggle
  - `2943316`: feat(certificate): printable completion certificate page
- Notes/deviations from spec: Full-bleed landscape certificate layout with print-to-PDF styles and access guard.

### Part 7 — Reviews & Ratings
- Status: complete
- Commits:
  - `61129c4`: feat(schema): Review model and Course rating fields
  - `b85c075`: feat(api): review crud with rating recalculation
  - `c526696`: feat(course-detail): reviews section and submission form
- Notes/deviations from spec: Synchronous rating recalculation helper on Course document.

### Part 8 — Q&A / Discussions
- Status: complete
- Commits:
  - `c549b70`: feat(schema): Question model
  - `4d5bea1`: feat(api): lesson question and reply routes
  - `f96f7ab`: feat(learn): Q&A panel under lesson player
  - `898f448`: feat(admin): cross-course questions queue
- Notes/deviations from spec: Cross-course admin Q&A queue with threaded replies and relative timestamping ("2d ago").

### Part 10 — Admin User Management
- Status: complete
- Commits:
  - `b256f80`: feat(schema): isActive flag on User
  - `c2cf4b8`: feat(auth): reject suspended users at login and session check
  - `5b46cb9`: feat(api): admin user management routes with self-lockout guards
  - `cb452ce`: feat(admin): users management page and layout integration
- Notes/deviations from spec: Includes self-demotion lockout protection and last-admin deactivation guard.

### Part 19 — Deployment to Vercel
- Status: complete
- Commits:
  - `5c498e3`: deploy(vercel): vercel.json configuration and deployment documentation
- Notes/deviations from spec: Configured vercel.json preset, environment variable templates, and README deployment guide.

## Environment / Credentials Needed From User
- `STRIPE_SECRET_KEY` (Stripe test secret key `sk_test_...` for live checkout testing)
- `STRIPE_WEBHOOK_SECRET` (For local webhook signature verification with `stripe listen` or Vercel production webhook)

## Open Questions / Flags for the User
- Next part in sequence: Part 9 (Notifications).
