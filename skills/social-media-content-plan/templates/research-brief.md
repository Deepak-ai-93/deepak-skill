# Research Brief — proper, all platforms, sourced & dated (Stage 1)

> **How to run it:** fills `strategy.md` with facts not vibes. Script scaffold + agent deep research (same pattern as vibe-code `research-playbook.md`).

## Layer A — scripts (no API key, 2 min)

```bash
node scripts/research-plan.mjs --niche "fitness for busy pros" --subreddits "fitness,Entrepreneur" --geo US
# -> research-brief scaffold (Reddit top-of-day + Google Trends)

node scripts/platform-playbook.mjs --platform instagram,x,linkedin  # grounded 2026 facts
```

## Layer B — agent deep research (fill before strategy.md)

| Platform | What to pull | Query | Signal |
|---|---|---|---|
| Reddit | 3-5 pain posts verbatim | site:reddit.com "busy professional fitness" | Repeated pain + language |
| X | Top hooks, complaint threads | X search min_faves:50 | Hook patterns |
| Product Hunt | 5 rivals last 12mo | producthunt.com/search?q=fitness | Positioning + pricing |
| Hacker News | Show HN / Ask HN | hn.algolia.com | Builder complaints |
| Indie Hackers | Revenue/churn posts | indiehackers.com/search | Monetization proof |
| G2/Capterra | 1-star reviews 3 incumbents | g2.com | Roadmap = complaints |
| App Store/SEO | Ratings + SERP | ahrefs "fitness app" | Keyword difficulty |
| Google Trends | Rising terms + CPC | trends.google.com | Timing + CAC |

Every claim: Source (YYYY-MM-DD): link — one-line takeaway. Triangulate >=2 sources per criterion. Raw -> `research-notes.md` (auditor-verifiable).

## Outputs -> strategy.md Section 2 preamble

- Competitor table (3-6 rivals: pricing, complaints verbatim, moat, gap)
- TAM->SAM->SOM funnel
- Channel matrix (SEO/communities/paid/outreach/marketplace)
- Pricing/CPM anchors (3+ prices + workaround cost)
- One-sentence positioning (verbatim into pillars + calendar hero)
- Brainstorm >=5 angles -> winner = problem-to-effort x reachability

Definition of done: every scorecard criterion can be scored with sourced answer, not hand-wave. Then validator runs BUILD/ITERATE/PIVOT.
