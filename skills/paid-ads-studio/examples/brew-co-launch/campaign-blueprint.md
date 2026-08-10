# Campaign Blueprint — Brew & Co Tumbler Paid Launch

## Meta (Facebook + Instagram) — $50/day

| Setting | Choice |
|---|---|
| **Objective (ODAX)** | Sales |
| **Campaign type** | Advantage+ Shopping (catalog + creative-led) |
| **Audience** | Advantage+ audience — **controls:** US, 18+ · **suggestions:** website visitors (pixel), 30-day engagers, lookalike seed from purchasers |
| **Placements** | Automatic (Advantage+ placements: Feed, Reels, Stories, Marketplace) |
| **Budget** | CBO $50/day |
| **Bidding** | Weeks 1-2: Highest volume (data collection) → then Cost cap at $35 → then Minimum ROAS 2.0× once CAPI purchase value is rich |
| **Ad set structure** | 1 ad set, 3-5 distinct creatives (use the 3 video + 4 image ads from `prompts.md`) |
| **Tracking** | Meta Pixel + Conversions API, Event Match Quality high |

**Why Advantage+:** inputs are *suggestions*, not hard rules — the algorithm expands beyond them once it sees conversion patterns. Creative IS the targeting: the tumbler's hook copy and visuals filter the audience.

## Google — $30/day

| Campaign | Role | Setup |
|---|---|---|
| **Demand Gen** (prospecting) | Storytelling + upper-funnel | $18/day · audience signals: customer list + website visitors · creatives: 9:16 Reels ad + 1.91:1 flat-lay + 4:5 lifestyle · placements: YouTube (in-stream + Shorts), Discover, Gmail |
| **Performance Max** (capture) | Full-funnel conversion capture | $12/day · asset group: 4 headlines + 5 descriptions from `copy.md`, square + landscape + portrait images, the 15s video · audience signals: customer list, site visitors |
| **Search** (intent, optional) | High-intent capture | If budget allows: "insulated tumbler", "tumbler keeps coffee hot" · exact + phrase · $5-10/day |

**Audience signals ≠ targeting:** in Demand Gen + PMax the signals are starting recommendations; Google AI expands beyond them. Don't restrict with layered exclusions during learning.

## Budget split summary

| Funnel stage | Meta | Google |
|---|---|---|
| Prospecting | 60-70% ($30-35/day) | Demand Gen ($18/day) |
| Retargeting/capture | 30-40% ($15-20/day via catalog) | PMax ($12/day) |

## Expected blended economics (from forecast.md + retargeting uplift)

- Meta cold (base): CPA ~$31, ROAS ~1.15-1.31× after learning discount
- Blended with retargeting + Demand Gen/PMax assist: target CPA ≤ $100, blended ROAS 1.5-2.5×
- Re-forecast after week 1 with real CPM/CTR/CVR (`--overrides`)
