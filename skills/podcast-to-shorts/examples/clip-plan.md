# Clip Plan — virality-scored moments
Source: `transcript-sample.txt` · 10 segments scored · cutoff ≥ 4

| # | Start | End | Score | Words | Why it scores | Suggested hook |
|---|---|---|---|---|---|---|
| 1 | 00:01:05 | 00:01:17 | 14 | 16 | hook+6 (here's the thing, nobody tells), emotion+2 (hurt), controversy+4 (wrong, actually hurts), short+2 | Contrarian hook — the claim people will argue with |
| 2 | 00:00:42 | 00:00:54 | 10 | 17 | hook+6 (everyone thinks, biggest), controversy+2 (myth), short+2 | Contrarian hook — the claim people will argue with |
| 3 | 00:03:00 | 00:03:12 | 8 | 17 | emotion+2 (angry), controversy+2 (stop doing), numbers+2, short+2 | Contrarian hook — the claim people will argue with |
| 4 | 00:03:25 | 00:03:37 | 6 | 14 | controversy+2 (wrong), quotable+2 (that's it, end of story), short+2 | Contrarian hook — the claim people will argue with |
| 5 | 00:01:30 | 00:01:42 | 5 | 32 | hook+3 (my client), numbers+2 | Bold-claim hook — state the outcome |

## FFmpeg cut commands (9:16 vertical)

```bash
# Clip 1 — 00:01:05 → 00:01:17 (score 14)
ffmpeg -ss 65 -i episode.mp4 -t 12.00 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k clips/clip_01.mp4

# Clip 2 — 00:00:42 → 00:00:54 (score 10)
ffmpeg -ss 42 -i episode.mp4 -t 12.00 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k clips/clip_02.mp4

# Clip 3 — 00:03:00 → 00:03:12 (score 8)
ffmpeg -ss 180 -i episode.mp4 -t 12.00 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k clips/clip_03.mp4

# Clip 4 — 00:03:25 → 00:03:37 (score 6)
ffmpeg -ss 205 -i episode.mp4 -t 12.00 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k clips/clip_04.mp4

# Clip 5 — 00:01:30 → 00:01:42 (score 5)
ffmpeg -ss 90 -i episode.mp4 -t 12.00 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k clips/clip_05.mp4

```

Re-run with `--cuts clip-plan.md --input episode.mp4 --run` to execute all cuts.