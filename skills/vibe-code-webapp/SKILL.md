---
name: vibe-code-webapp
description: Build production-ready vibe-coded web apps (SaaS, tools, MVPs, internal apps) with a 5-stage pipeline — research demand (research-idea.mjs + web), evaluate the idea on a SaaS scorecard (BUILD / ITERATE / PIVOT), write a PRD.md and STOP for approval, build with vibe-coding craft rules (run early, one feature at a time, commit often), then pass a production-readiness audit (audit-webapp.mjs + auditor subagent). Ships with templates/ (copy-paste prompts for any CLI, PRD template, production checklist) so anyone can build a production-ready web app from one prompt.
---

# skill: vibe-code-webapp

**Name:** Vibe-Coding Web App Builder (research → evaluate → approve → build → audit)
**Description:** Turns any app idea — SaaS, tool, MVP, internal app — into a **working, production-ready web app** through a disciplined 5-stage pipeline. Vibe-coding means *fast, iterative, agent-driven building* — the pipeline keeps it honest: **research** real demand, **evaluate** the idea before writing code (kill the dud ideas cheaply), **approve a PRD** before building, **build with craft rules** that keep the app runnable at every step, and **audit for production** before anything is delivered. Works on ANY CLI (Claude Code, Cursor, Codex, Gemini CLI, Antigravity, Grok Build, Freebuff).

---

## When to use

- "Build me an app that…" / "Turn this idea into a SaaS" / "Make an MVP for…"
- A vague "I want an app for X" → research → evaluate → PRD → approve → build → audit
- Non-SaaS too (tools, internal apps, landing-page+waitlist): skip the monetization-specific checks, keep the rest.

**Invariant:** *Research and evaluation are always allowed; **no code is written before the user has approved `PRD.md`.***

---

## Install anywhere (standalone)

```bash
# install ONLY this skill into the current project
npx skills add Deepak-ai-93/deepak-skill --skill vibe-code-webapp

# globally — available in every project on this machine
npx skills add Deepak-ai-93/deepak-skill --skill vibe-code-webapp -g
```

Installs to `.agents/skills/vibe-code-webapp/` (`SKILL.md` + `scripts/`: `research-idea.mjs`, `audit-webapp.mjs` + `templates/`: `prompts.md`, `prd-template.md`, `production-checklist.md`).

**Prerequisites:** Node.js 18+ (for the scripts), and whatever the chosen stack needs (`npm create vite@latest` etc.). The audit uses only Node built-ins.

---

## The 5-stage workflow

```
idea ──► 0. RESEARCH ──► 1. EVALUATE ──► 2. PRD.md ──► USER APPROVAL ──► 3. BUILD ──► 4. AUDIT ──► 5. DELIVER
              │               │             │                  ▲                          │
              └─ idea-brief.md└─ scorecard  └─ ask ≤3 questions └─ (edit / reject)        └─ fix loop until PASS
```

### Stage 0 — Research the idea (don't build on vibes alone)

Goal: one **`idea-brief.md`** (from `scripts/research-idea.mjs`) that proves (or disproves) demand.

**Step 0a — harvest keyless demand signals:**

```bash
node scripts/research-idea.mjs --niche "saas for freelancers" --subreddits "freelance,Entrepreneur,webdev" --geo US
```

`research-idea.mjs` fetches **Reddit top-of-day posts** (real pain + exact user language) and **Google Trends "Trending now"** (what's rising today), then writes the `idea-brief.md` scaffold. **Copy it to the project root** (it becomes the live `idea-brief.md`) and complete it.

**Step 0b — agent web research** (the signals script can't see):

| Source | What it gives | Example use |
|---|---|---|
| Product Hunt | similar launches + reception | competition pressure |
| Hacker News / X | "nobody made X well" complaints | open gap |
| Competitor sites | pricing, features, gaps | pricing anchor + differentiation |
| Niche subreddits (via script) | pain + language | exact copy for the landing page |

**Step 0c — brainstorm ≥5 product angles** (audience lens, problem-first, feature remix), pick the best **problem-to-effort** winner, and record it in section 4 of the brief.

### Stage 1 — Evaluate the idea (the SaaS evaluator)

Score the winner on the **SaaS scorecard (1–5 each, /35)** — brutal honesty here saves weeks:

| Criterion | Ask |
|---|---|
| Problem clarity | Is it a real, repeated pain — or a nice-to-have? |
| Market size & reachability | Are there enough buyers you can actually reach? |
| Competition | Crowded me-too (low) vs differentiated gap (high)? |
| Monetization | Would they pay? What price? (skip for non-monetized apps) |
| Technical feasibility | Buildable fast with vibe-coding? |
| Moat / why not copyable | Network effects, data, workflow lock-in? |
| Time-to-MVP | Honest weeks-to-first-user estimate |

**Decision:** ≥ 30 **BUILD** · 25–29 **ITERATE** (sharpen problem or scope) · < 25 **PIVOT or KILL** — tell the user the verdict and the top 3 risks before going further. For non-SaaS apps use a lighter value check (real user pain + buildable in a week) instead of the monetization rows.

### Stage 2 — Write `PRD.md` and STOP for approval (the gate)

Copy `templates/prd-template.md` → **`PRD.md`** in the project root and fill it completely:

- **Identity** — name, one-liner, audience, platform, monetized?, stack
- **Problem & validation** — the pain from `idea-brief.md`, with sources
- **MVP scope** — must-have checkboxes (the approval contract), should-have, non-goals
- **User flows** — the happy paths the app must support
- **Data model** — entities, key fields, relations
- **Auth & payments** — identity, ownership rules, billing (only if monetized)
- **Analytics & KPIs** — the number that says "keep going" vs "kill it"
- **Decisions** — everything you rewrote or defaulted from the raw request

Then **present the full file to the user and wait**. The user may **approve** (→ Stage 3), **edit** (revise and re-present), or **reject** (stop). No scaffolding, no code, before approval.

> If the raw prompt is vague ("make an app for productivity"), ask **at most 3** clarifying questions with defaults (audience? monetized? stack?) — never guess silently.

### Stage 3 — Build (vibe-code with craft)

Execute `PRD.md` feature by feature. Pick the stack in the PRD (default: **Next.js + Supabase + Stripe + Vercel** for SaaS; **Vite + Express + SQLite** for tools/MVPs), scaffold with official generators (`npm create next-app@latest`, `npm create vite@latest`), then follow the **vibe-coding craft rules**:

1. **Run early, run often** — the app must start after every change, not at the end.
2. **One feature at a time** — implement → run → verify → commit. No mega-branches.
3. **Follow the PRD, no gold-plating** — extra ideas go in a `NEXT.md` backlog.
4. **Secrets never in code** — `process.env` only, `.env.example` committed, `.env` gitignored.
5. **Tests for the money paths** — auth, billing, anything that deletes data.
6. **Commit after every working feature** — the timeline is the safety net.

Demo the running MVP to the user at the end of the build (or after the first 3 features for big apps) before auditing.

### Stage 4 — Audit for production (automated + auditor subagent)

**Step 4a — run the audit script:**

```bash
node scripts/audit-webapp.mjs --dir . --name {app} --payments   # add --payments only if monetized
```

The script scans the project for production markers — app entry, run/build scripts, `.gitignore`, `.env.example`, **hardcoded secrets**, auth, database, payments, error handling, validation, CORS/rate-limit, tests, lint, CI, deploy config, analytics, SEO — and writes `audit-report.md` with PASS/WARN/FAIL per check plus an auditor section. Exit code 1 if any FAIL.

**Step 4b — spawn the auditor subagent** (fresh eyes — never audit your own work):

```
You are the web-app auditor for the project at {dir} ({name}).
1. Read output/audit/audit-report.md and complete section 2:
   2.1 real secrets anywhere? 2.2 the app actually runs? 2.3 broken/half-built
   screens (dead buttons, TODO stubs, mocked data) 2.4 error states on every
   async view 2.5 mobile responsive 2.6 accessibility basics 2.7 any WARN that
   is really a blocker.
2. Verdict: all PASS and no real WARN → PASS. Any FAIL or WARN you judge real
   → FIX NEEDED with a concrete fix list.
3. Report the verdict + the audit-report.md path.
```

**Step 4c — fix loop.** Any FAIL (or auditor-flagged WARN) → fix → re-run the audit → re-submit to the auditor. **Nothing is delivered until the auditor signs off PASS.**

### Stage 5 — Deliver

- Working app + `PRD.md` + `idea-brief.md` + `audit-report.md` (PASS) in the project folder.
- A production README: what it is, setup, env vars, deploy + rollback runbook.
- Tell the user: the one-line pitch, the scorecard total + verdict, what was built, what's in `NEXT.md`, and the deploy step (Stage 5 helper prompts in `templates/prompts.md`).

---

## Auditor checklist (script + subagent agree on these)

- [ ] App entry point + run script exist; app actually starts
- [ ] No hardcoded secrets; `.env.example` documents every env var; `.env` ignored
- [ ] Auth + ownership checks; database with committed schema + backups
- [ ] Payments wired and verified (if monetized)
- [ ] Error handling + input validation + CORS/rate limiting in place
- [ ] Tests for auth/billing/delete paths; lint passing; CI on push
- [ ] Deploy config, domain/SSL, analytics, SEO meta present
- [ ] No half-built screens, TODO stubs, or mocked data in shipped flows
- [ ] Mobile responsive; empty/loading/error states; accessibility basics
- [ ] Two identical audit runs produce the same verdict (deterministic script)

---

## Example session

**User:** "make an app for freelancers to get paid faster"

**Agent:** *(Stage 0)* `node scripts/research-idea.mjs --niche "freelancer invoicing" --subreddits "freelance,Entrepreneur"` → Reddit pain: "I chase clients for 6 weeks" · Trends: "invoice software". Web-researches 3 competitors (pricing $9–29/mo, all clunky). Brainstorms 5 angles, winner: **"InvoiceFlow — invoices that pay themselves"**.

**Agent:** *(Stage 1)* Scorecard: problem 5, market 4, competition 3, monetization 4, feasibility 5, moat 2, time-to-MVP 4 → **29/35 → ITERATE** — sharpens scope to "one-time invoices + Stripe link, no subscriptions in MVP" → **BUILD**.

**Agent:** *(Stage 2)* Writes `PRD.md`, presents, waits. **User:** "approve"

**Agent:** *(Stage 3)* Next.js + Supabase + Stripe; scaffold → auth → invoice form → Stripe checkout → status dashboard; runs after every feature; commits each one; covers auth + payment webhook with tests.

**Agent:** *(Stage 4)* `node scripts/audit-webapp.mjs --dir . --name invoiceflow --payments` → 1 FAIL (missing CI) + 3 WARN → adds GitHub Actions, fixes WARNs → auditor subagent signs **PASS**.

**Agent:** *(Stage 5)* Delivers: running app + PRD + idea-brief + audit-report (PASS) + README with Vercel deploy runbook.

---

## Production checklist

- [ ] `idea-brief.md` written: demand signals dated + sourced, ≥5 angles, winner locked
- [ ] SaaS scorecard applied (/35); BUILD / ITERATE / PIVOT verdict shared with the user
- [ ] ≤3 clarifying questions if the prompt was vague; no silent guessing
- [ ] `PRD.md` written from `templates/prd-template.md` with **Decisions** section
- [ ] **Approval gate: user explicitly approved before ANY code**
- [ ] Built per the craft rules: runnable at every step, one feature at a time, committed, tests on money paths
- [ ] `audit-webapp.mjs` ran: PASS/WARN/FAIL per check + `audit-report.md` written
- [ ] Auditor subagent signed off **PASS**; any FAIL fixed and re-audited
- [ ] Delivered: working app + `PRD.md` + `idea-brief.md` + `audit-report.md` + production README
