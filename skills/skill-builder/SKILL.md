---
name: skill-builder
description: Scaffold new Agent Skills that match the deepak-skill repo conventions — generates the folder, SKILL.md (frontmatter + quality bar + workflow stages + production checklist), scripts (with the Deepak brand banner), templates, and examples, then validates the scaffold and wires it into README/USAGE/prompt-examples. Use whenever the user wants to add a new skill to this repo or build a standalone skill for skills.sh.
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: skill-builder
     https://github.com/Deepak-ai-93/deepak-skill · MIT license
     ════════════════════════════════════════════════════════════════════════ -->

```
   ██████╗ ███████╗███████╗██████╗  █████╗ ██╗  ██╗
   ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗██║ ██╔╝
   ██║  ██║█████╗  █████╗  ██████╔╝███████║█████╔╝
   ██║  ██║██╔══╝  ██╔══╝  ██╔══██╗██╔══██║██╔═██╗
   ██████╔╝███████╗███████╗██║  ██║██║  ██║██║  ██╗
   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
```

**🎬 deepak-skill — crafted by Deepak** · skill: `skill-builder` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: skill-builder

**Name:** Skill Builder (meta) — scaffold new skills the deepak-skill way
**Description:** Creates a **new skill folder** that follows this repo's proven conventions — the structure, the SKILL.md contract, the Deepak-branded scripts, the docs wiring — so a new skill starts complete, not half-built. Run it once per new skill; the scaffold is the skeleton you then fill with the skill's real logic.

---

## What a deepak-skill skill looks like (the contract)

Every skill in this repo ships the same shape, and skill-builder reproduces it:

```
skills/<skill-name>/
├── SKILL.md                  # frontmatter (name + description) + the full playbook
├── scripts/                  # zero-dependency Node scripts, each with the brand banner
│   └── <tool>.mjs            #   🎬 deepak-skill — crafted by Deepak
├── templates/                # copy-paste reference docs (prompts, formulas, checklists)
└── examples/                 # one complete worked example, mirroring the SKILL's deliverable
```

**The SKILL.md contract** (all 8 existing skills follow it):
1. YAML frontmatter: `name` + `description` (the description is what agents match against — make it rich).
2. `# skill: <name>` + a one-line Name/Description intro.
3. **The quality bar** — a non-negotiable table (3–5 rails) defining what "done" means.
4. **When to use** — trigger phrases.
5. **The methodology/workflow** — numbered stages, ending in a validation/audit stage.
6. **Production checklist** — the final gate.
7. Zero dependencies where possible; scripts use the tiny `opt()` arg parser, exit codes 0/1/2, and print the **brand banner**.

---

## Workflow (5 stages)

### Stage 1 — Interview the skill (≤3 questions)
Extract: **skill name** (kebab-case, `<what>-<descriptor>` — e.g. `podcast-to-shorts`, `blog-seo-content`) · **what it produces** (the deliverable) · **who uses it** (creator/team type) · **triggers** (example user phrases) · **script needs** (any CLI tooling, or pure copywriting?).

If the user just says "give me skill ideas" or "add a skill for X", propose 2–3 concrete skill names from their request + the repo's gaps, and let them pick before scaffolding.

### Stage 2 — Scaffold the folder
Run:
```bash
node scripts/scaffold-skill.mjs --name <skill-name> --desc "one-line description" [--scripts tool1,tool2] [--templates doc1,doc2] [--example 1]
```
This creates `skills/<skill-name>/` with:
- `SKILL.md` — the full contract skeleton (quality bar rails + 5-stage workflow + production checklist, filled from `templates/SKILL-skeleton.md`)
- one `.mjs` per `--scripts` entry — with the `opt()` arg parser + **Deepak brand banner** pre-installed (from `templates/script-banner.mjs`)
- one `.md` per `--templates` entry — copy-paste reference placeholders
- an `examples/` folder with a README placeholder when `--example 1`

Then **verify** the scaffold: `node scripts/scaffold-skill.mjs --list` shows every skill (name, description, has-scripts/has-templates/has-examples). Every generated script must run cleanly (`node <script>.mjs` → usage message, exit 2).

### Stage 3 — Fill in the real content
Replace every `{{PLACEHOLDER}}` in the generated files with the actual methodology:
1. **SKILL.md** — the quality bar rails specific to this skill, the real workflow stages, the production checklist. (Borrow patterns from sibling skills: video skills borrow the audit stage, marketing skills borrow the anti-fluff contract, email/webapp skills borrow the EEAT section.)
2. **Scripts** — implement the actual tooling with zero deps (Node builtins only). Keep the banner + arg parser.
3. **Templates** — real reference docs (formulas, prompts, checklists), not placeholders.
4. **Examples** — one complete worked example mirroring the skill's deliverable.

### Stage 4 — Wire into the repo docs
Update so the skill is discoverable and installable:
- `README.md` — add a row to the skills table + an install-options row (`npx skills add Deepak-ai-93/deepak-skill --skill <name>`) + a usage section + the verify-ls block.
- `USAGE.md` — add the skill to the "all N skills" count and a short usage blurb.
- `prompt-examples.md` — add a numbered section with example prompts (sloppy + premium).

### Stage 5 — Audit harness (automated checks + scaffold-auditor subagent, before delivery)
**Step 5a — run the automated audit harness:**
```bash
node scripts/audit-scaffold.mjs --pack skills/<skill-name> --docs --out scaffold-audit.md
```
`audit-scaffold.mjs` checks the new skill against the repo contract: SKILL.md (frontmatter name+description, # skill header, quality bar, when-to-use, numbered stages, an audit stage, production checklist), scripts/ (brand banner, opt() parser), templates/ + examples/ presence, and — with `--docs` — the repo docs wiring (README row + install row, USAGE, prompt-examples, install.sh/install.md, consistent skill count). Writes `scaffold-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 5b — spawn the scaffold-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/scaffold-auditor-brief.md`: completes the **scaffold-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth shipping**, with verdict bands), makes the creative judgment calls the script can't (methodology quality, rail enforceability, ship-readiness), and signs **PASS / FIX NEEDED** with per-file fixes.

**Step 5c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix the scaffold → re-run `audit-scaffold.mjs` → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `scaffold-audit.md` ships with the skill folder. Then optionally commit + push (only after user says so).

---

## Production checklist

- [ ] Skill name is kebab-case `<what>-<descriptor>` and doesn't collide with an existing skill
- [ ] `SKILL.md`: frontmatter (name + description), quality bar table, when-to-use, numbered workflow, production checklist
- [ ] Every script: `opt()` arg parser, Deepak brand banner, usage-on-no-args exits 2, zero external deps
- [ ] Templates are real reference docs (not placeholders)
- [ ] `examples/` has at least one complete worked example
- [ ] README: skills-table row + install row + usage section + verify-ls updated
- [ ] USAGE.md: skill count updated
- [ ] prompt-examples.md: new numbered section with sloppy + premium prompts
- [ ] All new scripts run clean (banner + exit codes verified)
- [ ] **Audit harness run:** `audit-scaffold.mjs --pack skills/<name> --docs` → automated checks (contract, scripts, templates/examples, docs wiring) — exit 0
- [ ] **Scaffold-auditor subagent** (fresh eyes) completed the scaffold-worthiness scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `scaffold-audit.md`
- [ ] Skill count in all three docs is consistent
