# Prompt Pack — vibe-code-webapp (copy-paste for ANY agent)

Install once: `npx skills add Deepak-ai-93/deepak-skill --skill vibe-code-webapp`
Works in Claude Code, Cursor, Windsurf, Codex CLI, Gemini CLI, Antigravity, Grok Build, Freebuff — any CLI with a terminal.

---

## 1. Full pipeline (idea + stack → build pack → approve → build anywhere → audit)

> Using the **vibe-code-webapp** skill, I want to build **{idea}** for **{audience}**.
> Stack preference: **{Next.js / React + Vite / Express / whatever fits}** · Monetized: {yes / no}
> Run the full pipeline: research demand → analyze my idea + stack and evaluate it
> on the SaaS scorecard → write the **build pack** (`PRD.md` + `stack-blueprint.md`
> with the open-source design system + backend architecture + handoff prompts)
> → **wait for my approval** → build it → run the production audit before handover.

## 2. Research only (Stage 0)

> Using the **vibe-code-webapp** skill, research demand for **{idea}**:
> run `node scripts/research-idea.mjs --niche "{niche}" --subreddits "{r1},{r2}" --geo US`,
> then web-research competitors + pricing, and write the completed `idea-brief.md`
> with 5+ product angles. Don't build anything yet.

## 3. Evaluate only (Stage 1 — the SaaS evaluator)

> Using the **vibe-code-webapp** skill, evaluate this idea before building:
> **{idea}** for **{audience}**. Score it 1–5 on all 7 scorecard criteria
> (problem clarity, market size, competition, monetization, feasibility,
> moat, time-to-MVP), give the /35 total and a BUILD / ITERATE / PIVOT verdict
> with the top 3 risks. Be brutally honest — I'd rather kill it now than build a dud.

## 4. Build pack only (Stage 2 — approval gate)

> Using the **vibe-code-webapp** skill, write the **build pack** for **{idea}**:
> `PRD.md` (MVP scope, flows, KPIs) + `stack-blueprint.md` (locked stack,
> design system from the open-source pack, backend architecture, paste-ready
> data model, numbered build order, and filled handoff prompts for CLI +
> Lovable/Bolt/v0). Stack: {Next.js / …}. Show both to me for approval — don't
> write a line of code until I say **approve**.

## 5. Build (Stage 3 — after approval)

> Using the **vibe-code-webapp** skill, build the approved `PRD.md` now.
> Vibe-code it properly: scaffold → run it → one feature at a time, keep the
> app runnable after every step, commit after each working feature, and cover
> auth + {billing} with tests. Demo it to me when the MVP works.

## 6. Production audit (Stage 4)

> Using the **vibe-code-webapp** skill, run the production audit on this app:
> `node scripts/audit-webapp.mjs --dir . --name {app} {--payments}`,
> then spawn the auditor subagent per the skill brief, fix everything it flags,
> and re-audit until the report says PASS.

## 7. Deploy (Stage 5)

> Using the **vibe-code-webapp** skill, get this app to production:
> pick the best host for {Next.js / Vite / Express} (Vercel / Railway / Fly),
> add the deploy config, wire env vars, set up the domain + SSL, and give me
> a copy-paste deploy + rollback runbook in the README.

## 8. Keep the vibe loop going

> Continue with the **vibe-code-webapp** skill: from the current state of the
> app, pick the next highest-impact thing in `PRD.md`, implement it, run it,
> commit. Keep the app green and demoable at all times.

## 9. Analyze + evaluate only (idea + stack in → verdict out)

> Using the **vibe-code-webapp** skill, analyze this idea and stack preference,
> then evaluate before anything is built: **{idea}**, stack **{Next.js / Vite / …}**,
> for **{audience}**. Confirm the stack fits (or say why not), score 1–5 on all
> 7 criteria, give the /35 total and BUILD / ITERATE / PIVOT with top 3 risks.
> Be brutally honest — I'd rather kill it now than build a dud.

## 10. Build anywhere — handoff prompts (paste the approved build pack)

### CLI agent

> Build the app in `PRD.md` + `stack-blueprint.md` exactly — follow the build
> order, keep the app runnable after every step, commit after each working
> feature, tests for auth + billing. Don't redesign; apply the locked design
> system and architecture as-is.

### Lovable / Bolt / v0 (paste this + the blueprint's §7 details)

> Build a production-ready web app: **{one-liner}**. Stack: Next.js + TypeScript
> + Tailwind v4 + shadcn/ui + Drizzle + Postgres + Auth.js + Stripe + Vercel.
> Pages: **{list}**. Design: neutral shadcn tokens, accent **{hue}**, Geist fonts,
> **{component list}**. Data model: **{tables}**. Auth: email/Google sign-in,
> protect /dashboard. Payments: **{checkout + webhook → status}**. Features in
> order: **{must-haves}**. Quality: mobile responsive, empty/loading/error
> states, accessibility, SEO meta. Run/verify after every step, no gold-plating.

### Any tool, re-prompt after edits

> Keep this project's design system and architecture unchanged. Implement the
> next item from `PRD.md`'s must-haves exactly as scoped; run it; verify; commit.

---

## The vibe-coding craft rules (what these prompts enforce)

1. **Run early, run often** — the app must start after every change, not at the end.
2. **One feature at a time** — implement → run → verify → commit. No mega-branches.
3. **No gold-plating** — build what `PRD.md` says; ideas for later go in a `NEXT.md` backlog.
4. **Tests for the money paths** — auth, billing, and anything that deletes data.
5. **Secrets never in code** — `process.env` only, `.env.example` committed, `.env` ignored.
6. **Production audit before handover** — every deliverable passes `audit-webapp.mjs` + the auditor.
