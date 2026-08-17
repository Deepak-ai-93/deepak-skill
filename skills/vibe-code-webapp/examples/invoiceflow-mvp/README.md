# Worked example — "InvoiceFlow" MVP build pack

> A complete (compact) worked output of the vibe-code-webapp skill for one app:
> scan → interview → validation → build pack → confirmed TODO → MEMORY.
> Every file below lives in the project root — nothing global, all committed.

## 1. Pack files (all project-local)
```
MEMORY.md  PRD.md  stack-blueprint.md  sitemap.md  TODO.md  BUILD.md
build-report.md  validation.md  idea-brief.md  audit-report.md  deploy-runbook.md
output/scan/project-scan.md  output/audit/audit-report.md
```

## 2. Validation (excerpt)
- `saas-score.mjs --scores 5 4 4 5 5 3 4` → **30/35 → BUILD**; kill criteria: none hit; unit economics: margin 82%, payback 6 mo.
- Kill guardrail: "if < 10 paying users by day 45 → iterate (usage-based pricing)".

## 3. Stack blueprint (excerpt — locked, zero open decisions)
- Next.js 15 + TS + Tailwind v4 + shadcn/ui · Drizzle + Neon/Postgres · Auth.js · Stripe Checkout + webhook · Vercel + PostHog.
- Build order 1–9 (scaffold → tokens → schema → auth → invoice form → payments → tests → audit → **deploy per deploy-runbook.md**).

## 4. Confirmed TODO (excerpt)
```
TODO — InvoiceFlow · Confirmed: YES · by: user · on: 2026-08-17
## P0 — do first
- [ ] (P0) #1 Scaffold Next.js app — ref: blueprint §6.1
- [ ] (P0) #2 Drizzle schema + migration — ref: blueprint §5
## P1 — important
- [ ] (P1) #3 Invoice form — ref: PRD-4
```

## 5. MEMORY.md (excerpt — today's entry)
```
## 2026-08-17
- Did: shipped tasks #1–#2 (scaffold, schema); deploy via deploy-runbook.md (Vercel) done, /api/health 200
- Decided: one-time Stripe checkout in MVP; subscriptions later (P2)
- Blocked: nothing
- Next: task #3 invoice form (ref PRD-4)
```

## 6. Audit (excerpt)
- `audit-webapp.mjs --dir . --name invoiceflow --payments` → **PASS** (deploy-runbook present, no secrets, runs).
- Auditor + everything-auditor signed off **PASS**; hardening (webhook idempotency) + subscription-cancel test applied.
