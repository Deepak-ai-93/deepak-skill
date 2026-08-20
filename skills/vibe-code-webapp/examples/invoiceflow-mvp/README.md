# Worked example — "InvoiceFlow" MVP build pack

> A complete worked output of the vibe-code-webapp skill for one app —
> **produced by the skill's own scripts** so the example mirrors the real
> deliverable. `pack-plan.json` is the ONE input file the agent authors;
> `generated/` is what `pack-builder.mjs` produced from it — no hand-written
> pack files in this example, exactly like a real Stage 3.

## 1. How this pack was produced (run the scripts yourself)

```bash
cd skills/vibe-code-webapp

# ONE input file: the interview + research + validation + design answers
node scripts/pack-builder.mjs --plan examples/invoiceflow-mvp/pack-plan.json --check-only   # validate
node scripts/pack-builder.mjs --plan examples/invoiceflow-mvp/pack-plan.json --out-dir examples/invoiceflow-mvp/generated

# validation.md (Stage 2) — the scorecard that gates the build
node scripts/saas-score.mjs --scores 5 4 4 5 5 3 4 --out examples/invoiceflow-mvp/generated/validation.md
```

## 2. Files in this example

```
pack-plan.json            ← the ONE input (agent-authored, script-validated)
creator-portfolio.md      ← cross-project memory (Stage 0 read / Stage 7 write-back)
generated/
├── PRD.md                ← what to build (approval contract)
├── stack-blueprint.md    ← exactly HOW — stack lock, design tokens, data model, build order
├── sitemap.md            ← every route, page, endpoint, workflow
├── TODO.md               ← task list in todo.mjs format (17 tasks, P0/P1/P2)
└── validation.md         ← 30/35 → BUILD + kill guardrail + validation moves
```

## 3. Validation (from `saas-score.mjs`)

- `--scores 5 4 4 5 5 3 4` → **30/35 → BUILD**; kill criteria: none hit; unit economics: margin 82%, payback 6 mo.
- Kill guardrail: "if fewer than 10 paying users by day 45 → iterate (usage-based pricing) or kill."

## 4. The productivity layer this example demonstrates

| Script | What it replaces | Gain |
|---|---|---|
| `pack-builder.mjs` | hand-writing PRD + blueprint + sitemap + TODO | one JSON instead of four files; placeholder gate (exit 1) kills incomplete packs |
| `pack-builder.mjs --batch` | one pack per run | N ideas → N validated packs in one run |
| `progress.mjs` | "where are we?" in prose | deterministic stage log (0 Onboard → 7 Deliver) |
| `deploy-setup.mjs` | doc-only deploy | real `vercel.json`/CI/`deploy-runbook.md` — deploy is scripted |
| `package-deliverable.mjs` | loose file trees | `HANDOFF.md` + `manifest.json` + one ZIP per app |
| `creator-portfolio.md` | re-asking decided things | defaults loaded at Stage 0, written back at Stage 7 |

## 5. Where the rest of the skill's flow fits (not re-produced here)

- `scan-project.mjs` (existing-project mode) and `research-idea.mjs` (Stage 1) hit live web sources — run them fresh per project.
- `audit-webapp.mjs` runs on the BUILT app (needs the codebase).
- `deploy-setup.mjs --host vercel --name invoiceflow --domain invoiceflow.app` would generate the real deploy artifacts for this pack.
- `todo.mjs confirm` is the approval gate — the generated `TODO.md` ships with **Confirmed: NO** on purpose.