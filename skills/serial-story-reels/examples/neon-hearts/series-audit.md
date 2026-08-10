# Series Audit — neon-hearts

**Automated checks (2026-08-10):** 16 PASS · 0 WARN · 0 FAIL · **automated verdict:** PASS (pending auditor)

## 1. Automated results

| Status | Check | Detail |
|---|---|---|
| PASS | arc re-validation | ≥2 episodes · hooks + cliffhangers present · characters defined · tokens locked |
| PASS | prompts.md scenes | 12 scene prompt(s) parsed |
| PASS | prompts.md self-verify | 12 ✅ — all scenes consistency-verified |
| PASS | prompts.md header | ingredients + do-once notes present |
| PASS | prompts.md continuity | series continuity notes present |
| PASS | per-scene token consistency | 12/12 prompts carry verbatim character blocks + grade + cinematic + world |
| PASS | bridge continuity | 3 scene(s) 🔗 match the 3 planned bridge(s) |
| PASS | cinematic language | 12/12 prompts carry specific camera language (shot size + motion + optics) |
| PASS | voiceover coverage | 12 line(s) in the sheet |
| PASS | voiceover completeness | 12 lines cover 12 speaking scene(s) |
| PASS | voiceover voice-anchor | voice-anchor note present |
| PASS | character sheet cast | 2/2 characters present |
| PASS | character sheet reference images | reference-image prompts + upload-to-Ingredients note present |
| PASS | character sheet anti-drift | anti-drift rules present |
| PASS | story bible tokens | grade + world + cinematic locked tokens present |
| PASS | story bible episodes | all 3 episode title(s) present |

## 1b. Series snippets for the auditor

- voiceover mode: native Veo + Kokoro post path
- season: The First Beat → Ink and Asphalt → Neon Hearts

## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)

### 2.1 Consistency-worthiness scorecard (rate 1–5 each, /50 — a series worth generating scores ≥ 35)

| Criterion | Ask | Score /5 |
|---|---|---|
| **Cross-episode consistency** | Every prompt carries the verbatim character blocks + grade + cinematic + world tokens (word-level checks passed)? Ingredients reuse plan is real? | |
| **Episode-1 hook pull** | Would the Episode 1 hook stop a distracted scroller in the first 2 seconds? | |
| **Cliffhanger pull** | Does every episode end on a loop that makes you click Episode 2? | |
| **Cinematic action** | Is camera language specific (no vague "cinematic shot")? One dominant motion per clip? Physics/motion blur on action? | |
| **Voiceover direction** | Are lines in-character with concrete delivery tones? Does the VO sheet cover every speaking scene? | |
| **Story logic** | Does the season arc hold together (hooks → cliffhangers → payoff)? Continuity written across episode boundaries? | |
| **Copy-paste readiness** | Is every prompt pure copy-paste into Flow (no meta-commentary)? One idea per scene? | |
| **Reference-image readiness** | Would the character-sheet reference-image prompts generate a clean, consistent likeness to anchor Flow's Ingredients? | |
| **Genre-grade fit** | Does the locked grade/world/cinematic token match the chosen genre preset (comic/love/action/thriller/fantasy)? | |
| **Retention pacing** | Do scenes escalate (hook → rise → turn → cliffhanger) per episode, and does the season escalate overall? | |

### 2.2 Creative judgment calls

- Hooks/cliffhangers: any that read weak, clichéd, or that break the season logic the script can't judge?
- Prompts: any prompt that would render poorly (impossible action, character drift, text/warping risk, missing native-audio labels)?
- Voiceover: any delivery tone that doesn't fit the character or genre?
- Continuity: any scene-to-scene or episode-to-episode cut that would visibly jump (lighting, wardrobe state, location)?

### 2.3 Verdict

- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.
- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list concrete fixes per file.

> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: 2026-08-10
