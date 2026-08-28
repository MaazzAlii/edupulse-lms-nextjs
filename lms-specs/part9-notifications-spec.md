# LMS Project — Part 9: Notifications

**Goal:** An in-app notification bell for the admin (new purchase, new question) and a lightweight version for students (admin replied to your question). Ties together Part 5 (purchases), Part 8 (questions), and sets up the cron-cleanup pattern your own `LMS_Step_By_Step_Notes.md` reference material already describes.

---

## 1. Data Model

### New model: `src/models/Notification.ts`
Fields: `recipient` (ObjectId ref `User`, required — the specific user who should see this, not a broadcast), `type` (String enum: `'new_enrollment' | 'new_question' | 'question_reply'`), `message` (String, required), `link` (String, required — an in-app path to navigate to on click, e.g. `/admin/questions` or `/learn/[courseId]/[lessonId]`), `isRead` (Boolean, default false), timestamps.

---

## 2. Backend — Creating Notifications

Don't build a generic pub/sub system — just create a `Notification` document directly at the point each event already happens, since you're editing those routes anyway:

- **Part 5's Stripe webhook** (`checkout.session.completed` handler): after marking an Enrollment `Paid`, create a notification for every admin user (`User.find({ role: 'admin' })`) — `type: 'new_enrollment'`, message including the course title and student name, `link: '/admin' `(or wherever purchase history lives once Part 11 exists).
- **Part 8's `POST /api/lessons/[id]/questions`**: after creating the question, notify every admin — `type: 'new_question'`, `link` pointing to the admin questions queue.
- **Part 8's `POST /api/questions/[id]/replies`**: after creating the reply, notify the original question's `user` (not the admin who just replied) — `type: 'question_reply'`, `link` back to the lesson.

### `GET /api/notifications/route.ts`
Requires auth. Returns the current user's notifications, newest first, plus an `unreadCount`.

### `PUT /api/notifications/[id]/route.ts`
Requires auth, only the recipient can mark their own notification `isRead: true`.

### `PUT /api/notifications/read-all/route.ts`
Marks all of the current user's notifications read in one call — needed so "mark all as read" in the UI doesn't require N requests.

---

## 3. Frontend

### `src/components/NotificationBell.tsx`
A client component added to `Navbar.tsx`, visible only when `isAuthenticated`:
- Bell icon with an unread-count badge.
- Dropdown/panel on click showing recent notifications (message, relative time, read/unread styling), each clickable → navigates to `link` and marks that one read.
- "Mark all as read" action.
- Poll `GET /api/notifications` every ~30 seconds while the tab is open (simplest approach for this scope — no need for WebSockets/SSE here) so the badge updates without a manual refresh.

---

## 4. Cron Cleanup

Next.js on Vercel doesn't run a persistent Node process for `node-cron` the way a traditional Express server would — instead use **Vercel Cron Jobs** (a `vercel.json` config + a protected API route it calls on schedule).

### `vercel.json`
```json
{
  "crons": [
    { "path": "/api/cron/cleanup-notifications", "schedule": "0 0 * * *" }
  ]
}
```

### `src/app/api/cron/cleanup-notifications/route.ts`
- Verify the request is really from Vercel Cron, not a random public hit: check the `Authorization: Bearer ${CRON_SECRET}` header against a `CRON_SECRET` env var you set both in `.env.local` and the Vercel dashboard. Reject with 401 otherwise — this endpoint deletes data, it must not be publicly callable.
- Deletes notifications where `isRead: true` and `createdAt` older than 30 days, mirroring the pattern in your reference notes.
- This only actually runs on a schedule once deployed to Vercel (Part 19) — for local testing, just call the route manually with the right header via curl/Postman.

---

## 5. Verification Checklist

1. `npm run build` / `npm run lint` — zero errors.
2. As a student, purchase a course → confirm the admin's notification bell shows a new unread "new enrollment" notification (log in as admin in a second browser/incognito to check).
3. As a student, ask a question → confirm admin gets notified; admin replies → confirm the student gets notified.
4. Click a notification → confirm it navigates correctly and marks itself read (badge count decreases).
5. "Mark all as read" → confirm badge goes to 0.
6. Manually call `/api/cron/cleanup-notifications` without the auth header → confirm 401. With the correct header (and at least one old, read notification manually backdated in the DB for testing) → confirm it's deleted.
7. Screenshot: the notification bell with unread badge, the dropdown panel, and both notification types.

## 6. Git & Push

Suggested commits: `feat(schema): Notification model`, `feat(api): notification create hooks in webhook and questions routes`, `feat(nav): notification bell component`, `feat(cron): vercel cron notification cleanup`. Update README roadmap.

Report back before Part 10 (Admin User Management) — the last piece required for your task's admin-dashboard acceptance criterion.
