# Test results — creator-prompt-library (Stage 4 loop)

## Hook generator — threads
- Tool: Claude
- Test input: topic = "async feedback for design teams", pasted one thread Priya liked
- Output quality: 4/5
- Verdict: pass
- What broke / fix: hooks 4–5 drifted to 110+ chars — constraint now says ≤ 100 with no exceptions; re-ran clean.

## Newsletter intro — in my voice
- Tool: Claude
- Test input: Priya's 600-word draft on pricing-page mistakes
- Output quality: 5/5
- Verdict: pass
- What broke / fix: none — subject line and CTA held after one pass tightening.

## Competitor teardown — research
- Tool: ChatGPT
- Test input: two competitor pricing pages pasted
- Output quality: 5/5
- Verdict: pass
- What broke / fix: none — table stayed source-faithful.

## Blog post → carousel outline — repurposing
- Tool: Claude
- Test input: Priya's 1,200-word post on support-ticket deflection
- Output quality: 3/5
- Verdict: needs-work
- What broke / fix: slides 4–5 repeated the same idea at different word counts — added the "each slide raises the stakes, one idea only" constraint and the source-trace rule; re-run scheduled for next pass.
