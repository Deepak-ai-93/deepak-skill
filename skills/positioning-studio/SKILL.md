---
name: positioning-studio
description: Turn any product or brand into a positioning that makes every content piece convert — ONE one-liner (≤ 15 words), a messaging hierarchy (audience → problem → promise → proof), 3 taglines, a proof-point bank, and a voice guide written in the creator's own taste (the memory + taste rails from ebook-builder). Every downstream piece — landing pages, emails, threads, ebooks — lifts the same message instead of inventing a new one. Audit harness: audit-positioning.mjs (one-liner cap, hierarchy completeness, proof points, taglines, fluff blocklist, taste banned-words → positioning-audit.md) + a fresh positioning-auditor subagent scoring /50 and signing PASS / FIX NEEDED.
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: positioning-studio
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

**🎬 deepak-skill — crafted by Deepak** · skill: `positioning-studio` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: positioning-studio

**Name:** Positioning Studio — the message every piece of content lifts
**Description:** Turns a product or brand into **one positioning** — ONE one-liner (≤ 15 words), a **messaging hierarchy** (audience → problem → promise → proof), **3 taglines**, a **proof-point bank**, and a **voice guide** written in the creator's own taste (memory + taste rails). The deliverable `positioning.md` is the single source of truth for the message; every downstream piece (landing pages, emails, threads, carousels, ebooks) lifts the same hierarchy instead of inventing a new message per post. An anti-hype rail: proof beats adjectives — if there's no proof, the promise shrinks until there is. Audit harness: `audit-positioning.mjs` + a fresh positioning-auditor subagent (/50, ≥ 35 = worth shipping) before delivery.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **ONE one-liner (the #1 rail)** | `## One-liner` is a single sentence ≤ 15 words that names the audience, the outcome, and the difference. If it can't be said in one breath, it isn't positioning yet. |
| **Messaging hierarchy complete** | The `## Messaging hierarchy` section has all four rungs — **Audience** (who), **Problem** (the pain), **Promise** (the outcome), **Proof** (why it's believable). A missing rung fails the audit. |
| **Proof over hype (the anti-fluff rail)** | `## Proof points` ≥ 3 specific bullets (numbers, named customers, measurable results — "cut onboarding time 40%", not "amazing results"). The FLUFF blocklist (no "unlock", "game-changer", …) fails the audit. |
| **3 taglines** | `## Taglines` ≥ 3 distinct one-liners, each ≤ 8 words, each usable as a standalone hook. |
| **Voice guide = the author's taste** | `## Voice guide` records tone, rhythm and **banned words** from the creator's taste profile (`positioning-memory.md`); the audit FAILs the positioning on taste banned-words. |
| **One message everywhere** | The optional `message-map.md` maps the same hierarchy to 3+ channels (landing page, email, social) — the SAME promise and proof, different phrasing per channel, never a new message. |
| **Audited before delivery (the harness)** | Final stage is a harness, never a self-check: `audit-positioning.mjs` runs the automated checks → a FRESH positioning-auditor subagent scores the positioning (/50, ≥ 35 = worth shipping) → fix loop until signed **PASS** in `positioning-audit.md`. |

---

## Memory + taste rails (the author's voice — read before anything else)

Same contract as `ebook-builder`: the positioning is written FOR the same creator every time, and the voice guide comes from THEIR taste, not generic marketing.

**The memory file** — `positioning-memory.md` at the working folder root (format: `templates/memory-profile.md`): author identity, taste profile (tone, rhythm, pet phrases, **banned words**), the products/brands positioned so far (past-builds table with verdicts), and standing facts (offer, links, brand colors). Created at **Stage 0** on first run (≤ 3 questions via the taste profile), read every run, updated at the end.

**The taste profile** — inside the memory file: the creator's tone, sentence rhythm, person, humor, jargon level, pet phrases, and banned words. The `## Voice guide` section of every positioning is written from it; the audit FAILs the positioning on taste banned-words.

---

## When to use

- "I need a positioning / one-liner / taglines for my product"
- "What should my landing page actually say?" (before writing copy)
- "My content feels random — give me one message to lift everywhere"
- "Write a messaging hierarchy for my brand"
- "My one-liner is weak — rebuild it"
- "Make my product sound like me, not like AI marketing"

**Complements:** `landing-page-copy` (the positioning becomes the hero + value prop), `email-marketing` + `drip-email-sequence` (same promise in every email), `x-threads-engagement` / `linkedin-personal-brand` / `newsletter-growth` (threads, posts and newsletters lift the hierarchy), `ebook-builder` (the positioning is the cover promise), `paid-ads-studio` (ad hooks come from the taglines), `prompt-engineering` (the positioning is injected into every content prompt).

---

## Workflow (Stage 0 → Stage 6)

### Stage 0 — Load the author's memory + taste (always first)
Read `positioning-memory.md` (format: `templates/memory-profile.md`). First run? Capture identity + taste in ≤ 3 questions (tone, one writing sample, banned words) and write the file. Echo back: "Positioning in [author]'s voice: [tone] — anything change?" This is the voice the one-liner, hierarchy, taglines and voice guide are all written in.

### Stage 1 — Analyze the product + audience (ask ≤ 3 questions if vague)
Extract: **product** (what it does, in one sentence) · **audience** (who buys) · **current positioning** (what they say today) · **goal** (signups / subscribers / authority). If the creator can't say who it's for, stop and ask — positioning without an audience is adjectives.

### Stage 2 — Gather the raw material (inputs before any writing)
- **Audience pains:** 3–5 specific pains/outcomes from the audience's world (ask or infer from reviews/comments).
- **Competitor scan:** what 2–3 competitors promise; where they're vague.
- **Proof inventory:** every number, named customer, and measurable result you can honestly claim — including small proof (a testimonial, a before/after, a metric from one client). No proof yet? The promise shrinks until it's provable (the anti-hype rail).

### Stage 3 — Write the positioning card → `positioning.md`
Fill `templates/positioning-card.md` (the format IS the audit contract): `## One-liner` (≤ 15 words) → `## Messaging hierarchy` (Audience / Problem / Promise / Proof) → `## Proof points` (≥ 3 bullets) → `## Taglines` (≥ 3, ≤ 8 words each) → `## Voice guide` (tone + rhythm + **banned words** from the taste profile). Write it in the author's voice — the one-liner especially: their way of promising, zero buzzwords. If a line could have been written for any product, rewrite it.

### Stage 4 — Map the message (optional but recommended) → `message-map.md`
The SAME hierarchy phrased for 3+ channels: landing page (hero + value prop), email (subject + first line), social (hook + tagline). Same promise and proof, different phrasing per channel. This is what makes content stop feeling random.

### Stage 5 — Approval gate
Show the user: one-liner + hierarchy + taglines + voice guide (+ message map). They say **approve / edit / reject**. Edits go back to the affected stage.

### Stage 6 — Audit harness (automated checks + positioning-auditor subagent, before delivery)
**Step 6a — run the automated audit:**
```bash
node scripts/audit-positioning.mjs --pack <positioning-folder> --out positioning-audit.md
```
`audit-positioning.mjs` checks: `positioning.md` exists; one-liner ≤ 15 words; hierarchy complete (Audience / Problem / Promise / Proof); ≥ 3 proof points; ≥ 3 taglines; anti-fluff blocklist; voice guide present; **memory + taste** (`positioning-memory.md` present in the pack or working folder; taste banned-words FAIL the positioning if they leak in); `message-map.md` present (WARN if missing). Writes `positioning-audit.md`. **Exit 1 on any FAIL.**

**Step 6b — spawn the positioning-auditor subagent** — a FRESH subagent (never self-audit) with the brief from `templates/positioning-auditor-brief.md`: reads `positioning-audit.md` + all pack files + the taste profile, completes the **positioning-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth shipping**), makes the judgment calls a script can't (does the one-liner actually differentiate? is the promise believable? does it sound like the author? is it one message, not five?), and signs **PASS / FIX NEEDED**.

**Step 6c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix → re-run → re-submit to a fresh auditor. **Nothing ships until the auditor signs PASS.** `positioning-audit.md` ships with the pack.

### Stage 7 — Write memory back
Append this build to `positioning-memory.md`: date, product, one-liner, verdict (/50), and what the author changed/loved. Never delete standing facts.

---

## Production checklist

- [ ] Stage 0: `positioning-memory.md` read (created on first run) — taste known before writing
- [ ] One-liner: ONE sentence ≤ 15 words (audience + outcome + difference), in the author's voice
- [ ] Messaging hierarchy complete: Audience → Problem → Promise → Proof — no missing rung
- [ ] Proof points ≥ 3 specific, honest bullets (numbers / named results) — no adjectives standing in for proof
- [ ] Taglines ≥ 3, each ≤ 8 words, each usable as a standalone hook
- [ ] Voice guide written from the taste profile (tone, rhythm, banned words) — no AI-marketing voice
- [ ] Anti-fluff blocklist clear; taste banned-words clear
- [ ] `message-map.md` maps the SAME message to 3+ channels (WARN if skipped)
- [ ] Approval gate: user approved the one-liner + hierarchy + taglines + voice before delivery
- [ ] **Audit harness run:** `audit-positioning.mjs` → automated checks — exit 0
- [ ] **Positioning-auditor subagent** (fresh eyes) completed the scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `positioning-audit.md`
- [ ] Delivery: `positioning.md` (+ `message-map.md`) + `positioning-audit.md` + `positioning-memory.md` (updated)
