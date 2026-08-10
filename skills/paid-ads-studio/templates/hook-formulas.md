# Ad Copy Formulas — hook-first, char-limit-safe, anti-fluff

The copy contract: **hook in the first line**, one concrete benefit, one mechanism, one proof signal, one CTA. No fluff words, no fake urgency, no unsubstantiated claims.

## Hook formulas (pick ONE per ad)

| Formula | Pattern | Example (tumbler) |
|---|---|---|
| **PAS** (pain-agitate-solve) | `Tired of {pain}? {product} fixes it — {mechanism}.` | "Tired of lukewarm coffee by 10am? Brew & Co keeps it hot 8 hours — triple-wall vacuum insulation." |
| **Curiosity gap** | `Nobody tells you about {mechanism}. {product} — {benefit}.` | "Nobody tells you about triple-wall vacuum insulation. Brew & Co — hot coffee 8 hours." |
| **Contrarian** | `{common belief}? That's a choice. {product} {benefit}.` | "Cold coffee by lunch? That's a choice. Brew & Co keeps it hot 8 hours." |
| **Results-first** | `Join {n/proof} who switched to {product} — {benefit}.` | "Join 2,100 reviewers who switched to Brew & Co — coffee hot from 8am to 4pm." |
| **Listicle** | `{n} reasons {product} beats the rest: {benefit}, {mechanism}, {proof}.` | "3 reasons Brew & Co beats your current mug: 8-hour heat, triple-wall build, 4.8 stars." |

## Hard char limits (enforced by ad-copy.mjs — exit 1 on violation)

| Platform | Field | Limit |
|---|---|---|
| Meta | Primary text | ≤125 chars (soft — shorter is better) |
| Meta | Headline | ≤40 chars |
| Meta | Description | ≤30 chars |
| Google | Headline | ≤30 chars |
| Google | Description | ≤90 chars |

> Rule: **shorten the copy, never widen the limit.** A 42-char headline gets rewritten, not exempted.

## Anti-fluff blocklist (hard-banned words/phrases)

unlock · game-changer / game changer · revolutionary · amazing · incredible · stunning · mind-blowing · world-class · best-in-class · cutting-edge · state-of-the-art · revolutionize · transform your · supercharge · skyrocket · guaranteed · 100% free · act now · limited time only · don't miss out · free money · miracle · magic · `!!` / `!!!`

**Also banned:** ALL-CAPS sentences, fake countdowns, exaggerated claims ("the best coffee ever"), and CTAs that overpromise ("Get rich now").

## Benefit → mechanism → proof → CTA (fill per ad)

```
Benefit:   <one outcome the customer gets>          e.g. "coffee stays hot 8 hours"
Mechanism: <why it works, one sentence>             e.g. "triple-wall vacuum insulation"
Proof:     <one social-proof or spec signal>        e.g. "4.8 stars from 2,100 reviews"
Offer:     <one hook if any>                        e.g. "20% off + free shipping"
CTA:       <one action>                             e.g. "Shop Now"
```

## Per-placement re-expression

| Placement | Voice | Rule |
|---|---|---|
| Meta Feed | conversational, benefit-led | primary ≤125, headline ≤40, description ≤30 |
| Meta Reels/Stories | bold, punchy, hook-first | shorter primary; CTA visible in the first 2s on screen |
| Google Search | keyword-anchored | headline carries the search intent, description states benefit + mechanism |
| Google Display | short + visual | description ≤90; the image does the talking |
| Performance Max | 4 headlines × 30c, 5 descriptions × 90c | headline variety across benefit/offer/proof/urgency-free angles |
