# Worked example — "Product Launch in 20s" (asset reel pack)

> The video-asset-reels deliverable for a 20s reel built from real clips + photos:
> storyboard → cut manifest → composition → rendered 4K reel + caption pack.
> This is the shape of the folder the skill produces.

## 1. Storyboard (beat sheet)
| Beat | Asset | Duration | On-screen text |
|---|---|---|---|
| 1 | `clips/hands-typing.mp4` (in 1.5s) | 3.0s | THE PROBLEM |
| 2 | `photos/old-dashboard.jpg` | 2.5s | 6 tools. 6 tabs. |
| 3 | `clips/new-ui.mp4` (in 0.5s) | 4.0s | ONE dashboard |
| 4 | `photos/team-shot.jpg` | 3.0s | Built for teams |
| 5 | `clips/launch-cut.mp4` | 4.0s | Ship today → CTA |

## 2. Cut manifest (`storyboard.json` — feeds `cut-assets.mjs`)
```json
{
  "out": "assets/cuts", "width": 1080, "height": 1920, "fps": 30,
  "beats": [
    { "id": "beat_01", "src": "assets/clips/hands-typing.mp4", "in": 1.5, "duration": 3.0 },
    { "id": "beat_02", "src": "assets/photos/old-dashboard.jpg", "duration": 2.5 },
    { "id": "beat_03", "src": "assets/clips/new-ui.mp4", "in": 0.5, "duration": 4.0 },
    { "id": "beat_04", "src": "assets/photos/team-shot.jpg", "duration": 3.0 },
    { "id": "beat_05", "src": "assets/clips/launch-cut.mp4", "duration": 4.0 }
  ]
}
```
```bash
node scripts/cut-assets.mjs --manifest storyboard.json   # → assets/cuts/beat_01..05.mp4 (1080×1920, muted, cover-cropped)
```

## 3. Composition + render
```bash
node scripts/render-frames.mjs --html reel.html --name launch-reel_4k --duration 20 --audio assets/mix/voiceover+music.mp3
# → output/launch-reel_4k/launch-reel_4k.mp4 (2160×3840) with muxed audio
```
- Asset gate (`check-assets.mjs`) passed first: every beat's source exists, aspect-correct, no letterboxing.
- Audio: Kokoro VO + royalty-free bed, ducked −14 LUFS (voice-sfx-audio skill).

## 4. Captions (`caption.md` — excerpt)
- **Hook (first line, every platform):** "This is what 6 tools did to our workflow."
- Character windows 500–900 per platform; one CTA; no hashtags.

## 5. Audit (excerpt)
- `audit-asset-reel.mjs` → 0 FAIL: beats match storyboard, cut durations hold, composition determinism (two renders byte-identical), output + captions present.
- **asset-reel-auditor verdict:** 42/50 → **PASS**.
