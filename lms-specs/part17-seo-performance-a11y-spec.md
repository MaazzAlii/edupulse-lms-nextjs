# LMS Project — Part 17: SEO, Performance & Accessibility

**Goal:** Polish pass so the app is fast, indexable, and usable with a keyboard/screen reader — the difference between "it works" and "it's production-grade." Do this after the core features are done, not before (polishing a page that's about to change structurally is wasted effort).

---

## 1. Metadata & SEO

### Per-page `metadata` exports
Next.js App Router's `export const metadata` (static) or `generateMetadata()` (dynamic) — the root layout already sets a static title/description from Part 1. Add dynamic metadata to:
- `src/app/courses/[id]/page.tsx` — title = course title, description = truncated course description, `openGraph` fields including the course thumbnail so shared links look good.
- `src/app/page.tsx` — keep the static catalog-level title/description.

### `src/app/sitemap.ts`
Generate a sitemap listing the homepage and every **published** course detail page (query `Course.find({ isPublished: true })`), each with `lastModified` from `updatedAt`. Next.js serves this automatically at `/sitemap.xml`.

### `src/app/robots.ts`
Allow all crawling of public pages, disallow `/admin`, `/dashboard`, `/my-courses`, `/api`, `/checkout`, `/certificate` — nothing behind auth should be crawlable/indexed.

---

## 2. Performance

- **Images**: audit every `<img>` tag (course thumbnails, avatars if any) and convert to `next/image` where not already used — this gets automatic lazy-loading, responsive sizing, and format optimization for free. `next.config.mjs` already has `remotePatterns` open to `**`, which is fine to keep for a course project pulling thumbnails from arbitrary URLs.
- **Bundle check**: run `npm run build` and look at the route size output — flag any route unexpectedly large (usually caused by an accidentally-client-imported heavy library like `recharts` leaking into a page that doesn't need it). Recharts should only be in the admin analytics bundle, not the public catalog.
- **Loading states**: confirm every data-fetching page (catalog, course detail, dashboard, admin tables) has a real loading skeleton/spinner rather than a blank flash — most of this should already exist from earlier parts; this is an audit pass, not new architecture.

---

## 3. Accessibility

- **Keyboard navigation**: tab through the full purchase flow (browse → course detail → enroll → checkout) and the full admin CRUD flow using only the keyboard (no mouse) — every interactive element (buttons, modal close, form submit) must be reachable and operable. Modals specifically need focus trapped inside them while open and returned to the trigger element on close.
- **Alt text**: every meaningful image (course thumbnails, certificate) needs descriptive `alt` text; purely decorative icons (lucide-react icons used as visual accents next to text) should be `aria-hidden="true"` so screen readers don't announce redundant icon names.
- **Form labels**: every input across register/login/checkout/admin forms needs a real associated `<label>` (or `aria-label`), not just a placeholder — placeholders disappear on focus and don't count as labels for assistive tech.
- **Color contrast**: spot-check the existing plum/gold palette's text-on-background combinations (especially `--muted` text on `--surface`, and white text on `--primary`) against WCAG AA (4.5:1 for normal text) using a contrast checker — adjust shades slightly if anything fails rather than redesigning the palette.

---

## 4. Verification Checklist

1. `npm run build` — check the route size table for anything surprisingly large.
2. Run Lighthouse (Chrome DevTools → Lighthouse tab) against the homepage and a course detail page in an incognito window — target 90+ on Performance, Accessibility, Best Practices, SEO. Note and fix any specific flagged issues rather than chasing the score blindly.
3. Tab through the full purchase flow and admin CRUD flow with the mouse unplugged (or just not touched) — confirm nothing is unreachable or invisible-but-focused.
4. Visit `/sitemap.xml` and `/robots.txt` directly → confirm they render correctly and only list/allow public pages.
5. Screenshot: Lighthouse scores (both pages), and the sitemap/robots output.

## 5. Git & Push

Suggested commits: `feat(seo): dynamic metadata, sitemap, and robots.txt`, `perf: convert remaining img tags to next/image`, `fix(a11y): focus trapping, labels, and contrast fixes`. Update README roadmap.

Report back before Part 18 (Security Hardening).
