# LMS Project — Part 7: Reviews & Ratings

**Goal:** Enrolled (paid) students can leave a 1–5 star rating and written review on a course; every visitor sees the average rating and review count on the catalog and course detail page; admins can post one reply per review.

**Do not build yet:** Q&A (that's per-lesson questions, a different feature — Part 8), notifications.

---

## 1. Data Model

### New model: `src/models/Review.ts`
Fields: `course` (ObjectId ref `Course`, required), `user` (ObjectId ref `User`, required), `rating` (Number, required, min 1, max 5), `comment` (String, required, trim), `adminReply` (String, default `""`), timestamps. **Unique compound index** on `{ course: 1, user: 1 }` — one review per student per course, matching the `Enrollment` pattern from Part 1.

### `src/models/Course.ts` (update)
Add two denormalized fields for fast catalog rendering without a join on every list request: `averageRating` (Number, default 0), `numReviews` (Number, default 0). These get recalculated whenever a review is created, updated, or deleted — never trust a client-supplied value for these.

### Shared recalculation helper
`src/lib/reviewStats.ts` exporting `recalculateCourseRating(courseId)`: runs a Mongo aggregation (`$match` by course, `$group` avg rating + count) over `Review`, then `Course.findByIdAndUpdate` with the results. Call this at the end of every review create/update/delete route.

---

## 2. Backend — Review API

### `POST /api/courses/[id]/reviews/route.ts`
- Requires auth.
- **Requires paid enrollment** — reuse `hasPaidAccess(userId, courseId)` from Part 5. 403 with a clear message ("Enroll in this course to leave a review") if not enrolled.
- Reject duplicates (400, "You've already reviewed this course") — catch the unique-index error or check first.
- Body: `{ rating, comment }`. Validate rating is an integer 1–5.
- Create the review, call `recalculateCourseRating`, return the new review.

### `GET /api/courses/[id]/reviews/route.ts`
- Public. Returns all reviews for the course, newest first, each populated with the reviewing user's `name` (never their email or other fields).

### `PUT /api/reviews/[id]/route.ts`
- Two distinct behaviors gated by role:
  - The review's own author can update `rating`/`comment` (their own review only — 403 otherwise).
  - An admin can update `adminReply` only (not the student's rating/comment).
- Recalculate rating stats after any rating change.

### `DELETE /api/reviews/[id]/route.ts`
- Author or admin only. Recalculate stats after deletion.

---

## 3. Frontend

### `src/app/courses/[id]/page.tsx` (update)
- Show average rating (stars) and review count near the title, matching the level/category badge styling already established.
- A reviews section below the curriculum: list of reviews (reviewer name, stars, comment, admin reply if present), and — only if the current user `hasPaidAccess` and hasn't already reviewed — an inline form to submit one.
- If the user already reviewed, show their existing review with an "Edit" option instead of the form.

### Catalog cards (`src/app/page.tsx`)
Add a small star + count under the price on each course card, using the new `averageRating`/`numReviews` fields (no extra API calls needed — they're already on the course list response).

### `src/app/admin/courses/[id]/lessons/page.tsx` or a new `src/app/admin/courses/[id]/reviews/page.tsx`
Simple admin view listing a course's reviews with a reply textarea per review (reuses `PUT /api/reviews/[id]` with just `adminReply`).

---

## 4. Edge Cases & Gotchas

- **Recalculation must happen inside the route handler, synchronously, before responding** — not as a "background job" — otherwise the catalog can show stale ratings for a noticeable window with no easy way to force-refresh in this simple architecture.
- **A course with zero reviews** should show "No reviews yet" rather than "0.0 ★ (0)" — check `numReviews === 0` explicitly in the UI.
- **Un-enrolling isn't a feature in this app**, so there's no need to handle "review from someone who was refunded" — out of scope.

---

## 5. Verification Checklist

1. `npm run build` / `npm run lint` — zero errors.
2. As a non-enrolled user, confirm the review form is hidden/replaced with an "enroll to review" message.
3. As an enrolled student: submit a review → confirm it appears immediately, and the course card on the catalog now shows the updated average.
4. Try submitting a second review for the same course → confirm a clear rejection, not a duplicate.
5. As admin: post a reply to a review → confirm it displays under the student's comment, and a student cannot edit the `adminReply` field themselves.
6. Delete a review as admin → confirm the average rating recalculates correctly (test with at least 2 reviews so the average visibly changes).
7. Screenshot: catalog card with stars, course detail reviews section, the review form, and an admin reply.

## 6. Git & Push

Suggested commits: `feat(schema): Review model and Course rating fields`, `feat(api): review crud with rating recalculation`, `feat(course-detail): reviews section and submission form`, `feat(admin): review reply interface`. Update README roadmap.

Report back before Part 8 (Q&A / Discussions).
