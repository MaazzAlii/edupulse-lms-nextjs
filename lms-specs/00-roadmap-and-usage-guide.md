# EduPulse LMS — Roadmap & How to Use These Specs

This folder is a continuation of your existing `lms-part1-foundation-spec.md`, `lms-part2-catalog-admin-spec.md`, and `lms-part3-lessons-video-spec.md` (all ✅ complete per your README). It adds **Parts 4–20**: everything needed to turn EduPulse from "core LMS" into an advanced, submission-ready product.

## How to use this with Claude Code / Antigravity / any coding agent

1. Feed the agent **one file at a time**, in numeric order. Don't paste all 17 at once — each part assumes the previous one is built, tested, and pushed, exactly like your existing Part 1→2→3 workflow.
2. After each part, run its **Verification Checklist** yourself (or have the agent run `npm run build` / `npm run lint` and report output) before moving to the next file.
3. Each file ends with commit-message suggestions and a note to update `README.md`'s roadmap table. Keep doing that — it's your evidence trail for the mentor review.
4. If the agent starts building things listed under a later part's "Do not build yet," stop it and point it back at the current file's scope. This is the same discipline your Part 3 spec used and it's what kept the codebase clean.
5. If an agent (or you) gets stuck mid-part, use the task tracker's "Log a roadblock" / "Request more time" — don't silently skip verification steps, that's how Part 1 ended up needing a cleanup pass.

## Priority tiers against your due date

Your task card's acceptance criteria are only four things: course CRUD (✅ done), video upload/streaming (✅ done), **payment integration for course purchase**, and an **admin dashboard with user and course management** (course side ✅ done, user side missing). Everything else here is genuinely valuable but is *advanced/portfolio* scope, not required to pass the task.

Given a due date this close, build in this order and stop at whichever tier your remaining time allows:

**P0 — required to meet the stated acceptance criteria**
- Part 4: Stripe Checkout & Payment Sessions
- Part 5: Enrollment Engine, Webhook & Purchase Guard
- Part 10: Admin User Management

**P1 — makes it a genuinely complete LMS, do these next if time allows**
- Part 6: Progress Tracking & Certificates
- Part 11: Admin Analytics Dashboard
- Part 13: Student Dashboard ("My Learning")
- Part 19: Deployment to Vercel
- Part 20: Final QA & Submission Packaging

**P2 — advanced/stretch, do only if P0+P1 are done with time to spare**
- Part 7: Reviews & Ratings
- Part 8: Q&A / Discussions
- Part 9: Notifications
- Part 12: Search, Filters & Wishlist
- Part 14: Transactional Email
- Part 15: Password Reset & Account Security
- Part 16: Automated Testing (Playwright)
- Part 17: SEO, Performance & Accessibility
- Part 18: Security Hardening

## Full roadmap table (paste into README.md, replacing the current one)

| Part | Phase | Status | Key Deliverables |
| :--- | :--- | :---: | :--- |
| 1 | Foundation & Auth Engine | ✅ Completed | Next.js 15 setup, 5 Mongoose schemas, JWT cookie auth, protected dashboard |
| 2 | Course Catalog & Admin CRUD | ✅ Completed | Public catalog, filter/search, course detail, category & course admin studio |
| 3 | Lessons & Video Streaming | ✅ Completed | Vercel Blob video upload, admin curriculum studio, gated player, HTTP streaming |
| 4 | Payments & Checkout | ⏳ Upcoming | Stripe Checkout Sessions, success/cancel pages, webhook skeleton |
| 5 | Enrollment Engine | ⏳ Upcoming | Webhook completes purchase, purchase guard on lessons, "My Courses" |
| 6 | Progress & Certificates | ⏳ Upcoming | Lesson completion tracking, progress bar, printable certificate |
| 7 | Reviews & Ratings | ⏳ Upcoming | Star ratings, average rating, admin reply |
| 8 | Q&A / Discussions | ⏳ Upcoming | Per-lesson questions, threaded replies |
| 9 | Notifications | ⏳ Upcoming | In-app notification center, cron cleanup |
| 10 | Admin User Management | ⏳ Upcoming | Search/paginate users, role promote/demote, suspend |
| 11 | Admin Analytics | ⏳ Upcoming | Revenue/enrollment/signup charts, top courses |
| 12 | Search, Filters & Wishlist | ⏳ Upcoming | Sort/paginate catalog, wishlist |
| 13 | Student Dashboard | ⏳ Upcoming | My Learning overview, purchase history, certificates list |
| 14 | Transactional Email | ⏳ Upcoming | Order confirmation, welcome email |
| 15 | Password Reset & Security | ⏳ Upcoming | Forgot/reset password flow |
| 16 | Automated Testing | ⏳ Upcoming | Playwright e2e suite |
| 17 | SEO, Performance & A11y | ⏳ Upcoming | Metadata, sitemap, Lighthouse pass |
| 18 | Security Hardening | ⏳ Upcoming | Input validation, rate limiting, headers, secret rotation |
| 19 | Deployment | ⏳ Upcoming | Vercel prod deploy, live Stripe webhook |
| 20 | Final QA & Submission | ⏳ Upcoming | Regression checklist, README polish, submission packaging |

## One thing to fix before Part 4

Your `full_project_dump.md` contains a real MongoDB Atlas username/password in `.env.local` (`maaz:MaazAli@cluster0...`). `.gitignore` correctly excludes `.env*.local` from git, so this is likely fine in your actual repo — but since it now exists in plain text in this dump file, rotate that database password in Atlas before going further, just in case this dump is ever shared or uploaded anywhere public.
