# LMS Project — Part 10: Admin User Management

**Goal:** The last piece your task card's acceptance criteria explicitly calls for: an admin dashboard section for **user** management (course management already exists from Part 2). Admin can search/browse all users, see their enrollment activity, promote/demote role, and suspend an account.

**Priority note:** this is P0 — do it before the more advanced Parts 6–9 if you're tight on time, since it's one of the four things your task card literally lists as acceptance criteria.

---

## 1. Data Model

### `src/models/User.ts` (update)
Add `isActive` (Boolean, default `true`). A suspended account has `isActive: false`.

### Auth changes
- `src/lib/auth.ts` — both `getAuthUserFromRequest` and `getServerUser` should treat `isActive: false` as "not authenticated" (return `null`), so a suspended user's existing session cookie stops working immediately, not just on next login.
- `POST /api/auth/login` — reject login for `isActive: false` users with a clear 403 message ("Your account has been suspended — contact support"), not a generic "invalid credentials."

---

## 2. Backend — User Management API

All routes here go through `requireAdmin` (existing `src/lib/adminGuard.ts`), matching the pattern already used for categories/courses.

### `GET /api/admin/users/route.ts`
- Query params: `?keyword=` (matches name or email, case-insensitive regex — same style as the existing course keyword filter), `?role=student|admin`, `?page=` and `?limit=` (default `limit=20`).
- Returns `{ users, total, page, pages }` — never return the `password` field (it's `select: false` on the schema already, so a plain `find()` already excludes it — just don't `.select('+password')` here).
- For each user, also compute and include `enrollmentCount` (a Mongo `$lookup`/aggregation against `Enrollment`, or a simple `Promise.all` of `Enrollment.countDocuments` per page of results — the aggregation is more correct but the simple version is fine at this scale and easier to get right quickly).

### `GET /api/admin/users/[id]/route.ts`
Single user detail: profile fields, `enrollmentCount`, and their list of enrollments (course title, paymentStatus, enrolledAt) — this is the "see what this student bought" admin view.

### `PUT /api/admin/users/[id]/route.ts`
- Body can include `role` (`'student' | 'admin'`) and/or `isActive`.
- **Guard against self-demotion lockout**: if the admin is changing their OWN account's role away from `'admin'`, or their own `isActive` to `false`, reject with 400 ("You cannot change your own admin access"). Without this, an admin could accidentally lock themselves out with no way back in (no other admin-creation path exists in this app).
- **Guard against removing the last admin**: before demoting/deactivating any admin, count remaining `role: 'admin', isActive: true` users excluding this one — if it would drop to zero, reject with 400.

Don't build a `DELETE` route for users — suspending (`isActive: false`) is the safer, reversible action for this app; hard-deleting a user with existing Enrollments/Reviews/Questions would orphan those references. Deleting is explicitly out of scope.

---

## 3. Frontend

### `src/app/admin/users/page.tsx`
- Add to the admin sidebar nav (`src/app/admin/layout.tsx`) alongside existing Categories/Courses links.
- Table: name, email, role badge, active/suspended badge, enrollment count, joined date.
- Search box (keyword) and role filter dropdown, both driving the `GET /api/admin/users` query params, with pagination controls at the bottom.
- Row actions: a role toggle (student ↔ admin) and a suspend/reactivate toggle, both with a confirmation modal before firing (these are consequential actions, matching the deletion-confirmation pattern already used for categories in Part 2).
- Clicking a row opens a detail view/modal showing that user's enrollment history.

### `src/app/admin/page.tsx` (update)
Add a "Total Users" KPI card next to the existing Total Courses/Published/Drafts/Categories cards.

---

## 4. Edge Cases & Gotchas

- **Don't let the currently-logged-in admin suspend or demote themselves** — see the guard above. Test this specifically; it's an easy thing to skip and a real way to brick the only admin account in a demo.
- **Suspended users mid-session**: since `getAuthUserFromRequest`/`getServerUser` now check `isActive`, a suspended user's next API call fails auth immediately even with a valid cookie — make sure the frontend's `AuthContext` treats a 401 from `/api/auth/me` as a logout, not an infinite loading state.

---

## 5. Verification Checklist

1. `npm run build` / `npm run lint` — zero errors.
2. As admin, open `/admin/users` → confirm all registered users appear with correct roles/status.
3. Search by a partial name/email → confirm filtering works. Filter by role → confirm it narrows correctly. Test pagination with page/limit if you have enough test users (create a few throwaway accounts if needed).
4. Promote a student to admin → log in as that user in another browser → confirm they now see the Admin nav link and can reach `/admin`.
5. Suspend a user → confirm their existing logged-in session immediately loses access (next request 401s) and they cannot log back in (clear "suspended" message, not a generic error).
6. Attempt to suspend/demote your OWN admin account → confirm it's blocked with a clear message.
7. Screenshot: the users table with search/filter, the user detail view showing enrollment history, and the self-demotion block message.

## 6. Git & Push

Suggested commits: `feat(schema): isActive flag on User`, `feat(auth): reject suspended users at login and session check`, `feat(api): admin user management routes with self-lockout guards`, `feat(admin): users management page`. Update README roadmap — **this completes the "admin dashboard with user and course management" acceptance criterion.**

Report back before Part 11 (Admin Analytics).
