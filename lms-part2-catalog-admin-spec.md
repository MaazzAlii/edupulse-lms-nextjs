# LMS Project — Part 2: Course Catalog & Admin CRUD

**Builds on Part 1.** Do not modify anything in `src/models/`, `src/lib/`, `src/context/AuthContext.tsx`, or the `/api/auth/*` routes — they're done and verified. This part adds categories, courses, public browsing, and admin management on top of that foundation.

---

## 1. Scope for this part

- Admin-only CRUD for **Categories**
- Admin-only CRUD for **Courses** (not lessons yet — that's Part 3)
- Public course catalog: browse, search, filter by category
- Public course detail page
- An `isAdmin`-gated `/admin` section with a sidebar/nav distinct from the public site

**Do not build yet** (later parts): lesson management, video upload, enrollment/payment, admin analytics, user management. If you're tempted to stub these out "for later," don't — an empty stub page that isn't wired to anything real just becomes clutter, same problem as last time.

---

## 2. Shared Auth Guard for Admin API Routes

Create `src/lib/adminGuard.ts`:

```typescript
export async function requireAdmin(req: NextRequest): Promise<IUser | NextResponse>
```

- Calls `getAuthUserFromRequest(req)`.
- If no user → return `apiError('Not authenticated', 401)`.
- If user role isn't `'admin'` → return `apiError('Admin access required', 403)`.
- Otherwise → return the user.

Callers do:
```typescript
const authResult = await requireAdmin(req);
if (authResult instanceof NextResponse) return authResult;
const admin = authResult; // typed as IUser from here
```

This avoids repeating the same auth-check boilerplate in every admin route.

---

## 3. Category API Routes

`src/app/api/categories/route.ts`:
- `GET` — public, returns all categories, sorted by name.
- `POST` — admin only (`requireAdmin`). Body `{ name }`. Auto-generate `slug` from `name` (lowercase, spaces→hyphens, strip non-alphanumeric). Return 400 if name empty or slug already exists.

`src/app/api/categories/[id]/route.ts`:
- `DELETE` — admin only. Return 400 if any Course still references this category (don't allow orphaning courses — require the admin to reassign or delete those courses first, and say so in the error message).

---

## 4. Course API Routes

**Important — route ordering.** In Part 1's sibling projects, static routes placed after dynamic `:id`/`[id]` routes got silently swallowed (Express matched `:id` against literal words like "new" or "mine"). Next.js route handlers use folder-based routing so this specific bug can't happen the same way, but keep the equivalent discipline: `/api/courses/mine` (if you add anything like it later) must be its own folder, not something that could collide with `/api/courses/[id]`.

`src/app/api/courses/route.ts`:
- `GET` — public. Query params: `?keyword=` (case-insensitive match on `title`), `?category=` (category ObjectId), `?level=`. **Only return courses where `isPublished: true`** for non-admin requests — an unpublished course should not appear in the public catalog. (Check the requester: if `getAuthUserFromRequest` resolves to an admin, include unpublished courses too; otherwise filter to `isPublished: true` only.)
- `POST` — admin only. Body `{ title, description, category, instructor, level, price, thumbnailUrl }`. Auto-generate `slug` from `title`, ensure uniqueness (append `-2`, `-3` etc. if the slug already exists rather than erroring). Validate `category` references a real Category document (404 if not). New courses default `isPublished: false` — admin publishes explicitly.

`src/app/api/courses/[id]/route.ts`:
- `GET` — public detail. **If the course is unpublished and the requester isn't an admin, return 404** (not 403 — don't reveal that an unpublished course exists at all to non-admins).
- `PUT` — admin only. Partial update, `runValidators` equivalent (Mongoose does this by default on `save()`; if using `findByIdAndUpdate`, pass `{ new: true, runValidators: true }`).
- `DELETE` — admin only. For now (Lesson model isn't wired to lessons yet in the UI), just delete the course document. Part 3 will add "also delete this course's lessons" when lessons actually exist.

`src/app/api/admin/courses/route.ts`:
- `GET` — admin only. Returns ALL courses (published and unpublished), for the admin course-management table.

---

## 5. Frontend — Public Pages

### `src/app/page.tsx` (replace the Part 1 placeholder)

Now a real course catalog homepage:
- Search bar (`?keyword=`) and category filter dropdown, both updating the query via `useSearchParams`/`router.push`.
- Grid of course cards: thumbnail, title, category name, level badge, price, instructor.
- Empty state if no courses match.
- Loading state while fetching.

### `src/app/courses/[id]/page.tsx`

Course detail page:
- Full title, description, instructor, level, price, category.
- A "Curriculum" section — for now, since lessons don't exist yet, show "Lessons coming in Part 3" as a placeholder text, not a fake lesson list.
- An "Enroll" button that's **visibly disabled** with a tooltip/caption "Payments coming in Part 4" — don't fake a working enroll flow.

Keep the Part 1 home page's "What's built so far" framing but move it to this catalog page or drop it — your call, just don't leave two competing homepages.

---

## 6. Frontend — Admin Section

### `src/app/admin/layout.tsx`

- On mount, check `useAuth()` — if `!loading && !isAdmin`, redirect to `/` (non-admins should never see admin UI, not even a flash of it).
- Simple sidebar: links to `/admin` (overview — can just list courses for now), `/admin/categories`, `/admin/courses`.

### `src/app/admin/categories/page.tsx`

- Table of existing categories with a delete button per row (with confirm dialog).
- A form to add a new category (name only, slug auto-generated server-side).
- Show the backend's error message plainly if delete fails because courses reference it.

### `src/app/admin/courses/page.tsx`

- Table of ALL courses (published + unpublished), with a visible "Published"/"Draft" badge per row.
- A form (inline or modal — your choice, but if a modal, don't reintroduce the old `AuthModal.tsx` pattern, this is a new, separate component) to create a course: title, description, category (dropdown from `GET /api/categories`), instructor, level, price, thumbnail URL.
- Edit and delete actions per row.
- A "Publish"/"Unpublish" toggle button per row (calls `PUT /api/courses/:id` with `{ isPublished: true/false }`).

---

## 7. Verification Checklist

1. `npm run build` — zero errors. Confirm the route list now includes `/courses/[id]`, `/admin`, `/admin/categories`, `/admin/courses`, and the new API routes, with nothing extra.
2. `npm run lint` — zero errors.
3. Manual test against real MongoDB (screenshot each step):
   - Log in as the admin test account (promote a user to `role: 'admin'` directly in MongoDB Atlas if you haven't already).
   - Create 2–3 categories.
   - Create 3+ courses across different categories, leave one unpublished.
   - Confirm the **public catalog only shows published courses** — log out (or use an incognito window) and verify the unpublished one is genuinely absent, and that visiting its detail page URL directly returns a 404-style "not found" rather than showing the content.
   - Search and category-filter on the public catalog, confirm results update correctly.
   - Toggle a course to published, confirm it now appears publicly.
   - Try deleting a category that still has courses attached — confirm you get a clear error, not a silent failure or a crash.
   - As a non-admin (regular student) logged-in user, try visiting `/admin` directly — confirm you're redirected away, not shown any admin content.
4. Screenshot: catalog page, course detail page, admin categories page, admin courses page (with both published/draft badges visible), and the blocked-category-delete error.

## 8. Git & Push

- Same repo (`edupulse-lms-nextjs`), same pattern: commit logically grouped changes with descriptive messages (e.g. `feat(models/api): category CRUD routes`, `feat(admin): course management UI`, `feat(catalog): public course browsing and detail page`), push to `origin main`.
- Update `README.md` with a "Part 2: Course Catalog & Admin CRUD" section and the new screenshots in `docs/screenshots/`.

Report back with the repo state once done and I'll verify directly before writing Part 3.
