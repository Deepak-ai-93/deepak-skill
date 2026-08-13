# Companion Skills — what produces each calendar row

A 30-day content plan schedules posts; the sibling skills in this repo
PRODUCE them. Use this map to pick the right skill per calendar row, then run
the gate to check/install:

```bash
node scripts/check-skills.mjs --out companion-skills.md   # matrix + install commands
node scripts/check-skills.mjs --install                   # install all missing (after user OK)
```

## The map (calendar row → producer skill)

| The calendar row produces | Skill | What you get |
|---|---|---|
| **Reels / Shorts — text-only motion graphics** | `text-motion-reels` | 4K kinetic-typography reels (word-pop, highlighter, quiz-trap, day-counter, thread-court…), 11 formats, beat-synced VO, captions |
| **Reels / Shorts — cinematic AI video** | `veo-cinematic-reels` | Rich copy-paste scene prompts (~150–250 words) for Flow/Veo, Kling, Luma, Runway… locked character consistency |
| **Reels / Shorts — from your own clips** | `video-asset-reels` | Beat-cut your footage/images into a 4K reel with text overlays + VO |
| **Reels / Shorts — viral spec + trend research** | `video-product-pipeline` | Trend hunt → angle scoring → `video-product.md` → your approval → generate → audit (the premium video gate) |
| **Reels / Shorts — hook + storyboard first** | `hook-storyboard-retention` | Scroll-stopping hook + beat-by-beat storyboard (script ↔ timeline in sync) |
| **Carousels (Instagram / LinkedIn)** | `carousel-post-images` | 4K carousel decks (browser render or image-model mode) + per-platform captions |
| **LinkedIn text posts** | `linkedin-personal-brand` | Voice-captured posts, headline + About, weekly calendar — in the user's real voice |
| **YouTube long-form** | `youtube-video-pipeline` | Script (hook in 30s) + 10-title pack + thumbnail brief + description/chapters/tags |
| **Voiceovers / SFX / mixing** | `voice-sfx-audio` | Kokoro/Piper VO, royalty-free SFX/music guidance, FFmpeg mix to -14 LUFS |
| **Boost the winners (once metrics.md shows a pattern)** | `paid-ads-studio` | Meta + Google ad campaigns with forecast-first economics |

## Ready-to-paste handoff prompts

Replace `{N}` with the calendar day and `{hook}`/`{pillar}` with the row's values:

- **text-motion-reels:** "Using the text-motion-reels skill, make a 15s word-pop reel from the Day {N} hook: '{hook}' — Kokoro voice, 4K, caption pack."
- **veo-cinematic-reels:** "Using the veo-cinematic-reels skill, build cinematic scene prompts for the Day {N} reel — same character in every scene, IMAX look, Google Flow."
- **video-asset-reels:** "Using the video-asset-reels skill, cut my clips in assets/ into the Day {N} reel — hook '{hook}', text overlays, Kokoro VO."
- **video-product-pipeline:** "Using the video-product-pipeline skill, run the Day {N} reel through the full pipeline — trend research, angle scoring, spec, approve, generate, audit."
- **hook-storyboard-retention:** "Using the hook-storyboard-retention skill, storyboard the Day {N} reel — hook '{hook}', 15s, retention-engineered beats."
- **carousel-post-images:** "Using the carousel-post-images skill, make the Day {N} carousel from pillar '{pillar}' — 5 slides, 4K, LinkedIn + Instagram captions."
- **linkedin-personal-brand:** "Using the linkedin-personal-brand skill, write the Day {N} LinkedIn post in my voice — hook first, one CTA, no buzzwords."
- **youtube-video-pipeline:** "Using the youtube-video-pipeline skill, plan the Day {N} long-form video — script (hook in 30s), 10 titles, thumbnail brief, description."
- **voice-sfx-audio:** "Using the voice-sfx-audio skill, add a Kokoro voiceover to the Day {N} reel and mix a CC0 bed under it, -14 LUFS."

## Rule of thumb

- A row that says **Reel** and no video skill installed = not executable → install (`text-motion-reels` covers it unless the user has footage → `video-asset-reels`, or wants cinematic AI → `veo-cinematic-reels`).
- **Carousel** rows need `carousel-post-images`; **long-form** rows need `youtube-video-pipeline`; **LinkedIn** text rows are voice-sensitive → `linkedin-personal-brand`.
- The gate (`check-skills.mjs`) is the source of truth for installed vs missing — run it before promising the user an executable 30 days.
