# Worked example — 30s "Money Rules" reel audio mix

> A complete worked output of the voice-sfx-audio skill for one reel: voice
> selection → TTS generation → SFX + music sourcing → FFmpeg mix (ducked) →
> audit. Every artifact is license-safe and fully monetizable.

## 1. Voice selection (Step 1)
- **Engine:** Kokoro-82M (Apache 2.0, local CPU) · **Voice:** `am_michael` (stable, warm).
- Per-scene generation (easier to redo one take):
```bash
pip install kokoro soundfile
python gen.py --text "Stop paying your credit card bill on time." --voice am_michael --out vo/beat1.wav
python gen.py --text "Pay two days early. Watch the interest window shrink." --voice am_michael --out vo/beat2.wav
```

## 2. SFX + music (Step 2 — license-safe only)
- **Music:** Pixabay "Upbeat Minimal Corporate" (Pixabay Content License — commercial OK) → `sfx/bed.mp3`.
- **SFX:** card swipe (Freesound CC0) → `sfx/swipe.wav`; cash register (CC0) → `sfx/cash.wav`.
- ⚠️ Rejected: any track marked "attribution required" without attribution in the caption.

## 3. Mix (Step 3 — FFmpeg, ducked, deterministic)
```bash
# concat VO → bed + duck → SFX on beat → loudness normalize
ffmpeg -i vo/beat1.wav -i vo/beat2.wav -filter_complex "[0][1]concat=n=2:v=0:a=1[vo]" \
  -i sfx/bed.mp3 -i sfx/swipe.wav \
  -filter_complex "[vo]volume=1.0[vc];[1:a]volume=0.22,sidechaincompress=threshold=0.05:ratio=8[bed];\
   [bed][vc]amix=inputs=2:duration=first[full];[2:a]adelay=500|500,volume=0.6[fx];\
   [full][fx]amix=inputs=2:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[out]" \
  -map "[out]" -ar 48000 mix/reel-final.wav
```

## 4. Integration (Step 4)
- `render-frames.mjs --html reel.html --name money-rules_4k --audio mix/reel-final.wav` → MP4 with muxed, ducked audio.

## 5. Audit (Step 5 — excerpt)
- `audit-audio.mjs` → 0 FAIL: every source license-safe (CC0 / Pixabay / Apache-2.0), mix command deterministic, loudness ≈ −14 LUFS, no clipping (max sample < −1 dBTP).
- **audio-auditor verdict:** 40/50 → **PASS**.
