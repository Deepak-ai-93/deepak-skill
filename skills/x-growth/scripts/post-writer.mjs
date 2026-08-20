#!/usr/bin/env node
// x-growth — assemble + validate the X growth content plan from a plan JSON.
// Enforces the repo's storytelling + addiction rails AND the TOP-CREATOR post
// format: every post is a 500–800 char micro-essay (hook line ≤ 100 chars that
// opens a loop → story/context → bullet points → payoff → CTA), zero hashtags
// (a single "#" FAILS the plan — X growth is copy-first, tags are noise),
// anti-fluff + bait-spam blocklists. Exits 1 on any FAIL, writes nothing.
//
// Usage:
//   node post-writer.mjs --plan content-plan.json [--out content-plan.md]
//
// Exit codes: 0 = plan assembled, 1 = plan FAIL, 2 = usage error.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: x-growth · ${label}\n${BRAND_LINE}\n`;
console.log(banner("post-writer.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

// --- the repo's anti-fluff contract, plus X bait-spam patterns --------------
const FLUFF = [
  "unlock", "game-changer", "elevate", "supercharge", "level up", "unleash",
  "boost", "empower", "revolutionize", "optimize", "leverage", "journey",
  "transform your", "skyrocket", "crush it", "secrets to", "amazing", "guaranteed",
];
const BAIT = [
  "rt if", "retweet if", "like if", "tag someone", "share if you agree",
  "follow for follow", "follow back", "engagement group",
];
const ROLES = new Set(["hook", "value", "story", "proof", "cta", "loop"]);
const HASH = "#";

// --- the TOP-CREATOR POST FORMAT contract (the user's rail) ------------------
// Every post is a 500–800 char micro-essay, scannable like the accounts that
// actually grow: hook line ≤ 100 chars → story/context → bullet points → payoff
// → CTA. A 500+ char wall of text with no line breaks is a FAIL.
const MIN_CHARS = 500;
const MAX_CHARS = 800;
const MAX_HOOK_LINE = 100;
const MIN_LINES = 3;       // line breaks = scannability
const MIN_BULLETS = 2;     // "- " or "• " — the top-creator list format

const planPath = opt("plan");
const outPath = resolve(opt("out", "content-plan.md"));
if (!planPath) {
  console.error("Usage: node post-writer.mjs --plan content-plan.json [--out content-plan.md]");
  process.exit(2);
}

let plan;
try {
  plan = JSON.parse(readFileSync(resolve(planPath), "utf8"));
} catch (e) {
  console.error(`❌ Cannot read plan ${planPath}: ${e.message}`);
  process.exit(1);
}

const fails = [];
const warns = [];
const check = (ok, label, detail) => { if (!ok) fails.push(`${label} — ${detail}`); };
const hasFluff = (t) => FLUFF.find((w) => t.toLowerCase().includes(w.toLowerCase()));
const hasBait = (t) => BAIT.find((w) => t.toLowerCase().includes(w.toLowerCase()));
const hasHash = (t) => t.includes(HASH);

// --- plan-level fields ------------------------------------------------------
const goal = (plan.goal || "").trim();
const audience = (plan.audience || "").trim();
const niche = (plan.niche || "").trim();
const voice = (plan.voice || "").trim();
const pillars = Array.isArray(plan.pillars) ? plan.pillars.map((p) => p.trim()).filter(Boolean) : [];
const cadence = Number(plan.cadence) || 0;
const posts = Array.isArray(plan.posts) ? plan.posts : [];

check(goal, "goal", "plan.goal missing — the growth goal decides the plan");
check(audience, "audience", "plan.audience missing");
check(niche, "niche", "plan.niche missing — one niche, not three");
check(voice, "voice", "plan.voice missing — posts must sound like the account");
check(pillars.length >= 3, "pillars", `need ≥ 3 content pillars, got ${pillars.length}`);
check(cadence >= 1, "cadence", `plan.cadence must be ≥ 1 post/day, got ${cadence}`);
check(posts.length >= 7, "post count", `need ≥ 7 posts (one week), got ${posts.length}`);

// --- story-spine post mix (the plan is the micro-story, posts are the beats) --
const roles = posts.map((p) => (p.role || "").trim()).filter((r) => ROLES.has(r));
check(roles.length === posts.length, "roles", `${posts.length - roles.length} post(s) with missing/invalid role — allowed: ${[...ROLES].join(" / ")}`);
check(roles.includes("hook"), "story spine", "no hook post — every growth week needs a pure scroll-stop attention play");
check(roles.includes("value"), "story spine", "no value post — the week must teach something");
check(roles.some((r) => r === "story" || r === "proof"), "story spine", "no story/proof post — the plan needs evidence/payoff, not just tips");
check(roles.includes("cta") || roles.includes("loop"), "story spine", "no cta/loop post — a growth plan must convert the attention it earns");

// --- per-post rails (the top-creator format contract) ------------------------
const items = [];
posts.forEach((p, i) => {
  const text = (p.text || "").trim();
  const role = (p.role || "").trim();
  const pillar = (p.pillar || "").trim();
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const firstLine = lines[0] || "";
  const bullets = lines.filter((l) => /^[-•*]\s+/.test(l)).length;
  check(text, `post ${i + 1}`, "missing text");
  check(role && ROLES.has(role), `post ${i + 1}`, `role "${role}" not in ${[...ROLES].join(" / ")}`);
  check(pillar && pillars.includes(pillar), `post ${i + 1}`, `pillar "${pillar}" not in plan.pillars`);
  check(text.length >= MIN_CHARS, `post ${i + 1}`, `${text.length}/${MAX_CHARS} chars — the top-creator window is ${MIN_CHARS}–${MAX_CHARS}, this one is too thin to rank`);
  check(text.length <= MAX_CHARS, `post ${i + 1}`, `${text.length}/${MAX_CHARS} chars — over the top-creator window`);
  check(firstLine.length <= MAX_HOOK_LINE, `post ${i + 1}`, `hook line ${firstLine.length}/${MAX_HOOK_LINE} chars — the FIRST LINE must be the scroll-stopper, cut the qualifiers`);
  check(lines.length >= MIN_LINES, `post ${i + 1}`, `${lines.length} line(s) — a top-creator post needs ≥ ${MIN_LINES} lines with breaks, not a wall of text`);
  check(bullets >= MIN_BULLETS, `post ${i + 1}`, `${bullets} bullet(s) — the top-creator format needs ≥ ${MIN_BULLETS} bullet points ("- " or "• ")`);
  const f = hasFluff(text);
  if (f) fails.push(`post ${i + 1} — fluff word "${f}"`);
  const b = hasBait(text);
  if (b) fails.push(`post ${i + 1} — bait-spam "${b}"`);
  const h = hasHash(text);
  if (h) fails.push(`post ${i + 1} — hashtag "${h}" — the zero-hashtag rail: X growth is copy-first, no tags`);
  items.push({ text, role, pillar, len: text.length });
});

// every pillar must be fed by at least one post
for (const p of pillars) {
  if (!items.some((i) => i.pillar === p)) fails.push(`pillar "${p}" — no post feeds it; dead pillars are plan debt`);
}

if (fails.length) {
  console.error(`❌ content plan FAIL (${fails.length}):`);
  for (const f of fails) console.error(`   - ${f}`);
  console.error("Fix content-plan.json and re-run — nothing was written.");
  process.exit(1);
}

// --- write content-plan.md ----------------------------------------------------
const days = Math.max(7, posts.length);
const L = [];
L.push(`# X Growth Plan — ${niche}`);
L.push("");
L.push(`**Goal:** ${goal}`);
L.push(`**Audience:** ${audience} · **Voice:** ${voice} · **Cadence:** ${cadence} post(s)/day`);
L.push(`**Pillars:** ${pillars.join(" · ")}`);
L.push("");
L.push("## The growth rails (every post in this plan follows them)");
L.push("");
L.push("- **Top-creator post format.** Every post is a 500–800 char micro-essay: a hook line ≤ 100 chars that opens a loop → story/context → bullet points → payoff → CTA. Line breaks every 1–2 sentences — never a wall of text.");
L.push("- **Zero hashtags.** No tags anywhere — X growth is copy-first, hashtags are noise and read as spam. The script FAILS any post with a `#`.");
L.push("- **One micro-story per post.** The first line opens the loop, the last line closes it — every post is complete alone and scannable in 20 seconds.");
L.push("- **The week is the series.** Hook → value → proof/story → CTA/loop across the week — serialization makes the account worth following, not one viral post.");
L.push("- **Fluff rule:** if a post can be deleted without losing the story, delete it.");
L.push("");
L.push("## Weekly cadence");
L.push("");
L.push("| Day | Post mix | Focus |");
L.push("|---|---|---|");
for (let d = 1; d <= days; d++) {
  const dayPosts = items.filter((_, i) => i % days === d - 1);
  L.push(`| Day ${d} | ${dayPosts.map((p) => p.role).join(" → ") || "—"} | ${dayPosts.length ? `${dayPosts[0].pillar} lead` : "off/post" } |`);
}
L.push("");
L.push("## Engagement schedule (the posts earn reach; the replies compound it)");
L.push("");
L.push("- **Reply-first 60 minutes** after each post: reply to every reply, in order, within minutes — a reply trail under a post gets it pushed again.");
L.push("- **Quote posts:** 3–5 per day — quote the niche's big accounts with ONE sharp take (never 'Great post!'), never more than one line of your take + link.");
L.push("- **DM follow-ups:** match the CTA of the day — answer DMs within 24h, qualify with one question, never mass-DM the same text.");
L.push("- **Follow hygiene:** follow back genuine engagement same day, 20–40 follows/day max from real niche searches, prune spam weekly.");
L.push("");
L.push("## KPIs + day-7 review");
L.push("");
L.push(`| Metric | Target | Day-7 actual |`);
L.push("|---|---|---|");
L.push(`| Followers | ${plan.kpis?.followers || "target set in plan.kpis"} | — |`);
L.push(`| Reply rate | ${plan.kpis?.replyRate || "> 0.3% of impressions"} | — |`);
L.push(`| Quote posts | ${plan.kpis?.quotes || "> 1% of impressions"} | — |`);
L.push(`| Profile visits | ${plan.kpis?.visits || "rising week over week"} | — |`);
L.push(`| Follower conversion | ${plan.kpis?.conversion || "> 2% of impressions"} | — |`);
L.push("");
L.push("Fix loop if flat: replies → sharpen hooks · quotes → more quotable payoffs · followers → CTA post + pinned post + bio alignment.");
L.push("");
writeFileSync(outPath, L.join("\n"), "utf8");

// --- write posts.md (the actual copy, all drafted) ----------------------------
const postsPath = join(dirname(outPath), `posts.md`);
const P = [];
P.push(`# Posts — ${niche} (${posts.length} drafted)`);
P.push("");
P.push(`> Top-creator format · 500–800 chars each · hook line ≤ 100 chars · zero hashtags · one micro-story per post.`);
P.push("");
items.forEach((p, i) => {
  P.push(`### Post ${i + 1} · ${p.role} · ${p.pillar}  *(${p.len}/800 chars)*`);
  P.push("");
  P.push(p.text);
  P.push("");
});
writeFileSync(postsPath, P.join("\n"), "utf8");

console.log(`✅ Content plan assembled → ${basename(outPath)} + ${basename(postsPath)} (${items.length} posts · ${pillars.length} pillars · zero hashtags)`);
for (const w of warns) console.log(`   ⚠️ ${w}`);
process.exit(0);