#!/usr/bin/env node
// social-media-content-plan — the grounded platform knowledge base. Prints the
// 2026 algorithm playbook for one or more platforms (Instagram, X, LinkedIn,
// TikTok, YouTube, Facebook, Threads): how each algorithm actually
// ranks, its top signals, the honest reset sprint, native formats, cadence,
// hashtag/keyword rules, pitfalls, and growth levers. The agent uses this to
// write strategy.md with facts instead of vibes.
//
// Usage:
//   node platform-playbook.mjs --platform instagram
//   node platform-playbook.mjs --platform instagram,x,linkedin
//   node platform-playbook.mjs --platform x --platform tiktok
//   node platform-playbook.mjs --all
//
// Exit codes: 0 = printed, 1 = unknown platform, 2 = usage error.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: social-media-content-plan · ${label}\n${BRAND_LINE}\n`;
console.log(banner("platform-playbook.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

// ─── the playbook (grounded in 2025-26 algorithm reporting; revisit yearly) ──
const PLAYS = {
  instagram: {
    name: "Instagram",
    ranking:
      "Four separate ranking systems — Feed (relationships + interest), Reels (entertainment/discovery), Stories (closeness), Explore (pure discovery). Meta's five shared signals: relationships, interest, relevancy, popularity, usage. In 2026 the system matches semantic embedding, not hashtags: niche consistency teaches it exactly who to show you to. Engagement beats follower count; shares (especially DM shares) are the top Reels signal.",
    signals: [
      "Reels: watch time (total seconds), rewatches, DM shares, saves, completion — first 24–48h decide distribution",
      "Feed: likelihood to spend >10s, profile taps, comments, reshares — negative signals (skip, Not interested) demote",
      "Stories: replies, emoji reactions, profile taps — closeness history; >5 slides starts dropping views",
      "Explore: topic match, engagement velocity, saves, follow-through from non-followers",
    ],
    reset:
      "14-day re-training sprint: 5–6 posts/week with a Reels majority (4 Reels : 1 static : 1 carousel), every post inside 1–2 niche pillars so the embedding stays tight. First 60 minutes are diagnostic — engage hard: reply to every comment, answer every DM, comment on 5–10 niche accounts. Use Trial Reels to test hooks on a cold audience before committing. Do NOT delete underperformers (you delete training signal), do NOT repost TikTok watermarks (down-ranked).",
    formats: ["Reels < 90s (looped, captions on, audio on)", "Carousels (2–3 of 5 slides max engaging)", "Static image + strong caption (rare)", "Stories: 1–5 slides, polls/questions/link stickers"],
    cadence: "4–6 posts/week + 3–5 Stories/week during the sprint. Best when your audience is online (check Insights — mid-morning / early evening local).",
    hashtags:
      "3–5 relevant tags max (plus keywords in the caption itself — the model reads text). Don't chase broad tags; match the exact topic cluster of your audience. Native captions + AI-translatable simple language widen reach.",
    pitfalls: [
      "Cross-posting with visible watermarks / recycled formats — down-ranked",
      "Engagement pods and bought likes — detected and suppressed",
      "Posting 5x the same format — the model narrows you",
      "Reply-bait and like-bait CTAs — punished as low-quality signal",
    ],
    growthLevers: ["Watch time + rewatch rate", "DM-share triggers ('send this to a friend who…')", "Save-bait endings ('save this for your next workout')", "Follow conversion off Reels", "Trial Reels as a hook lab"],
  },
  x: {
    name: "X (Twitter)",
    ranking:
      "Interest-graph 'For You' feed: engagement velocity in the first 60 minutes decides tier expansion. Likes are baseline; replies, quote-posts, and dwell time (how long people read) carry the weight. Niche authority comes from consistency — the model clusters your account by what people who engage with you also read.",
    signals: [
      "First-hour engagement velocity (replies + reposts + quote-posts)",
      "Dwell / read time on your post",
      "Recirculation: reply-rate and swipe-past behavior after the initial hour",
      "Reposts are a follower signal; replies are a conversation signal (heavier)",
    ],
    reset:
      "14-day sprint: 2–4 posts/day (short, sharp, one idea each) + 1 numbered thread/week that goes deep on your pillar. Spend the first 60 minutes after each post replying to every reply and quoting 1–2 relevant posts with added insight. Cluster: 3–4 pillars, same vocabulary every week so the model builds a stable embedding. Keep underperformers public — deleting reduces training signal.",
    formats: ["Short text posts (one idea, under ~240 chars)", "Numbered threads (one idea per post, open loop across the thread)", "Native video < 60s", "Polls (low-weight — use sparingly)", "Quote-posts of niche accounts with insight added"],
    cadence: "2–4 posts/day during the sprint (about 15–25/week). Best: weekday mornings (US ET) + one weekend post.",
    hashtags:
      "ZERO hashtags — a single `#` fails the X plan (copy-first, tags are noise). The model reads the text; niche vocabulary in the body is the signal. See x-growth skill.",
    pitfalls: [
      "Reply-bait farming ('unpopular opinion:' with nothing behind it) — detected and throttled",
      "Engagement pods / follow-for-follow — suppressed",
      "Deleting underperformers — you erase the model's training data",
      "Threads that split one idea into 15 posts — one idea per post",
    ],
    growthLevers: ["First-hour reply velocity", "Quote-posts from niche accounts", "One weekly 'thread worth saving'", "Contrarian claims with receipts", "Dwell-time hooks (open loops in the first line)"],
  },
  linkedin: {
    name: "LinkedIn",
    ranking:
      "The most follow-graph-weighted major platform, but 2026 moved it to an interest-graph hybrid: dwell time and first-hour comment velocity now drive distribution beyond your network. Posts that hold a reader 5+ seconds get exponentially more reach than scrolled-past posts with similar likes. First-hour comments (especially from 1st-degree connections) push posts into 2nd-degree networks — 30 substantive comments in the first hour beat 300 likes over 24h.",
    signals: [
      "Dwell time (the 'dwell-time era' — 5+ seconds in-feed)",
      "First-60-minute comment velocity — decides 70%+ of eventual reach",
      "Engagement from 1st-degree connections (network spread)",
      "Completion on PDF carousels (highest dwell format in 2026)",
    ],
    reset:
      "14-day sprint: 3–5 posts/week, no more. Turn on Creator Mode. Prioritize PDF carousels (8 slides of scroll-worthy value = 20+ seconds dwell) and text posts with a story/contrarian take. After every post, spend 30–60 min commenting on 5–10 targets (peers, clients' industries) with ONE added insight — never 'Great post!'. Comment velocity is the lever; likes are vanity.",
    formats: ["PDF / document carousels (8 slides, highest dwell-time format)", "Text posts (hook in first 2 lines, one idea, one CTA)", "Native vertical video", "Polls are deprioritized — skip during the sprint"],
    cadence: "3–5 posts/week. Best: Tue–Thu mornings (US ET); Monday is noisy, Friday is light.",
    hashtags: "2–3 niche hashtags max — the feed reads the text; long hashtag walls look spammy and hurt dwell. Write for a 2-second decision: hook, whitespace, one idea.",
    pitfalls: [
      "Engagement-bait ('Agree? 👇', 'Who else feels this?') — punished",
      "Article-link posts (links suppressed — quote the insight instead)",
      "Polls as filler (low-signal, deprioritized)",
      "Template-speak ('Thrilled to announce…') — kills dwell",
    ],
    growthLevers: ["First-hour comment velocity (comment on 5–10 targets daily)", "Carousel dwell time (8-slide value packs)", "Conversation-starting endings ('What would you add?')", "Profile-to-post consistency (bio reinforces the niche)", "Tag 1–2 people with something real to add — sparingly"],
  },
  tiktok: {
    name: "TikTok",
    ranking:
      "The purest interest graph: every video is tested cold on a small cohort, then tier-expanded if signals clear each threshold. Completion rate and rewatch rate are the strongest positive signals; share rate and comment depth follow. The model also parses on-screen text and spoken audio for topic. Consistency compounds — posting 1–2x/day with a stable niche builds compound distribution; erratic posting makes the model 'forget' your audience cluster and resets baseline reach.",
    signals: [
      "Video completion rate (very high weight)",
      "Rewatch rate (strongest positive signal available)",
      "Share rate (off-platform shares weighted highest)",
      "Keyword/hashtag signals from on-screen text + audio",
      "Follows-from-video + comment depth (reply threads)",
    ],
    reset:
      "14-day sprint: 1–2 posts/day, same niche every single post (a productivity creator who posts finance one day breaks the embedding). First 1 second is the hook — pattern interrupt or claim. Reply to every comment in the first hour to deepen reply threads (depth > volume). Do NOT delete underperformers — keep them public; the model needs the training signal.",
    formats: ["15–30s videos (discovery sweet spot)", "Series / part 2s ('TO BE CONTINUED' bait)", "Trending sounds with ORIGINAL angles", "Text-on-screen + voiceover (model parses both)"],
    cadence: "1–2 posts/day (7–14/week) during the sprint — the most cadence-hungry platform.",
    hashtags: "3–5 topic tags + the trend's tag if you ride one. On-screen text and audio keywords matter more than the tag block. Stay in one topic cluster so the model's niche-to-niche spread works for you.",
    pitfalls: [
      "Erratic posting (3 posts, 10-day gap) — baseline reach resets",
      "Low-effort AI slop (generic voiceovers, stock slideshows) — signal-quality detectors",
      "Deleting low performers — removes training signal",
      "Chasing trends outside your niche — breaks the embedding",
    ],
    growthLevers: ["Completion + rewatch engineering (loop endings)", "Reply-thread depth in the first hour", "1–2 posts/day consistency", "Niche-to-niche spread (adjacent-audience hooks)", "Part-2 bait for session retention"],
  },  youtube: {
    name: "YouTube (Shorts + Long-form)",
    ranking:
      "YouTube runs TWO separate systems that must be designed for independently. The Shorts feed ranks on completion + swipe velocity (snackable entertainment, personalized discovery); long-form ranks on total session time — does the video keep viewers on YouTube — gated by CTR (4–8% vs the topic cluster) and the retention curve (intro retention ≥ ~70% at 30s; dips mark sections to cut; scrub-back moments are expandable gold). Shorts and long-form have separate audience models: Shorts subscribers rarely watch long-form unless you explicitly bridge the two. YouTube optimizes one top-level metric: total session time.",
    signals: [
      "Shorts: completion rate + swipe velocity + rewatch",
      "Long-form: session contribution (total watch time across videos, not just one video)",
      "CTR on impressions — the 4–8% gate before distribution widens",
      "Retention curve: intro retention (first 30s), dips, re-engagement peaks",
      "Search: query intent + keyword match + channel authority on the topic",
    ],
    reset:
      "14-day sprint: 3–4 Shorts/week + 1 long-form/week from a single pillar — YouTube clusters by CHANNEL topic, so one niche across both systems. Shorts: first 1 second hook, loop the ending. Long-form: intro must clear the ~70%-at-30-seconds bar before anything else. Never delete underperformers (training signal); never cross-post watermarked verticals (throttled). Build an explicit Shorts→long-form bridge — a Short that ends with a real hook for the full video, not a link-only caption.",
    formats: ["Shorts 9:16 (< 60s, hook in 1s, loop ending)", "Long-form 8–15 min with a designed retention curve (hook < 30s, open loops, payoff map)", "Community posts (polls / questions — keeps the test audience warm between uploads)", "Shorts→long-form bridge videos (explicit 'full video on the channel' design)"],
    cadence: "3–4 Shorts/week + 1 long-form/week during the sprint (4–5 uploads/week). Best: a fixed day/time — the audience model learns your upload rhythm (evenings / US timezones typically peak).",
    hashtags:
      "Tags are minor — title keywords + the first 30 seconds carry search intent. Shorts: title + first-frame text match the topic cluster. Keep the channel to ONE topic; 'audience overlap' between Shorts and long-form requires intentional design, not cross-posting.",
    pitfalls: [
      "CTR below the topic-cluster threshold (4–8%) — throttled regardless of quality",
      "Intro that loses 30%+ of viewers in 30 seconds",
      "Shorts and long-form on completely different topics — no bridge, two audiences",
      "Cross-posting with watermarks — distribution penalty",
      "Deleting underperformers — removes training signal",
    ],
    growthLevers: ["Completion + loop endings on Shorts", "CTR-optimized titles/thumbnails (specific outcome, not clickbait)", "Intro retention ≥ 70% at 30s", "Session-building (playlists, part 2s)", "Save-as-playlist ('watch this before your next workout')", "Shorts→long-form bridge design"],
  },
  facebook: {
    name: "Facebook",
    ranking:
      "News Feed optimizes for 'meaningful social interactions' — comments, reactions, and shares between people who know each other. Not all engagement is equal: a long threaded comment from a friend outranks hundreds of reactions from strangers. Groups get a significant distribution boost; brand Page organic reach is below ~2% of followers. Reels are Meta's push — Page Reels often outperform Page posts 5–10x.",
    signals: [
      "Comment depth: threaded replies with 10+ words",
      "Meaningful social interaction (MSI) between connected people",
      "Video crossing the 60-second watch threshold",
      "Dwell time (including time spent reading comments)",
    ],
    reset:
      "14-day sprint: 3–5 Reels/week + 2–3 text posts, and — the real lever — run a niche community (Group) where you answer questions daily. If you only have a Page, set expectations: organic Page reach is tiny; the plan is Reels-first or Group-first. Reply to every comment with a follow-up question to deepen threads.",
    formats: ["Reels (5–10x Page-post reach — the format Meta is boosting)", "Group posts / community Q&As", "Text posts that start threaded conversations", "Videos > 60s (promoted past the threshold)"],
    cadence: "3–5 Reels/week + daily Group activity during the sprint.",
    hashtags: "Minimal. Groups and MSI matter, not tags. Post into the Group first; share winners to the Page.",
    pitfalls: [
      "Page-only organic strategy (reach < 2%)",
      "Filler posting — every post must invite a substantive reply",
      "Ignoring comments — MSI needs replies",
    ],
    growthLevers: ["Owned Group with daily questions", "Reels-first posting", "Follow-up questions on every comment", "Thread depth (10+ word replies)", "Cross-posting top Reels to Instagram (native, not watermarked)"],
  },
  threads: {
    name: "Threads",
    ranking:
      "Meta's text-first answer to X: interest-graph discovery mixed with follow-graph. Engagement velocity in the first hour and reply/quote culture drive distribution — Threads rewards conversation, not broadcast. Unlike Instagram, hashtags DO work on Threads (topic tags feed discovery), and the app heavily boosts native replies and quote-reposts.",
    signals: [
      "First-hour engagement velocity (replies + reposts)",
      "Reply chains and quote-reposts (conversation = distribution)",
      "Hashtag/topic match (tags are actually read here)",
      "Profile visits from discovery",
    ],
    reset:
      "14-day sprint: 1–3 posts/day of short opinionated takes inside your niche + a daily habit of replying with insight to 3–5 accounts. Conversation is the currency — end posts with an open loop or a 'change my mind' style question (genuine, not bait).",
    formats: ["Short text posts with a take", "Reposts with added insight (never empty reposts)", "Polls (conversation-starters)", "Native video"],
    cadence: "1–3 posts/day during the sprint.",
    hashtags: "Use 1–3 real topic hashtags — they work here and feed discovery. Keywords in the body still matter.",
    pitfalls: [
      "Empty reposts / link-only posts — no signal",
      "Broadcast energy instead of conversation — Threads rewards reply culture",
      "Fake question-bait ('Does anyone else…?') — detectable and dead",
    ],
    growthLevers: ["Daily insight replies (3–5)", "Hashtagged topic posts", "Open-loop endings", "Conversation chains you keep alive", "Cross-quoting your X takes adapted natively"],
  },
};

// ─── helpers ────────────────────────────────────────────────────────────────
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const KNOWN = Object.keys(PLAYS);

const printPlay = (slug) => {
  const p = PLAYS[slug];
  const out = [];
  out.push(`\n${"─".repeat(56)}`);
  out.push(`# ${p.name} — algorithm playbook (2025–26) · slug: ${slug}`);
  out.push(`${"─".repeat(56)}`);
  out.push(`\n## How it ranks\n${p.ranking}\n`);
  out.push(`## Top ranking signals\n`);
  for (const s of p.signals) out.push(`- ${s}`);
  out.push(`\n## The reset sprint (14 days)\n${p.reset}\n`);
  out.push(`## Formats that win\n`);
  for (const f of p.formats) out.push(`- ${f}`);
  out.push(`\n## Cadence\n${p.cadence}\n`);
  out.push(`## Hashtags / keywords\n${p.hashtags}\n`);
  out.push(`## Pitfalls (what kills reach)\n`);
  for (const p1 of p.pitfalls) out.push(`- ${p1}`);
  out.push(`\n## Growth levers (what metrics.md tracks)\n`);
  for (const g of p.growthLevers) out.push(`- ${g}`);
  out.push("");
  return out.join("\n");
};

// ─── arg parsing ────────────────────────────────────────────────────────────
if (args.length === 0 || (args.length === 1 && args.includes("--all"))) {
  console.log(
    args.length === 0
      ? "Usage: node platform-playbook.mjs --platform <slug[,slug…]> | --all\n  slugs: " + KNOWN.join(", ")
      : printAll()
  );
  process.exit(args.length === 0 ? 2 : 0);
}

if (args.includes("--all")) {
  console.log(printAll());
  process.exit(0);
}

// collect --platform values (repeatable + comma-separated)
const platformArgs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--platform" || args[i] === "-p") {
    const v = args[i + 1];
    if (!v || v.startsWith("--")) {
      console.error("Usage: node platform-playbook.mjs --platform <slug[,slug…]> | --all");
      process.exit(2);
    }
    platformArgs.push(...v.split(","));
    i++;
  }
}
if (platformArgs.length === 0) {
  console.error("Usage: node platform-playbook.mjs --platform <slug[,slug…]> | --all");
  process.exit(2);
}

const requested = platformArgs.map(slugify);
const unknown = requested.filter((s) => !KNOWN.includes(s));
if (unknown.length) {
  console.error(`❌ Unknown platform(s): ${unknown.join(", ")}`);
  console.error(`   Known slugs: ${KNOWN.join(", ")}`);
  process.exit(1);
}
for (const s of requested) console.log(printPlay(s));
console.log("✅ Playbook printed — use it to write strategy.md with grounded facts.");
process.exit(0);

function printAll() {
  return KNOWN.map((s) => printPlay(s)).join("\n");
}
