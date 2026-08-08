# Video Product — {Title}

> Copy this template to `video-product.md` (project root) and fill every field.
> This file is the **approval contract**: nothing is generated until the user approves it.

## 1. Identity

| Field | Value |
|---|---|
| **Title** | {e.g. 3 Money Rules Nobody Told You} |
| **Niche** | {e.g. personal finance / savings} |
| **Platform** | {Instagram Reels / TikTok / YouTube Shorts} |
| **Duration** | {15}s → {8} beats (seconds ÷ 2) |
| **Output name** | `{format-slug}_{topic-slug}_4k` (topic ≤ 3 words, lowercase, hyphens) |

## 2. Style & hook

| Field | Value |
|---|---|
| **Format / style** | {word-pop / highlighter / 3d-editorial / card-listicle / chat-thriller / svg-ambient / documentary / aesthetic / montage} |
| **Style slug** | {format-slug} |
| **Hook formula** | {curiosity gap / contrarian / results-first / listicle / PAS} |
| **Hook copy (first 3s, ≤8 words)** | {e.g. Your savings are leaking. Fix these 3 rules.} |
| **Palette** | {bg / text / accent hex} |
| **Typography** | {font stack + weights} |

## 3. Beat sheet (the generation contract)

One beat = one text block (3–6 words) + one visual. `start` + `duration` must tile the timeline exactly.

| # | id | start | duration | Text on screen (3–6 words) | Visual / motion |
|---|---|---|---|---|---|
| 1 | beat_01 | 0.0 | 3.0 | {hook} | {push-in zoom, word pop} |
| 2 | beat_02 | 3.0 | 2.0 | {…} | {cut / highlight sweep} |
| 3 | beat_03 | 5.0 | 2.0 | {…} | {…} |
| … | … | … | … | … | … |
| N | beat_NN | {last} | 2.5 | {CTA / loop ending} | {loop back to frame 1} |

Rules: hook in beat 1, open loop closed in the final 3s, visual shift every 1.5–2s, CTA/loop in the last beat.

## 4. Safe-zone map (9:16, enforced by the audit)

- Hard safe zone for ALL text: **x 8–92% · y 15–85%** of the 1080x1920 stage.
- Preferred reading column: centered, **75% width, y 28–72%**.
- Animations/assets only in bands outside the reading column (top 0–25%, bottom 75–100%, gutters x 0–8% / 92–100%), clipped with `overflow: hidden`.
- No two text blocks may overlap on screen; max 6 words per beat.

## 5. Voice & audio

| Field | Value |
|---|---|
| **Voice engine / id** | {kokoro af_heart / am_adam / …} |
| **One line per beat?** | {yes — auto-fit into each window, cap speed 1.35x, FITS ✓ required} |
| **Music / SFX** | {CC0 track — name + source + license} |
| **Mix target** | -14 LUFS, voice 100% / bed ~30% ducked |

## 6. Captions

`caption.md` via `generate-caption.mjs` — every platform section 500–900 chars (aim ~700), no hashtags, hook first, one CTA, truncation-safe.

## 7. Decisions (what changed from the raw prompt)

- {Raw prompt said "…" — interpreted as …}
- {Fixed typo / rewrote copy: "…" → "…"}
- {Defaulted duration / style / voice to … because the prompt didn't specify}

---

> **Status: awaiting user approval** — reply **approve** to generate, **edit** to revise, or **reject** to stop.
