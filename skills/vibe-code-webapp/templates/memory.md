# Memory — {App Name}

> **Copy this file to `MEMORY.md` (project root).** It is the project's shared brain.
> **User rule:** read it anytime to see where things stand; add your own lines under today's date.
> **Agent rule:** read it at the START of every session and append today's entry at the END — so any tool (Claude Code, Cursor, Freebuff, Lovable, …) can pick up exactly where the last one left off.
> **One file, append-only:** never rewrite history; new days go at the bottom.

## Project
- **Goal:** {one line — e.g. "InvoiceFlow — invoices freelancers actually get paid on"}
- **Stack (locked):** {e.g. Next.js 15 + TS + Tailwind/shadcn + Drizzle/Postgres + Auth.js + Stripe}
- **Where we are:** {e.g. Stage 4 — building the invoice form · or: launched, now on feature #6}
- **Pack:** `PRD.md` + `stack-blueprint.md` + `sitemap.md` (full sitemap, pages, backend, workflows) + `TODO.md` (confirmed {date}) — the contract for this build.

## Standing decisions (decided once, never re-litigated)
- {e.g. Neutral shadcn tokens, indigo accent, Geist fonts — per design-system.md}
- {e.g. One-time Stripe checkout in MVP; subscriptions later (P2)}
- {e.g. Every table gets user_id FK + created_at; soft-delete invoices}

## Known lessons & gotchas
- {e.g. Stripe webhook must return 200 fast or Stripe retries forever}
- {e.g. `npm run dev` fails if .env missing DATABASE_URL — check .env.example first}

## Open questions
- {e.g. Should invoices expire after 30 days? (asked in PRD §10 — answer when we ship reminder emails)}

---

## {2026-08-08}
- **Did:** {what got built / researched / decided today — 1–8 bullets}
- **Decided:** {new decisions → also move to "Standing decisions" if lasting}
- **Blocked:** {what's stuck and why}
- **Next:** {the immediate next step — the agent starts here next session}

## {2026-08-07}
- …

---

## Protocol (what the agent does with this file)

1. **Session start:** read `MEMORY.md` first. Greet the user with *"Picking up from {last date}: next up is …"* — the memory is the context, no re-asking what was already decided.
2. **During the session:** when a lasting decision is made ("we'll use X"), append it to **Standing decisions** immediately — not only at the end.
3. **Session end:** append a `## YYYY-MM-DD` section with **Did / Decided / Blocked / Next** (≤8 bullets each, concrete, tool-neutral). Write it so any other tool could continue.
4. **User writes too:** if the user pastes a note ("remember: pricing is $9 not $12"), add it under today's date and flag what changed.
5. **Missing file:** initialize it from this template before the first build session (Stage 0 of the skill).
6. **Memory is cheap, rediscovery is expensive:** when in doubt about a decision, check MEMORY.md first.
