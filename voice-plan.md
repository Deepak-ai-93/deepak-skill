# Voice Plan — deep, emotive, 100% open-source

> **Status:** Tier 1 implemented · Tiers 2–3 roadmap
> **Constraint:** CPU-only, commercial-safe licensing (MIT / Apache 2.0 / CC0) — no non-commercial models, ever.

## Problem

The current voiceover (`Kokoro af_heart` + auto-fit up to 1.35×) sounds **robotic**, and there is no deep, expressive male voice.

## Diagnosis (why it sounds robotic)

1. **Wrong voice register** — `af_heart` is a *female* voice (the most natural female in Kokoro, but the opposite of "deep").
2. **Pace** — lines are auto-fit up to **1.35×** to squeeze into beat windows; fast speech = robotic.
3. **No emotion/pitch conditioning** — Kokoro only exposes `voice` + `speed`.

## Tier 1 — Deep voice now (implemented, CPU, zero new deps)

| Change | Detail |
|---|---|
| **Voice** | `am_fenrir` (deepest, quality C+) · `am_michael` (most stable, C+) · `bm_george` (warm UK, C). **Avoid `am_adam`** — deep but grade F+, rough. |
| **Pace** | Auto-fit cap lowered **1.35× → 1.15×** (`generate-voice.mjs --max-speed 1.15`). If a line still overflows, **shorten the copy** — never widen the window (FITS ✓ contract). |
| **Enhance** | `node render/enhance-voice.mjs --in vo.wav --out vo_deep.wav` — pitch **−2 semitones** + **+4 dB @ 120 Hz** warmth EQ (+ optional light compressor), **duration-preserving** so beat sync holds. |
| **Master** | `mix-audio.sh` → **−14 LUFS**. |

```bash
# 1. generate with the deep male voice
node render/generate-voice.mjs --voice am_fenrir --max-speed 1.15
# 2. deepen each line (pitch down, duration preserved)
node render/enhance-voice.mjs --in assets/vo_01_hook.wav --out assets/vo_01_hook_deep.wav
# 3. mix everything to -14 LUFS
bash render/mix-audio.sh
```

Why duration-preserving matters: the pitch shift is `asetrate=rate*0.8909` + `atempo=1.1225` (+ `aresample=rate`), so the wave is *shorter in pitch but same in time* — the FITS ✓ beat-window contract never breaks. (Higher-quality alternative when available: `rubberband=pitch=0.89` — needs an FFmpeg build with librubberband, often absent on Windows.)

**Files changed:** `render/generate-voice.mjs` (flags + deep default) · `render/enhance-voice.mjs` (new) · `skills/voice-sfx-audio/SKILL.md` (recipe) · `README.md` · `prompt-examples.md`.

## Tier 2 — Chatterbox (MIT) — roadmap, needs GPU

- **Emotion exaggeration dial:** 0.0 flat → 0.5 natural (default) → 1.0+ theatrical.
- Natural tags (Turbo): `[pause]`, `[sigh]`, `[laugh]`, `[gasp]`.
- **Zero-shot cloning** from a 5–10 s reference — clone any deep-voiced narrator (with permission).
- Hardware: original ~8–16 GB VRAM; **Turbo (350M)** lighter.
- Note: generated audio carries Resemble's PerTh watermark (imperceptible, provenance only).

## Tier 3 — Zonos / Orpheus (Apache 2.0) — roadmap, needs GPU

| Model | Emotion control | Deep male | Hardware |
|---|---|---|---|
| **Zonos** (Zyphra) | sliders: happiness / sadness / anger / fear / surprise + speaking rate + pitch std | clone a deep reference (5–30 s) | 6–8 GB VRAM, 44 kHz |
| **Orpheus** (Canopy) | emotive tags `<laugh>` `<sigh>` … ; male presets Leo / Dan / Zac | built-in presets or clone | 8–12 GB VRAM |

## Excluded (never for monetized videos)

- **F5-TTS** — pre-trained models are CC-BY-NC.
- **Coqui XTTS-v2** — CPML non-commercial.
- **Edge-TTS / gTTS** — cloud wrappers with ToS limits for automated commercial use.

## Sync & quality rules (non-negotiable)

1. **Pitch shifts must preserve duration** — verify with ffprobe (in vs out ≤ 0.05 s drift); `enhance-voice.mjs` does this check automatically.
2. **Stay ≥ −3 semitones** — below that = artifacts.
3. Every line **FITS ✓** its beat window at ≤ 1.15×; else shorten copy.
4. Master at **−14 LUFS**.
5. **Deterministic:** same input → identical wav (no randomness introduced).
6. **A/B test** before switching a channel's default voice.

## Validation checklist

- [ ] `node --check render/generate-voice.mjs render/enhance-voice.mjs`
- [ ] ffprobe: enhancer output duration == input (±0.05 s)
- [ ] FITS ✓ on all lines at ≤ 1.15×
- [ ] −14 LUFS loudnorm pass on the final mix
- [ ] A/B listen: `af_heart` vs `am_fenrir + enhance` → keep the deeper, natural one
- [ ] Two identical runs → identical files
