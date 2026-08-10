#!/usr/bin/env node
// The serial-story-reels story-arc builder — turns a series-plan.json into a
// story bible (logline, season arc, per-episode hooks + cliffhangers) and
// VALIDATES the serialized structure: every episode needs scenes, a hook and
// a cliffhanger; every scene's characters must be defined; the grade +
// cinematic tokens must be present (they anchor episode-prompts.mjs).
//
// Usage:
//   node series-arc.mjs --plan series-plan.json [--bible story-bible.md]
//
// series-plan.json contract:
// {
//   "title": "Neon Hearts",
//   "genre": "love-story-action",        // from templates/genre-presets.md
//   "logline": "A courier and a hacker...",
//   "aspect": "9:16",
//   "scenes_per_episode": 4,
//   "grade": "Grade: ... (the FULL token — verbatim in every prompt)",
//   "cinematic": "Cinematic: IMAX-style ... (the FULL token — verbatim in every prompt)",
//   "world": "World: ... (verbatim world/lighting block)",
//   "characters": [
//     { "id": "maya", "name": "Maya", "block": "Character: Maya, ... (VERBATIM block)" }
//   ],
//   "episodes": [
//     { "id": "e1", "title": "...", "hook": "...", "cliffhanger": "...",
//       "scenes": [ { "id": "s1", "action": "...", "camera": "...", "context": "...", "dialogue": "...", "sfx": "...", "characters": ["maya"], "bridge": false } ] }
//   ]
// }
//
// Exit codes: 0 = OK, 1 = validation FAIL, 2 = usage error.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: serial-story-reels · ${label}\n${BRAND_LINE}\n`;
console.log(banner("series-arc.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const planArg = opt("plan");
if (!planArg) {
  console.error("Usage: node series-arc.mjs --plan series-plan.json [--bible story-bible.md]");
  process.exit(2);
}

let plan;
try {
  plan = JSON.parse(readFileSync(resolve(process.cwd(), planArg), "utf8"));
} catch (e) {
  console.error(`❌ Could not parse ${planArg}: ${e.message}`);
  process.exit(2);
}
const biblePath = resolve(process.cwd(), opt("bible", "story-bible.md"));

// ─── validation (collect every FAIL, don't stop at the first) ───────────────
const fails = [];
const check = (ok, msg) => { if (!ok) fails.push(msg); };
check(plan.title && plan.title.trim(), "missing title");
check(plan.logline && plan.logline.trim(), "missing logline");
check(plan.grade && plan.grade.trim(), "missing grade token (lock ONE grade for the whole series)");
check(plan.cinematic && plan.cinematic.trim(), "missing cinematic token (the IMAX-style block)");
check(plan.world && plan.world.trim(), "missing world block");

const characters = plan.characters || [];
const charIds = new Set(characters.map((c) => c.id));
check(characters.length > 0, "no characters defined — the series needs at least one character block");
const missingCharBlocks = characters.filter((c) => !c.block || !c.block.trim());
check(missingCharBlocks.length === 0, `characters missing verbatim blocks: ${missingCharBlocks.map((c) => c.id).join(", ")}`);

const episodes = plan.episodes || [];
check(episodes.length >= 2, `a serialized story needs ≥2 episodes (found ${episodes.length})`);
episodes.forEach((ep, i) => {
  const tag = `episode ${ep.id || i + 1}`;
  check(ep.title && ep.title.trim(), `${tag} missing title`);
  check(ep.hook && ep.hook.trim(), `${tag} missing hook (the 3-second open loop)`);
  check(ep.cliffhanger && ep.cliffhanger.trim(), `${tag} missing cliffhanger (the end-of-episode loop)`);
  check(Array.isArray(ep.scenes) && ep.scenes.length > 0, `${tag} has no scenes`);
  (ep.scenes || []).forEach((s, j) => {
    const stag = `${tag} scene ${s.id || j + 1}`;
    check(s.action && s.action.trim(), `${stag} missing action`);
    check(s.camera && s.camera.trim(), `${stag} missing camera language`);
    const sc = s.characters || [];
    const unknown = sc.filter((id) => !charIds.has(id));
    check(unknown.length === 0, `${stag} references undefined character(s): ${unknown.join(", ")}`);
  });
});

if (fails.length) {
  console.error(`❌ ${fails.length} story-arc validation FAIL(s):`);
  fails.forEach((f) => console.error(`   • ${f}`));
  console.error("   Fix series-plan.json and re-run — episode-prompts.mjs depends on a valid arc.");
  process.exit(1);
}

// ─── write story-bible.md ────────────────────────────────────────────────────
const L = [];
L.push(`# Story Bible — "${plan.title}"`);
L.push("");
L.push(`**Genre:** ${plan.genre || "—"} · **Logline:** ${plan.logline}`);
L.push(`**Format:** ${plan.aspect || "9:16"} · **Episodes:** ${episodes.length} · **Scenes per episode:** ${plan.scenes_per_episode || "—"} · **Cast:** ${characters.map((c) => c.name || c.id).join(", ")}`);
L.push("");
L.push("## The season arc");
L.push("");
episodes.forEach((ep, i) => {
  L.push(`### Episode ${i + 1} — ${ep.title}`);
  L.push(`- **Hook:** ${ep.hook}`);
  L.push(`- **Cliffhanger:** ${ep.cliffhanger}`);
  L.push(`- **Scenes:** ${(ep.scenes || []).map((s) => s.id).join(" → ")}`);
  L.push("");
});
L.push("## Locked consistency tokens (verbatim in EVERY prompt — never reword)");
L.push("");
L.push(`- **Grade:** ${plan.grade}`);
L.push(`- **Cinematic:** ${plan.cinematic}`);
L.push(`- **World:** ${plan.world}`);
L.push("");
L.push("## Cast blocks (verbatim in every prompt their character appears)");
L.push("");
characters.forEach((c) => L.push(`- **${c.name || c.id}** (id: ${c.id}): ${c.block}`));
L.push("");
L.push(`> Generated by series-arc.mjs — validate the arc first, then build the prompt pack with episode-prompts.mjs.`);

writeFileSync(biblePath, L.join("\n"), "utf8");
console.log(`✅ Story bible → ${basename(biblePath)} (${episodes.length} episodes · ${characters.length} characters · arc valid)`);
process.exit(0);
