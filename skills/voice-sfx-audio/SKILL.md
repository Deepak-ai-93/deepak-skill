---
name: voice-sfx-audio
description: Generate voiceovers with open-source TTS, source royalty-free sound effects and background music, and mix audio with FFmpeg sidechain ducking for short-form videos.
---

# skill: voice-sfx-audio

**Name:** Open-Source Voiceover + Sound Effects for Reels/Shorts
**Description:** Use this skill to generate natural AI voiceovers with open-source TTS, source royalty-free/open-source sound effects and background music, and mix them into a video with FFmpeg (ducking included) — fully monetizable, no commercial fees. Complements `text-only-motion-reels` (visuals) and `hook-storyboard-retention` (message/timing). The three skills together = complete reel production. Content first: the trending topic, hook and script come from `hook-storyboard-retention` / `video-product-pipeline` (trend research + brainstorming happen there) — this skill makes them sound premium.

---

## When to use

Use this skill whenever the user asks to:
- "Add a voiceover to this reel / short"
- "Generate narration with AI voice"
- "Add background music and sound effects"
- Mix audio tracks, duck music under narration, or pick audio with safe licenses

---

## 1. Open-source TTS engines (voiceover)

**Top pick: Kokoro-82M** — Apache 2.0, broadcast-quality narration, runs locally (even CPU), 54 voices across 8+ languages (US/UK English, Spanish, French, Hindi, Italian, Japanese, Mandarin, Brazilian Portuguese).

**Deep & emotive voices:** for a deep, non-robotic narration voice use the male voices — `am_fenrir` (deepest, robust), `am_michael` (most stable), `bm_george` (warm UK). Avoid `am_adam` (deep but rough). Combine with the deep-voice recipe below (Tier 1, CPU-only).

| Engine | License | Run | Best for | Notes |
|---|---|---|---|---|
| **Kokoro-82M** ⭐ | Apache 2.0 | Local, CPU-fast | Natural explainer/story narration | Recommended default; `pip install kokoro soundfile` |
| **Piper** | MIT | Local, ultra-light (even Raspberry Pi) | Bulk automated generation | Slightly robotic; `pip install piper-tts` |
| **Chatterbox** (Resemble) | MIT | Local (GPU helpful) | Emotional delivery | Has explicit emotion "exaggeration" dial |
| **F5-TTS** | Code MIT, **models CC-BY-NC** | Local (GPU) | Zero-shot voice cloning | ⚠️ Non-commercial pre-trained models — fine-tune for monetized use |
| **Coqui XTTS-v2** | CPML (non-commercial) | Local | Voice cloning from ~6s sample | ⚠️ Non-commercial; Coqui shut down in 2024 |
| **gTTS / Edge-TTS** | Cloud wrappers (not open-source) | Cloud | Quick drafts | ⚠️ ToS limits for automated commercial use |

**Kokoro example:**
```bash
pip install kokoro soundfile
# also need espeak-ng (phonemizer): apt-get install espeak-ng (Ubuntu) / MSI installer (Windows)
```
```python
from kokoro import KPipeline
import soundfile as sf

pipeline = KPipeline(lang_code='a')  # 'a' = American English
generator = pipeline("Welcome to this short video.", voice='af_heart')
for i, (gs, ps, audio) in enumerate(generator):
    sf.write('output.wav', audio, 24000)
```

**Voice & emotion rules:**
- Hook lines: energetic voice, slightly faster pace
- Story/explainer: calm, natural cadence; use reference audio with the emotion you want (F5/XTTS style)
- For explicit emotion control, use Chatterbox's exaggeration dial
- Generate each scene separately, then stitch — easier to re-do one take
- **Deep voice (CPU):** Kokoro male voice (`am_fenrir`) + `enhance-voice.mjs` (pitch −2 st + warmth EQ) — see the deep-voice recipe below

---

## The deep-voice recipe (Tier 1 — CPU, zero new deps)

> The commands below assume a repo clone (`render/`). In a standalone skill install, copy `generate-voice.mjs` + `enhance-voice.mjs` into your project (or run from a clone) — the recipe itself is just FFmpeg + Kokoro.

The default Kokoro voice (`af_heart`) is the most natural *female* voice, but the "robotic" complaint usually comes from a female register + auto-fitting lines up to 1.35×. For a deep, emotive narration with no GPU:

1. **Pick a deep male voice:** `am_fenrir` (deepest, robust) · `am_michael` (most stable) · `bm_george` (warm UK). Avoid `am_adam` — deep but rough.
2. **Slow the pace:** cap auto-fit at **1.15×** (`node render/generate-voice.mjs --voice am_fenrir --max-speed 1.15`). If a line still overflows its beat window, **shorten the copy** — never widen the window (FITS ✓ contract).
3. **Deepen the audio** (duration-preserving, so sync holds):
```bash
node render/enhance-voice.mjs --in assets/vo_01_hook.wav --out assets/vo_01_hook_deep.wav
# pitch −2 semitones (asetrate+atempo) + +4 dB @ 120 Hz warmth EQ (+ --compress optional)
```
4. **Master:** `mix-audio.sh` → −14 LUFS.

**Roadmap (GPU):** Tier 2 = Chatterbox (MIT, emotion exaggeration dial 0.0→1.0+, `[pause]`/`[sigh]` tags, zero-shot cloning) · Tier 3 = Zonos / Orpheus (Apache 2.0, emotion sliders / `<laugh>` tags). Full plan: `voice-plan.md`. Never F5-TTS or XTTS (non-commercial models) or Edge-TTS (ToS) for monetized videos.

---

## 2. Open-source / royalty-free SFX & music

| Source | License | Monetize? | Use for |
|---|---|---|---|
| **Kenney.nl** ⭐ | CC0 (public domain) | ✅ Free, no attribution | Clean UI/retro SFX packs |
| **Pixabay Audio** ⭐ | Pixabay Content License | ✅ Free commercial | BGM + SFX, huge library |
| **Freesound.org** | Mixed: CC0 / CC-BY / CC-NC | ✅ filter to CC0/CC-BY | Ambient & effects — **always filter by license** |
| **Incompetech** (Kevin MacLeod) | CC-BY 4.0 | ✅ with attribution in description | Cinematic/suspense/upbeat music |
| **OpenGameArt.org** | Mixed (CC0 / CC-BY / GPL) | ✅ check per-file | Game-style music & SFX |
| **BBC Sound Effects** | Personal/educational only | ❌ No commercial | Research/moodboards only |

**Rules:**
- Default to CC0 → no attribution, no risk
- CC-BY → add attribution line in the video description (e.g. "Music: Kevin MacLeod (incompetech.com), CC-BY 4.0")
- Never use CC-NC or BBC library clips in monetized videos
- Download once, freeze into the project folder (no hot-linking CDNs at render time)

---

## 3. Mixing with FFmpeg (voiceover + music + SFX)

Target levels: **voice 100%, music ~30%, SFX ~80%**. Always **duck** music under narration.

```bash
ffmpeg -i video.mp4 -i voice.wav -i music.mp3 -i sfx.wav \
-filter_complex \
"[2:a]volume=0.3[music]; \
 [3:a]volume=0.8[sfx]; \
 [1:a]asplit=2[voc_duck][voc_out]; \
 [music][voc_duck]sidechaincompress=threshold=0.08:ratio=6:attack=20:release=300[ducked_music]; \
 [ducked_music][voc_out][sfx]amix=inputs=3:duration=first:dropout_transition=2[a]" \
-map 0:v -map "[a]" \
-c:v copy -c:a aac -b:a 192k output_final.mp4
```

How it works: music drops to 30% baseline → sidechain compressor lowers it automatically whenever the voice speaks → voice + ducked music + SFX mix into one master track. `-c:v copy` keeps video untouched.

**Loudness tip:** aim for ~ -14 LUFS (platform standard). If you have only `loudnorm`, run it once on the final mix: `ffmpeg -i output_final.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v copy out.mp4`.

---

## 4. Integration with HyperFrames

Audio lives in the composition as `<audio>` tracks with timing + volume:

```html
<audio data-start="0" data-duration="12" data-track-index="1" data-volume="0.3" src="music.wav"></audio>
<audio data-start="1.5" data-duration="8"  data-track-index="2" data-volume="0.9" src="voice.wav"></audio>
```

- Voice track: `data-volume="0.9"` (lead)
- Music track: `data-volume="0.3"` (bed — ducking equivalent in composition)
- SFX track: short `data-start`/`data-duration` hits, e.g. a whoosh at scene transitions
- Keep `data-start` times aligned with storyboard beats (see `hook-storyboard-retention`)

---

## 5. Audit harness (automated checks + audio-auditor subagent, before delivery)

**Step 5a — run the automated audit harness:**
```bash
node scripts/audit-audio.mjs --pack <audio-folder> --out audio-audit.md
```
`audit-audio.mjs` checks everything a script can: license compliance (no CC-NC / BBC / F5-TTS / XTTS / Edge-TTS as choices for monetized work), commercial-safe sources (CC0 / MIT / Apache), CC-BY attribution notes, the voice engine choice, the mix contract (ducking, levels voice 100 / music ~30 / SFX ~80, -14 LUFS), local-freeze note, and the assets/ audio files. Writes `audio-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 5b — spawn the audio-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/audio-auditor-brief.md`: completes the **audio-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth shipping**, with verdict bands), makes the creative judgment calls the script can't (voice quality, emotion fit, sync accuracy, SFX taste), and signs **PASS / FIX NEEDED** with per-file fixes.

**Step 5c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix the plan/mix → re-run `audit-audio.mjs` → re-mix → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `audio-audit.md` ships with the deliverable.

---

## Production checklist

- [ ] Voiceover: Kokoro (Apache 2.0) or MIT engine chosen — no NC-licensed models for monetized work
- [ ] Voice generated per scene, matching emotion of the beat (hook = energetic)
- [ ] Music/SFX sourced from CC0 (default) or CC-BY (attribution added)
- [ ] No CC-NC / BBC library audio in monetized videos
- [ ] Music ducked under voice (sidechain or `data-volume`)
- [ ] Levels: voice 100% / music ~30% / SFX ~80%
- [ ] Final loudness ≈ -14 LUFS
- [ ] Attributed CC-BY sources in video description
- [ ] Audio files frozen locally in the project folder
- [ ] **Audit harness run:** `audit-audio.mjs` → automated checks (licenses, sources, voice, mix contract, loudness, local files) — exit 0
- [ ] **Audio-auditor subagent** (fresh eyes) completed the audio-worthiness scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `audio-audit.md`
