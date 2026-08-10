# Series-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-series.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the series-auditor for the episodic story series pack at {series-folder}/.

1. Read series-audit.md (the automated harness results) and every pack file:
   series-plan.json · story-bible.md · character-sheet.md · prompts.md ·
   voiceover.md.

2. Complete Section 2 of series-audit.md:
   - 2.1 Consistency-worthiness scorecard (rate 1–5 each, /50 — a series
     worth generating scores ≥ 35):
       · Cross-episode consistency — every prompt carries the verbatim
         character blocks + grade + cinematic + world tokens (word-level
         checks passed)? Ingredients reuse plan is real?
       · Episode-1 hook pull — would the Episode 1 hook stop a distracted
         scroller in the first 2 seconds?
       · Cliffhanger pull — does every episode end on a loop that makes you
         click Episode 2?
       · Cinematic action — camera language specific (no vague "cinematic
         shot")? One dominant motion per clip? Physics/motion blur on action?
       · Voiceover direction — lines in-character with concrete delivery
         tones? VO sheet covers every speaking scene?
       · Story logic — does the season arc hold together (hooks → cliffhangers
         → payoff)? Continuity written across episode boundaries?
       · Copy-paste readiness — every prompt pure copy-paste into Flow (no
         meta-commentary)? One idea per scene?
       · Reference-image readiness — would the character-sheet reference-image
         prompts generate a clean, consistent likeness to anchor Flow's
         Ingredients?
       · Genre-grade fit — does the locked grade/world/cinematic token match
         the chosen genre preset (comic/love/action/thriller/fantasy)?
       · Retention pacing — do scenes escalate (hook → rise → turn →
         cliffhanger) per episode, and does the season escalate overall?
   - 2.2 Creative judgment calls — anything the script couldn't judge:
       · Hooks/cliffhangers that read weak, clichéd, or break season logic
       · Prompts that would render poorly (impossible action, character
         drift, text/warping risk, missing native-audio labels)
       · Voiceover delivery tones that don't fit character or genre
       · Continuity cuts that would visibly jump (lighting, wardrobe state,
         location across scenes/episodes)
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER FILE (which scene, what to change).

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed series-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The consistency-worthiness scorecard is the **"is it good to go?" gate** the user asked for — it answers *"would I spend hours generating + editing these scenes?"* before anyone pastes a single prompt into Flow:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — generate as-is |
| 35–39 | Good — generate with the small fixes listed |
| 25–34 | Weak — fix story/consistency gaps before generating |
| < 25 | Not ready — rework bible + character sheet + prompts stages |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the file → **re-run `audit-series.mjs`** (and `series-arc.mjs` / `episode-prompts.mjs` if the plan changed) → re-submit to a fresh auditor. Loop until PASS. The deliverable folder ships `series-audit.md` with the signed PASS.
