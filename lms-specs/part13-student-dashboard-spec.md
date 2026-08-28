# LMS Project — Part 13: Student Dashboard ("My Learning")

**Goal:** Upgrade the placeholder `/dashboard` from Part 1 (which just proves the session works) into a real student home base that ties together enrollments (Part 5), progress (Part 6), and purchase history — the single page a returning student actually wants to land on.

---

## 1. Backend

No new models. This part is mostly composing data you already expose:

### `GET /api/dashboard/summary/route.ts`
A single endpoint that returns everything the dashboard needs in one request (avoids the page firing 4+ separate fetches on load):
- `enrollments`: the user's `Paid` enrollments, each with course title/thumbnail, `progressPercent` (reuse `computeProgress` from Part 6), and `completedAt` if finished.
- `inProgressCount`, `completedCount` — simple derived counts from the above.
- `recentActivity`: optionally, the most recently updated enrollment (by `updatedAt`) as a "Continue learning" shortcut target.
- `purchaseHistory`: `{ course title, amount, enrolledAt }` for every enrollment regardless of status, newest first — this is the receipts/history view.

---

## 2. Frontend

### `src/app/dashboard/page.tsx` (replace Part 1's placeholder content, keep the auth-guard pattern)
- Header: welcome message with the student's name, `inProgressCount`/`completedCount` summary stats.
- "Continue Learning" card: the most recent in-progress course with its progress bar and a direct link into the next incomplete lesson (find the first lesson in course order NOT in `completedLessons` — small helper function).
- Grid of all enrolled courses with progress bars (this can now simply reuse or link to `/my-courses` from Part 5 rather than duplicating that grid — decide one canonical "all my courses" view and have the other link to it, don't build two competing course-grid UIs).
- Purchase history table: course, amount paid, date, with a "Certificate" link for 100%-complete courses (Part 6).

### `src/components/Navbar.tsx` (update)
Since `/dashboard` is now the real student home, make sure the "My Learning"/"Dashboard" nav link (from Part 1) points here clearly, and that it's distinguished from "My Courses" (Part 5) if you kept both — simplest fix is to consolidate: make `/dashboard` the one landing page, and either remove the separate `/my-courses` route or make it redirect to `/dashboard`. Pick one and be consistent rather than leaving two half-overlapping pages.

---

## 3. Edge Cases & Gotchas

- **A brand-new student with zero enrollments** should see an inviting empty state ("Browse courses to get started" linking to the catalog), not an empty grid with no explanation.
- **"Continue learning" with no in-progress course** (either zero enrollments, or all courses either 0% or 100% complete) should gracefully omit that card rather than showing a broken/undefined link.

---

## 4. Verification Checklist

1. `npm run build` / `npm run lint` — zero errors.
2. New account with no purchases → confirm the empty state, not a blank/broken dashboard.
3. Account with one in-progress and one completed course → confirm "Continue Learning" points at the in-progress one's next incomplete lesson, and the completed one shows a certificate link.
4. Confirm purchase history shows correct amounts and dates matching what you actually paid in Stripe test mode.
5. Screenshot: empty-state dashboard, populated dashboard with continue-learning card, and purchase history table.

## 5. Git & Push

Suggested commit: `feat(dashboard): unified student home with continue-learning, progress, and purchase history`. Update README roadmap.

Report back before Part 14 (Transactional Email).
