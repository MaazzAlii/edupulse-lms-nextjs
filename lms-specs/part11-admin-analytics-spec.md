# LMS Project — Part 11: Admin Analytics Dashboard

**Goal:** Replace the plain KPI cards on `/admin` with real revenue, enrollment, and signup trend charts, plus a "top courses" table. Prerequisites: Part 5 (Paid enrollments exist), Part 10 (Total Users KPI already added).

---

## 1. Prerequisites

`npm install recharts` — lightweight, works well with Next.js client components, no separate CSS import needed.

---

## 2. Backend — Analytics Aggregation

### `src/lib/analytics.ts`
A shared helper, `getLast12MonthsData(model, dateField, matchFilter?)`, adapted from the "last 12 months" pattern in your own reference notes but rewritten as a single Mongo aggregation instead of a 12-iteration loop (much cheaper and avoids the timezone-fiddly manual date math in the reference version):

```
model.aggregate([
  { $match: { [dateField]: { $gte: twelveMonthsAgo }, ...matchFilter } },
  { $group: {
      _id: { year: { $year: `$${dateField}` }, month: { $month: `$${dateField}` } },
      count: { $sum: 1 },
      revenue: { $sum: '$amount' }   // only meaningful when called on Enrollment
  }},
  { $sort: { '_id.year': 1, '_id.month': 1 } }
])
```
Then fill in any missing months with zero counts (a 12-month array where some months had zero activity should still show a zero bar, not skip that month) before returning.

### `GET /api/admin/analytics/route.ts`
Admin only. Returns:
- `monthlySignups`: 12-month `User` counts by `createdAt`.
- `monthlyEnrollments`: 12-month `Enrollment` counts and summed `revenue`, filtered to `paymentStatus: 'Paid'` only (Pending/abandoned checkouts must not inflate revenue numbers).
- `topCourses`: top 5 courses by count of `Paid` enrollments (aggregate on `Enrollment`, group by `course`, sort desc, populate course title) — this is a genuinely useful "what's actually selling" view, not just decoration.
- `totals`: `{ totalRevenue, totalEnrollments, totalUsers, totalCourses }` for headline KPI cards.

---

## 3. Frontend

### `src/app/admin/analytics/page.tsx`
New admin page (add to sidebar nav):
- Headline KPI cards: Total Revenue (formatted as currency), Total Enrollments, Total Users, Total Courses.
- A line or bar chart (recharts `<ResponsiveContainer>` + `<BarChart>`/`<LineChart>`) for monthly signups over the last 12 months.
- A second chart for monthly revenue over the last 12 months.
- A "Top 5 Courses" table: course title, enrollment count, revenue generated, link to that course's admin edit page.
- Use the existing design tokens (`--primary`, `--gold`) for chart colors so it matches the rest of the admin UI rather than recharts' default palette.

### `src/app/admin/page.tsx` (update)
Replace the static KPI cards with a call to the same `/api/admin/analytics` totals (or keep the existing lightweight cards and add a "View full analytics →" link into the new page — either is fine, don't duplicate the aggregation logic in two places).

---

## 4. Edge Cases & Gotchas

- **A brand-new project with little data** will show mostly-flat/empty charts — that's expected and fine, not a bug. Don't fabricate placeholder data; an honest empty state (e.g. "Not enough data yet" under a chart with all zeros) is better than misleading numbers.
- **Revenue must only count `Paid` enrollments.** This is the single easiest place to accidentally overstate numbers by forgetting the `paymentStatus` filter — double-check it in both `monthlyEnrollments` and `topCourses`.

---

## 5. Verification Checklist

1. `npm run build` / `npm run lint` — zero errors.
2. With at least a few real test purchases made across Parts 4/5 testing, open `/admin/analytics` → confirm the revenue total matches what you'd expect from your test purchases (check against the Stripe test dashboard's total).
3. Confirm the monthly charts render (even if most months are zero and only the current month has a bar — that's correct for a brand-new project).
4. Confirm "Top Courses" lists your actual highest-enrolled test course first.
5. Create a `Pending` (unpaid, abandoned) checkout and confirm it does NOT appear in revenue totals.
6. Screenshot: the analytics page with KPI cards, both charts, and the top courses table.

## 6. Git & Push

Suggested commits: `feat(analytics): shared last-12-months aggregation helper`, `feat(api): admin analytics route`, `feat(admin): analytics dashboard with charts`. Update README roadmap.

Report back before Part 12 (Search, Filters & Wishlist).
