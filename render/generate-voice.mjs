// Generate beat-aligned voiceover lines with Kokoro-82M 'af_heart' (US female).
// - Uses RawAudio.toWav() (the library's own encoder).
// - Auto-fits each line into its beat window via Kokoro's native speed param.
// - Trims verbosity so no line needs >1.35x (avoids chipmunk artifacts).
import { KokoroTTS } from "kokoro-js";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

// Resolve relative to this script so the pipeline works from any clone location.
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../assets");
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

const MAX_SPEED = 1.35;

console.log("Loading Kokoro-82M ONNX model (cached)...");
const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "q8" });
console.log("Model ready. Generating + auto-fitting voiceover lines...\n");

for (const [file, start, maxDur, text] of LINES) {
  // Pass 1: natural speed to learn the raw duration.
  let out = await tts.generate(text, { voice: "af_heart", speed: 1.0 });
  let dur = out.audio.length / out.sampling_rate;
  let speed = 1.0;

  if (dur > maxDur) {
    speed = Math.min(MAX_SPEED, (dur / maxDur) * 1.03); // margin so it lands inside the window
    if (speed > 1.01) {
      out = await tts.generate(text, { voice: "af_heart", speed });
      dur = out.audio.length / out.sampling_rate;
    }
  }

  const wav = Buffer.from(out.toWav());
  writeFileSync(`${OUT}/${file}`, wav);
  const fits = dur <= maxDur;
  console.log(
    `${file.padEnd(20)} start=${String(start).padStart(4)}s  dur=${dur.toFixed(2)}s  ` +
    `window=${maxDur}s  speed=${speed.toFixed(2)}  ${fits ? "FITS ✓" : `OVER by ${(dur - maxDur).toFixed(2)}s (accept: bleed into next beat)`}`
  );
}

console.log("\nDone. All lines written to " + OUT);
