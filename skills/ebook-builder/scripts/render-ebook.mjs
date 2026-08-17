#!/usr/bin/env node
// The ebook-builder renderer — ONE script, TWO modes (same DNA as render-carousel):
//   Mode 1 (browser): render the HTML deck (one file, N .page elements) into an
//     A4 PDF + per-page PNGs + cover.png via headless Chrome — deterministic,
//     pixel-perfect text, works on ANY agent. The deck is the single source of
//     truth.
//   Mode 2 (model):   export the SAME deck as native image-model prompts
//     (prompts.md) for Nano Banana / Midjourney / Flux — photoreal cover +
//     interior scene prompts, with the overlay copy read straight from the DOM.
//
// Usage:
//   node render-ebook.mjs --html ebook.html [--out dir] [--mode browser|model] [--width 1080] [--height 1528] [--scale 2] [--pdf]
//
// HTML contract: <div class="page" data-page="cover" data-layout="editorial-classic">…
// One PNG per page → {out}/pages/page_XX_name.png, {out}/cover.png, and
// {out}/ebook.pdf (A4) when --pdf. Each .page should carry page-break-after:
// always in print CSS so the PDF gets one sheet per page.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: ebook-builder · ${label}\n${BRAND_LINE}\n`;
console.log(banner("render-ebook.mjs"));

// --- tiny arg parser (same style as the other render scripts) ----------------
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
  console.error("Usage: node render-ebook.mjs --html ebook.html [--out dir] [--mode browser|model] [--width 1080] [--height 1528] [--scale 2] [--pdf]");
  process.exit(2);
}

const MODE = opt("mode", "browser");
if (MODE !== "browser" && MODE !== "model") {
  console.error(`Unknown --mode "${MODE}" — use "browser" (A4 PDF + page PNGs) or "model" (export image-model prompts).`);
  process.exit(2);
}

const CWD = process.cwd();
const URL = pathToFileURL(resolve(CWD, htmlArg)).href;
const OUT = resolve(CWD, opt("out", "output/ebook"));
const WIDTH = parseInt(opt("width", "1080"), 10);
const HEIGHT = parseInt(opt("height", "1528"), 10); // A4 ratio (0.707)
const SCALE = parseFloat(opt("scale", "2")); // 2× → 2160×3056 print quality
const MAKE_PDF = args.includes("--pdf");
mkdirSync(OUT, { recursive: true });
mkdirSync(join(OUT, "pages"), { recursive: true });

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

await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2000); // layout + webfonts paint
await page.evaluate(() =>
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 5000))])
);
await page.waitForTimeout(300);

const count = await page.locator(".page").count();
if (!count) {
  await browser.close();
  throw new Error('No .page elements found in the HTML — each ebook page needs class="page".');
}

if (MODE === "model") {
  // ---- Mode 2 (image-model): export native image-gen prompts from the deck --
  const deck = await page.evaluate(() => {
    const pick = (el, sels) => {
      for (const sel of sels) {
        const n = el.querySelector(sel);
        if (n) return n.textContent.replace(/\s+/g, " ").trim();
      }
      return "";
    };
    return Array.from(document.querySelectorAll(".page")).map((s, i) => ({
      idx: i + 1,
      pageName: s.getAttribute("data-page") || "",
      layout: s.getAttribute("data-layout") || "editorial-classic",
      palette: s.getAttribute("data-palette") || "",
      motif: s.getAttribute("data-motif") || "",
      coverStyle: s.getAttribute("data-cover-style") || "",
      scene: pick(s, [".scene-tag"]).replace(/^scene\s*:\s*/i, ""),
      title: pick(s, [".cover-title"]),
      headline: pick(s, [".headline"]),
      body: pick(s, [".body"]).slice(0, 200),
      callout: pick(s, [".callout"]),
      cta: pick(s, [".cta"]),
    }));
  });
  const KW = WIDTH * 4;
  const KH = HEIGHT * 4;
  const pageTitle = await page.title();
  const lines = [
    "# Ebook Image-Model Prompts",
    `Deck: ${pageTitle}`,
    "Auto-exported from ebook.html by 'render-ebook.mjs --mode model'. Fill the SCENE details,",
    "then dispatch one block per page to your CLI's image tool (Nano Banana / Midjourney / Flux)",
    `at **4K ${KW}x${KH}** (A4 ratio). Cover first (from the cover brief), then interior scenes.`,
    "Verify every word on generated images afterwards.",
    "",
    "## Consistency tokens (repeat VERBATIM on every page — from the design picker)",
    "- ONE layout + ONE palette + ONE accent hex + ONE motif family + ONE cover style for the whole ebook (same world)",
    "- Grade: {layout's grade — e.g. warm paper editorial / bold color blocks / dark luxury / bright sticker pop / terminal glow / botanical calm}",
    "- Text layer: {layout's type pairing}, exact overlay copy — no typos, no extra words",
    "- No clichés: no gold bars, no hand-on-chin thinking, no floating 3D shapes as the main visual",
    "",
  ];
  for (const p of deck) {
    const title = p.pageName || `page_${p.idx}`;
    lines.push(`### ${p.idx}. ${title}`, "```");
    const tokens = [p.layout, p.palette, p.motif, p.coverStyle].filter(Boolean).join(" · ");
    lines.push(`Ebook ${p.idx}/${deck.length} — design tokens: ${tokens || "{layout · palette · motif · cover style}"}. Canvas: 4K ${KW}x${KH}, PNG, no watermark, no logo.`);
    lines.push(`SCENE (photoreal, real life): ${p.scene || "{describe the exact visual moment — who, where, when, prop, emotion}"}`);
    lines.push("CINEMATIC GRADE: {camera & lens, lighting source + color, depth of field, film grain, color mood}.");
    lines.push("TEXT (render EXACTLY):");
    if (p.title) lines.push(`  Cover title: "${p.title}"`);
    if (p.headline) lines.push(`  Headline: "${p.headline}"`);
    if (p.body) lines.push(`  Body: "${p.body}"`);
    if (p.callout) lines.push(`  Callout: "${p.callout}"`);
    if (p.cta) lines.push(`  CTA: "${p.cta}"`);
    lines.push("  Placement: legible over the scene — contrast guaranteed (scrim/panel behind text).");
    lines.push(`CONSISTENCY: layout ${p.layout}, same palette, same accent hex, same grade.`);
    lines.push("```", "");
  }
  lines.push("---", "After generation: visually verify every word, assemble the pages into the PDF/lead page, and audit (cover pull, layout consistency, copy, scenes, 4K ≥ 4000px long edge).");
  const promptsFile = join(OUT, "prompts.md");
  writeFileSync(promptsFile, lines.join("\n"), "utf8");
  await browser.close();
  console.log(`✅ Mode 2 (image-model): ${deck.length} page prompts → ${promptsFile}`);
  process.exit(0);
}

// ---- Mode 1 (browser): render the deck to A4 PDF + per-page PNGs ------------
console.log(`Mode 1 (browser) · ${count} pages → ${OUT} · ${WIDTH}×${HEIGHT} @${SCALE}x = ${WIDTH * SCALE}×${HEIGHT * SCALE}px`);

try {
  for (let i = 0; i < count; i++) {
    await page.evaluate((idx) => {
      document.querySelectorAll(".page").forEach((s, j) => {
        s.style.display = j === idx ? "block" : "none";
      });
    }, i);
    const el = page.locator(".page").nth(i);
    const pageName = await el.getAttribute("data-page");
    const safe = pageName ? pageName.replace(/[^a-z0-9_-]/gi, "-") : "";
    const file = `page_${String(i + 1).padStart(2, "0")}${safe ? "_" + safe : ""}.png`;
    await el.screenshot({ path: join(OUT, "pages", file) });
    console.log(`  ✓ pages/${file}`);
    if (i === 0) {
      await el.screenshot({ path: join(OUT, "cover.png") });
      console.log("  ✓ cover.png (from page 1 — the cover)");
    }
  }
  if (MAKE_PDF) {
    // Restore all pages + print CSS (page-break-after) for the PDF pass.
    await page.evaluate(() => {
      document.querySelectorAll(".page").forEach((s) => { s.style.display = "block"; });
    });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });
    const pdfFile = join(OUT, "ebook.pdf");
    writeFileSync(pdfFile, pdf);
    console.log(`  ✓ ebook.pdf (${pdf.length} bytes, A4)`);
  }
} finally {
  await browser.close(); // always close, even on a mid-deck failure
}
console.log(`\n✅ ${count} pages → ${OUT}${MAKE_PDF ? " (A4 PDF + cover + pages)" : " (cover + pages — add --pdf for the A4 PDF)"}`);
console.log("Next: audit the pack (see the ebook-builder skill — audit-ebook.mjs → ebook-auditor subagent).");
