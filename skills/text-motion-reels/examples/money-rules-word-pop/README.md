# Worked example — "3 Money Rules Nobody Told You" (word-pop reel pack)

> The text-motion-reels deliverable for one reel: wizard decision → composition
> HTML (excerpt) → rendered frames/MP4 → caption pack. This is the shape of the
> folder the skill produces.

## 1. Wizard (Step 1)
- **Format:** `word-pop` · **Niches:** money, self-improvement · **Duration:** 15s · **Voice:** `af_heart`
- **Template picked:** Format 1 (Word Pop) — kinetic text that pops on beat, no media needed.

## 2. Composition (`reel.html` — excerpt)
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

## 3. Render
```bash
node scripts/render-frames.mjs --html reel.html --name money-rules_4k --duration 15
# → output/money-rules_4k/frames/*.jpg (2160×3840) + money-rules_4k.mp4
```

## 4. Caption pack (`caption.md` — excerpt)
- **X/Threads:** "3 money rules that will cost you if you ignore them. 🧵" (≤ 280)
- **YouTube Shorts title (≤ 100):** "The credit card rule nobody told you"
- Character windows verified 500–900 per platform; no hashtags; one CTA ("Follow for rule 3").

## 5. Audit (excerpt)
- `audit-reel.mjs --pack money-rules_4k` → 0 FAIL (format slug, GSAP timeline determinism, beat windows, MP4 + frames exist, caption windows hold).
- **reel-auditor verdict:** 38/50 → **PASS**.
