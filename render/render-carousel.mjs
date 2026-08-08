#!/usr/bin/env node
// Render a carousel-post deck (one HTML file with N .slide elements) into
// per-slide PNGs via headless Chrome — the deterministic fallback renderer for
// the carousel-post-images skill. Native image models (Antigravity / Codex /
// Grok Build) are the primary path; this produces pixel-perfect, reproducible
// slides on ANY agent.
//
// Usage:
//   node render/render-carousel.mjs --html slides.html [--out dir] [--width 1080] [--height 1350] [--scale 1] [--4k]
//
// Quality bar: carousels are posted at 1080px, but ALWAYS render at 4K so the
// deck stays crisp when platforms re-encode. `--4k` forces deviceScaleFactor 4
// → 4320×5400 (4:5) / 4320×4320 (1:1). An explicit `--scale N` always wins.
//
// HTML contract: <div class="slide" data-name="cover">…</div> — one PNG per
// slide → {out}/slide_01_cover.png, slide_02_….png (data-name optional).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

// --- tiny arg parser (same style as the other render scripts) ----------------
// Supports BOTH "--name value" and "--name=value" forms (e.g. --scale=2).
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const htmlArg = opt("html");
if (!htmlArg) {
  console.error("Usage: node render-carousel.mjs --html slides.html [--out dir] [--width 1080] [--height 1350] [--scale 1] [--4k]");
  process.exit(2);
}

const CWD = process.cwd();
const URL = pathToFileURL(resolve(CWD, htmlArg)).href;
const OUT = resolve(CWD, opt("out", "output/carousel"));
const WIDTH = parseInt(opt("width", "1080"), 10);
const HEIGHT = parseInt(opt("height", "1350"), 10);
// 4K quality bar: --4k sets deviceScaleFactor 4 (4320×5400 @ 4:5). An explicit
// --scale N (also the --scale=N form) overrides it — the caller knows best.
// opt() handles both spellings, so derive from it instead of args.includes().
const FOUR_K = args.includes("--4k");
const scaleArg = opt("scale", null);
const SCALE =
  scaleArg !== null && Number.isFinite(parseFloat(scaleArg))
    ? parseFloat(scaleArg)
    : FOUR_K
    ? 4
    : 1;
const OUT_W = WIDTH * SCALE;
const OUT_H = HEIGHT * SCALE;
mkdirSync(OUT, { recursive: true });

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

// domcontentloaded (not "load") so a blocked fonts CDN can never stall the deck.
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2000); // let layout + webfonts paint
// Never hang on font loading (offline / blocked CDN): race a 5s fallback.
await page.evaluate(() =>
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 5000))])
);
await page.waitForTimeout(300);

const count = await page.locator(".slide").count();
if (!count) {
  await browser.close();
  throw new Error("No .slide elements found in the HTML — each slide needs class=\"slide\".");
}
console.log(`Slides: ${count} → ${OUT} · ${WIDTH}×${HEIGHT} @${SCALE}x = ${OUT_W}×${OUT_H}px (${OUT_W >= 4000 ? "4K" : SCALE >= 2 ? "HD+" : "preview"})`);

try {
  for (let i = 0; i < count; i++) {
    // Show only slide i so element screenshots never capture a stacked neighbor.
    await page.evaluate((idx) => {
      document.querySelectorAll(".slide").forEach((s, j) => {
        s.style.display = j === idx ? "block" : "none";
      });
    }, i);
    // Screenshot the i-th slide itself — never .first() (that stays hidden).
    const slide = page.locator(".slide").nth(i);
    const name = await slide.getAttribute("data-name");
    const safe = name ? name.replace(/[^a-z0-9_-]/gi, "-") : "";
    const file = `slide_${String(i + 1).padStart(2, "0")}${safe ? "_" + safe : ""}.png`;
    await slide.screenshot({ path: join(OUT, file) });
    console.log(`  ✓ ${file}`);
  }
} finally {
  await browser.close(); // always close, even on a mid-deck failure
}
console.log(`\n✅ ${count} slides → ${OUT}`);
console.log("Next: write caption.md (500–900 chars per platform, no hashtags — see the carousel-post-images skill).");
