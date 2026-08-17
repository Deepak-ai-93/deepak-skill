#!/usr/bin/env node
// Pre-cut + normalize video/image assets into per-beat 1080x1920 clips for
// asset reels (skills/video-asset-reels). Deterministic input for HyperFrames:
// every beat gets its own exact-length, muted, cover-cropped clip.
//
// Usage:
//   node render/cut-assets.mjs storyboard.json
//
// Manifest schema (storyboard.json):
// {
//   "out": "assets/cuts",          // output folder (relative to cwd)
//   "width": 1080, "height": 1920, "fps": 30,
//   "beats": [
//     { "id": "beat_01", "src": "assets/clips/sunrise.mp4", "in": 1.5, "duration": 3.0 },
//     { "id": "beat_02", "src": "assets/photos/desk.jpg",                "duration": 2.5 }
//   ]
// }
// Videos: trimmed from {in} for {duration}s. Images: looped for {duration}s.
// All output: H.264, yuv420p, muted, cover-cropped to 1080x1920 @ 30fps.
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: video-asset-reels · ${label}\n${BRAND_LINE}\n`;
console.log(banner("cut-assets.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

// Accept --manifest <path> or the positional form (kept for back-compat).
const manifestPath = opt("manifest", process.argv[2]);
if (!manifestPath) {
  console.error("Usage: node render/cut-assets.mjs storyboard.json  (or --manifest <path>)");
  process.exit(1);
}

const man = JSON.parse(readFileSync(resolve(process.cwd(), manifestPath), "utf8"));
const outDir = resolve(process.cwd(), man.out || "assets/cuts");
mkdirSync(outDir, { recursive: true });

const W = man.width || 1080;
const H = man.height || 1920;
const FPS = man.fps || 30;
const FILTER = `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${FPS},format=yuv420p`;

if (!Array.isArray(man.beats) || !man.beats.length) {
  console.error("Manifest has no beats. Add a beats array with { id, src, duration }.");
  process.exit(1);
}

for (const beat of man.beats) {
  const src = resolve(process.cwd(), beat.src);
  if (!existsSync(src)) {
    console.error(`MISSING source: ${src}`);
    process.exit(1);
  }
  const out = join(outDir, `${beat.id}.mp4`);
  const isImage = /\.(jpe?g|png|webp|gif)$/i.test(beat.src);

  const ff = ["-y", "-v", "error"];
  if (isImage) {
    ff.push("-loop", "1", "-i", src, "-t", String(beat.duration));
  } else {
    ff.push("-ss", String(beat.in || 0), "-i", src, "-t", String(beat.duration));
  }
  ff.push("-vf", FILTER, "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-r", String(FPS), out);

  execFileSync("ffmpeg", ff, { stdio: "inherit" });
  console.log(`${beat.id}: ${beat.src}${isImage ? " (image)" : ` @${beat.in || 0}s`} -> ${out} (${beat.duration}s)`);
}

console.log(`\n✅ ${man.beats.length} clips ready in ${outDir}`);
