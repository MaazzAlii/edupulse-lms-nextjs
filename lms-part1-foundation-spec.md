# LMS Project — Part 1: Foundation

**Goal:** Set up the Next.js project, database models, authentication (register/login/logout), protected routes, and a basic layout with role-aware navigation. This is the base every later part builds on top of.

---

## 1. Project Setup

Scaffold with the official CLI, pinned to **Next.js 15** (not 16 — the LMS course and later parts assume Next 15's App Router conventions):

```bash
npx create-next-app@latest lms-nextjs --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
```

After scaffolding, edit `package.json`:
- Change `"next"` to `"^15.5.23"` (or latest 15.x)
- Add dependencies: `mongoose@^8.5.2`, `bcryptjs@^2.4.3`, `jsonwebtoken@^9.0.2`
- Add dev dependencies: `@types/bcryptjs@^2.4.6`, `@types/jsonwebtoken@^9.0.6`

Then delete `node_modules` and `package-lock.json`, and run `npm install` again so the lockfile matches.

Remove unused CLI boilerplate: `AGENTS.md`, `CLAUDE.md`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`.

**Do not use `next/font/google`** (or any Google Fonts import) — use Tailwind's default system font stack instead. This avoids a network dependency at build time.

---

## 2. Environment Variables

Create `.env.example`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/lms?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
```

(Later parts will add `BLOB_READ_WRITE_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL` — don't add them yet.)

---

## 3. Design Tokens

In `src/app/globals.css`, replace the default `:root` and `@theme inline` blocks with these tokens (Tailwind v4 CSS-first theming — academic/education visual identity: deep plum primary + gold accent):

```css
@import "tailwindcss";

:root {
  --background: #faf8f6;
  --foreground: #221b20;
  --muted: #7a7078;
  --border: #e8e1e4;
  --surface: #ffffff;
  --primary: #6b2d5c;
  --primary-dark: #4f2144;
  --primary-tint: #f3e8f0;
  --gold: #c9972a;
  --gold-tint: #faf1dd;
  --green: #2e8b57;
  --green-tint: #e6f4ec;
  --red: #c0392b;
  --red-tint: #fbe9e7;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-surface: var(--surface);
  --color-primary: var(--primary);
  --color-primary-dark: var(--primary-dark);
  --color-primary-tint: var(--primary-tint);
  --color-gold: var(--gold);
  --color-gold-tint: var(--gold-tint);
  --color-green: var(--green);
  --color-green-tint: var(--green-tint);
  --color-red: var(--red);
  --color-red-tint: var(--red-tint);
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-serif: ui-serif, Georgia, "Times New Roman", serif;
  --font-mono: ui-monospace, "SFMono-Regular", "IBM Plex Mono", Menlo, monospace;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

---

## 4. Folder Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Home page
│   ├── register/page.tsx
│   ├── login/page.tsx
│   ├── dashboard/page.tsx    # Protected placeholder page
│   └── api/
│       └── auth/
│           ├── register/route.ts
│           ├── login/route.ts
│           ├── logout/route.ts
│           └── me/route.ts
├── components/
│   └── Navbar.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   ├── db.ts                 # MongoDB connection
│   ├── jwt.ts                # JWT sign/verify
│   ├── auth.ts                # Cookie-based auth helpers
│   └── response.ts             # Shared API response shape
└── models/
    ├── User.ts
    ├── Category.ts            # Empty schema now, used in Part 2
    ├── Course.ts               # Empty schema now, used in Part 2
    ├── Lesson.ts                # Empty schema now, used in Part 3
    └── Enrollment.ts             # Empty schema now, used in Part 4
```

Build all 5 models now even though only `User` is used in Part 1 — this avoids rework when Part 2 onward references them.

---

## 5. Database Models

### `src/lib/db.ts` — MongoDB connection

Use a cached-connection pattern (via `global`) so Next.js's dev-mode hot reload and serverless warm invocations don't create a new Mongoose connection every time. Throw a clear error if `MONGO_URI` is missing.

### `src/models/User.ts`

Fields: `name` (String, required), `email` (String, required, unique, lowercase), `password` (String, required, min 6 chars, `select: false`), `role` (enum `'student' | 'admin'`, default `'student'`), timestamps.

- `pre('save')` hook: hash `password` with bcrypt (10 rounds) if modified.
- Instance method `comparePassword(entered: string): Promise<boolean>` using `bcrypt.compare`.
- Export pattern: `mongoose.models.User || mongoose.model('User', userSchema)` (guards against Next.js hot-reload redefining the model).

### `src/models/Category.ts`

Fields: `name` (String, required, unique), `slug` (String, required, unique, lowercase), timestamps. Same `mongoose.models.X ||` export guard.

### `src/models/Course.ts`

Fields: `title`, `slug` (unique), `description`, `category` (ObjectId ref `'Category'`), `instructor` (String), `level` (enum `'Beginner' | 'Intermediate' | 'Advanced'`), `price` (Number, min 0), `thumbnailUrl` (String), `isPublished` (Boolean, default false), timestamps.

### `src/models/Lesson.ts`

Fields: `course` (ObjectId ref `'Course'`), `title`, `order` (Number), `videoUrl` (String), `durationSeconds` (Number), `isPreview` (Boolean, default false — watchable without purchasing), timestamps. Index on `{ course: 1, order: 1 }`.

### `src/models/Enrollment.ts`

Fields: `user` (ObjectId ref `'User'`), `course` (ObjectId ref `'Course'`), `amount` (Number), `paymentStatus` (enum `'Pending' | 'Paid'`), `stripeSessionId`, `stripePaymentIntentId`, `completedLessons` (array of ObjectId ref `'Lesson'`). Timestamps mapped as `{ createdAt: 'enrolledAt', updatedAt: true }`. **Unique compound index** on `{ user: 1, course: 1 }` — a user can only have one enrollment per course.

---

## 6. Auth Utilities

### `src/lib/jwt.ts`

`signToken({ id, role })` and `verifyToken(token)` using `jsonwebtoken`, reading `JWT_SECRET` and `JWT_EXPIRE` from env.

### `src/lib/response.ts`

Two helpers used by every API route for a consistent shape:
- `apiError(message, status)` → `NextResponse.json({ success: false, message }, { status })`
- `apiSuccess(data, status = 200)` → `NextResponse.json({ success: true, ...data }, { status })`

### `src/lib/auth.ts`

Cookie name constant: `AUTH_COOKIE = 'lms_token'`.

Two helper functions, both reading the JWT from the cookie, verifying it, and loading the user from MongoDB:
- `getAuthUserFromRequest(req: NextRequest)` — for use inside Route Handlers, reads `req.cookies.get(AUTH_COOKIE)`.
- `getServerUser()` — for use inside Server Components, reads via `await cookies()` (Next.js 15's `cookies()` is async).

Both return `null` (not a thrown error) if there's no valid session — callers decide whether that's an error.

---

## 7. Auth API Routes

All four routes go through `connectDB()` first, validate input, and return the shared `apiSuccess`/`apiError` shape.

- **`POST /api/auth/register`** — body `{ name, email, password }`. Validate all three present, password ≥ 6 chars. Check email not already taken (400 if so). Create user, sign JWT with `{ id, role }`, set it as an **httpOnly cookie** (`secure` in production, `sameSite: 'lax'`, 7-day maxAge), return `201` with the user object (never the password).
- **`POST /api/auth/login`** — body `{ email, password }`. Look up user with `.select('+password')` (since password has `select: false` on the schema), compare password, same cookie-setting pattern as register, return `200`.
- **`POST /api/auth/logout`** — clears the cookie (`maxAge: 0`), returns success.
- **`GET /api/auth/me`** — uses `getAuthUserFromRequest`, returns `401` if not authenticated, otherwise the user object.

---

## 8. Frontend

### `src/context/AuthContext.tsx`

Client-side React context (`'use client'`). On mount, calls `GET /api/auth/me` to restore session state (sets `loading` false once resolved). Exposes `user`, `loading`, `isAuthenticated`, `isAdmin`, and `register`/`login`/`logout`/`refresh` functions that call the corresponding API routes and update local state. Throw if `useAuth()` is called outside the provider.

### `src/components/Navbar.tsx`

Client component. Shows: brand logo/link to `/`, a "Courses" nav link, and then conditionally:
- While `loading`: nothing extra.
- If logged in: "Admin" link (only if `isAdmin`), "My Learning" link, the user's name, and a "Sign out" button that calls `logout()` then redirects to `/`.
- If logged out: a "Sign in" button linking to `/login`.

Use `usePathname()` to highlight the active link.

### `src/app/layout.tsx`

Root layout. Wrap `children` in `<AuthProvider>`, render `<Navbar />` above `{children}`. Set metadata title/description for the LMS.

### `src/app/page.tsx`

Simple home page explaining what's built so far in Part 1 (auth working, protected routes, role-aware nav) — this is a placeholder; the real course catalog replaces it in Part 2.

### `src/app/register/page.tsx` and `src/app/login/page.tsx`

Client components with controlled form inputs, calling `useAuth().register(...)` / `.login(...)`, showing a validation/error banner on failure, redirecting to `/dashboard` on success.

### `src/app/dashboard/page.tsx`

Client component demonstrating the **protected route pattern**: on mount, if `!loading && !isAuthenticated`, redirect to `/login` via `router.replace('/login')`. While loading or unauthenticated, show a loading state instead of flashing protected content. Once authenticated, show the user's name/email/role as proof the session works.

---

## 9. Verification Checklist (do this before pushing)

1. `npm install` completes cleanly.
2. `npm run build` succeeds with **zero errors**.
3. `npm run lint` passes with **zero errors**.
4. Manually test against a real MongoDB Atlas database (use `.env.example` as a template for a real `.env`):
   - Register a new account → should land on `/dashboard` showing your name/email/role.
   - Refresh the page → should stay logged in (session persists via cookie).
   - Click "Sign out" → should return to logged-out state.
   - Try to open `/dashboard` directly while logged out → should redirect to `/login`.
   - Log back in with the same credentials → should succeed and land on `/dashboard`.
   - Try registering with the same email again → should show a clear error, not crash.
5. Take screenshots of: the register page, login page, dashboard (logged in), and the terminal output of a successful `npm run build`.

## 10. GitHub

- Repo name suggestion: `lms-nextjs-foundation` (or just `lms-nextjs` if you want one repo for the whole project across all 6 parts — recommended, since later parts extend this same codebase rather than starting fresh).
- Public repo, empty (no auto-generated README/gitignore).
- Commit files individually with descriptive messages.
- Push to `origin main`.
- Add the verification screenshots to `docs/screenshots/` and reference them in the README under a "Part 1: Foundation" heading.

**Do not deploy to Vercel yet** — later parts add more environment variables (Blob storage, Stripe), so we'll deploy once more of the app exists. Local verification against a real MongoDB Atlas database is enough for this part.
