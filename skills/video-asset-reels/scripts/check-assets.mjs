#!/usr/bin/env node
// The video-asset-reels ASSET GATE — scan, check, alias, arrange.
// Probes every video/image in an assets folder (ffprobe), validates it
// against the vertical 9:16 reel spec, assigns aliases (asset_01…) while
// KEEPING the original filenames, and AUTO-ARRANGES the best-fit assets
// into a draft storyboard.json + assets-report.md. The agent then fills the
// per-beat texts (--text or by editing storyboard.json), optionally swaps an
// asset if the content doesn't match a beat, and runs cut-assets.mjs.
//
// Usage:
//   node scripts/check-assets.mjs --dir assets [options]
//
// Options:
//   --dir <folder>      assets folder to scan (required)
//   --beats N           cap the number of beats (default: one per asset)
//   --duration S        total reel duration in seconds (default 15)
//   --text "a|b|c"      per-beat texts, pipe-separated (agent fills these after)
//   --out storyboard.json    draft storyboard path (default storyboard.json)
//   --report assets-report.md  report path (default assets-report.md)
//   --width W --height H --fps F   reel spec (default 1080x1920@30)
//   --dry-run           don't write files — just print the plan
//
// Arrangement rules ("the perfect video"): real videos beat images, portrait
// beats landscape (cover-crop), higher resolution wins, and every beat window
// is capped at the source clip's length so no beat can render black frames.
// Exit codes: 0 = arranged OK (WARNs allowed) · 1 = no usable assets · 2 = usage.
import { spawnSync } from "node:child_process";
import { readdirSync, writeFileSync, statSync, existsSync } from "node:fs";
import { resolve, join, basename } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: video-asset-reels · ${label}\n${BRAND_LINE}\n`;
console.log(banner("check-assets.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};
const has = (name) => args.includes(`--${name}`);

const dirArg = opt("dir");
if (!dirArg) {
  console.error("Usage: node scripts/check-assets.mjs --dir <assets-folder> [--beats N] [--duration S] [--text 'a|b|c'] [--out storyboard.json] [--report assets-report.md] [--dry-run]");
  process.exit(2);
}
const ASSET_DIR = resolve(process.cwd(), dirArg);
const W = Number(opt("width", 1080));
const H = Number(opt("height", 1920));
const FPS = Number(opt("fps", 30));
const TOTAL_DUR = Number(opt("duration", 15));
const BEATS_CAP = Number(opt("beats", 0)); // 0 = one per asset
const TEXT = (opt("text", "") || "").split("|").map((s) => s.trim()).filter(Boolean);
const OUT_PATH = resolve(process.cwd(), opt("out", "storyboard.json"));
const REPORT_PATH = resolve(process.cwd(), opt("report", "assets-report.md"));
const DRY = has("dry-run");

if (!existsSync(ASSET_DIR)) {
  console.error(`❌ Assets folder not found: ${ASSET_DIR}`);
  process.exit(1);
}

// ─── media discovery ─────────────────────────────────────────────────────────
const VIDEO_EXT = /\.(mp4|mov|m4v|webm|mkv)$/i;
const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

function listMedia(dir, base = "") {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(abs).isDirectory()) out.push(...listMedia(abs, rel));
    else if (VIDEO_EXT.test(entry) || IMAGE_EXT.test(entry)) out.push(rel);
  }
  return out;
}

const files = listMedia(ASSET_DIR).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (!files.length) {
  console.error(`❌ No video/image assets found in ${dirArg} (mp4/mov/m4v/webm/mkv/jpg/png/webp/gif)`);
  process.exit(1);
}

// ─── ffprobe ─────────────────────────────────────────────────────────────────
function probe(abs) {
  const r = spawnSync(
    "ffprobe",
    ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", abs],
    { encoding: "utf8" }
  );
  if (r.status !== 0) return null;
  try {
    const j = JSON.parse(r.stdout);
    const v = (j.streams || []).find((s) => s.codec_type === "video");
    if (!v) return null;
    const fmtDur = j.format && j.format.duration ? Number(j.format.duration) : NaN;
    const sDur = v.duration && v.duration !== "N/A" ? Number(v.duration) : NaN;
    let fps = NaN;
    if (v.r_frame_rate && v.r_frame_rate !== "N/A") {
      const [a, b] = v.r_frame_rate.split("/");
      fps = Number(a) / (Number(b) || 1);
    }
    return {
      width: v.width, height: v.height,
      duration: Number.isFinite(sDur) ? sDur : (Number.isFinite(fmtDur) ? fmtDur : null),
      fps: Number.isFinite(fps) && fps > 0 ? fps : null,
      codec: v.codec_name,
    };
  } catch {
    return null;
  }
}

// ─── per-asset checks ────────────────────────────────────────────────────────
const entries = [];
for (const rel of files) {
  const abs = join(ASSET_DIR, rel);
  const isVideo = VIDEO_EXT.test(rel);
  const meta = probe(abs);
  const sizeKB = Math.round(statSync(abs).size / 1024);
  const nameNote = /[\s()#&]/.test(basename(rel)) ? "space/special chars in name" : "";
  const verdicts = [];
  let score = 0;
  let orientation = "?";
  let aspect = "";
  let resTier = 0;

  if (!meta) {
    verdicts.push("UNREADABLE — not a valid media file");
  } else {
    const w = meta.width, h = meta.height;
    orientation = w > h ? "landscape" : h > w ? "portrait" : "square";
    aspect = h ? (w / h).toFixed(3) : "";
    resTier = Math.max(w, h) >= 2160 ? 3 : Math.max(w, h) >= 1080 ? 2 : 1;
    score += isVideo ? 4 : 0;
    score += orientation === "portrait" ? 3 : orientation === "square" ? 2 : 1;
    score += resTier;
    score += meta.duration ? Math.min(meta.duration, 10) / 20 : 0; // tiebreak
    if (resTier === 1) verdicts.push("WARN low-res — will look soft at 4K");
    if (orientation === "landscape") verdicts.push("OK cover-crop — will be cropped to 9:16");
    if (!isVideo && !/\.(jpe?g|png|webp)$/i.test(rel)) verdicts.push("WARN image format (gif) — prefer jpg/png/webp");
    if (isVideo && meta.duration === null) verdicts.push("WARN duration unknown");
  }
  if (nameNote) verdicts.push(`WARN naming — ${nameNote} (alias used instead)`);

  entries.push({ rel, abs, isVideo, meta, sizeKB, nameNote, verdicts, score, orientation, aspect });
}
const usable = entries.filter((e) => e.meta);
if (!usable.length) {
  console.error("❌ None of the assets could be probed — no storyboard can be arranged.");
  console.error("   Is FFmpeg/ffprobe installed and on PATH? (ffmpeg -version should work)");
  process.exit(1);
}

// ─── arrange: best assets first → beat 1 gets the "perfect" asset ────────────
usable.sort((a, b) => b.score - a.score || a.rel.localeCompare(b.rel));
const beatsTotal = BEATS_CAP > 0 ? Math.min(BEATS_CAP, usable.length) : usable.length;
const perBeat = TOTAL_DUR / beatsTotal;
const beatSlots = [];
let t = 0;
for (let i = 0; i < beatsTotal; i++) {
  const e = usable[i];
  const alias = `asset_${String(i + 1).padStart(2, "0")}`;
  const dur = e.isVideo
    ? e.meta.duration
      ? Math.min(perBeat, Math.max(e.meta.duration, 0.5))
      : Math.min(perBeat, 3) // duration unknown — keep the window short so it can't render black frames
    : perBeat;
  beatSlots.push({
    id: `beat_${String(i + 1).padStart(2, "0")}`,
    alias,
    src: `${dirArg.replace(/\\/g, "/").replace(/\/+$/, "")}/${e.rel.replace(/\\/g, "/")}`,
    in: e.isVideo ? 0 : undefined,
    duration: Number(dur.toFixed(2)),
    start: Number(t.toFixed(2)),
    text: TEXT[i] || "",
    _file: e.rel,
    _note: e.verdicts.join(" · ") || "OK",
  });
  t += dur;
}

const unused = usable.slice(beatsTotal);

// ─── report ──────────────────────────────────────────────────────────────────
const L = [];
L.push(`# Asset Check Report — ${dirArg}`);
L.push("");
L.push(`**Reel spec:** ${W}×${H} @ ${FPS}fps (vertical 9:16) · **beats:** ${beatsTotal} · **target length:** ~${TOTAL_DUR}s`);
L.push("");
L.push(`Probed ${entries.length} asset(s) on ${new Date().toISOString().slice(0, 10)} — original filenames are KEPT; storyboard uses aliases.`);
L.push("");
L.push("## 1. Asset inventory");
L.push("");
L.push("| # | File | Type | Resolution | Orientation | Aspect | Duration | Size | Checks |");
L.push("|---|---|---|---|---|---|---|---|---|");
for (const e of entries) {
  const res = e.meta ? `${e.meta.width}×${e.meta.height}` : "—";
  const dur = e.isVideo ? (e.meta && e.meta.duration > 0 ? `${e.meta.duration.toFixed(1)}s` : "?") : "image";
  const fps = e.meta && e.meta.fps ? ` @${e.meta.fps.toFixed(1)}fps` : "";
  L.push(`| ${e.rel} | ${e.isVideo ? "video" : "image"} | ${res}${fps} | ${e.orientation} | ${e.aspect || "—"} | ${dur} | ${e.sizeKB}KB | ${e.verdicts.join("<br>") || "OK"} |`);
}
L.push("");
L.push("## 2. Naming guide");
L.push("");
L.push("- **Original filenames are never touched.** Each asset gets an alias used inside `storyboard.json` (`asset_01`, `asset_02`, … in arrangement order).");
for (const e of entries.filter((x) => x.nameNote)) {
  L.push(`- ⚠️ \`${e.rel}\` — ${e.nameNote}; the alias hides it from the pipeline.`);
}
L.push("");
L.push("## 3. Automatic arrangement (best-fit)");
L.push("");
L.push("Best video wins beat 1 (hook). Priority: **video > image · portrait > landscape · higher resolution · longer source**. Beat windows are capped at the source clip length so no beat renders black frames.");
L.push("");
L.push("| Beat | Alias | File | Window | Duration | Note |");
L.push("|---|---|---|---|---|---|");
for (const b of beatSlots) {
  L.push(`| ${b.id} | ${b.alias} | ${b._file} | ${b.start}s → ${(b.start + b.duration).toFixed(1)}s | ${b.duration}s | ${b._note} |`);
}
L.push("");
if (unused.length) {
  L.push(`## 4. Not used in this reel (${unused.length})`);
  L.push("");
  for (const e of unused) L.push(`- ${e.rel}`);
  L.push("");
}
L.push("## 5. Next steps (agent)");
L.push("");
L.push("1. Fill the per-beat texts — rerun with `--text \"hook|…|CTA\"` or edit `storyboard.json`.");
L.push("2. Swap any beat's asset if its content doesn't match the beat text (edit `src` / `alias` in `storyboard.json`).");
L.push("3. Cut: `node scripts/cut-assets.mjs storyboard.json`.");
L.push("4. Then HTML → render → audio → captions → audit (SKILL.md stages 3–7).");
L.push("");

// ─── storyboard.json ─────────────────────────────────────────────────────────
const storyboard = {
  out: "assets/cuts",
  width: W,
  height: H,
  fps: FPS,
  beats: beatSlots.map(({ _file, _note, ...rest }) => ({ ...rest })),
};

console.log(`📦 ${entries.length} asset(s) probed → ${beatsTotal} beat(s) · ${beatSlots.length - beatSlots.filter((b) => b.text).length} beat text(s) still empty`);
console.log(`   Best asset on the hook beat: ${beatSlots[0]._file}`);
for (const b of beatSlots) {
  console.log(`   ${b.id}  ${b.alias}  ${b._file}  ${b.start}s→${(b.start + b.duration).toFixed(1)}s`);
}

if (DRY) {
  console.log("\n(dry-run — nothing written)");
  process.exit(0);
}
writeFileSync(OUT_PATH, JSON.stringify(storyboard, null, 2), "utf8");
writeFileSync(REPORT_PATH, L.join("\n"), "utf8");
console.log(`\n✅ ${basename(REPORT_PATH)} → ${REPORT_PATH}`);
console.log(`✅ ${basename(OUT_PATH)} → ${OUT_PATH} (draft — fill texts, then cut-assets)`);
