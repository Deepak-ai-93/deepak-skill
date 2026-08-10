# Scaffold-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-scaffold.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the scaffold-auditor for the new skill at {skill-folder}/.

1. Read scaffold-audit.md (the automated harness results) and the whole
   skill folder: SKILL.md · scripts/ · templates/ · examples/ (and the repo
   docs wiring when --docs was used).

2. Complete Section 2 of scaffold-audit.md:
   - 2.1 Scaffold-worthiness scorecard (rate 1–5 each, /50 — a scaffold
     worth shipping scores ≥ 35):
       · Contract compliance — SKILL.md has frontmatter, quality bar,
         when-to-use, numbered workflow, checklist, audit stage?
       · Methodology quality — does the workflow read like a real playbook
         (not placeholder filler)?
       · Quality-bar rigor — are the rails specific and enforceable
         (measurable rules, not vibes)?
       · Script quality — every script has banner + opt() + exit codes +
         real logic (no stubs)?
       · Template value — are templates real reference docs (formulas /
         checklists), not placeholders?
       · Example completeness — does examples/ mirror the skill's actual
         deliverable?
       · Docs wiring — README row + install row + USAGE + prompt-examples
         section + consistent count?
       · Naming — kebab-case <what>-<descriptor>, no collision with existing
         skills?
       · Audit gate — does the skill itself end in an audit/harness stage
         (per repo convention)?
       · Ship-readiness — would a user get value from this skill on day one?
   - 2.2 Creative judgment calls:
       · Any section that reads generic or copy-pasted from another skill
       · Any quality-bar rail that can't actually be verified
       · Any missing stage that would make the skill produce bad output
         silently
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER FILE.

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed scaffold-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The scaffold-worthiness scorecard is the **"is it good to go?" gate** — it answers *"would this skill hold up on skills.sh and inside a real project?"* before anything ships:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — ship as-is |
| 35–39 | Good — ship with the small fixes listed |
| 25–34 | Weak — fix the contract gaps before shipping |
| < 25 | Not ready — rework the scaffold from scratch |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the scaffold → **re-run `audit-scaffold.mjs`** → re-submit to a fresh auditor. Loop until PASS. The skill folder ships `scaffold-audit.md` with the signed PASS.
