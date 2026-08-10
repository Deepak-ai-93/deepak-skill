#!/usr/bin/env node
// The email-marketing preview renderer — screenshots the email at desktop
// (600px) and mobile (320px) widths so the agent + auditor can SEE the email
// before send: layout, overflow, contrast, dark mode, CTA visibility.
//
// Usage:
//   node preview-email.mjs --html email.html [--out preview] [--dark]
//
// Requires: Chrome + `playwright` (npm i playwright) — same dependency as the
// carousel renderer. If playwright is missing, this prints install guidance.
//
// Output:
//   preview/email_desktop_600.png · preview/email_mobile_320.png
//   (plus _dark variants when --dark is passed)
import { mkdirSync } from "node:fs";
import { resolve, join, basename, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createRequire } from "node:module";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: email-marketing · ${label}\n${BRAND_LINE}\n`;
console.log(banner("preview-email.mjs"));

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
  console.error("Usage: node preview-email.mjs --html email.html [--out preview] [--dark]");
  process.exit(2);
}

// Playwright may be installed next to this script (standalone skill install),
// in the project root, or in a sibling render/ folder (repo clone). Try all.
let chromium;
const here = dirname(fileURLToPath(import.meta.url));
const candidates = [
  join(here, ".."), // <skill>/scripts/../ → <skill>/
  join(here, "..", "..", ".."), // project root
  join(here, "..", "..", "..", "render"), // repo clone's render/
  process.cwd(),
];
const require = createRequire(import.meta.url);
for (const dir of candidates) {
  try {
    // playwright is CJS — load it synchronously (dynamic import() of the file
    // URL hangs on Windows). require.resolve finds the nearest install.
    ({ chromium } = require(require.resolve("playwright", { paths: [dir] })));
    break;
  } catch {
    /* try next */
  }
}
if (!chromium) {
  console.error("❌ playwright is not installed — needed to render the preview screenshots.");
  console.error("   Install it once:  cd <this-skill-dir> && npm init -y && npm i playwright && npx playwright install chrome");
  console.error("   (Or run from a repo clone that already has playwright, e.g. this repo's render/.)");
  process.exit(2);
}

const CWD = process.cwd();
const URL = pathToFileURL(resolve(CWD, htmlArg)).href;
const OUT = resolve(CWD, opt("out", join(dirname(resolve(CWD, htmlArg)), "preview")));
const DARK = args.includes("--dark");
const name = basename(htmlArg).replace(/\.html?$/i, "");

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function snap(width, label, dark) {
  const page = await browser.newPage({
    viewport: { width, height: 800 },
    colorScheme: dark ? "dark" : "light",
  });
  page.on("pageerror", (e) => console.log("  PAGE ERROR:", e.message));
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  // Give images/layout a beat, race fonts (never hang on a blocked CDN).
  await page.waitForTimeout(1200);
  await page.evaluate(() =>
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 4000))])
  );
  await page.waitForTimeout(300);
  const suffix = dark ? `_dark` : "";
  const file = `${name}_${label}_${width}${suffix}.png`;
  const path = join(OUT, file);
  // fullPage captures the entire scrollable email (client width = viewport width
  // is forced so the 600px container stacks correctly at 320px).
  await page.screenshot({ path, fullPage: true });
  await page.close();
  return file;
}

try {
  const files = [];
  files.push(await snap(600, "desktop", false));
  files.push(await snap(320, "mobile", false));
  if (DARK) {
    files.push(await snap(600, "desktop", true));
    files.push(await snap(320, "mobile", true));
  }
  console.log(`✅ Preview → ${OUT}`);
  for (const f of files) console.log(`  ✓ ${f}`);
  console.log("Check: 600px container centered · no overflow at 320px · CTA visible above the fold · footer readable · contrast OK" + (DARK ? " · dark mode legible" : " (add --dark to check dark mode)"));
} finally {
  await browser.close();
}
