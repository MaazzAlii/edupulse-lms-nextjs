# LMS Project — Part 6: Progress Tracking & Certificates

**Goal:** Let enrolled students mark lessons complete, see a progress bar, and get a printable certificate at 100%. The `completedLessons` array already exists on the `Enrollment` schema (built in Part 1, unused until now) — this part wires it up.

**Do not build yet:** reviews, Q&A, notifications.

---

## 1. Backend — Progress API

### `PUT /api/enrollments/[id]/progress/route.ts`
- Requires auth. Load the Enrollment by `id`, 404 if not found, 403 if `enrollment.user` doesn't match the requester (a student can only update their own progress).
- Body: `{ lessonId, completed: boolean }`.
- Validate `lessonId` actually belongs to `enrollment.course` (look up the Lesson, compare `lesson.course` to `enrollment.course`) — reject with 400 otherwise, don't let a student mark a lesson from an unrelated course as complete.
- `completed: true` → `$addToSet` the lessonId into `completedLessons` (avoids duplicates). `completed: false` → `$pull` it out (support un-marking, useful for review).
- Return the updated enrollment with a computed `progressPercent` (see below).

### Shared progress calculation
Add a small helper (e.g. in `src/lib/enrollmentGuard.ts` alongside `hasPaidAccess`, or a new `src/lib/progress.ts`): `computeProgress(enrollment, totalLessonCount)` → `Math.round(completedLessons.length / totalLessonCount * 100)`. Reuse it wherever progress is displayed (learn page, my-courses, later the student dashboard in Part 13) so the math is never duplicated.

---

## 2. Frontend — Learn Page

### `src/app/learn/[courseId]/[lessonId]/page.tsx` (update)
- For unlocked (owned or preview) lessons, show a "Mark as complete" / "Completed ✓" toggle button that calls the progress endpoint and updates local state optimistically.
- Add a slim progress bar in the course sidebar (visible only to enrolled students, not to preview-only visitors): `X of Y lessons complete (Z%)`.
- When progress reaches 100%, show a small inline banner: "Course complete! 🎉 View your certificate" linking to the certificate page (below).

### `src/app/my-courses/page.tsx` (update)
Add a progress bar to each enrolled course card, and show a "Get Certificate" button on cards at 100%.

---

## 3. Certificates

Keep this deliberately simple rather than adding a PDF-generation dependency: a clean, print-friendly HTML page that the student saves as PDF via the browser's native "Print → Save as PDF."

### `src/app/certificate/[courseId]/page.tsx`
- Protected route. Load the enrollment for `(currentUser, courseId)`. If not `Paid` or `progressPercent < 100`, redirect back to `/learn/[courseId]/...` rather than showing a broken/empty certificate.
- Render a full-bleed, landscape-oriented certificate design using the existing design tokens (primary plum + gold accent already in `globals.css` — gold especially fits a certificate): student name, course title, instructor name, completion date (`enrollment.updatedAt` at the moment it hit 100% — see note below), and a decorative border.
- A "Print / Save as PDF" button that calls `window.print()`. Add a `@media print` CSS block that hides the navbar/button and makes the certificate fill the page.

**Completion date note**: the Enrollment schema doesn't currently have a dedicated `completedAt` field. Add one (`completedAt: { type: Date, default: null }`) and set it the first time `progressPercent` hits 100 inside the progress route — this is a small, additive schema change, not a breaking one.

---

## 4. Edge Cases & Gotchas

- **Lesson count can change after enrollment.** If an admin adds a new lesson to a course a student already completed, their `completedLessons.length / totalLessonCount` will drop below 100% and their certificate route will redirect them away. This is correct behavior (the course genuinely has new content they haven't seen) — don't try to "grandfather" old completions, just make sure the UI messaging ("1 new lesson added since you completed this course") doesn't feel like a bug. A simple version: just show the recalculated percentage; a polished message is a nice-to-have, not required.
- **Un-enrolled or unpaid users hitting `/certificate/[courseId]` directly** must be redirected, never shown a blank/broken certificate — this is a common "forgot the guard" bug.

---

## 5. Verification Checklist

1. `npm run build` / `npm run lint` — zero errors.
2. As an enrolled student with a 3-lesson course:
   - Mark lesson 1 complete → confirm the progress bar updates to ~33% without a full page reload.
   - Un-mark it → confirm it drops back to 0%.
   - Mark all 3 complete → confirm the "Course complete" banner appears and `/certificate/[courseId]` now works, showing your real name and the real course title/instructor.
   - Click Print/Save as PDF → confirm the printed layout hides the navbar and looks like an actual certificate, not a webpage screenshot.
   - Try visiting `/certificate/[courseId]` for a course you're NOT enrolled in → confirm you're redirected, not shown a broken page.
3. Screenshot: the progress bar mid-course, the 100% completion banner, and the certificate page (both screen and print-preview).

## 6. Git & Push

Suggested commits: `feat(schema): add completedAt to Enrollment`, `feat(api): lesson progress tracking route`, `feat(learn): progress bar and mark-complete toggle`, `feat(certificate): printable completion certificate page`. Update README roadmap.

Report back before Part 7 (Reviews & Ratings).
