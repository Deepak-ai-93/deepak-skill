# Shoot-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-shoot.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the shoot-auditor for the photoshoot-studio pack at {shoot-folder}/.

1. Read shoot-audit.md (the automated harness results) and every pack file:
   shoot-plan.json · prompts.md · subject-sheet.md · shot-list.md.

2. Complete Section 2 of shoot-audit.md:
   - 2.1 Shoot-worthiness scorecard (rate 1–5 each, /50 — a shoot worth
     generating scores ≥ 35):
       · Subject consistency — every prompt carries the verbatim subject block
         + grade + craft tokens (word-level checks passed)? Reference-image
         reuse plan is real?
       · Subject-likeness plan — would the subject-sheet reference-image
         prompts generate a clean, consistent likeness (face or product)?
       · Shoot arc — hero → detail → lifestyle → closing/CTA present and
         sensible for the brief?
       · Photography language — camera body + lens + f-stop + lighting setup
         specific (no "professional photo" vagueness)?
       · Aspect ratios — every shot's aspect matches its platform (4:5 feed,
         1:1 grid, 9:16 stories, 16:9 banner, 3:2 print)?
       · Edit prompts — each Edit: prompt describes ONLY the change (no
         subject re-description)?
       · Grade-tone fit — does the locked grade token match the shoot's tone
         (editorial/luxury/commercial/candid)?
       · Copy-paste readiness — every prompt pure copy-paste into
         Flow/Midjourney/Flux (no meta-commentary)?
       · Tool fit — do the upload notes match the user's tool (Ingredients /
         --cref / reference image)?
       · Retouch readiness — are edit prompts available for shots that
         obviously need them (outfit/background/light changes)?
   - 2.2 Creative judgment calls:
       · Shots whose pose/placement/setting would look forced or render poorly
       · Edit prompts that would change more than the intended region
       · Any shot that would visibly break the subject's identity (hair, face,
         outfit, product build/color)
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER FILE (which shot, what to change).

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed shoot-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The shoot-worthiness scorecard is the **"is it good to go?" gate** — it answers *"would I spend hours generating + retouching these shots?"* before anyone generates a single image:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — generate as-is |
| 35–39 | Good — generate with the small fixes listed |
| 25–34 | Weak — fix consistency/aspect gaps before generating |
| < 25 | Not ready — rework subject sheet + shot list + prompts stages |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the file → **re-run `audit-shoot.mjs`** (and `shot-prompts.mjs` if the plan changed) → re-submit to a fresh auditor. Loop until PASS. The deliverable folder ships `shoot-audit.md` with the signed PASS.
