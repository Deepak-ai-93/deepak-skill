# TODO — InvoiceFlow

> **Confirmed:** NO · by: — · on: —
> The build may **NOT** start until the user approves this list (SKILL.md Stage 3 gate).
> Manage: `node scripts/todo.mjs list | add "task" --p P1 | priority <id> P0 | done <id> | blocked <id> | confirm`
> Scope: InvoiceFlow MVP — new Next.js app

## P0 — do first
- [ ] (P0) #1 Scaffold create-next-app (TS, Tailwind, App Router) — ref: blueprint §6.1
- [ ] (P0) #2 Design tokens + fonts + theme provider + base layout (indigo accent) — ref: blueprint §6.2
- [ ] (P0) #3 Drizzle schema + migrations + db client — ref: blueprint §6.3
- [ ] (P0) #4 Auth (lib/auth + middleware + login/signup + session) — ref: blueprint §6.4
- [ ] (P0) #5 Dashboard + invoice list with status badges — ref: blueprint §6.5
- [ ] (P0) #6 Create + send invoice (form, zod, pay token) — ref: blueprint §6.6
- [ ] (P0) #7 Public pay page /p/:token + Stripe Checkout — ref: blueprint §6.7
- [ ] (P0) #8 Webhook → paid status + payment record — ref: blueprint §6.8
- [ ] (P0) #12 Production audit + deploy (deploy-setup.mjs → Vercel) — ref: blueprint §6.12

## P1 — important
- [ ] (P1) #9 AI reminder copilot (streaming off, template fallback) — ref: blueprint §6.9
- [ ] (P1) #10 Analytics + SEO + error/empty states + polish — ref: blueprint §6.10
- [ ] (P1) #11 Tests for auth/billing + CI — ref: blueprint §6.11

## P2 — nice to have
- [ ] (P2) #13 Payment-reminder email after 7 days (from the interview)
- [ ] (P2) #14 Google OAuth (from the interview)
- [ ] (P2) #15 PDF export (from the interview)
- [ ] (P2) #16 Annual discount (20%) (from the interview)
- [ ] (P2) #17 Churn email for canceled accounts (from the interview)

## Done
_Completed tasks move here (status `[x]`) — `node scripts/todo.mjs done <id>`._

---

## Task line format (one task per line, agent- and human-readable)

```
- [ ] (P1) #N Example task — ref: PRD-4
```

- **Status:** `[ ]` todo · `[~]` doing · `[!]` blocked · `[x]` done

- **Priority:** `(P0)` do first · `(P1)` important · `(P2)` nice to have

- **ID:** `#n` — assigned by `todo.mjs add`, never reused; used by `priority/done/doing/blocked/todo/remove`

- **Reference:** `— ref: PRD-4` links a task to the PRD/blueprint (optional)


## How this list works (the contract)

- **The user owns the list.** The agent proposes it; the user **confirms** it (gate), adds tasks, and changes priorities at any time — even mid-build.

- **Priorities:** `P0` = do first (blocks everything else) · `P1` = important · `P2` = nice to have. Order within a group is the suggested build order.

- **Confirm:** the agent runs `node scripts/todo.mjs confirm` only after the user explicitly approves. The build pack (`PRD.md` + `stack-blueprint.md` + `sitemap.md`) and this list are confirmed together — no code before both are approved.

- **Done only when verified:** a task is `done` after it runs and is verified — not when the code is merely written.

- **Script owns the four sections** (`P0/P1/P2/Done`): `todo.mjs` re-sorts tasks into them on every change. Keep prose notes **above the list** or **under the Done section**.
