# Worked example — scaffolding `comparison-content`

> A complete worked output of the skill-builder skill: one scaffold run for a
> brand-new skill, from command to contract-complete folder. The live result is
> the `skills/comparison-content/` folder in this repo — this file documents
> exactly what a scaffold produces and what must be filled before shipping.

## 1. The scaffold command
```bash
node skills/skill-builder/scripts/scaffold-skill.mjs \
  --name comparison-content \
  --desc "Turn 'X vs Y' into fair, criteria-scored comparison content ..." \
  --scripts comparison-writer,audit-compare \
  --templates criteria-framework,comparison-formulas,verdict-framework \
  --example 1
```

## 2. What the scaffold produces
```
skills/comparison-content/
├── SKILL.md        # frontmatter + # skill: + quality bar + workflow + checklist (placeholders)
├── scripts/        # comparison-writer.mjs, audit-compare.mjs (banner + opt() + exit codes)
├── templates/      # criteria-framework.md, comparison-formulas.md, verdict-framework.md
└── examples/       # README.md placeholder → replaced with the worked example
```

## 3. Filling the placeholders (the real work)
- **SKILL.md:** quality-bar rails (fair scoring, shared criteria, honest verdict), 5-stage workflow, production checklist.
- **Scripts:** real logic — `comparison-writer.mjs` validates the plan (≥2 contenders, ≥5 shared criteria, verdict present, exit 1 on bias) → writes `comparison.md`; `audit-compare.mjs` audits the pack → `compare-audit.md`.
- **Templates:** real reference docs (criteria rubric, headline formulas, verdict rules).
- **Examples:** one worked comparison pack mirroring the deliverable.
- **Docs wiring:** README row + install row + USAGE.md + prompt-examples.md + install.sh/install.md lists + count bump.

## 4. The contract gate
```bash
node skills/skill-builder/scripts/audit-scaffold.mjs --pack skills/comparison-content --docs
# → 0 FAIL / 0 WARN → spawn the scaffold-auditor subagent → /50 ≥ 35 → PASS
```

> Rule of thumb baked into this example: **scaffold = skeleton, not the skill.**
> A skill is "done" only when every placeholder is filled with real rails, the
> scripts do real work with real exit codes, and the audit signs off PASS.
