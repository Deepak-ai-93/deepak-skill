#!/bin/bash
set -e
cd "$(dirname "$0")"
ROOT="$(cd .. && pwd)"   # project root, works from any clone location
A="$ROOT/assets"

# Voice lines placed at their beat starts (mono->stereo, 48k), pad at 20% bed.
# Sidechain: pad ducked further under each spoken line (the "ducked to 20%" contract).
ffmpeg -y -v error \
  -i "$A/vo_01_hook.wav" \
  -i "$A/vo_02_week1.wav" \
  -i "$A/vo_03_week2.wav" \
  -i "$A/vo_04_week3.wav" \
  -i "$A/vo_05_payoff1.wav" \
  -i "$A/vo_06_payoff2.wav" \
  -i "$A/vo_07_rules.wav" \
  -i "$A/vo_08_cta.wav" \
  -i "$A/ambient_pad_cc0.wav" \
  -filter_complex "\
[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=0|0,volume=0.9[a0];\
[1:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=3000|3000,volume=0.9[a1];\
[2:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=4500|4500,volume=0.9[a2];\
[3:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=6000|6000,volume=0.9[a3];\
[4:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=7500|7500,volume=0.9[a4];\
[5:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=9000|9000,volume=0.9[a5];\
[6:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=10500|10500,volume=0.9[a6];\
[7:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=12500|12500,volume=0.9[a7];\
[8:a]aresample=48000,volume=0.2[bed];\
[a0][a1][a2][a3][a4][a5][a6][a7]amix=inputs=8:normalize=0[voices];\
[voices]asplit=2[vout][vkey];\
[bed][vkey]sidechaincompress=threshold=0.02:ratio=4:attack=10:release=400[duckbed];\
[duckbed][vout]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.95,apad=pad_dur=1[a]" \
  -t 15 -map "[a]" -c:a aac -b:a 192k "$A/full_mix.m4a"

echo "=== full mix ==="
ffprobe -v error -show_entries format=duration -of csv=p=0 "$A/full_mix.m4a"

# Also export the standalone full voiceover track + pad (matching the HTML <audio> srcs)
ffmpeg -y -v error \
  -i "$A/vo_01_hook.wav" -i "$A/vo_02_week1.wav" -i "$A/vo_03_week2.wav" \
  -i "$A/vo_04_week3.wav" -i "$A/vo_05_payoff1.wav" -i "$A/vo_06_payoff2.wav" \
  -i "$A/vo_07_rules.wav" -i "$A/vo_08_cta.wav" \
  -filter_complex "\
[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=0|0[a0];\
[1:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=3000|3000[a1];\
[2:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=4500|4500[a2];\
[3:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=6000|6000[a3];\
[4:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=7500|7500[a4];\
[5:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=9000|9000[a5];\
[6:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=10500|10500[a6];\
[7:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=12500|12500[a7];\
[a0][a1][a2][a3][a4][a5][a6][a7]amix=inputs=8:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,apad=pad_dur=1[a]" \
  -t 15 -map "[a]" -c:a pcm_s16le "$ROOT/voice_kokoro_af_heart.wav"

cp "$A/ambient_pad_cc0.wav" "$ROOT/ambient_pad_cc0.wav"
echo "=== standalone voice track ==="
ffprobe -v error -show_entries format=duration -of csv=p=0 "$ROOT/voice_kokoro_af_heart.wav"
echo "mix done"
