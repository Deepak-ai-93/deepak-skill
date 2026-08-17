# Worked example — "InvoiceFlow" promo reel (`video-product.md`)

> A complete worked output of the video-product-pipeline skill for one reel:
> trend brief → analyzed prompt → approved `video-product.md` spec → audit.
> This is the shape of the deliverable the skill produces before ANY generation.

## 1. Trend brief (`trend-brief.md` — excerpt from `trend-hunt.mjs`)
- **Niche:** freelancer invoicing · **Reddit top-of-day:** r/freelance — "I sent the invoice 3 weeks late again" (score 842).
- **Angle:** "The invoice you send late costs you 30 days of cash flow" → 3-step fix.

## 2. The prompt, analyzed (Stage 1 — never generate yet)
> "make a reel for my invoice app"
- **Vague → extracted:** product = InvoiceFlow (freelancer invoicing), goal = app installs, format = asset reel (real UI clips), duration ≈ 30s, voice = Kokoro `am_michael`, CTA = "Try InvoiceFlow free".
- **Open questions locked in Decisions:** target = freelancers (US/IN), pain-first angle (late invoices), UI clip assets provided by user.

## 3. `video-product.md` — spec (excerpt)
- **Hook (0–3s):** "You invoice 3 weeks late. That's a 30-day loan to your client."
- **Beats (story spine):** pain (late invoice) → cost (30 days of cash flow) → fix (3 steps: template → auto-send → reminder) → payoff (paid in 48h) → CTA.
- **Format:** asset reel (`video-asset-reels`) — user's UI clips + photos; text overlay kinetic, safe-zone verified.
- **Audio:** VO + royalty-free bed, ducked −14 LUFS (voice-sfx-audio).
- **Decisions section:** angle = pain-first; voice = `am_michael`; CTA = single; caption per platform (500–900 chars).

## 4. Approval gate
- Spec presented → user approved → `video-product.md` locked (Stage 2 gate) → only then Stage 3 generation.

## 5. Audit (Stage 4 — excerpt)
- `audit-composition.mjs --html reel.html --storyboard storyboard.json` → 0 FAIL: every visible text inside the 9:16 safe zone, beat text matches storyboard, timeline deterministic.
- **video-product-pipeline auditor verdict:** 43/50 → **PASS** → delivered with caption pack.
