#!/usr/bin/env node
// social-media-content-plan — the COMPANION SKILLS GATE. A 30-day content
// plan schedules posts, but the skills that PRODUCE them live in sibling
// skills: Reels → text-motion-reels / veo-cinematic-reels / video-asset-reels,
// carousels → carousel-post-images, LinkedIn posts → linkedin-personal-brand,
// YouTube long-form → youtube-video-pipeline, voiceovers → voice-sfx-audio.
// This gate scans the common install locations for each companion, prints a
// matrix (installed / missing + the exact install command), optionally writes
// companion-skills.md, and — with --install (after the user approves) — runs
// `npx skills add Deepak-ai-93/deepak-skill --skill <slug>` for the missing ones.
//
// Usage:
//   node scripts/check-skills.mjs                      # full matrix → console
//   node scripts/check-skills.mjs --group video        # only video producers
//   node scripts/check-skills.mjs --out companion-skills.md   # also write the report
//   node scripts/check-skills.mjs --install            # install missing companions (npx)
//
// Exit codes: 0 = all companions installed (or report written), 1 = some missing, 2 = usage.
import { existsSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, join, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: social-media-content-plan · ${label}\n${BRAND_LINE}\n`;
console.log(banner("check-skills.mjs"));

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

// ─── the companion map (what the calendar schedules → who produces it) ──────
// groups: video (Reels/Shorts) · carousel · text-post · long-form · voice
const COMPANIONS = [
  {
    slug: "text-motion-reels",
    groups: ["video"],
    produces: "text-only motion graphic Reels/Shorts (word-pop, quiz-trap, day-counter, thread-court…) — 4K, captions",
    prompt: "Using the text-motion-reels skill, make a 15s word-pop reel from the Day {N} hook: \"{hook}\"",
  },
  {
    slug: "veo-cinematic-reels",
    groups: ["video"],
    produces: "cinematic AI video prompts for Google Flow/Veo, Kling, Luma… (locked character consistency)",
    prompt: "Using the veo-cinematic-reels skill, build cinematic scene prompts for the Day {N} reel",
  },
  {
    slug: "video-asset-reels",
    groups: ["video"],
    produces: "reels from the user's own clips/images (beat-cut, text overlay, 4K)",
    prompt: "Using the video-asset-reels skill, cut my clips into the Day {N} reel",
  },
  {
    slug: "carousel-post-images",
    groups: ["carousel"],
    produces: "4K carousel decks + per-platform captions for Instagram/LinkedIn (browser or image-model mode)",
    prompt: "Using the carousel-post-images skill, make the Day {N} carousel from pillar \"{pillar}\"",
  },
  {
    slug: "linkedin-personal-brand",
    groups: ["text-post"],
    produces: "voice-captured LinkedIn posts, headline + About, weekly calendar",
    prompt: "Using the linkedin-personal-brand skill, write the Day {N} LinkedIn post in my voice",
  },
  {
    slug: "youtube-video-pipeline",
    groups: ["long-form"],
    produces: "long-form YouTube script (hook in 30s), 10-title pack, thumbnail brief, description + chapters",
    prompt: "Using the youtube-video-pipeline skill, plan the Day {N} long-form video end-to-end",
  },
  {
    slug: "voice-sfx-audio",
    groups: ["voice"],
    produces: "Kokoro/Piper voiceovers, royalty-free SFX/music guidance, FFmpeg mixing (-14 LUFS)",
    prompt: "Using the voice-sfx-audio skill, add a Kokoro voiceover to the Day {N} reel and mix a bed",
  },
  {
    slug: "video-product-pipeline",
    groups: ["video"],
    produces: "viral-engineered video spec: trend research → angle scoring → video-product.md → approval → audit",
    prompt: "Using the video-product-pipeline skill, run the full spec → approve → generate → audit loop for the Day {N} reel",
  },
  {
    slug: "hook-storyboard-retention",
    groups: ["video"],
    produces: "scroll-stopping hooks + beat-by-beat storyboards (script ↔ video timeline in sync)",
    prompt: "Using the hook-storyboard-retention skill, storyboard the Day {N} reel from its hook",
  },
  {
    slug: "sponsorship-pipeline",
    groups: ["earning"],
    produces: "sponsor media kit + rate-card.mjs CPM benchmarks + outreach scripts (monetize the pillars)",
    prompt: "Using the sponsorship-pipeline skill, build the media kit + rate card for the Day {N} niche",
  },
  {
    slug: "paid-ads-studio",
    groups: ["earning"],
    produces: "Meta + Google ad campaigns with forecast-ads.mjs (boost winners once metrics.md shows pattern)",
    prompt: "Using the paid-ads-studio skill, forecast and blueprint ads for the Day {N} winner",
  },
];

// ─── where skills can be installed (scan order) ─────────────────────────────
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", ".."); // the deepak-skill repo root
const scanRoots = () => {
  const roots = [
    join(REPO_ROOT, "skills"),                      // inside the deepak-skill repo itself
    resolve(process.cwd(), ".agents", "skills"),    // npx skills add (current project)
    resolve(process.cwd(), ".claude", "skills"),    // Claude Code project-level
    resolve(process.cwd(), ".cursor", "skills"),    // Cursor project-level
  ];
  for (const sub of [".agents", ".claude", ".cursor", ".gemini", ".codex"]) {
    roots.push(join(homedir(), sub, "skills"));     // global installs
  }
  return roots;
};
const isInstalled = (slug) => scanRoots().some((r) => existsSync(join(r, slug, "SKILL.md")));

// ─── arg parsing ────────────────────────────────────────────────────────────
const group = opt("group", "all").toLowerCase();
const GROUPS = ["video", "carousel", "text-post", "long-form", "voice", "earning", "all"];
if (!GROUPS.includes(group)) {
  console.error(`Usage: node scripts/check-skills.mjs [--group ${GROUPS.slice(0, -1).join("|")}|all] [--out companion-skills.md] [--install]`);
  process.exit(2);
}
const outPath = opt("out", "") ? resolve(process.cwd(), opt("out")) : "";
const doInstall = has("install");

const shown = COMPANIONS.filter((c) => group === "all" || c.groups.includes(group));
const missing = shown.filter((c) => !isInstalled(c.slug));
const present = shown.filter((c) => isInstalled(c.slug));

// ─── console matrix ─────────────────────────────────────────────────────────
const L = [];
L.push(`# Companion Skills — ${group === "all" ? "full matrix" : `group: ${group}`}`);
L.push("");
L.push(`Scanned install locations: repo \`skills/\`, \`.agents/skills/\`, \`.claude/skills/\`, \`.cursor/skills/\`, global \`~/.agents|.claude|.cursor|.gemini|.codex/skills\`.`);
L.push("");
L.push(`**${present.length} installed · ${missing.length} missing** — install missing ones so the calendar's posts can actually be produced:`);
L.push("");
L.push("| Skill | Produces | Status | Install |");
L.push("|---|---|---|---|");
for (const c of COMPANIONS) {
  if (group !== "all" && !c.groups.includes(group)) continue;
  const ok = isInstalled(c.slug);
  L.push(`| **${c.slug}** | ${c.produces} | ${ok ? "✅ installed" : "⚠️ missing"} | ${ok ? "—" : "`npx skills add Deepak-ai-93/deepak-skill --skill " + c.slug + "`"} |`);
}
L.push("");

if (missing.length) {
  L.push("## Install (run after you approve — each is one command)");
  L.push("");
  for (const c of missing) {
    L.push(`- \`npx skills add Deepak-ai-93/deepak-skill --skill ${c.slug}\`  → ${c.produces}`);
  }
  L.push("");
  L.push("> Single-shot: `node scripts/check-skills.mjs --install` installs every missing companion above.");
  L.push("");
}

L.push("## Handoff prompts (delegate a calendar row to the right skill)");
L.push("");
for (const c of shown) {
  L.push(`- **${c.slug}** → ${c.produces}`);
  L.push(`  - \`${c.prompt}\``);
  L.push("");
}

if (outPath) {
  writeFileSync(outPath, L.join("\n"), "utf8");
  console.log(`✅ companion-skills.md → ${basename(outPath)} (${present.length} installed · ${missing.length} missing)`);
}

console.log(`${"─".repeat(56)}`);
for (const c of shown) {
  const ok = isInstalled(c.slug);
  console.log(`   ${ok ? "✅" : "⚠️"} ${c.slug.padEnd(24)} ${ok ? "installed" : `missing → npx skills add Deepak-ai-93/deepak-skill --skill ${c.slug}`}`);
}
console.log("");

if (missing.length) {
  console.log(`⚠️ ${missing.length} companion skill(s) missing — install them so the calendar's posts can be produced.`);
  console.log(`   Single-shot install: node scripts/check-skills.mjs --install`);
  if (doInstall) {
    console.log("");
    console.log("🚀 Installing missing companions…");
    let ok = true;
    for (const c of missing) {
      const r = spawnSync("npx", ["skills", "add", "Deepak-ai-93/deepak-skill", "--skill", c.slug, "--yes"], { stdio: "inherit", shell: process.platform === "win32" });
      if (r.status !== 0) { ok = false; console.error(`❌ Failed to install ${c.slug}`); }
    }
    if (!ok) process.exit(1);
    console.log("✅ All missing companions installed.");
    process.exit(0);
  }
  process.exit(1);
}
console.log("✅ All companion skills are installed — the calendar's posts can be produced end-to-end.");
process.exit(0);
