#!/usr/bin/env node
// Render deterministic frames from a HyperFrames HTML composition and assemble
// a properly-named MP4 (default: vertical 4K = 2160x3840).
//
// The paused GSAP timeline (window.__timelines.<name>) is seeked per frame,
// then the full viewport is screenshotted (stage must exactly fill it).
// deviceScaleFactor = 2 on a 1080x1920 CSS stage yields true 4K output.
//
// Usage:
//   node render-frames.mjs --html <file> [options]
//
// Options:
//   --html <file>    path to the composition HTML (required; relative paths OK)
//   --out <dir>      output directory (default: "output")
//   --name <base>    output base name  -> {name}.mp4  (default: "reel_4k")
//   --fps <n>        frames per second (default: 30)
//   --duration <s>   total seconds (default: timeline duration, fallback 15)
//   --width <px>     viewport CSS width  (default: 1080)
//   --height <px>    viewport CSS height (default: 1920)
//   --scale <n>      device scale factor; output pixels = viewport * scale
//                    (default: 2  →  2160x3840 vertical 4K)
//   --quality <n>    jpeg quality 1-100 (default: 90)
//   --timeline <id>  timeline key on window.__timelines (default: "reel")
//   --audio <file>   optional audio to mux into the MP4
//   --no-assemble    skip the ffmpeg MP4 assembly step (frames only)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

// --- tiny arg parser (no deps) -------------------------------------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const inline = args[i].split("=")[1];
  if (inline !== undefined) return inline;
  return args[i + 1];
};
const has = (name) => args.includes(`--${name}`);

const htmlArg = opt("html");
if (!htmlArg) {
  console.error("Usage: node render-frames.mjs --html <file> [--out dir] [--name base] [--fps 30] [--duration s] [--width 1080] [--height 1920] [--scale 2] [--audio file] [--no-assemble]");
  process.exit(1);
}

const CWD = process.cwd();
const URL = pathToFileURL(resolve(CWD, htmlArg)).href;
const OUT = resolve(CWD, opt("out", "output"));
const NAME = opt("name", "reel_4k");
const FPS = parseInt(opt("fps", "30"), 10);
const DURATION_ARG = parseFloat(opt("duration", "NaN"));
const WIDTH = parseInt(opt("width", "1080"), 10);
const HEIGHT = parseInt(opt("height", "1920"), 10);
const SCALE = parseFloat(opt("scale", "2"));
const QUALITY = parseInt(opt("quality", "90"), 10);
const TIMELINE = opt("timeline", "reel");
const AUDIO = opt("audio");
const ASSEMBLE = !has("no-assemble");

const FRAMES_DIR = join(OUT, `${NAME}_frames`);
mkdirSync(FRAMES_DIR, { recursive: true }); // also creates OUT

console.log(`Composition : ${URL}`);
const PX = WIDTH * SCALE, PY = HEIGHT * SCALE;
console.log(`Render      : ${WIDTH}x${HEIGHT} CSS @ scale ${SCALE} → ${PX}x${PY}px (${PY >= 3840 ? "4K UHD vertical" : "HD"})`);
console.log(`Frames      : ${FRAMES_DIR}`);

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--force-color-profile=srgb", "--hide-scrollbars"],
});

const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: SCALE,
});
page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));

await page.goto(URL, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(1500); // let the GSAP CDN script arrive & run

// Wait for GSAP + the registered timeline.
let ready = false;
for (let attempt = 0; attempt < 40 && !ready; attempt++) {
  ready = await page.evaluate(
    (tl) => !!(window.gsap && window.__timelines && window.__timelines[tl]),
    TIMELINE
  );
  if (!ready) await page.waitForTimeout(500);
}
if (!ready) {
  const dbg = await page.evaluate(() => ({
    hasGsap: typeof window.gsap !== "undefined",
    hasTimelines: !!window.__timelines,
    timelineKeys: Object.keys(window.__timelines || {}),
    scripts: [...document.scripts].map((s) => s.src),
  }));
  throw new Error("Timeline never became ready: " + JSON.stringify(dbg));
}
await page.evaluate(() => document.fonts.ready.then(() => true));
await page.waitForTimeout(500); // let fonts paint

// Sanity: confirm the stage fills the viewport and grab the real duration.
const dims = await page.evaluate((tl) => {
  const s = document.querySelector(".stage");
  const r = s.getBoundingClientRect();
  return { w: r.width, h: r.height, tlDur: window.__timelines[tl].duration() };
}, TIMELINE);
console.log("stage:", JSON.stringify(dims));

const TOTAL = Number.isFinite(DURATION_ARG) ? DURATION_ARG : dims.tlDur || 15;
const FRAMES = Math.round(TOTAL * FPS);
console.log(`Duration    : ${TOTAL}s @ ${FPS}fps → ${FRAMES} frames`);

const t0 = Date.now();
for (let i = 0; i < FRAMES; i++) {
  const t = i / FPS;
  await page.evaluate(
    ({ tt, total, tl }) => {
      window.__timelines[tl].progress(total > 0 ? tt / total : 0);
    },
    { tt: t, total: TOTAL, tl: TIMELINE }
  );
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
  await page.screenshot({
    path: `${FRAMES_DIR}/frame_${String(i).padStart(4, "0")}.jpg`,
    type: "jpeg",
    quality: QUALITY,
  });
  if (i % 50 === 0) {
    const el = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`frame ${i}/${FRAMES} (t=${t.toFixed(2)}s)  elapsed ${el}s`);
  }
}

await browser.close();
console.log(`\nDone: ${FRAMES} frames → ${FRAMES_DIR} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

// --- assemble the final, properly-named 4K MP4 ----------------------------
if (ASSEMBLE) {
  const mp4 = join(OUT, `${NAME}.mp4`);
  const inputs = ["-framerate", String(FPS), "-i", join(FRAMES_DIR, "frame_%04d.jpg")];
  let filters = ["fps=" + FPS, "format=yuv420p"];
  const map = ["-map", "0:v"];
  if (AUDIO) {
    inputs.push("-i", resolve(CWD, AUDIO));
    filters.push("apad=pad_dur=0.5");
    map.push("-map", "1:a", "-c:a", "aac", "-b:a", "192k");
  }
  const ffArgs = [
    "-y", "-v", "error",
    ...inputs,
    "-vf", filters.join(","),
    "-c:v", "libx264", "-crf", "18", "-preset", "medium",
    ...map,
    "-movflags", "+faststart",
    "-t", String(TOTAL),
    mp4,
  ];
  console.log("\nAssembling MP4 (ffmpeg)...");
  execFileSync("ffmpeg", ffArgs, { stdio: "inherit" });
  const probe = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate", "-of", "csv=p=0", mp4]).toString().trim();
  console.log(`\n✅ Final video: ${mp4}`);
  console.log(`   Resolution : ${probe.replace(/,/g, " × ")}`);
}
