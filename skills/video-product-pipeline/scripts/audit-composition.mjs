#!/usr/bin/env node
// Automated composition audit for HyperFrames reels — the "machine half" of the
// video-product-pipeline Stage-3 audit. Loads the composition in headless
// Chrome, captures one keyframe per beat, measures every visible text element
// against the 9:16 safe zone, flags off-screen/clipped text, overlapping text,
// word-cap violations and timeline incoherence, runs static determinism lint,
// and writes an audit-report.md scaffold for the auditor subagent to complete
// (spelling, style, readability, beat↔voice sync, final sign-off).
//
// Usage:
//   node audit-composition.mjs --html reel.html [options]
//
// Options:
//   --html <file>      composition HTML (required)
//   --out <dir>        parent output directory (default: "output")
//   --name <base>      audit folder name (default: html basename)
//   --duration <s>     total seconds (default: timeline duration)
//   --timeline <id>    window.__timelines key (default: "reel")
//   --scale <n>        keyframe device scale (default: 1 — previews, fast)
//   --keyframes <n>    max keyframes to capture (default: 12)
//   --storyboard <f>   optional storyboard.json to cross-check beat text
//   --quality <n>      jpeg quality (default: 85)
//
// Exit code: 0 = no FAILs (WARNs OK), 1 = at least one FAIL → must fix,
// re-render and re-audit before the auditor subagent signs off.
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { pathToFileURL } from "node:url";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: video-product-pipeline · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-composition.mjs"));

// --- tiny arg parser (mirrors render-frames.mjs) ---------------------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const inline = args[i].split("=")[1];
  if (inline !== undefined) return inline;
  return args[i + 1];
};

const htmlArg = opt("html");
if (!htmlArg) {
  console.error("Usage: node audit-composition.mjs --html <file> [--out dir] [--name base] [--duration s] [--timeline reel] [--scale 1] [--keyframes 12] [--storyboard f]");
  process.exit(2);
}

const CWD = process.cwd();
const URL = pathToFileURL(resolve(CWD, htmlArg)).href;
const OUT = resolve(CWD, opt("out", "output"));
const NAME = opt("name", basename(htmlArg, ".html"));
const DURATION_ARG = parseFloat(opt("duration", "NaN"));
const TIMELINE = opt("timeline", "reel");
const SCALE = parseFloat(opt("scale", "1"));
const QUALITY = parseInt(opt("quality", "85"), 10);
const MAX_KF = parseInt(opt("keyframes", "12"), 10);
const SB_PATH = opt("storyboard") ? resolve(CWD, opt("storyboard")) : null;

const AUDIT_DIR = join(OUT, NAME, "audit");
const FRAMES_DIR = join(AUDIT_DIR, "frames");
mkdirSync(FRAMES_DIR, { recursive: true });

// 9:16 safe zone (SHARED with the SKILL.md spec) — fraction of the stage.
// Platform UI overlays: bottom ~12% (like bar), top ~10% (status bar),
// right ~8% (share/CTA rails). Text must stay inside the hard safe zone;
// the preferred reading column is centered 75% wide, y 28–72%.
const SAFE = { xMin: 0.08, xMax: 0.92, yMin: 0.15, yMax: 0.85 };
const MAX_WORDS_WARN = 6; // skill contract: 3–6 words per beat
const MAX_WORDS_FAIL = 10;

const htmlSource = readFileSync(resolve(CWD, htmlArg), "utf8");
const results = []; // { check, verdict: PASS|WARN|FAIL, detail }
const fail = (check, detail) => results.push({ check, verdict: "FAIL", detail });
const warn = (check, detail) => results.push({ check, verdict: "WARN", detail });
const pass = (check, detail) => results.push({ check, verdict: "PASS", detail });

// --- 1. static lint (determinism + contract) -------------------------------
const scriptText = htmlSource.replace(/<style[\s\S]*?<\/style>/gi, "");

if (/Math\.random\s*\(/.test(scriptText)) {
  fail("determinism", "Math.random() found — nondeterministic frames (ban it or seed it)");
} else pass("determinism", "no Math.random()");

if (/<\s*(animate|animateTransform|animateMotion)\b/i.test(htmlSource)) {
  fail("determinism", "SMIL <animate>/<animateTransform>/<animateMotion> found — cannot be scrubbed by the paused GSAP timeline");
} else pass("determinism", "no SMIL <animate> tags");

if (/\.play\s*\(/.test(scriptText)) {
  warn("determinism", ".play() found in JS — the renderer seeks instead; confirm it is not timing-critical");
} else pass("determinism", "no .play() calls in JS");

if (/<audio\b/i.test(htmlSource)) {
  fail("audio", "<audio> elements inside the HTML — audio must live in the mix and be muxed with --audio");
} else pass("audio", "no <audio> in HTML (voice+bed are muxed at render)");

console.log(`Auditing composition : ${URL}`);
console.log(`Audit output          : ${AUDIT_DIR}\n`);

// --- 2. load in headless Chrome --------------------------------------------
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--force-color-profile=srgb", "--hide-scrollbars", "--autoplay-policy=no-user-gesture-required"],
});

const page = await browser.newPage({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: SCALE,
});
page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));

await page.goto(URL, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(1500); // let the GSAP CDN script arrive & run

let ready = false;
for (let attempt = 0; attempt < 40 && !ready; attempt++) {
  ready = await page.evaluate(
    (tl) => !!(window.gsap && window.__timelines && window.__timelines[tl]),
    TIMELINE
  );
  if (!ready) await page.waitForTimeout(500);
}
if (!ready) {
  fail("timeline", "paused GSAP timeline never became ready (window.__timelines." + TIMELINE + ") — composition is not seekable");
} else {
  pass("timeline", `paused GSAP timeline window.__timelines.${TIMELINE} registered`);
}
await page.evaluate(() => document.fonts.ready.then(() => true));
await page.waitForTimeout(500); // let fonts paint

// Stage rect + real timeline duration (same contract as render-frames.mjs).
// If the stage is missing, still produce a report — never crash without one.
const hasStage = await page.evaluate(() => !!document.querySelector(".stage"));
let dims = null;
if (hasStage) {
  dims = await page.evaluate((tl) => {
    const s = document.querySelector(".stage");
    const r = s.getBoundingClientRect();
    return { w: r.width, h: r.height, tlDur: window.__timelines[tl] ? window.__timelines[tl].duration() : 0 };
  }, TIMELINE);
} else {
  fail("stage contract", "no .stage element found — cannot measure safe zones (measurement skipped)");
}
const TOTAL = Number.isFinite(DURATION_ARG) ? DURATION_ARG : (dims && dims.tlDur) || 15;
console.log(`stage: ${dims ? `${dims.w}x${dims.h}` : "MISSING"}  duration: ${TOTAL}s\n`);

// --- 3. beat sheet from the DOM --------------------------------------------
// Beats = any element carrying data-start (text .clips and .asset-clip
// wrappers alike). innerText gives the visible beat copy for the report.
const beatInfo = await page.evaluate(() =>
  [...document.querySelectorAll("[data-start]")]
    // the .stage carries data-start="0" by convention but is NOT a beat
    .filter((el) => !el.classList.contains("stage") && !el.closest("svg"))
    .map((el) => ({
      start: parseFloat(el.dataset.start || "0"),
      duration: el.dataset.duration ? parseFloat(el.dataset.duration) : 2,
      text: (el.innerText || "").replace(/\s+/g, " ").trim().slice(0, 120),
    }))
);

// --- 3b. timeline coherence --------------------------------------------------
const sorted = [...beatInfo].sort((a, b) => a.start - b.start);
if (!sorted.length) {
  warn("timeline", "no [data-start] beat elements found — cannot verify beat windows");
}
for (let i = 1; i < sorted.length; i++) {
  const prev = sorted[i - 1], cur = sorted[i];
  if (cur.start < prev.start + prev.duration - 0.05) {
    warn("timeline", `beat @${cur.start.toFixed(2)}s overlaps previous window (@${prev.start.toFixed(2)}s + ${prev.duration}s)`);
  }
}
for (const b of sorted) {
  if (b.start + b.duration > TOTAL + 0.1) {
    warn("timeline", `beat @${b.start.toFixed(2)}s (${b.duration}s) runs past the ${TOTAL}s duration`);
  }
}
if (sorted.length) pass("timeline", `${sorted.length} beat window(s), sequential, within ${TOTAL}s`);

// --- 3c. optional storyboard.json cross-check --------------------------------
if (SB_PATH) {
  const sb = JSON.parse(readFileSync(SB_PATH, "utf8"));
  for (const b of sb.beats || []) {
    const hit = sorted.find((x) => Math.abs(x.start - b.start) < 0.01);
    if (!hit) warn("storyboard sync", `storyboard beat "${(b.text || "").slice(0, 60)}" @${b.start}s not found in HTML`);
    else if (b.text && !hit.text.includes(b.text.trim().slice(0, 40))) {
      warn("storyboard sync", `HTML text @${b.start}s ("${hit.text.slice(0, 40)}…") differs from storyboard ("${b.text.slice(0, 40)}…")`);
    }
  }
  pass("storyboard sync", `cross-checked against ${SB_PATH}`);
}

// --- 4. keyframe times (one per beat, at 60% of each window) ----------------
let timeList = [];
if (hasStage) {
  const times = new Set([0.3]); // always include an early hook frame
  for (const b of sorted) {
    times.add(+(b.start + b.duration * 0.6).toFixed(2));
  }
  timeList = [...times]
    .filter((t) => t >= 0 && t < TOTAL)
    .sort((a, b) => a - b);
}
if (timeList.length > MAX_KF) {
  // Evenly downsample — in-bounds indices only (no undefined can enter the list).
  timeList = Array.from(
    { length: MAX_KF },
    (_, i) => timeList[Math.round((i * (timeList.length - 1)) / (MAX_KF - 1))]
  );
}
console.log(`Keyframes (${timeList.length}): ${timeList.map((t) => t.toFixed(2) + "s").join(", ")}\n`);

// --- 5. per-keyframe measurement --------------------------------------------
const frameIssues = []; // { t, text, rel, words, offscreen, outsideSafe }
const overlapPairs = []; // { t, a, b }
const textSheet = []; // { t, text, words } — for the report's spelling review

const measure = async (t) => {
  await page.evaluate(
    ({ tt, total, tl }) => window.__timelines[tl].progress(total > 0 ? tt / total : 0),
    { tt: t, total: TOTAL, tl: TIMELINE }
  );
  // Asset reels: deterministically seek visible <video> clips (no-op otherwise).
  await page.evaluate(
    async ({ tt }) => {
      const vids = [...document.querySelectorAll("video")];
      if (!vids.length) return;
      const waiters = [];
      for (const v of vids) {
        const wrap = v.closest("[data-start]");
        if (!wrap || !v.duration) continue;
        const start = parseFloat(wrap.dataset.start || "0");
        if (tt < start) continue;
        const local = Math.min(tt - start, Math.max(v.duration - 0.05, 0.001));
        if (Math.abs(v.currentTime - local) > 0.01) {
          waiters.push(
            new Promise((res) => {
              const done = () => res();
              v.addEventListener("seeked", done, { once: true });
              v.currentTime = local;
              setTimeout(done, 1500);
            })
          );
        }
      }
      if (waiters.length) await Promise.all(waiters);
    },
    { tt: t }
  );
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));

  const data = await page.evaluate(() => {
    const stage = document.querySelector(".stage");
    if (!stage) return { missing: true, rects: [], overlaps: [] };
    const sr = stage.getBoundingClientRect();
    const vis = (el) => {
      let op = 1, node = el;
      while (node && op > 0.02) {
        const cs = getComputedStyle(node);
        if (cs.display === "none" || cs.visibility === "hidden") { op = 0; break; }
        op *= parseFloat(cs.opacity);
        node = node.parentElement;
      }
      return op > 0.02;
    };
    const leaves = [...document.querySelectorAll(".stage *")].filter((el) => {
      if (el.closest("svg") || el.closest(".noise-overlay")) return false;
      const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
      return own.length > 0;
    });
    const rects = [];
    for (const el of leaves) {
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      rects.push({
        el,
        text: (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120),
        rl: (r.left - sr.left) / sr.width,
        rr: (r.right - sr.left) / sr.width,
        rt: (r.top - sr.top) / sr.height,
        rb: (r.bottom - sr.top) / sr.height,
      });
    }
    const overlaps = [];
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i], b = rects[j];
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue; // nesting ≠ overlap
        const ix = Math.min(a.rr, b.rr) - Math.max(a.rl, b.rl);
        const iy = Math.min(a.rb, b.rb) - Math.max(a.rt, b.rt);
        if (ix > 0 && iy > 0) {
          const inter = ix * iy;
          const small = Math.min((a.rr - a.rl) * (a.rb - a.rt), (b.rr - b.rl) * (b.rb - b.rt));
          if (small > 0 && inter / small > 0.02) overlaps.push({ a: a.text || "(untitled)", b: b.text || "(untitled)" });
        }
      }
    }
    return {
      missing: false,
      rects: rects.map(({ text, rl, rr, rt, rb }) => ({ text, rl, rr, rt, rb })),
      overlaps,
    };
  });

  if (data.missing) return;

  for (const r of data.rects) {
    const words = (r.text || "").split(/\s+/).filter(Boolean).length;
    const offscreen = r.rr > 1.02 || r.rl < -0.02 || r.rb > 1.02 || r.rt < -0.02;
    const outside = r.rl < SAFE.xMin || r.rr > SAFE.xMax || r.rt < SAFE.yMin || r.rb > SAFE.yMax;
    frameIssues.push({ t, text: r.text, words, offscreen, outside, rel: [r.rl, r.rt, r.rr, r.rb] });
    if (r.text) textSheet.push({ t, text: r.text, words });
  }
  for (const o of data.overlaps) overlapPairs.push({ t, a: o.a, b: o.b });

  await page.screenshot({
    path: join(FRAMES_DIR, `kf_${String(timeList.indexOf(t) + 1).padStart(2, "0")}_t=${t.toFixed(2)}s.jpg`),
    type: "jpeg",
    quality: QUALITY,
  });
};

for (const t of timeList) await measure(t);

// --- 6. verdicts from measurements (aggregated per violation, with times) ---
const agg = new Map(); // `${verdict}|${check}|${base}` -> { check, verdict, base, times: [] }
const addIssue = (verdict, check, base, t) => {
  const key = `${verdict}|${check}|${base}`;
  if (!agg.has(key)) agg.set(key, { check, verdict, base, times: [] });
  agg.get(key).times.push(t);
};

for (const f of frameIssues) {
  if (f.offscreen) addIssue("FAIL", "safe zone", `"${f.text.slice(0, 60)}" is OFF-SCREEN / clipped`, f.t);
  else if (f.outside) addIssue("WARN", "safe zone", `"${f.text.slice(0, 60)}" sits outside the safe zone (x 8–92%, y 15–85%)`, f.t);
  if (f.words > MAX_WORDS_FAIL) addIssue("FAIL", "word cap", `"${f.text.slice(0, 60)}" = ${f.words} words (>${MAX_WORDS_FAIL})`, f.t);
  else if (f.words > MAX_WORDS_WARN) addIssue("WARN", "word cap", `"${f.text.slice(0, 60)}" = ${f.words} words (target 3–6)`, f.t);
}
for (const o of overlapPairs) addIssue("WARN", "text overlap", `"${o.a.slice(0, 50)}" overlaps "${o.b.slice(0, 50)}"`, o.t);

for (const it of agg.values()) {
  const times = [...new Set(it.times.map((t) => t.toFixed(2) + "s"))].join(", ");
  results.push({ check: it.check, verdict: it.verdict, detail: `${it.base} — at ${times}` });
}

if (hasStage) {
  if (!frameIssues.some((f) => f.offscreen || f.outside)) pass("safe zone", "all visible text inside the 9:16 safe zone on every keyframe");
  if (!overlapPairs.length) pass("text overlap", "no overlapping text elements on any keyframe");
  if (!frameIssues.some((f) => f.words > MAX_WORDS_WARN)) pass("word cap", `all beats ≤ ${MAX_WORDS_WARN} words`);
}

await browser.close();

// --- 7. report ---------------------------------------------------------------
const verdictOf = (v) => (v === "FAIL" ? "❌ FAIL" : v === "WARN" ? "⚠️ WARN" : "✅ PASS");
const rows = results
  .map((r, i) => `| ${i + 1} | ${r.check} | ${verdictOf(r.verdict)} | ${r.detail} |`)
  .join("\n");

const kfRows = timeList
  .map((t, i) => `| \`audit/frames/kf_${String(i + 1).padStart(2, "0")}_t=${t.toFixed(2)}s.jpg\` | ${t.toFixed(2)}s | ${(sorted.filter((b) => t >= b.start && t <= b.start + b.duration).map((b) => (b.text ? `"${b.text}"` : "asset beat")).join(" · ") || "—")} |`)
  .join("\n");

const sheetRows = [...new Map(
  textSheet.sort((a, b) => a.t - b.t).map((s) => [s.text, s]) // dedupe by text
).values()]
  .map((s) => `| ${s.t.toFixed(2)}s | ${s.words} | ${s.text} |`)
  .join("\n");

const now = new Date().toISOString().slice(0, 10);
const md = `# Audit Report — ${NAME}

- **Composition:** ${htmlArg}
- **Duration:** ${TOTAL}s · **Keyframes:** ${timeList.length} (scale ${SCALE})
- **Safe zone (9:16):** x 8–92% · y 15–85% · preferred reading column y 28–72%
- **Audited:** ${now} (automated pass) — subagent review below

## 1. Automated checks (script verdicts)

| # | Check | Verdict | Detail |
|---|-------|---------|--------|
${rows}

## 2. Keyframes (open these — they are the evidence)

| Frame | Time | Beats visible |
|---|---|---|
${kfRows}

## 3. On-screen text extracted for review (spelling / style / grammar)

| Time | Words | Text |
|---|---|---|
${sheetRows || "| — | — | (no visible text captured) |"}

## 4. Auditor subagent review — COMPLETE THIS SECTION

### 4.1 Spelling & grammar
- [ ] Every beat text in Section 3 is spelled correctly and reads naturally
- [ ] No typos visible in the keyframes (Section 2)

### 4.2 Text overlap & clipping (visual)
- [ ] No two text blocks collide on screen at any keyframe
- [ ] Nothing is cut off at the stage edges

### 4.3 Style consistency
- [ ] Typography, palette and motion match the chosen format/style in \`video-product.md\`

### 4.4 Readability & contrast (mute test)
- [ ] Text is readable over the backdrop — no busy areas behind the reading column
- [ ] Highlight/accent colors keep 4.5:1-ish contrast on the active words

### 4.5 Safe-zone placement (visual)
- [ ] All text sits inside x 8–92% / y 15–85% — platform UI overlays won't cover it

### 4.6 Beat ↔ voice sync
- [ ] Every voice line fits its beat window (FITS ✓ in the generate-voice log)

### 4.7 Verdict
- [ ] **PASS** — approve for delivery
- [ ] **FIX NEEDED** — list the fixes below, then fix → re-render → re-audit

**Fix list:**
1. 
`;

writeFileSync(join(AUDIT_DIR, "audit-report.md"), md, "utf8");

// --- 8. stdout summary + exit code -------------------------------------------
console.log("Automated audit summary:");
console.log("Check".padEnd(16), "verdict");
const hasFail = results.some((r) => r.verdict === "FAIL");
for (const r of results) console.log(r.check.padEnd(16), verdictOf(r.verdict));
console.log(`\n✅ audit-report.md → ${join(AUDIT_DIR, "audit-report.md")}`);
console.log(`   keyframes        → ${FRAMES_DIR}`);
if (hasFail) {
  console.log("\n❌ FAILs present — fix the composition, re-render, then re-audit. Do NOT deliver.");
  process.exitCode = 1;
} else {
  console.log("\n✅ No FAILs — hand this report to the auditor subagent for sign-off (WARNs must be judged visually).");
}
