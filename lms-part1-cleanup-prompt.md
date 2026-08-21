# Part 1 Cleanup — Remove Out-of-Scope Files, Finish Verification

The Part 1 build succeeded, but it included files well beyond Part 1's scope — likely merged in from the old `full_project_dump.md` reference project. Before we move to Part 2, clean this up so the codebase only contains what Part 1 actually specified.

## 1. Delete these out-of-scope files/folders entirely

These belong to later parts (2–5) and should not exist yet — they'll be built fresh against the real backend when we get there, not left over as fake-data mockups:

- `src/app/admin/` (entire folder — analytics, courses, users, layout, page)
- `src/app/courses/` (entire folder)
- `src/app/learn/` (entire folder)
- `src/app/my-courses/`
- `src/components/admin/` (entire folder)
- `src/components/checkout/` (entire folder)
- `src/components/courses/` (entire folder)
- `src/components/layout/` (entire folder — this duplicates `src/components/Navbar.tsx`)
- `src/components/auth/AuthModal.tsx` (we're using dedicated `/login` and `/register` pages, not a modal)
- `src/context/LMSContext.tsx`
- `src/data/` (entire folder, including `mockCourses.ts`)
- `src/types/index.ts` **only if** nothing from Part 1's actual files imports it — check first
- `src/lib/utils.ts` **only if** nothing from Part 1's actual files imports it — check first
- `tailwind.config.ts` — this project uses Tailwind v4's CSS-first `@theme inline` config in `globals.css`, not a JS config file. Having both can cause conflicts or confusion. Remove it unless something in `globals.css` explicitly requires it.

## 2. After deleting, verify nothing is broken

Run `npm run build` again. If it fails because some file you kept still imports one of the deleted files, either delete that importing file too (if it's also out-of-scope) or remove the broken import.

Confirm the final route list from `npm run build` output matches **only**:
```
/
/_not-found
/api/auth/login
/api/auth/logout
/api/auth/me
/api/auth/register
/dashboard
/login
/register
```

If any other route still appears, something out-of-scope wasn't fully removed.

## 3. Complete the manual verification (this was skipped)

Using a real MongoDB Atlas connection string in `.env.local`:

1. Run `npm run dev`.
2. Register a new account → confirm it lands on `/dashboard` showing your name, email, and role.
3. Refresh the page → confirm you're still logged in (session persists via the cookie).
4. Click "Sign out" → confirm you return to a logged-out state.
5. Try opening `/dashboard` directly in a new tab while logged out → confirm it redirects to `/login`.
6. Log back in with the same credentials → confirm it succeeds and lands on `/dashboard`.
7. Try registering again with the same email → confirm you get a clear error, not a crash.

Take screenshots of: the register page, login page, dashboard while logged in, and the terminal output of a successful `npm run build`. Save them to `docs/screenshots/`.

## 4. Push to GitHub (this was not done)

- Create a new **public**, empty GitHub repo (no auto-generated README/gitignore).
- Repo name: `lms-nextjs` (this will be the single repo for all 6 parts).
- Description: "Full-stack Learning Management System built with Next.js 15, MongoDB, JWT auth, Vercel Blob video, and Stripe payments. Built incrementally in parts — see README for progress."
- Initialize git, commit every file individually with descriptive messages, push to `origin main`.
- Add the screenshots from step 3 to `docs/screenshots/`, reference them in a `README.md` under a "Part 1: Foundation" heading, commit, push again.

## 5. Report back

Once done, share:
- The GitHub repo link
- Confirmation the route list matches the expected 9 routes above
- The screenshots (or a description of what they show)

I'll verify the repo directly before we move to Part 2.
