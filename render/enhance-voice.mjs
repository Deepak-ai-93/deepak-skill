#!/usr/bin/env node
// Deep-voice enhancer — Tier 1 of the open-source deep-voice plan (voice-plan.md).
// Pitch-shifts a voice DOWN while PRESERVING duration (so the FITS ✓ beat-window
// sync contract never breaks), then adds low-end chest warmth via EQ. Pure
// FFmpeg, no new dependencies, CPU-only.
//
// Usage:
//   node render/enhance-voice.mjs --in assets/vo_01_hook.wav --out assets/vo_01_hook_deep.wav
//
// Options:
//   --in <file>      input audio (required)
//   --out <file>     output audio (default: <in>_deep.wav)
//   --semitones <n>  pitch shift DOWN in semitones (default: 2 — keep ≤ 3)
//   --warmth <db>    120 Hz chest-warmth EQ boost in dB (default: 4)
//   --compress       also apply a light vocal compressor (default: off)
//
// Exit 0 = success + duration preserved · 1 = processing error · 2 = bad usage.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, join, dirname, basename, extname } from "node:path";

// --- tiny arg parser (same style as the other render scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const inline = args[i].split("=")[1];
  return inline !== undefined ? inline : args[i + 1];
};

const IN = opt("in");
if (!IN) {
  console.error("Usage: node enhance-voice.mjs --in <file> [--out file] [--semitones 2] [--warmth 4] [--compress]");
  process.exit(2);
}
const inPath = resolve(process.cwd(), IN);
if (!existsSync(inPath)) {
  console.error(`MISSING input: ${inPath}`);
  process.exit(1);
}
const SEMIS = parseFloat(opt("semitones", "2"));
const WARMTH = parseFloat(opt("warmth", "4"));
if (!(SEMIS > 0)) {
  console.error("--semitones must be a positive number (e.g. 2 = two semitones down).");
  process.exit(2);
}
const COMPRESS = args.includes("--compress");
const OUT_ARG = opt("out");
const outPath = OUT_ARG
  ? resolve(process.cwd(), OUT_ARG)
  : join(dirname(inPath), `${basename(inPath, extname(inPath))}_deep${extname(inPath)}`);

if (SEMIS > 3) console.log("⚠️  More than 3 semitones risks artifacts — consider a different voice instead.");

// Real input sample rate (Kokoro outputs 24000; anything is fine).
const rate =
  parseInt(
    execFileSync("ffprobe", [
      "-v", "error",
      "-select_streams", "a:0",
      "-show_entries", "stream=sample_rate",
      "-of", "csv=p=0",
      inPath,
    ]).toString().trim(),
    10
  ) || 44100;

// Duration-preserving pitch shift: lower the rate (drops pitch + stretches time),
// then atempo by the reciprocal (restores duration), then resample back.
const factor = Math.pow(2, -SEMIS / 12);
const atempo = 1 / factor;
const sr = Math.round(rate * factor);

const chain = [
  `asetrate=${sr}`,
  `atempo=${atempo.toFixed(6)}`,
];
if (COMPRESS) chain.push("acompressor=threshold=-18dB:ratio=3:attack=5:release=120");
chain.push(`equalizer=f=120:width_type=o:w=1:g=${WARMTH}`);
chain.push(`aresample=${rate}`);

console.log(`Input   : ${inPath}`);
console.log(`Shift   : -${SEMIS} semitones (factor ${factor.toFixed(4)}, atempo ${atempo.toFixed(4)}) · warmth +${WARMTH} dB @ 120 Hz${COMPRESS ? " · compressor on" : ""}`);
console.log(`Output  : ${outPath}`);

execFileSync("ffmpeg", ["-y", "-v", "error", "-i", inPath, "-af", chain.join(","), outPath], { stdio: "inherit" });

// Sync check: duration MUST be preserved (FITS ✓ beat-window contract).
const durOf = (p) =>
  parseFloat(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).toString().trim()
  );
const dIn = durOf(inPath);
const dOut = durOf(outPath);
const drift = Math.abs(dOut - dIn);
console.log(`\nDuration: in ${dIn.toFixed(3)}s → out ${dOut.toFixed(3)}s (drift ${drift.toFixed(3)}s)`);
if (drift > 0.05) {
  console.log("❌ SYNC DRIFT — the pitch shift changed the duration; the FITS contract is broken. Check your FFmpeg build.");
  process.exitCode = 1;
} else {
  console.log("✅ Duration preserved — safe for beat-window sync. Finish with mix-audio.sh (-14 LUFS).");
}
