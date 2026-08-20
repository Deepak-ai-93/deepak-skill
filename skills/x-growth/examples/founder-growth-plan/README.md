# Worked example — "Founder growth plan" (one week of X posts)

> A complete worked output of the **x-growth** skill: `content-plan.json` is the
> ONE input file the agent authors; `content-plan.md` + `posts.md` are what
> `post-writer.mjs` produced from it — no hand-written plan files, exactly like
> a real Stage 3–4 run.

## How this pack was produced (run the scripts yourself)

```bash
cd skills/x-growth

# ONE input file: the goal + pillars + the week of drafted posts
node scripts/post-writer.mjs --plan examples/founder-growth-plan/content-plan.json --out examples/founder-growth-plan/content-plan.md

# the audit harness → x-audit.md (18 PASS / 0 FAIL for this pack)
node scripts/audit-x.mjs --pack examples/founder-growth-plan --out examples/founder-growth-plan/x-audit.md
```

## Files in this example

```
content-plan.json    ← the ONE input (agent-authored, script-validated)
content-plan.md      ← goal + KPIs + 3 pillars + daily cadence + engagement schedule + day-7 review
posts.md             ← 7 drafted single posts (hook → value → story → proof → value → cta → loop)
x-audit.md           ← automated audit output (then a fresh x-auditor signs PASS / FIX NEEDED)
```

## What this example demonstrates

| Rail | Proof in the pack |
|---|---|
| **Zero hashtags** | Not one `#` in any post — the copy-first rail (a single `#` fails the script, exit 1) |
| **Top-creator format** | Every post is a 500–800 char micro-essay: hook line ≤ 100 chars → story → bullets → payoff → CTA (503–717 chars) |
| **One micro-story per post** | Every post complete alone: loop opened in the first line, paid off by the last |
| **The week is the series** | Mix: hook → value → story → proof → value → cta → loop, all 3 pillars fed |
| **Growth plan, not a wish** | Goal (2k → 4k in 30 days), 5 KPIs, cadence, engagement schedule, day-7 fix loop |
| **Audit harness** | `audit-x.mjs` → PASS → x-auditor signs before delivery |