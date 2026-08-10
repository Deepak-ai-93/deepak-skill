# Reel-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-reels.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the reel-auditor for the veo-cinematic-reels pack at {reel-folder}/.

1. Read reels-audit.md (the automated harness results) and every pack file:
   scene-plan.json · prompts.md · character-sheet.md · scene-script.md.

2. Complete Section 2 of reels-audit.md:
   - 2.1 Reel-worthiness scorecard (rate 1–5 each, /50 — a reel worth
     generating scores ≥ 35):
       · Character consistency — every prompt carries the verbatim character
         block + grade + IMAX + world tokens (word-level checks passed)?
         Reference-image reuse plan is real?
       · Hook pull (scene 1) — would the opening scene stop a distracted
         scroller in the first 2 seconds?
       · Retention arc — hook → agitate → payoff → CTA/loop present and
         escalating? Scene count × duration in the 30–60s target?
       · Cinematic action — camera language specific (no vague "cinematic
         shot")? One dominant motion per clip? Lens/tempo/lighting detail?
       · Dialogue/SFX direction — dialogue in quotes with delivery tone?
         SFX/ambient labeled? Voice consistent per character?
       · Continuity — lighting hand-offs written between scenes? No
         wardrobe/hair state contradictions? Bridge flags on the right cuts?
       · Copy-paste readiness — every prompt pure copy-paste into the user's
         tool (no meta-commentary)? One idea per scene?
       · Reference-image readiness — would the character-sheet reference-image
         prompts generate a clean, consistent likeness for the user's tool
         (Ingredients / Elements / image-to-video)?
       · Grade-tone fit — does the locked grade + world token match the reel's
         tone (action/emotional/luxury)?
       · Safety nets — negative prompt per scene? Seed locked across scenes
         when API?
   - 2.2 Creative judgment calls — anything the script couldn't judge:
       · Hooks that read weak, clichéd, or mismatch the topic
       · Prompts that would render poorly (impossible action, character
         drift, text/warping risk, missing audio labels)
       · Continuity cuts that would visibly jump (lighting, wardrobe state,
         location)
       · Tool fit: do the header upload instructions match the user's actual
         generator?
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER FILE (which scene, what to change).

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed reels-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The reel-worthiness scorecard is the **"is it good to go?" gate** — it answers *"would I spend hours generating + editing these scenes in my video tool?"* before anyone pastes a single prompt:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — generate as-is |
| 35–39 | Good — generate with the small fixes listed |
| 25–34 | Weak — fix consistency/arc gaps before generating |
| < 25 | Not ready — rework character sheet + script + prompts stages |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the file → **re-run `audit-reels.mjs`** (and `scene-prompts.mjs` if the plan changed) → re-submit to a fresh auditor. Loop until PASS. The deliverable folder ships `reels-audit.md` with the signed PASS.
