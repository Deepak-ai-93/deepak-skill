# Example — "Neon Hearts" (serial-story-reels)

A complete 3-episode **comic love-story action series** built with `serial-story-reels`: a midnight bike courier (Maya) who carries secret cargo falls for the comic-book artist (Leo) who has been drawing her face for months — while a masked collector hunts the pages she just delivered.

**Genre:** comic-love-story-action · **Aspect:** 9:16 · **3 episodes × 4 scenes × 6s** = 12 scenes / ~72s of story · **2 characters**

## The files

| File | What it is |
|---|---|
| `series-plan.json` | The plan that drives everything (validate + bible → prompt pack + VO) |
| `story-bible.md` | **Generated** by `series-arc.mjs` — season arc, per-episode hooks + cliffhangers, locked grade/world/cinematic tokens, cast blocks (arc validated, exit 0) |
| `character-sheet.md` | Verbatim character blocks for Maya + Leo + 2–3 reference-image prompts each → upload to Flow's Ingredients ONCE, reuse for the whole series |
| `prompts.md` | **Generated** by `episode-prompts.mjs` — 12 copy-paste Veo 3.1 prompts (12/12 consistency-verified), grouped by episode, verbatim character blocks + grade + cinematic tokens in every prompt, 🔗 bridge flags across scenes and episode boundaries |
| `voiceover.md` | **Generated** — every line per episode with delivery direction (native Veo audio or Kokoro post pass) + voice-anchor note |

## Regenerate (from this folder)

```bash
node ../../scripts/series-arc.mjs --plan series-plan.json --bible story-bible.md
node ../../scripts/episode-prompts.mjs --plan series-plan.json --out prompts.md --vo voiceover.md
```

## The season arc

- **E1 "The First Beat"** — Hook: a red-jacket courier leans into a rain-slick turn, a masked van inches from her rear wheel. Cliffhanger: the masked figure pulls a glowing comic page from her bag — it is the exact page Leo has been missing for a year.
- **E2 "Ink and Asphalt"** — Hook: a fist pounds the studio door in the middle of the night. Cliffhanger: the collector raises his mask — it is the gallery owner who launched Leo's show.
- **E3 "Neon Hearts"** — Hook: black ink explodes across a billboard as two silhouettes sprint across the rooftops. Cliffhanger: under the neon heart, a glowing page settles into place — page one of their new story.

## Generate in Flow

1. Upload Maya + Leo reference images to the **Ingredients** panel (once — never change them).
2. Copy each prompt from `prompts.md` → generate at 9:16, 6s, 1080p. **Do not edit the character blocks.**
3. Bridged scenes (🔗) start from the previous scene's last frame; **Episode 2 starts from Episode 1's last frame** (same for E3).
4. Voiceover: keep Veo's native dialogue, or run `voiceover.md` through `voice-sfx-audio` (Kokoro) and mix to -14 LUFS.
