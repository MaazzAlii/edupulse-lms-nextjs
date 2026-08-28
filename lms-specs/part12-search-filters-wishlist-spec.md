# LMS Project — Part 12: Search, Filters, Pagination & Wishlist

**Goal:** The Part 2 catalog already supports `?keyword=`, `?category=`, `?level=`. This part adds sorting, real pagination (currently the catalog likely loads everything at once), and an optional wishlist/save-for-later.

---

## 1. Backend — Catalog Enhancements

### `GET /api/courses/route.ts` (update)
Add:
- `?sort=` — one of `newest` (default, `-createdAt`), `price_asc`, `price_desc`, `rating` (`-averageRating`, from Part 7 — if Part 7 wasn't built, skip this option or default `rating` sort to `-createdAt` gracefully rather than erroring on a missing field).
- `?page=` and `?limit=` (default `limit=9`, a clean 3x3 grid).
- Response shape becomes `{ courses, total, page, pages }` instead of a bare array — **this is a breaking response-shape change**, so update every frontend caller in the same commit (the public catalog page, and anywhere else that calls this route) rather than leaving them out of sync.
- Existing `keyword`/`category`/`level` filters remain unchanged, just combined with the new sort/pagination in the same query.

---

## 2. Wishlist

### New model: `src/models/Wishlist.ts`
Simple: `user` (ObjectId ref User), `course` (ObjectId ref Course), timestamps. Unique compound index `{ user: 1, course: 1 }`.

### `POST /api/wishlist/route.ts` — body `{ courseId }`, requires auth, upsert/create.
### `DELETE /api/wishlist/[courseId]/route.ts` — requires auth, remove.
### `GET /api/wishlist/route.ts` — requires auth, returns the user's wishlisted courses populated.

---

## 3. Frontend

### `src/app/page.tsx` (update)
- Add a sort dropdown next to the existing search/category/level filters.
- Replace "load everything" with real pagination controls (Prev/Next or numbered pages) driven by the new `page`/`pages` response fields. Preserve the other active filters when changing page (all in the query string, e.g. via `useSearchParams`/`router.push` with merged params) so filtering + pagination compose correctly instead of resetting each other.
- Add a small heart/bookmark icon on each course card (filled if wishlisted) that calls the wishlist POST/DELETE routes — only shown when logged in; logged-out users see it disabled or hidden entirely, not a broken click.

### `src/app/wishlist/page.tsx`
New protected page: grid of the user's saved courses, same card component as the catalog, each with a "Remove" action and an "Enroll" shortcut.

### `src/components/Navbar.tsx` (update)
Add a Wishlist link (with a small count badge, optional) when authenticated.

---

## 4. Edge Cases & Gotchas

- **Breaking response shape**: because `GET /api/courses` now returns `{ courses, ... }` instead of a bare array, grep the whole codebase for every place that currently does something like `const data = await res.json(); setCourses(data.courses)` vs `setCourses(data)` and make sure they all agree — this is exactly the kind of small inconsistency that causes a confusing "catalog shows nothing" bug that isn't obviously related to this change.
- **Wishlisting an unpublished course** shouldn't be possible from the public UI (it isn't listed there), but the API route should still validate `course.isPublished` server-side rather than trusting that the frontend never sends a bad id.

---

## 5. Verification Checklist

1. `npm run build` / `npm run lint` — zero errors.
2. Confirm the catalog still shows courses correctly after the response-shape change (this is the single most likely thing to silently break).
3. Test each sort option, confirm ordering is actually correct (price low-to-high really is ascending, etc.).
4. Change pages while a search/category filter is active → confirm the filter persists across pages.
5. Wishlist a course, visit `/wishlist` → confirm it appears; remove it → confirm it disappears from both places.
6. Screenshot: catalog with sort dropdown and pagination controls, and the wishlist page.

## 6. Git & Push

Suggested commits: `feat(api): sort and pagination on courses catalog`, `refactor(catalog): update all callers for new paginated response shape`, `feat(schema): Wishlist model`, `feat(wishlist): save/remove courses and wishlist page`. Update README roadmap.

Report back before Part 13 (Student Dashboard).
