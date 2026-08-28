# LMS Project — Part 3: Lessons & Video

**Builds on Parts 1 and 2.** Do not modify anything in `src/models/`, `src/lib/db.ts`, `src/lib/auth.ts`, `src/lib/jwt.ts`, `src/lib/response.ts`, `src/lib/adminGuard.ts`, `AuthContext.tsx`, or any `/api/auth/*` or `/api/categories/*` route — they're done and verified. This part adds lesson CRUD (nested under courses) and real video upload/streaming via Vercel Blob.

---

## 1. Scope for this part

- Admin-only CRUD for **Lessons**, scoped to a specific course
- Real video file upload (not a URL paste field) via Vercel Blob, from the admin lesson form
- A course "curriculum" view on the public course detail page, replacing the Part 2 "Lessons coming in Part 3" placeholder
- A basic lesson video player page — **but gated**: only the first lesson marked `isPreview: true` should actually be watchable by non-enrolled visitors; everything else should show a locked state with "Enroll to unlock" (since enrollment/payment isn't built until Part 4, this locked state is honest UI, not a broken promise)

**Do not build yet:** enrollment, payment, progress tracking (`completedLessons` on the Enrollment model exists in the schema but isn't wired to anything until Part 4), admin analytics, user management.

---

## 2. Vercel Blob Setup (do this first, before writing code)

1. In the Vercel dashboard, open this project → **Storage** tab → **Create Database** → **Blob**. Free tier is enough.
2. Vercel auto-generates `BLOB_READ_WRITE_TOKEN` and offers to add it to your project's environment variables — accept that.
3. For **local development**, pull that same env var down: `vercel env pull .env.local` (requires the Vercel CLI logged into this project — `npx vercel login` then `npx vercel link` if not already linked). Alternatively, copy the token value from the Vercel dashboard's Environment Variables page directly into `.env.local` by hand.
4. Add `BLOB_READ_WRITE_TOKEN=` to `.env.example` (no real value, just the key name) so the pattern is documented.

If this token isn't available, video upload cannot be tested locally — flag that clearly rather than silently skipping the verification step.

---

## 3. Video Upload Utility

`src/lib/videoUpload.ts`:

```typescript
export class VideoUploadError extends Error {
  statusCode: number;
}

export async function uploadVideo(file: File): Promise<{ url: string; size: number }>
```

- Validate `file.type` is one of `video/mp4`, `video/webm`, `video/quicktime` — reject anything else with a clear message.
- Validate `file.size` ≤ 200MB — reject oversized files with a message stating the actual size.
- If `BLOB_READ_WRITE_TOKEN` isn't set, throw a clear `VideoUploadError` with statusCode 500 explaining Blob storage isn't configured (don't let this fail with a cryptic "undefined" error).
- Use `put()` from `@vercel/blob` with `access: 'public'` and `addRandomSuffix: true`, filename prefixed `lessons/${Date.now()}-${sanitized original name}`.
- Return the resulting public URL.

**Why this matters for "streaming"**: Vercel Blob URLs support HTTP range requests, which is what lets a plain `<video>` tag seek/scrub without downloading the whole file first — that's the actual streaming behavior, not something we need to build ourselves.

---

## 4. Lesson API Routes

`src/app/api/courses/[id]/lessons/route.ts`:
- `GET` — public, returns all lessons for this course, sorted by `order`. **Do not include `videoUrl` in the response for lessons where `isPreview: false`** unless the requester is an admin — non-enrolled visitors should see the lesson title/order/duration in the curriculum list, but not get a working video URL for locked lessons. (Enrollment-based unlocking comes in Part 4; for now, "preview lessons only" is the unlock rule.)
- `POST` — admin only. Expects `multipart/form-data` with fields: `title`, `order`, `isPreview`, and a `video` file field. Calls `uploadVideo()`, then creates the Lesson document with the resulting `videoUrl`. Validate the `course` param references a real, existing course (404 if not).

`src/app/api/lessons/[id]/route.ts`:
- `PUT` — admin only. Supports updating `title`, `order`, `isPreview` via JSON body (no video re-upload in this route — see below).
- `DELETE` — admin only. Deletes the lesson document. (Leave the actual video file in Blob storage — deleting blobs is an optional nice-to-have, not required; don't spend time on it unless the rest of this part is done early.)

`src/app/api/lessons/[id]/video/route.ts`:
- `PUT` — admin only, separate endpoint specifically for replacing a lesson's video (multipart form with just a `video` field). Keeps the "replace video" action distinct from "edit metadata" so the admin UI can offer them as separate, clear actions.

**Route ordering reminder**: `src/app/api/courses/[id]/lessons/route.ts` and `src/app/api/lessons/[id]/route.ts` are different path shapes (`courses/[id]/lessons` vs `lessons/[id]`), so there's no collision risk here — just keep this pattern in mind for anything added later.

---

## 5. Frontend — Admin Lesson Management

### `src/app/admin/courses/[id]/lessons/page.tsx`

A dedicated page (linked from the admin courses table — add a "Manage Lessons" button/link per course row in `src/app/admin/courses/page.tsx`) for one course's curriculum:

- List of existing lessons in order, showing title, order, duration (if known), preview badge, and a working `<video controls>` preview player for each (using the real `videoUrl`).
- A form to add a new lesson: title, order (number), preview checkbox, and a native `<input type="file" accept="video/mp4,video/webm,video/quicktime">`.
- Show real upload progress feedback (at minimum a "Uploading…" state while the request is in flight — full percentage progress is a nice-to-have, not required, since the underlying `fetch`/`put()` call doesn't expose granular progress without extra plumbing).
- Edit (title/order/preview toggle) and delete actions per lesson.
- A "Replace video" action per lesson, separate from metadata edit.

---

## 6. Frontend — Public Curriculum & Player

### `src/app/courses/[id]/page.tsx` (update from Part 2)

Replace the "Lessons coming in Part 3" placeholder with a real curriculum list: lesson titles in order, with a lock icon on non-preview lessons and a play icon on preview lessons. Clicking a preview lesson navigates to the player; clicking a locked lesson does nothing (or shows a small "Enroll to unlock" tooltip — still don't build a working enroll flow yet).

### `src/app/learn/[courseId]/[lessonId]/page.tsx`

A basic lesson player page:
- If the lesson is a preview lesson (or the requester is an admin), show a real `<video controls className="w-full">` with the lesson's `videoUrl`, playable and scrubbable.
- If the lesson is NOT a preview lesson and the requester isn't an admin, show a locked state: no video element at all (don't render a `<video>` tag with an empty/placeholder src — that's confusing UI), just a clear message "This lesson unlocks after enrollment (Part 4)" with a disabled-looking placeholder box.
- Simple prev/next lesson navigation within the same course's lesson list, respecting the same lock rule on next/prev targets.

---

## 7. Verification Checklist

1. `npm run build` — zero errors. Confirm new routes appear: `/courses/[id]/lessons`, `/admin/courses/[id]/lessons`, `/learn/[courseId]/[lessonId]`, and the new lesson API routes.
2. `npm run lint` — zero errors.
3. Manual test against real MongoDB + real Vercel Blob (screenshot each step):
   - As admin, open a published course's "Manage Lessons" page.
   - Upload a real short video file (a few seconds, doesn't need to be long) as Lesson 1, mark it `isPreview: true`.
   - Upload a second video as Lesson 2, leave `isPreview: false`.
   - Confirm both appear in the admin lesson list with working inline preview players.
   - Log out (or incognito), visit the course's public detail page — confirm the curriculum shows both lesson titles, with Lesson 1 unlocked/playable and Lesson 2 showing a lock state.
   - Click into Lesson 1's player page — confirm the video actually plays and you can scrub/seek within it (proving streaming, not just playback of a fully-loaded blob).
   - Try navigating directly to Lesson 2's player URL while logged out — confirm you see the locked state, not the video.
   - As admin, confirm you CAN view Lesson 2's video (admins bypass the lock).
   - Try uploading a non-video file (e.g. a `.txt` renamed to `.mp4`, or just try a `.pdf`) — confirm you get a clear validation error, not a crash or a silently broken lesson.
4. Screenshot: admin lesson upload form, admin lesson list with preview players, public curriculum showing locked/unlocked states, the playing video with visible scrub bar, and the locked-lesson message.

## 8. Git & Push

Same repo, same pattern. Suggested commits: `feat(video): Vercel Blob upload utility`, `feat(api): lesson CRUD and video upload routes`, `feat(admin): lesson management UI with video upload`, `feat(learn): public curriculum and gated video player`. Update `README.md` with a "Part 3: Lessons & Video" section and new screenshots.

Report back with the repo state once done and I'll verify directly before writing Part 4 (Payments & Enrollment).
