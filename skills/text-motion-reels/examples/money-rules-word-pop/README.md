# Worked example — "3 Money Rules Nobody Told You" (word-pop reel pack)

> The text-motion-reels deliverable for one reel: wizard decision → top-5-creator
> copy rails → composition HTML (excerpt) → rendered frames/MP4 → caption pack.
> This is the shape of the folder the skill produces.

## 1. Wizard (Step 1)
- **Format:** `word-pop` · **Niches:** money, self-improvement · **Duration:** 15s · **Voice:** `af_heart`
- **Template picked:** Format 1 (Word Pop) — kinetic text that pops on beat, no media needed.

## 2. Copy rails (top-5-creator playbook — validated before any HTML)
- **Hook ≤ 8 words:** "3 money rules nobody told you." (6 words ✓ — list promise, curiosity gap)
- **Zero hashtags on screen AND in captions** — no `#` anywhere in the composition or caption.md
- **One claim per beat, ≤ 8 words** — every `.pop` beat is a single idea
- **One CTA, final 2 seconds** — "Follow for rule 3" (serialization bait)
- **Loop ending** — final frame mirrors the hook list ("3 rules…" → "…you now know all 3")
- **No intro openers** — frame 1 IS the claim, no "hey guys"

## 3. Composition (`reel.html` — excerpt)
```html
<div class="stage" data-format="word-pop" data-timeline="reel">
  <div class="pop" data-at="0.0">STOP paying on time.</div>
  <div class="pop accent" data-at="3.5">28.7% APR is priced into your statement.</div>
  <div class="pop" data-at="7.0">Pay 2 days early.</div>
  <div class="pop accent" data-at="10.5">RULE 2 IS WORSE.</div>
  <div class="pop" data-at="14.0">Credit ≠ budget.</div>
</div>
```
- GSAP timeline `window.__timelines.reel` pauses per word; each `.pop` pops on a beat (scale 0.8→1 + y-drift), text always above the safe zone.
- Background: `svg-ambient` gradient loop (commercial-safe, no SMIL).

## 4. Render
```bash
node scripts/render-frames.mjs --html reel.html --name money-rules_4k --duration 15
# → output/money-rules_4k/frames/*.jpg (2160×3840) + money-rules_4k.mp4
```

## 5. Caption pack (`caption.md` — excerpt)
- **X/Threads:** "3 money rules that will cost you if you ignore them." — hook sentence ≤ 8 words, zero hashtags, one CTA
- **YouTube Shorts title (≤ 100):** "The credit card rule nobody told you"
- Character windows verified 500–900 per platform; zero hashtags; one CTA ("Follow for rule 3").

## 6. Audit (excerpt)
- `audit-reel.mjs --pack money-rules_4k` → 0 FAIL (format slug, GSAP timeline determinism, beat windows, **zero hashtags on screen, no intro openers, hook ≤ 8 words, caption CTA**, MP4 + frames, caption windows hold).
- **reel-auditor verdict:** 40/55 → **PASS** (built to chase millions of views: watch-twice mechanics, save bait, series hook).