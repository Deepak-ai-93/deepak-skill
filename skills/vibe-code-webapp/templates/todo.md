# TODO — {App Name}

> **Confirmed:** NO · by: — · on: —
> The build may **NOT** start until the user approves this list (SKILL.md Stage 3 gate).
> Manage: `node scripts/todo.mjs list | add "task" --p P1 | priority <id> P0 | done <id> | blocked <id> | confirm`
> Scope: {one line — what this list covers, e.g. "MVP for InvoiceFlow — extend the existing Next.js app"}

## P0 — do first
_Add P0 tasks with `node scripts/todo.mjs add "task" --p P0`._

## P1 — important
_none yet_

## P2 — nice to have
_none yet_

## Done
_Completed tasks move here (status `[x]`) — `node scripts/todo.mjs done <id>`._

---

## Task line format (one task per line, agent- and human-readable)

```
- [ ] (P1) #3 Create the invoice form — ref: PRD-4
```

- **Status:** `[ ]` todo · `[~]` doing · `[!]` blocked · `[x]` done
- **Priority:** `(P0)` do first · `(P1)` important · `(P2)` nice to have
- **ID:** `#3` — assigned by `todo.mjs add`, never reused; used by `priority/done/doing/blocked/todo/remove`
- **Reference:** `— ref: PRD-4` links a task to the PRD/blueprint (optional)

## How this list works (the contract)

- **The user owns the list.** The agent proposes it; the user **confirms** it (gate), adds tasks, and changes priorities at any time — even mid-build.
- **Priorities:** `P0` = do first (blocks everything else) · `P1` = important · `P2` = nice to have. Order within a group is the suggested build order.
- **Status markers:** `[ ]` todo · `[~]` doing · `[!]` blocked · `[x]` done.
- **IDs** (`#n`) are assigned by `todo.mjs add` and never reused — stable for `priority/done/doing/blocked/todo/remove`.
- **Confirm:** the agent runs `node scripts/todo.mjs confirm` only after the user explicitly approves (verbally or via chat). The build pack (`PRD.md` + `stack-blueprint.md` + `sitemap.md`) and this list are confirmed together — no code before both are approved.
- **User changes mid-build:** "make task 4 P0" → `node scripts/todo.mjs priority 4 P0`. "add a task" → `node scripts/todo.mjs add "…" --p P1`. The agent then works the new order and says what changed.
- **Done only when verified:** a task is `done` after it runs and is verified — not when the code is merely written.
- **Keep the list in sync with the pack:** if a confirmed task contradicts `PRD.md`, `stack-blueprint.md` or `sitemap.md`, update them and re-confirm scope with the user.
- **Script owns the four sections** (`P0/P1/P2/Done`): `todo.mjs` re-sorts tasks into them on every change. Keep prose notes **above the list** or **under the Done section** — non-task lines between tasks are not preserved by the script. You can also edit the file by hand; the script only parses lines matching the exact format above.
