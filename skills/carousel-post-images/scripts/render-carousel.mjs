#!/usr/bin/env node
// The carousel-post-images renderer — ONE script, TWO modes:
//   Mode 1 (browser): render the HTML deck (one file, N .slide elements) into
//     per-slide PNGs via headless Chrome — deterministic, pixel-perfect text,
//     works on ANY agent. The deck is the single source of truth.
//   Mode 2 (model):   export the SAME deck as native image-model prompts
//     (prompts.md) for Antigravity / Codex image_gen / Grok /imagine — the
//     overlay copy is read straight from the DOM, so it's typo-free.
//
// Usage:
//   node render-carousel.mjs --html slides.html [--out dir] [--mode browser|model] [--width 1080] [--height 1350] [--scale 1] [--4k]
//
// Quality bar: carousels are posted at 1080px, but ALWAYS deliver at 4K so the
// deck survives platform re-encoding. `--4k` forces deviceScaleFactor 4 →
// 4320×5400 (4:5) / 4320×4320 (1:1). An explicit `--scale N` always wins.
//
// HTML contract: <div class="slide" data-name="cover">…</div> — one PNG per
// slide → {out}/slide_01_cover.png, slide_02_….png (data-name optional).
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
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
  console.error("Usage: node render-carousel.mjs --html slides.html [--out dir] [--mode browser|model] [--width 1080] [--height 1350] [--scale 1] [--4k]");
  process.exit(2);
}

const MODE = opt("mode", "browser"); // browser (render PNGs) | model (export prompts.md)
// Note: model mode always exports a 4K canvas (WIDTH*4) — --scale/--4k only
// affect browser-mode rendering, never the prompts.
if (MODE !== "browser" && MODE !== "model") {
  console.error(`Unknown --mode "${MODE}" — use "browser" (render 4K PNGs) or "model" (export image-model prompts).`);
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
  throw new Error('No .slide elements found in the HTML — each slide needs class="slide".');
}

if (MODE === "model") {
  // ---- Mode 2 (image-model): export native image-gen prompts from the deck --
  // The overlay text is read from the real DOM, so the prompts carry the exact,
  // typo-free copy the browser mode would have rendered. The agent dispatches
  // each block to its image tool at 4K, then audits like any other deck.
  const deck = await page.evaluate(() => {
    const pick = (el, sels) => {
      for (const sel of sels) {
        const n = el.querySelector(sel);
        if (n) return n.textContent.replace(/\s+/g, " ").trim();
      }
      return "";
    };
    return Array.from(document.querySelectorAll(".slide")).map((s, i) => ({
      idx: i + 1,
      name: s.getAttribute("data-name") || "",
      scene: pick(s, [".scene-tag"]).replace(/^scene\s*:\s*/i, ""),
      label: pick(s, [".label", ".time"]),
      headline: pick(s, [".headline"]),
      sub: pick(s, [".sub"]),
      cta: pick(s, [".cta", ".swipe", ".cta-box"]),
    }));
  });
  const aspect = HEIGHT > WIDTH ? "4:5" : "1:1";
  const KW = WIDTH * 4;
  const KH = HEIGHT * 4;
  const pageTitle = await page.title();
  const lines = [
    "# Native Image-Model Prompts",
    `Deck: ${pageTitle}`,
    `Auto-exported from slides.html by \`render-carousel.mjs --mode model\`. Fill the SCENE details,`,
    `then dispatch one block per slide to your CLI's image tool (Antigravity / Codex image_gen /`,
    `Grok /imagine) at **4K ${KW}×${KH}** (${aspect} ${WIDTH}×${HEIGHT}). Verify every word afterwards.`,
    "",
    "## Consistency tokens (repeat VERBATIM on every slide)",
    "- Same character + same world for the whole deck (one day in one life)",
    "- Camera: 35mm, f/1.8, natural practical light, shallow depth of field, subtle film grain",
    "- Grade: warm shadows, slightly desaturated, ONE accent hex only",
    "- Text layer: heavy sans (Archivo Black / Inter 900), white, uppercase, bottom 45% over a dark scrim gradient",
    "- No clichés: no gold bars, no hand-on-chin thinking pose, no abstract gradient-only slides",
    "- Render the overlay text EXACTLY as given — no typos, no extra words",
    "",
  ];
  for (const s of deck) {
    const title = s.name || `slide_${s.idx}`;
    lines.push(`### ${s.idx}. ${title}`, "```");
    lines.push(`Carousel slide ${s.idx}/${deck.length} — style: {cinematic-real-life | dark-terminal | editorial-cards | neon-gradient}. Canvas: 4K ${KW}x${KH}, PNG, no watermark, no logo.`);
    lines.push(`SCENE (photoreal, real life): ${s.scene || "{describe the exact real-life moment — who, where, when, prop, emotion}"}`);
    lines.push("CINEMATIC GRADE: {camera & lens, lighting source + color, depth of field, film grain, color mood}.");
    lines.push("TEXT (render EXACTLY):");
    if (s.label) lines.push(`  Label: "${s.label}"`);
    if (s.headline) lines.push(`  Headline: "${s.headline}"`);
    if (s.sub) lines.push(`  Sub: "${s.sub}"`);
    if (s.cta) lines.push(`  CTA: "${s.cta}"`);
    lines.push("  Placement: bottom 45% over a dark scrim gradient; headline ≈ 6% of frame height; white; accent for the {number/keyword}.");
    lines.push("CONSISTENCY: same character, same world, same lens + grade, same scrim, same accent hex.");
    lines.push("```", "");
  }
  lines.push("---", "After generation: visually verify every word, write caption.md, and audit (text accuracy, copy punch, scenes, contrast, 4K ≥ 4000px long edge).");
  const promptsFile = join(OUT, "prompts.md");
  writeFileSync(promptsFile, lines.join("\n"), "utf8");
  await browser.close();
  console.log(`✅ Mode 2 (image-model): ${deck.length} slide prompts → ${promptsFile}`);
  console.log("Dispatch each block to your image tool at 4K, then audit the generated slides.");
  process.exit(0);
}

// ---- Mode 1 (browser): render the deck to per-slide PNGs --------------------
console.log(`Mode 1 (browser) · ${count} slides → ${OUT} · ${WIDTH}×${HEIGHT} @${SCALE}x = ${OUT_W}×${OUT_H}px (${OUT_W >= 4000 ? "4K" : SCALE >= 2 ? "HD+" : "preview"})`);

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
