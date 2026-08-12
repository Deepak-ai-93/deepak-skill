# Research Playbook — expert-level demand & market research

> **How to run it (Stage 1 of the skill):** this is the difference between "an idea"
> and "a validated wedge into a market". The vibe-code-webapp skill never builds on
> vibes alone: it harvests **keyless signals** (script), then goes **deep** with
> agent web research (competitors, pricing, distribution, sizing), then locks a
> **winner angle** with a positioning statement. Copy this playbook into
> `research-notes.md` while you work; the finished brief is `idea-brief.md`.
>
> **Expert rule #1: date and source every claim.** An opinion with no source is a
> guess. A guess with a date and a link is research.
> **Expert rule #2: triangulate.** Two independent sources beat one strong one.
> **Expert rule #3: kill duds cheaply.** Research exists to stop you building
> things people won't pay for — never soften a negative finding.

---

## 1. Harvest keyless signals (always first — ~2 minutes)

```bash
node scripts/research-idea.mjs --niche "saas for freelancers" --subreddits "freelance,Entrepreneur,webdev" --geo US
```

Two free signals, no API key:

| Source | What it gives you | How to read it |
|---|---|---|
| Reddit top-of-day (niche subreddits) | Real pain + the **exact language users use** | Pain repeated across 3+ posts = real problem; quote the language verbatim into the PRD |
| Google Trends "Trending now" (region) | What is rising in a geography TODAY | Rising + relevant = timing tailwind; rising + irrelevant = noise |

**Expert rule #4: the user's words are the product.** When Reddit says "I'm tired of
chasing invoices", the PRD says "stops chasing payments" — not "automated receivable
workflow orchestration". Copy their words.

---

## 2. Deep market research (agent web research — the real expert layer)

The script gets you started; **this section is where the expertise lives**. Cover all
five, in order, and write the evidence into `idea-brief.md` §2.

### 2.1 Competitor teardown (3–6 real competitors)

| Competitor | One-liner | Pricing | What users complain about (quotes) | What they do WELL | The gap we exploit |
|---|---|---|---|---|---|
| {name} | {what they do} | {price/plan} | {from reviews, forums, HN, X} | {their moat} | {your differentiation} |

Sources: Product Hunt, G2/Capterra reviews, r/SaaS + niche subreddits, HN "Show HN"
comments, X search. **Expert rule #5:** read the *complaints*, not the marketing.
Complaints are the roadmap of a better product.

### 2.2 Market sizing (TAM → SAM → SOM — a rough but honest funnel)

| Level | Definition | Number | How you estimate it |
|---|---|---|---|
| TAM | Everyone who could ever use this | {e.g. 2M freelancers globally} | top-down: total population of the buyer category |
| SAM | Those you can actually serve | {e.g. 400k English-speaking, digital, in reach} | TAM × language/geo/segment filters |
| SOM | Those you can win in 24 months | {e.g. 4k users = 1% of SAM} | SAM × realistic capture % |

> **Expert rule #6:** SOM is the number that matters. If SOM × price < your living
> costs, the market is too small **or** the wedge is too narrow — fix the wedge, not
> the price.

### 2.3 Distribution channels (how you actually reach buyers)

| Channel | Effort (L/M/H) | Cost | Time-to-first-user | Fit for this audience? |
|---|---|---|---|---|
| SEO / content | H | low | 3–6 months | {yes/no + why} |
| Communities (Reddit, Discord, FB groups) | M | low | days–weeks | {yes/no + why} |
| Paid (Meta/Google) | M | medium | days | {yes/no + why} |
| Cold outreach / partnerships | M | low | weeks | {yes/no + why} |
| Marketplace/plugin distribution | M | low–med | weeks | {yes/no + why} |

**Expert rule #7:** no channel + no network = no reachability. If every box is "H
effort, 6 months", the scorecard's *market reachability* score drops hard — that's
not pessimism, that's honesty.

### 2.4 Pricing research (anchor, don't guess)

- Find 3+ competitor prices (from §2.1) → your price sits in the **same band** or
  *clearly above with a defensible "why"*.
- Check what the audience already pays for adjacent tools (the workaround's cost).
- Record the anchoring in `idea-brief.md`; the validator (§3 of saas-validator.md)
  sanity-checks it against your costs.

### 2.5 Positioning statement (one sentence — the wedge)

> For **{target customer}** who **{needs}**, **{product}** is a **{category}** that
> **{benefit}**. Unlike **{competitor set}**, it **{unique difference}**.

This sentence goes verbatim into the PRD one-liner, the landing hero, and every
handoff prompt. If you can't write it in one sentence, you haven't researched enough.

---

## 3. Brainstorm ≥5 product angles, pick the winner

| # | Angle | One-line pitch | Who it's for | Effort (L/M/H) | Reachability | Problem-to-effort |
|---|---|---|---|---|---|---|
| 1 | {angle} | {pitch} | {persona} | {L/M/H} | {L/M/H} | {score /10} |

- **Existing projects:** angles are *extensions of the current app* — what can the
  scan's foundation support cheaply?
- **Winner:** best problem-to-effort × reachability, not the coolest angle. Lock it
  in `idea-brief.md` §4 with one line of "why".

---

## 4. Outputs & quality bar

| Artifact | From | What's in it |
|---|---|---|
| `idea-brief.md` | script + this playbook | dated+sourced signals, competitor teardown, TAM/SAM/SOM, channels, pricing, 5+ angles, winner, positioning sentence, scorecard (filled next) |
| `research-notes.md` | agent | the raw evidence trail (links + dates) — auditors can verify every claim |

**Definition of done for research:** every scorecard criterion in
`saas-validator.md` can be scored with a sourced answer, not a hand-wave. No
"probably", no "I think". **Then** the validator runs and the verdict is honest —
BUILD / ITERATE / PIVOT.

> Feeds Stage 2 (SaaS validator → `validation.md`) → Stage 3 (build pack). The
> research winner IS the PRD's core, so a weak research pass produces a weak app.
