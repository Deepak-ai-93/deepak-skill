#!/usr/bin/env node
// The email-marketing validator — the automated gate BEFORE any send.
//   Scans the subject line + HTML body for spam triggers, compliance gaps
//   (unsubscribe, physical address, alt text, plain-text version), copy
//   quality (ALL-CAPS, !!!, link text) and E-E-A-T signals (author, proof,
//   named source, permission line). Writes validation-report.md.
//
// Usage:
//   node validate-email.mjs --html email.html --subject "Your subject here" [--preheader "…"] [--out validation-report.md]
//
// Exit codes: 0 = PASS (no FAILs), 1 = FAILs found, 2 = usage error.
//
// NOTE: this is a heuristic linter — it finds obvious problems fast, but the
// auditor subagent (Stage 6) makes the final call on copy quality, EEAT
// strength and visual render. The script intentionally errs on the side of
// warning so nothing slips through.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, dirname, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: email-marketing · ${label}\n${BRAND_LINE}\n`;
console.log(banner("validate-email.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const htmlArg = opt("html");
const subject = opt("subject", "");
const preheader = opt("preheader", "");
if (!htmlArg) {
  console.error("Usage: node validate-email.mjs --html email.html --subject \"Subject line\" [--preheader \"…\"] [--out validation-report.md]");
  process.exit(2);
}

const CWD = process.cwd();
const HTML_PATH = resolve(CWD, htmlArg);
const html = readFileSync(HTML_PATH, "utf8");
const outPath = resolve(CWD, opt("out", join(dirname(HTML_PATH), "validation-report.md")));
const plainTxtPath = join(dirname(HTML_PATH), "plain.txt");
const hasPlainTxt = existsSync(plainTxtPath);

// --- blocklists ---------------------------------------------------------------
// Hard triggers: auto-FAIL. Soft triggers: WARN (context-dependent, but flag).
const HARD_WORDS = [
  "act now", "urgent", "limited time", "last chance", "don't delay", "expires",
  "hurry", "guaranteed", "risk-free", "no cost", "make money", "earn cash",
  "double your income", "cash bonus", "win a", "winner",
  "amazing", "miracle", "shocking", "life-changing", "free trial",
  "verify your account", "confirm your identity", "dear friend",
  "dear customer", "wire transfer", "social security",
];
const SOFT_WORDS = [
  "free", "100%", "credit card", "secret", "unlock", "game-changer", "supercharge",
  "level up", "unleash", "boost", "empower", "revolutionize", "leverage",
  "transform your", "incredible", "click here", "read more", "unbelievable",
  "once in a lifetime", "act immediately", "act fast", "do it today",
  "exclusive deal", "final notice",
];
// Word-boundary matcher — "free" must NOT flag "freedom"/"freely", "secret"
// must NOT flag "secretary", etc. "$$$" is special (no \b, $ is a regex char).
const boundaryHit = (text, words) =>
  words.filter((w) => {
    if (w.includes("$")) return text.includes(w);
    return new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text);
  });
const ALL_CAPS_RE = /\b[A-Z]{4,}\b/g; // SCREAMING words
const BANG_RE = /!{2,}|\?{2,}/g;

// --- strip helpers ------------------------------------------------------------
const stripTags = (s) =>
  s.replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");

const stripUrls = (s) => s.replace(/https?:\/\/[^\s"'<>)]+/gi, " ").replace(/www\.[^\s"'<>)]+/gi, " ");

// --- subject-line checks ------------------------------------------------------
const subjChecks = [];
const checkSubject = () => {
  const len = subject.length;
  if (!subject) {
    subjChecks.push({ level: "FAIL", label: "Subject line", detail: "No --subject provided — an email without a subject can't be validated." });
    return;
  }
  if (len < 10) subjChecks.push({ level: "WARN", label: "Subject length", detail: `Only ${len} chars — very short. Consider a more specific hook (aim 33–50).` });
  else if (len > 50) subjChecks.push({ level: "WARN", label: "Subject length", detail: `${len} chars — longer than 50; mobile cuts off ~33–40 chars. Front-load the hook and shorten.` });
  else subjChecks.push({ level: "PASS", label: "Subject length", detail: `${len} chars — in the 33–50 sweet spot.` });

  const upper = subject.replace(/[^A-Za-z]/g, "");
  const capsRatio = upper ? (subject.match(/[A-Z]/g) || []).length / upper.length : 0;
  if (capsRatio > 0.6) subjChecks.push({ level: "FAIL", label: "Subject ALL-CAPS", detail: `Looks SHOUTY (${Math.round(capsRatio * 100)}% uppercase). Rewrite in normal case.` });

  const bangs = subject.match(BANG_RE);
  if (bangs) subjChecks.push({ level: "FAIL", label: "Subject punctuation", detail: `Found ${bangs.join(" ")} — exclamation/question stacks trigger spam filters.` });

  const lower = subject.toLowerCase();
  const hardHit = boundaryHit(lower, HARD_WORDS);
  if (hardHit.length) subjChecks.push({ level: "FAIL", label: "Subject spam trigger", detail: `Found: ${hardHit.join(", ")}. Replace with specific, honest phrasing.` });
  const softHit = boundaryHit(lower, SOFT_WORDS);
  if (softHit.length) subjChecks.push({ level: "WARN", label: "Subject soft trigger", detail: `Found: ${softHit.join(", ")} — evaluate context; likely replace.` });

  const capsWord = subject.match(ALL_CAPS_RE);
  if (capsWord) subjChecks.push({ level: "WARN", label: "Subject SHOUTY word", detail: `Found: ${capsWord.join(", ")}.` });
};

// --- body checks ---------------------------------------------------------------
const bodyChecks = [];
const bodyText = stripTags(html).trim();
const lowerBody = bodyText.toLowerCase();

const checkBodySpam = () => {
  const hardHit = boundaryHit(lowerBody, HARD_WORDS);
  if (hardHit.length) bodyChecks.push({ level: "FAIL", label: "Body spam trigger", detail: `Found: ${hardHit.join(", ")}. Rewrite — these are filter red flags.` });

  const softHit = boundaryHit(lowerBody, SOFT_WORDS);
  if (softHit.length) bodyChecks.push({ level: "WARN", label: "Body soft trigger", detail: `Found: ${softHit.join(", ")} — check each in context.` });

  // Run the ALL-CAPS check on URL-stripped text so uppercase URL segments
  // (EXAMPLE.COM) and addresses don't produce spurious warnings.
  const capsWords = stripUrls(bodyText).match(ALL_CAPS_RE) || [];
  const screaming = capsWords.filter((w) => w.length >= 5 && !["HTTP", "HTTPS", "WWW"].includes(w.toUpperCase()));
  if (screaming.length) bodyChecks.push({ level: "WARN", label: "Body ALL-CAPS", detail: `SHOUTY words: ${screaming.join(", ")} — use sparingly (a button label is OK).` });

  const bangs = bodyText.match(BANG_RE);
  if (bangs && bangs.length > 2) bodyChecks.push({ level: "WARN", label: "Body punctuation", detail: `${bangs.length} exclamation/question stacks — tone down to one or zero.` });

  // Link text "click here"-style generic anchors
  const genericAnchors = (html.match(/<a\b[^>]*>([^<]{1,30})<\/a>/gi) || [])
    .map((a) => a.replace(/<[^>]+>/g, "").trim().toLowerCase())
    .filter((t) => /^(click here|read more|learn more|here|this link|more|go here|find out more)$/.test(t));
  if (genericAnchors.length) bodyChecks.push({ level: "WARN", label: "Generic link text", detail: `Found: "${genericAnchors.join('", "')}" — use descriptive anchors ("See the case study").` });
};

const checkLinks = () => {
  const links = html.match(/<a\b[^>]*href="([^"]*)"/gi) || [];
  const external = links.filter((l) => /https?:\/\//i.test(l));
  if (external.length > 3) bodyChecks.push({ level: "WARN", label: "Link count", detail: `${external.length} external links — keep the core email to 1–3 to protect deliverability (footer links often don't count toward this).` });
  const shorteners = links.filter((l) => /bit\.ly|tinyurl|t\.co|goo\.gl|buff\.ly/i.test(l));
  if (shorteners.length) bodyChecks.push({ level: "FAIL", label: "URL shorteners", detail: "Found shortened URLs — they raise spam scores. Use full destination URLs." });
  const jsHref = links.filter((l) => /javascript:/i.test(l));
  if (jsHref.length) bodyChecks.push({ level: "FAIL", label: "JavaScript links", detail: "javascript: hrefs are stripped/blocked by filters — use real URLs." });
};

const checkImages = () => {
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  if (!imgs.length) return;
  const noAlt = imgs.filter((i) => !/alt=["']/i.test(i));
  if (noAlt.length) bodyChecks.push({ level: "FAIL", label: "Image alt text", detail: `${noAlt.length}/${imgs.length} <img> tags missing alt — required for deliverability + accessibility.` });
  const noWidth = imgs.filter((i) => !/\bwidth=/i.test(i));
  if (noWidth.length) bodyChecks.push({ level: "WARN", label: "Image dimensions", detail: `${noWidth.length} image(s) missing width/height — set them to avoid layout shift and filter flags.` });
};

const checkTextRatio = () => {
  // Text:image ratio heuristic — visible text words vs <img> count (rough proxy).
  const visibleText = stripUrls(bodyText);
  const words = visibleText.split(/\s+/).filter(Boolean).length;
  const imgs = (html.match(/<img\b/gi) || []).length;
  if (imgs === 0) return; // no images = fine
  const ratio = words / imgs;
  if (ratio < 20) bodyChecks.push({ level: "FAIL", label: "Text:image ratio", detail: `Only ~${words} words for ${imgs} image(s) — image-heavy emails look like ads. Aim for ≥ 50% text (heuristic: ≥ 20 words per image).` });
  else if (ratio < 40) bodyChecks.push({ level: "WARN", label: "Text:image ratio", detail: `~${words} words / ${imgs} images — OK, but more text would help.` });
};

const checkCompliance = () => {
  const lower = lowerBody;
  const hasUnsub = /unsubscribe/i.test(html) || /{{[^}]*unsub[^}]*}}/i.test(html);
  if (hasUnsub) bodyChecks.push({ level: "PASS", label: "Unsubscribe link", detail: "Found an unsubscribe reference — verify it's the ESP's global unsubscribe merge-tag." });
  else bodyChecks.push({ level: "FAIL", label: "Unsubscribe link", detail: "No unsubscribe found. Every commercial email needs a visible unsubscribe link (ESP merge-tag)." });

  const hasAddress =
    (/\b\d{1,5}\s+[A-Za-z]/.test(bodyText) && /(street|st\.|avenue|ave\.|road|rd\.|lane|ln\.|drive|dr\.|boulevard|blvd|place|pl\.|court|ct\.|suite|ste\.|floor|flr\.|plaza|city|town|zip|postal|code)\b/i.test(bodyText)) ||
    /{{[^}]*addr[^}]*}}/i.test(html); // ESP address merge-tag (e.g. {{company_address}})
  if (hasAddress) bodyChecks.push({ level: "PASS", label: "Physical address", detail: "Looks like a postal address or address merge-tag is present in the footer — confirm it's complete." });
  else bodyChecks.push({ level: "FAIL", label: "Physical address", detail: "No physical postal address found in the footer. CAN-SPAM requires one on every commercial email." });

  const hasPermission = /you'?re receiving this|you are receiving this|because you (opted|signed|joined|subscribed)|you opted in|email preferences/i.test(lower);
  if (hasPermission) bodyChecks.push({ level: "PASS", label: "Permission line", detail: "Found the 'why you're getting this' line — great for trust + deliverability." });
  else bodyChecks.push({ level: "WARN", label: "Permission line", detail: "No 'You're receiving this because…' line — add one to build trust and reduce complaints." });

  const hasFromName = /{{[^}]*first[^}]*}}|{{[^}]*name[^}]*}}|Hi\s+{{|Dear\s+{{/i.test(html);
  if (hasFromName) bodyChecks.push({ level: "PASS", label: "Personalization", detail: "Personalization tag found (swap to your ESP's syntax)." });
};

const checkEeAt = () => {
  const hasAuthor = /\b(founder|ceo|head of|product|marketing|editor|author|—\s*[A-Z][a-z]+\s+[A-Z][a-z]+|sincerely|thanks,?\s+[A-Z][a-z]+)/i.test(bodyText);
  if (hasAuthor) bodyChecks.push({ level: "PASS", label: "EEAT: named author", detail: "Found a real-name / role signal in the copy or sign-off." });
  else bodyChecks.push({ level: "WARN", label: "EEAT: named author", detail: "No named author/role found — sign the email from a real person (name + role + link)." });

  const hasProof = /(\d{1,3}(\.\d+)?%|\$\d[\d,]*|(in|over|under|per|across|for)\s+\d+|\d+\s+(users|customers|teams|clients|signups|people|reads))|\btested\b|\bmeasured\b|\bstudy\b|\bcase study\b|\breport\b|\baccording to\b|\bsource\b/i.test(bodyText);
  if (hasProof) bodyChecks.push({ level: "PASS", label: "EEAT: real proof", detail: "Found a specific metric / named source / study reference — keep it accurate and linkable." });
  else bodyChecks.push({ level: "WARN", label: "EEAT: real proof", detail: "No metric, testimonial, or named source found. Add at least one piece of real proof." });

  // Note: no bare double-quote — any random quoted phrase would trivially pass.
  const hasSocial = /(testimonial|review|“|★|rated|rating|quote|says?\s+[A-Z]\w+)/i.test(bodyText);
  if (hasSocial) bodyChecks.push({ level: "PASS", label: "EEAT: social proof", detail: "Testimonial / review signal found." });
  else bodyChecks.push({ level: "WARN", label: "EEAT: social proof", detail: "No testimonial/review signal — a short real quote adds trust (verify it's genuine)." });

  const reply = html.match(/<a\b[^>]*href="mailto:([^"]+)"/i);
  if (reply) bodyChecks.push({ level: "PASS", label: "EEAT: human reply-to", detail: `mailto: link present (${reply[1]}) — or set Reply-To to a human in the ESP.` });
  else bodyChecks.push({ level: "WARN", label: "EEAT: human reply-to", detail: "No mailto: link — set Reply-To to a real person's inbox in the ESP." });
};

const checkHtmlRobustness = () => {
  if (/<script\b/i.test(html)) bodyChecks.push({ level: "FAIL", label: "JavaScript", detail: "<script> found — scripts are stripped by email clients and raise filter flags. Remove." });
  if (/<form\b/i.test(html)) bodyChecks.push({ level: "FAIL", label: "Forms", detail: "<form> found — forms don't work in email. Use a button linking to a landing page." });

  if (/@media\s*\(prefers-color-scheme\s*:\s*dark\)/i.test(html)) bodyChecks.push({ level: "PASS", label: "Dark mode", detail: "Dark-mode media query present." });
  else bodyChecks.push({ level: "WARN", label: "Dark mode", detail: "No dark-mode block — add @media (prefers-color-scheme: dark) so the email isn't unreadable for dark-mode users." });

  if (/color-scheme/i.test(html)) bodyChecks.push({ level: "PASS", label: "Color-scheme meta", detail: "color-scheme meta present." });
  else bodyChecks.push({ level: "WARN", label: "Color-scheme meta", detail: "Add <meta name='color-scheme' content='light dark'> + supported-color-schemes." });

  // Table-based layout present?
  const tables = (html.match(/<table\b/gi) || []).length;
  if (tables >= 2) bodyChecks.push({ level: "PASS", label: "Table layout", detail: `Found ${tables} <table>s — table-based layout is the email-safe approach.` });
  else bodyChecks.push({ level: "WARN", label: "Table layout", detail: "Few/no layout tables — email clients (esp. Outlook) need table-based layout, not divs." });

  const inlineStyles = (html.match(/style=/gi) || []).length;
  if (inlineStyles >= 5) bodyChecks.push({ level: "PASS", label: "Inline styles", detail: "Inline styles present (correct for email)." });
  else bodyChecks.push({ level: "WARN", label: "Inline styles", detail: "Very few inline styles — Gmail strips <head> styles; put critical styles inline." });

  // Preheader (hidden text near the top of <body>) — detect a display:none /
  // mso-hide element containing ≥ ~10 chars of real text, or an explicit
  // preheader class/id/comment.
  const preheaderHint =
    /style="[^"]*display:\s*none[^"]*"[^>]*>\s*\S{10,}/.test(html) ||
    /class="preheader"|id="preheader"/i.test(html) ||
    /<!--\s*preheader/i.test(html);
  if (preheader || preheaderHint) bodyChecks.push({ level: "PASS", label: "Preheader", detail: "Preheader text detected." });
  else bodyChecks.push({ level: "WARN", label: "Preheader", detail: "No preheader found — the preheader is the 'second subject line' and lifts opens. Add one (40–90 chars)." });

  // Absolute image URLs
  const imgs = html.match(/<img\b[^>]*src="([^"]*)"/gi) || [];
  const relative = imgs.filter((i) => /src="(?![a-z]+:|\/\/|data:)/i.test(i));
  if (relative.length) bodyChecks.push({ level: "FAIL", label: "Image URLs", detail: `${relative.length} image(s) use relative paths — must be absolute URLs for the live send (local paths only OK for the local preview).` });
};

const checkPlainTxt = () => {
  if (hasPlainTxt) bodyChecks.push({ level: "PASS", label: "Plain-text version", detail: "plain.txt found next to the HTML — include it (or the ESP's auto version) in the send." });
  else bodyChecks.push({ level: "WARN", label: "Plain-text version", detail: "No plain.txt found — provide one or use the ESP's auto-generated plain-text version (some filters flag HTML-only)." });
};

// --- run + report --------------------------------------------------------------
checkSubject();
checkBodySpam();
checkLinks();
checkImages();
checkTextRatio();
checkCompliance();
checkEeAt();
checkHtmlRobustness();
checkPlainTxt();

const all = [...subjChecks, ...bodyChecks];
const fails = all.filter((c) => c.level === "FAIL");
const warns = all.filter((c) => c.level === "WARN");
const passes = all.filter((c) => c.level === "PASS");
const score = Math.max(0, Math.round(100 - fails.length * 12 - Math.min(warns.length * 4, 30)));

const lines = [];
lines.push(`# Email Validation Report`);
lines.push(`\n**File:** \`${basename(HTML_PATH)}\` · **Subject:** \`${subject || "(none)"}\`${preheader ? ` · **Preheader:** \`${preheader}\`` : ""}`);
lines.push(`\n**Score: ${score}/100** · ${fails.length} FAIL · ${warns.length} WARN · ${passes.length} PASS`);
lines.push(fails.length === 0 ? "**Verdict:** fix WARNs → preview → auditor sign-off → send." : "**Verdict:** NOT READY — fix every FAIL before preview/send.");
lines.push("\n## FAIL (must fix)");
lines.push(fails.length ? fails.map((c) => `- **${c.label}:** ${c.detail}`).join("\n") : "- none ✅");
lines.push("\n## WARN (check each)");
lines.push(warns.length ? warns.map((c) => `- **${c.label}:** ${c.detail}`).join("\n") : "- none ✅");
lines.push("\n## PASS");
lines.push(passes.length ? passes.map((c) => `- **${c.label}:** ${c.detail}`).join("\n") : "- none");
lines.push("\n---\n*Generated by `validate-email.mjs` — heuristic lint only. Final sign-off: auditor subagent (copy, EEAT strength, visual render at 600px + 320px + dark mode).*");

writeFileSync(outPath, lines.join("\n"), "utf8");

console.log(`📋 ${basename(HTML_PATH)} — score ${score}/100 (${fails.length} FAIL, ${warns.length} WARN, ${passes.length} PASS) → ${outPath}`);
for (const c of fails) console.log(`  ✗ [${c.label}] ${c.detail}`);
for (const c of warns) console.log(`  ! [${c.label}] ${c.detail}`);
process.exit(fails.length ? 1 : 0);
