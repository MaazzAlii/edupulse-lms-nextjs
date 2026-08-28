# LMS Project — Part 8: Q&A / Discussions

**Goal:** Under each lesson's video player, enrolled students can ask a question; the admin (or any admin, since this app has one instructor role) can reply. This is distinct from Part 7's reviews — reviews are one-per-course course-level feedback, Q&A is many-per-lesson discussion.

**Do not build yet:** notifications (Part 9 wires up "notify admin on new question" using the model built here).

---

## 1. Data Model

### New model: `src/models/Question.ts`
Fields: `lesson` (ObjectId ref `Lesson`, required), `course` (ObjectId ref `Course`, required — denormalized for cheap "all questions for this course" admin queries without populating through lesson), `user` (ObjectId ref `User`, required), `question` (String, required, trim), `replies` (array of subdocuments: `{ user: ObjectId ref User, text: String, createdAt: Date }`), timestamps. No unique index — a student can ask multiple questions per lesson.

---

## 2. Backend — Question API

### `POST /api/lessons/[id]/questions/route.ts`
- Requires auth. Requires `hasPaidAccess` for the lesson's course, OR the lesson `isPreview: true` (preview visitors should be able to ask "is this course right for me" style questions too — admin's call, but this is the more inviting default). Reject with 403 otherwise.
- Body: `{ question }` (non-empty, trim).
- Create, return the new question.

### `GET /api/lessons/[id]/questions/route.ts`
- Public read is fine (matches the "preview visitors can ask" openness above) but non-preview lesson questions should only be visible to admins and enrolled users of that course — reuse the same access check as the POST route for GET too.
- Returns questions for the lesson, newest first, each with `user.name` populated (not email) and replies populated with `user.name`.

### `POST /api/questions/[id]/replies/route.ts`
- Admin only for now (single-instructor app) — 403 for students, even the original asker. If you want students to reply to their own thread later, that's an easy extension but explicitly out of scope here to keep this part small.
- Body: `{ text }`. Pushes a reply subdocument with the admin's id and current timestamp.

### `DELETE /api/questions/[id]/route.ts`
- Author or admin only — lets a student delete their own question, or admin moderate.

---

## 3. Frontend

### `src/app/learn/[courseId]/[lessonId]/page.tsx` (update)
Below the video player (and progress toggle from Part 6), add a Q&A panel:
- List of existing questions for this lesson with their replies threaded underneath, most recent question first.
- A form to ask a new question (only shown if the access check passes — reuse the same `hasPaidAccess` check already computed for gating the video itself).
- Each question shows the asker's name and a relative timestamp ("2 days ago" — a tiny helper function, no need for a date library dependency for this alone).

### Admin reply surface
Add a lightweight "Questions" tab/section to `src/app/admin/courses/[id]/lessons/page.tsx` (or a new `src/app/admin/questions/page.tsx` listing ALL unanswered questions across every course, so the admin has one place to catch up — this second option scales better once there are multiple courses, and doubles as a natural preview of the "notifications" concept in Part 9). Recommend building the cross-course version since it's more useful and not meaningfully more work.

---

## 4. Edge Cases & Gotchas

- **XSS**: question/reply text is rendered back to other users — render it as plain text (React does this safely by default as long as you don't use `dangerouslySetInnerHTML`). Don't add any markdown/HTML rendering for this feature; it's not worth the sanitization surface for a student Q&A box.
- **Empty replies array** should render as "No replies yet" not an empty gap, so admin follow-up feels like an actionable queue rather than a UI glitch.

---

## 5. Verification Checklist

1. `npm run build` / `npm run lint` — zero errors.
2. As an enrolled student, ask a question on an unlocked lesson → confirm it appears immediately.
3. As admin, find that question in the admin Questions view, reply → confirm the reply appears threaded under the question on the lesson page.
4. As a different, non-enrolled student, attempt to view/ask on a locked lesson's Q&A → confirm it's blocked (or shows the "enroll to ask" message, matching whatever your final POST/GET rule ends up being).
5. Delete your own question as its author → confirm it's removed; confirm a student cannot delete someone else's question.
6. Screenshot: the Q&A panel with a question and admin reply, the ask form, and the admin cross-course Questions queue.

## 6. Git & Push

Suggested commits: `feat(schema): Question model`, `feat(api): lesson question and reply routes`, `feat(learn): Q&A panel under lesson player`, `feat(admin): cross-course questions queue`. Update README roadmap.

Report back before Part 9 (Notifications).
