# Prompt bank — patterns to lift per use case (reference for Stage 2–3)

Not prompts to copy — patterns to adapt to the author's use cases, always through the framework + voice rules.

## Content production

| Use case | Pattern |
|---|---|
| Hook generation | Role names the voice → Task: N hooks, M angles → Format: bullets ≤ 100 chars → Constraints: banned words, "one hook asks a question" |
| Thread / post outline | Role: writer who opens loops → Task: story-spine beats (hook → rising → payoff → CTA) → Format: per-beat line + escalation → Constraints: follow Voice rules, no fluff |
| Repurposing (one source → pieces) | Role: editor → Task: one source → N native pieces (never copy-paste) → Format: per-platform shape → Constraints: no repeated first lines across pieces |
| Carousel / ebook outline | Task: cover promise (≤ 6 words) → 4–8 escalating pages → payoff → CTA → Format: page map → Constraints: one idea per page |

## Research & analysis

| Use case | Pattern |
|---|---|
| Competitor teardown | Task: positioning, proof, gaps for each of N competitors → Format: table + 3 takeaways → Constraints: only claims backed by the provided source text |
| Source summary | Role: skeptical analyst → Task: TL;DR + key numbers + what's missing → Format: 3 sections → Constraints: no invented numbers, quote the source |
| Audience pains | Task: from reviews/comments → 5 pains in the audience's words → Format: pain + proof quote each → Constraints: no invented quotes |

## Email & sales

| Use case | Pattern |
|---|---|
| Email in the author's voice | Task: subject (≤ 60 chars) + body → Format: subject / greeting / 3 short paragraphs / ONE CTA → Constraints: banned words, follow Voice rules, no exclamation marks |
| Objection handling | Task: the 5 strongest objections + a 2-line reply each → Constraints: replies in the author's voice, no defensiveness |

## Code & ops

| Use case | Pattern |
|---|---|
| Code review | Role: senior reviewer → Task: bugs > style > nits, with a fix suggestion each → Format: severity-tagged bullets → Constraints: no invented issues, quote the lines |
| Debugging | Task: reproduce from the error → hypothesis → test → fix → Format: 4 steps → Constraints: no speculative fixes without a test step |

## The test loop (Stage 4) — record honestly

```
## {prompt title}
- Tool: {Claude / ChatGPT / …}
- Test input: {the real sample}
- Output quality: {1–5}
- Verdict: pass | needs-work
- What broke / fix: {one line}
```
