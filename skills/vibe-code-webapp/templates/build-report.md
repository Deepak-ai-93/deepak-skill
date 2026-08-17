# Build Report — {App Name}

> **Copy this file to `build-report.md` (project root) when the build starts**
> (Stage 4). Append a session section per working session. This report must be
> **proper and detailed** — it is handed to the everything-auditor (Stage 6),
> and a vague report gets sent back. Every claim has evidence: a command, a
> test result, a path, a screenshot URL.

---

## Session 1 · {YYYY-MM-DD} · Duration: {e.g. 3h · 4 tasks}

### 1. Session summary
- **Goal this session:** {e.g. "Ship the confirmed MVP tasks 1–4: scaffold, tokens, schema, auth."}
- **Mode:** {new project / existing project — extension of …}
- **Outcome:** {e.g. "3 of 4 tasks done and verified; auth blocked on missing GOOGLE_CLIENT_ID"}

### 2. Tasks worked (map to TODO.md)
| TODO id | Task | Status | Verified how |
|---|---|---|---|
| #1 | {Scaffold Next.js app} | done | `npm run dev` → 200 at localhost:3000 |
| #2 | {Design tokens + base layout} | done | landing renders at `/`, tokens in globals.css |
| #3 | {Drizzle schema + migration} | done | `npm run db:check` passed; `db/schema.ts` + migration committed |
| #4 | {Auth (login/signup)} | **blocked** | waiting on `AUTH_GOOGLE_ID` from user — `todo.mjs blocked 4` |

### 3. What was built (detailed)
- **{Feature/task}** — `{file paths}` — how it works: {2–5 sentences}. Evidence: {command/output/test}.
- **{Feature/task}** — `{file paths}` — how it works: {…}. Evidence: {…}.

### 4. Deviations from the plan (stack-blueprint §6 / PRD / sitemap)
- {e.g. "Blueprint said Auth.js credentials+Google; wired Google first because email verification adds a step — kept credentials in the blueprint for later." — **and** the blueprint/TODO was updated to match, or is flagged for update.}
- {Any scope change → re-confirmed with user? yes/no + when}

### 5. Decisions made (→ also recorded in MEMORY.md Standing decisions)
- {e.g. "Stripe test mode keys go in `.env.local`; `NEXT_PUBLIC_` only for publishable key."}

### 6. Tests run
| Test | Command | Result |
|---|---|---|
| {Auth redirect when logged out} | {npm test … / manual} | {PASS / FAIL + fix} |
| {Stripe webhook signature} | {…} | {PASS} |

### 7. Risks & open issues
- {e.g. "No rate limit on login yet — P2 task added (#9)." · "Invoice PDF export untested."}

### 8. Memory & report status
- `MEMORY.md`: {appended today? standing decisions updated? next-line set?}
- This report: {complete? anything missing?}

### 9. Next steps (what the next session starts with)
1. {e.g. "Get AUTH_GOOGLE_ID from user → finish task #4."}
2. {e.g. "Task #5: invoice form (ref PRD-4)."}

---

## Session 2 · {YYYY-MM-DD} · Duration: {…}
… (same sections)

---

## Final delivery section (after the everything-auditor signs off)

### A. Everything-auditor verdict
- **Verdict:** {PASS / CHANGES NEEDED}
- **Hardening fixes applied:** {list — from audit FAILs / auditor findings}
- **Tests added (test harness):** {list}
- **Brainstormed next ideas:** {3–5 angles → NEXT.md / P2 tasks}
- **Skill feedback submitted:** {suggested edits to SKILL.md / templates — approved by user: yes/no}

### B. Handover checklist
- [ ] App runs; first user flow works end-to-end
- [ ] `audit-report.md` = PASS
- [ ] `TODO.md` all done (or blocked with reasons) — confirmed gate history intact
- [ ] `MEMORY.md` current (today's entry + standing decisions)
- [ ] README: setup, env vars, deploy + rollback runbook (links `deploy-runbook.md`)
- [ ] `deploy-runbook.md` written from the template — ONE host, env vars mapped, verification list run, rollback steps; app actually deployed
- [ ] Handoff prompt (from `stack-blueprint.md` §7) given to the user for their favorite builder
