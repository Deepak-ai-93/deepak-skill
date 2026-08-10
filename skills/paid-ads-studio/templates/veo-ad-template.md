# Veo Video Ad Prompts — the 7-layer template (Google Flow / Veo 3.1)

One prompt per ad. Pure copy-paste — no instructions inside the prompt. Paste into Flow's text-to-video (or Ingredients→video) panel, generate at the placement's aspect ratio.

## The 7-layer template

```
[Camera/lens] + [Subject = VERBATIM product block] + [Action & physics] +
[Setting] + [Lighting] + [Style = grade token] + [Audio: Dialogue in quotes, SFX labeled]
```

## Placement specs (2026)

| Placement | Aspect | Duration | Notes |
|---|---|---|---|
| Reels / Shorts / TikTok | 9:16 | 8-24s (8s clips, Extend to chain) | hook in frame 1; sound-on friendly |
| Meta Feed (video) | 1:1 or 9:16 | 15-30s | loop-friendly ending |
| YouTube in-stream | 16:9 | 15-30s | hook ≤5s (skip button) |
| Bumper | 16:9 or 9:16 | 6s | one idea, one CTA word |

**Export specs:** 1080p (or 4K upscale), MP4 H.264 + AAC audio. Apply logos/fine print in post.

## Camera vocabulary (be specific — never "cinematic shot")

| Element | Pick one |
|---|---|
| Shot size | extreme close-up · close-up · medium close-up · medium · wide · overhead top-down |
| Camera motion | locked-off · slow push-in · dolly-in · tracking · handheld urgency · crane up · orbit |
| Lens | 24mm wide · 35mm · 50mm · 85mm portrait · 100mm macro · shallow depth of field · deep focus |
| Time | real-time · slow-motion 50% · speed-ramp |

## Product-ad pattern (timestamp pacing)

```
0-3 seconds: <open: setting + product in silhouette / soft focus>.
3-6 seconds: <reveal: light sweep or camera move exposes the product, hero claim on screen>.
6-8 seconds: <payoff: macro detail, action moment, product + CTA word>.
```

### Example (tumbler, 9:16 Reels)

```
Locked-off medium close-up, slow push-in on a 50mm lens. Brand: Brew & Co — a matte-black 500ml
vacuum-insulated stainless steel tumbler, tapered silhouette with a brushed-steel rim and a silicone
grip ring, an engraved label reading "BREW & CO · 500ML" on the front, and a hero claim: keeps drinks
hot for 8 hours or iced for 12. A hand in a charcoal sleeve lifts the tumbler toward camera; steam
rises gently from the open lid. Bright minimalist kitchen at morning golden hour, soft window light
from the left, warm backlight rim. Grade: high-key commercial product photography, crisp whites,
soft seamless gradients, premium product glow, clean highlights, subtle film grain. Dialogue:
"Eight hours. Still hot." SFX: subtle lid click, warm room tone.
```

## UGC / founder-ad pattern (locked human identity)

```
<Camera locked at eye level, medium close-up, 35mm lens>.
<Identity block: a <age>-year-old <role> with <hair>, wearing <exact wardrobe>, in <setting>.
One dominant action: <speaking to camera / unboxing / demoing>.
Lighting: <soft window light / ring light, time of day>.
Style: <grade token>.
Audio: <the person says, "...">. No subtitles.
```

## Brand-consistency techniques (Veo 3.1 in Flow)

1. **Ingredients to video** — upload the product reference images once (hero/lifestyle/macro), reuse for every clip.
2. **Verbatim product block** — the same paragraph in every prompt; only camera/action/setting change.
3. **Frames to video** — for seamless multi-shot ads, feed the previous clip's last frame as the next clip's start frame.
4. **Clip chaining** — reuse the final frame of clip N as the start frame of clip N+1 to lock lighting and composition across cuts.
5. **Material cues** — name real textures (matte canvas, brushed aluminum, silicone) instead of generic color words.

## Text/logo rules

- Native generated text: **≤3 words** (brand name or one CTA word like "SHOP").
- Logos, watermarks, fine print, legal lines → **post-production only**.
- If a label must be legible (e.g. the tumbler's engraved text), keep the camera slow and close — fast motion warps generative text.
