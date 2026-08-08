// Generate beat-aligned voiceover lines with Kokoro-82M. Default voice:
// 'am_fenrir' — the deepest stable male voice (see voice-plan.md and the
// voice-sfx-audio "deep voice" recipe). The two biggest anti-robotic fixes are:
// (1) use a deep male voice, (2) never auto-fit above 1.15x — shorten the copy
// instead of speeding it up (1.35x = chipmunk/robotic).
//
// - Uses RawAudio.toWav() (the library's own encoder).
// - Auto-fits each line into its beat window via Kokoro's native speed param.
// - Flags: --voice <id> (default am_fenrir) · --max-speed <n> (default 1.15)
//          --out <dir> (default: <repo>/assets; relative paths resolve from cwd)
//
// After generation, deepen the lines:
//   node render/enhance-voice.mjs --in assets/vo_01_hook.wav --out assets/vo_01_hook_deep.wav
import { KokoroTTS } from "kokoro-js";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

// --- tiny arg parser (same style as the other render scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const inline = args[i].split("=")[1];
  return inline !== undefined ? inline : args[i + 1];
};

const VOICE = opt("voice", "am_fenrir");
const MAX_SPEED = parseFloat(opt("max-speed", "1.15"));
const OUT_ARG = opt("out");
// Default: <repo>/assets (relative to this script) — same as before; --out from cwd.
const OUT = OUT_ARG
  ? resolve(process.cwd(), OUT_ARG)
  : resolve(dirname(fileURLToPath(import.meta.url)), "../assets");
mkdirSync(OUT, { recursive: true });

// [file, beat-start-seconds, max-window-seconds, text]
const LINES = [
  ["vo_01_hook.wav",     0.0, 3.0, "How I mastered mental clarity in three weeks."],
  ["vo_02_week1.wav",    3.0, 1.5, "I silenced the noise."],
  ["vo_03_week2.wav",    4.5, 1.5, "I built a ritual."],
  ["vo_04_week3.wav",    6.0, 1.5, "I kept what mattered."],
  ["vo_05_payoff1.wav",  7.5, 1.5, "Clarity isn't found."],
  ["vo_06_payoff2.wav",  9.0, 1.5, "It is curated."],
  ["vo_07_rules.wav",   10.5, 2.0, "Three rules. Nothing else."],
  ["vo_08_cta.wav",     12.5, 2.5, "Save this. Rewatch it."],
];

console.log("Loading Kokoro-82M ONNX model (cached)...");
const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "q8" });
console.log(`Model ready. Voice: ${VOICE} · max auto-fit speed: ${MAX_SPEED}x\n`);

for (const [file, start, maxDur, text] of LINES) {
  // Pass 1: natural speed to learn the raw duration.
  let out = await tts.generate(text, { voice: VOICE, speed: 1.0 });
  let dur = out.audio.length / out.sampling_rate;
  let speed = 1.0;

  if (dur > maxDur) {
    speed = Math.min(MAX_SPEED, (dur / maxDur) * 1.03); // margin so it lands inside the window
    if (speed > 1.01) {
      out = await tts.generate(text, { voice: VOICE, speed });
      dur = out.audio.length / out.sampling_rate;
    }
  }

  const wav = Buffer.from(out.toWav());
  writeFileSync(`${OUT}/${file}`, wav);
  const fits = dur <= maxDur;
  console.log(
    `${file.padEnd(20)} start=${String(start).padStart(4)}s  dur=${dur.toFixed(2)}s  ` +
    `window=${maxDur}s  speed=${speed.toFixed(2)}  ${fits ? "FITS ✓" : `OVER by ${(dur - maxDur).toFixed(2)}s — SHORTEN THE COPY (never widen the window)`}`
  );
}

console.log("\nDone. All lines written to " + OUT);
console.log("Next: node render/enhance-voice.mjs --in <line>.wav --out <line>_deep.wav  (pitch −2 st + warmth EQ, duration-preserving)");
