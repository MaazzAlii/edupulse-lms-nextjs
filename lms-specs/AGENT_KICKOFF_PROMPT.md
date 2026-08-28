# EduPulse LMS — Agent Kickoff & Operating Instructions

**Paste this entire file as your first message to Claude Code / Antigravity in this project's workspace.** It replaces needing to explain the rules every session — everything the agent needs to operate correctly, resume after a context/usage limit, and stay disciplined about commits and verification is below.

---

## 0. Project Context — Read This First

This is an **existing, already-working project**, not a fresh scaffold. It's a Next.js 15 + TypeScript + MongoDB Mongoose LMS called EduPulse, already open in this workspace. **Parts 1–3 are already built and working**: authentication, course/category CRUD, and lesson video upload/streaming via Vercel Blob. Do not re-scaffold the project, do not rebuild anything already listed as complete in `README.md`'s roadmap table, and do not touch Part 1–3 files unless a later spec explicitly says to modify them.

There is a folder in this repo called `lms-specs/` containing:
- `00-roadmap-and-usage-guide.md` — priorities and the full plan. Read this now.
- `part4-payments-checkout-spec.md` through `part20-final-qa-submission-spec.md` — one detailed spec per remaining feature, meant to be implemented **in numeric order, one at a time**.

Each spec file already contains everything for that part: data model changes, API routes, frontend work, edge cases, a verification checklist, and suggested commit messages. Follow each spec closely — don't improvise scope beyond what it says, and don't skip ahead to a later part's territory even if it seems related.

---

## 1. Your Operating Loop

Every session, and every time you finish a part, follow this loop exactly:

1. **Read `AGENT_PROGRESS.md`** at the repo root (see §2) before doing anything else. This tells you exactly what's done and what's next — trust it over your own memory of earlier in the conversation, since that memory may not survive a session reset.
2. Determine the next **not-yet-complete** part in sequence from the progress file. Never skip ahead, never re-do a part marked complete unless the user explicitly asks you to revisit it.
3. Open and fully read that part's spec file in `lms-specs/`.
4. Implement exactly what it scopes — models, routes, frontend, in the order the spec presents them.
5. Comment the code thoroughly as you go (see §4 — don't leave this for a cleanup pass).
6. Run `npm run build` and `npm run lint`. Fix everything until both are clean. **Never commit code that doesn't build.**
7. Work through that part's Verification Checklist for real (see §5).
8. Commit in small, logical chunks as you go — not one giant commit at the end (see §3).
9. Push after each commit.
10. Update `AGENT_PROGRESS.md` with what you just did, commit it, push it.
11. Report a short summary to the user, then continue to the next part **unless** you've reached a checkpoint listed in §8, in which case stop and wait for confirmation.

---

## 2. The Progress Log — `AGENT_PROGRESS.md`

This file is the single source of truth for continuity across sessions, context resets, and usage limits. It lives at the **repo root**, gets **committed and pushed like any other file** (this is what makes it survive a fresh session — a new agent instance clones/opens the same repo and reads it), and is not gitignored.

If it doesn't exist yet, create it now using the template at the bottom of this document, then commit it as your very first action before touching any spec.

**Update it after every meaningful sub-step, not just at the end of a part.** If you get cut off mid-part (context limit, usage limit, connection drop), the next session needs to know precisely which files/routes/commits already landed and which are still pending — not just "Part 7 in progress." Vague entries like "working on reviews" are not good enough; write "Review model + POST/GET routes committed (`a1b2c3d`); PUT/DELETE routes and frontend review form still pending" so the next session can pick up mid-part without re-doing or missing anything.

---

## 3. Commit & Push Discipline

- **One logical change per commit.** Use each spec's "Suggested commits" list as your baseline granularity (e.g. schema change → its own commit, API routes → their own commit, frontend UI → its own commit).
- **Push after every commit**, or at minimum after every completed sub-step. Do not accumulate a whole part's worth of uncommitted local changes — that's exactly the work that gets lost if a session ends unexpectedly.
- Follow the commit message style already established in this repo (`feat(scope): description`, `fix(scope): description`, `docs: description`, `test: description`).
- Never force-push, never rewrite history, never commit directly-to-main-and-amend. If a push fails (auth, conflict, etc.), **stop and report it** rather than discarding the work or trying something destructive to force it through.
- `AGENT_PROGRESS.md` updates get their own commits too (`docs(progress): update after part N`) — don't bundle progress-file updates silently into a feature commit.

---

## 4. Code Quality Bar

- **Zero build errors, zero lint errors, before every commit.** Run both and fix before committing, every time — not just once at the end of a part.
- **Comment as you write, not after.** Every model file needs a short comment on non-obvious fields (why an index exists, why a field is denormalized). Every API route needs a comment stating what it does and who's allowed to call it. Every non-trivial function (aggregations, guards, webhook handling) needs a comment explaining *why*, not a restatement of the code. This matters here specifically because these specs describe intent and edge cases in prose that won't survive into the code unless you deliberately carry it over as comments.
- **Never claim something is tested, verified, or working without having actually run it.** If you can't run a step (e.g. no browser automation available for a visual check), say so explicitly in your report and in the progress log — don't mark a checklist item done on the assumption it probably works.

---

## 5. Verification & Screenshots

Each spec's Verification Checklist is not optional or advisory — actually do each step.

- If you have browser automation available, capture the screenshots each spec asks for into `docs/screenshots/`, following the existing naming pattern from Parts 1–3, and commit them.
- If you don't have browser automation, do everything you can verify functionally (build output, lint output, direct API calls via curl/fetch scripts, database state checks), and then give the user a clear, specific list of the remaining manual/visual checks they need to do themselves before you mark that part complete in the progress log. Mark it "implementation complete, pending manual verification" rather than just "complete."

---

## 6. When You Hit a Wall

- **Missing credentials you can't generate yourself** (Stripe keys, a Mongo URI, a Resend API key, `BLOB_READ_WRITE_TOKEN`, etc.) → stop and ask the user for the real value. Never fabricate a placeholder and proceed as if it works — that produces code that looks done but silently fails the first time anyone actually uses it.
- **Spec seems to require touching files outside its stated scope** → stop and flag this to the user rather than guessing. This exact situation happened once already in this project (see the Part 1 cleanup file in `lms-specs`) and cost a whole extra cleanup pass — don't repeat it.
- **Running low on context/budget mid-part** → finish your current atomic sub-step cleanly, commit and push it, write a precise `AGENT_PROGRESS.md` entry describing exactly what remains, then stop. Do not leave a half-written file uncommitted, and do not try to cram the rest of the part in with less care just to "finish."

---

## 7. Course Video Content

Parts 3–5 need real video files to upload as lesson content and to demonstrate the purchase-unlocks-video flow. **Do not download and re-host arbitrary public YouTube videos** — visibility on YouTube doesn't mean a video is licensed for redistribution, and re-hosting someone else's video as your own app's content is both a YouTube ToS violation and a real copyright risk, independent of how the request is framed. Use one of these instead:

- **Free stock video sites** (recommended — most consistent with the existing Vercel Blob upload architecture from Part 3, since you actually get real files to upload): Pexels Videos, Pixabay Videos, Mixkit, or Coverr. All offer short clips free for any use, no attribution required, explicitly licensed for exactly this kind of use. Grab 5–10 short (1–3 minute) clips, name them descriptively (`intro-to-html.mp4`, etc.), keep them in a local `seed-videos/` folder that stays **out of git** (video files don't belong in the repo — add `seed-videos/` to `.gitignore`), and upload them through the real admin lesson-upload flow.
- **Creative Commons–licensed YouTube videos**: YouTube's search has a "Creative Commons" license filter under search tools. CC-BY videos can legally be downloaded and reused with attribution to the original creator (credit them somewhere visible, e.g. in the lesson description). This is legitimate but slower to source in bulk than stock sites.
- **YouTube embeds instead of uploads**: for demo/placeholder purposes only, you could embed a public YouTube video via `<iframe>` (fully permitted by YouTube, no redistribution involved) rather than treating it as an uploaded lesson file. This doesn't exercise the actual Blob-upload/streaming code path though, so it's a weaker choice if the point is demonstrating that feature.

Default to the stock-video approach unless the user says otherwise.

---

## 8. Checkpoints — Stop and Report Before Continuing

Given the project's deadline, don't blow through all 17 parts unattended. Stop and wait for the user's go-ahead at these points:

- **After Part 5** (Stripe checkout + webhook enrollment) — this is the biggest, riskiest integration (real payment provider, webhook signature verification). Confirm it's genuinely working before building anything on top of it.
- **After Part 10** (admin user management) — at this point all four of the task's acceptance criteria are met. This is a natural "we could stop here and submit" checkpoint even if you continue further.
- **After Part 19** (deployment) — confirm the live URL actually works before doing final QA/submission packaging in Part 20.

At every other part boundary, a brief progress report is enough — keep moving unless something in §6 stops you.

---

## `AGENT_PROGRESS.md` Starter Template

Create this file at the repo root now if it doesn't already exist:

```markdown
# EduPulse LMS — Agent Progress Log

Read this file first, every session, before doing anything else.
Update it after every meaningful sub-step — not just at the end of a part.

## Status Summary
- Last updated: <ISO timestamp>
- Current part in progress: <e.g. "Part 6" or "none — awaiting next instruction">
- Last part fully completed and verified: <e.g. "Part 5">

## Part-by-Part Log

### Part 4 — Payments & Checkout
- Status: not started | in progress | implementation complete, pending manual verification | complete
- Commits: <hashes + one-line description each>
- Remaining work (if not complete): <precise list>
- Notes/deviations from spec: <anything, or "none">

### Part 5 — Enrollment Engine & Webhook
- Status:
- Commits:
- Remaining work:
- Notes:

<... one section per part, added as you reach it — don't pre-fill parts you haven't started ...>

## Environment / Credentials Needed From User
<list anything you're blocked on — e.g. "STRIPE_WEBHOOK_SECRET for local testing", "RESEND_API_KEY">

## Open Questions / Flags for the User
<anything from §6 that needs a human decision>
```
