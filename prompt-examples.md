# Prompt Examples — deepak-skill 🎬

Copy-paste any prompt below into your agent (Claude Code, Cursor, Codex, Gemini CLI, …) once the skills are installed. Every video prompt runs through the **`video-product-pipeline`**: trend research → brainstorm + viral scorecard → `video-product.md` → **your approval** → generate → audit. Web-app prompts (section 11) run through **`vibe-code-webapp`** instead: expert research → SaaS validator → `PRD.md` + design source (Figma/Stitch) + AI rails → **your approval** → build → audit. Email prompts (section 12) run through **`email-marketing`**: subject-line pack → bulletproof HTML + plain text → spam/compliance validation → preview → auditor sign-off. Long-form + brand prompts (section 13) run through **`podcast-to-shorts` / `youtube-video-pipeline` / `blog-seo-content` / `linkedin-personal-brand`**: score → approve → generate → audit. Google Flow/Veo scene-prompt prompts (section 14) run through **`veo-cinematic-reels`**: character sheet → scene script → self-verified copy-paste prompt pack → **audit harness** (audit-reels.mjs + reel-auditor subagent). Episodic story-series prompts (section 17) run through **`serial-story-reels`**: story bible (arc validated) → character sheets → per-episode prompt pack + voiceover sheet, all self-verified → **audit harness**. AI-photoshoot prompts (section 15) run through **`photoshoot-studio`**: subject sheet → shot list → self-verified copy-paste image prompt pack (person + product modes, edit/inpaint prompts) → **audit harness**. Social-media content-plan prompts (section 18) run through **`social-media-content-plan`**: Platform Wizard (3 questions) → per-platform playbook → strategy + pillars + 30-day calendar → engagement protocol + metrics loop → **audit harness**. X-growth prompts (section 19) run through **`x-growth`**: growth goal + ONE niche → weekly growth content plan (3+ pillars, KPIs, cadence) → 7+ drafted single posts (hook → value → story/proof → CTA/loop mix) → **zero hashtags** (a single `#` fails the plan) → `post-writer.mjs` enforces 280-char caps + anti-fluff → engagement schedule (reply-first hour, quote posts, DMs) → **audit harness**. Newsletter prompts (section 20) run through **`newsletter-growth`**: subject formula (≤ 60 chars) → story-first issue plan (open loop → stakes → payoff → ONE CTA + growth plug) → `issue-writer.mjs` enforces the word window + anti-fluff → `growth-plan.md` (welcome sequence, referral loop, cross-promos) → **audit harness**. MCP + AI-agent prompts (section 21) run through **`mcp-agent-builder`**: discovery interview → `mcp-prd.md` → `mcp-architecture.md` (ONE deployment model) → `scaffold-server.mjs` generates a runnable `@modelcontextprotocol/sdk` server from `mcp-plan.json` → `agent-design.md` + `ide-cli-matrix.md` → **audit harness**. Ebook prompts (section 22) run through **`ebook-builder`**: **author memory + taste first** — `ebook-memory.md` (identity, voice fingerprint, design defaults, past builds) read at Stage 0 and written back at Stage 8, so copy matches the author's voice with zero banned words → the **design picker** locks ONE of six layouts (Editorial Classic / Modern Bold / Minimal Luxury / Playful Pop / Technical Dark / Nature Calm) + ONE of 30 palettes + accent/type + ONE of 6 cover styles + ONE motif family + mood/texture → `ebook.html` deck (data-layout + data-palette + data-motif on every page) → Mode 1 browser render (A4 PDF + cover + page PNGs) or Mode 2 image-model prompts (design-token photoreal cover + interior scenes) → **audit harness** (incl. memory/taste checks + voice match). Thumbnail prompts (section 23) run through **`thumbnail-studio`**: CTR teardown of the niche → 3–5 variants (ONE idea + ≤ 5-word overlay + 1280×720 photoreal prompt, verified by `thumbnail-prompts.mjs`) → A/B plan with niche CTR benchmarks → **audit harness**. Repurposing prompts (section 24) run through **`content-repurposing-hub`**: one source → per-platform NATIVE pieces (no copy-paste reposts, anti-repost hook check by `repurpose-writer.mjs`) → staggered calendar → delegates to the producer skills → **audit harness**. Sponsorship prompts (section 25) run through **`sponsorship-pipeline`**: media kit + `rate-card.mjs` (niche CPM/RPM benchmarks, honest ranges) + personalized outreach (FTC disclosure, zero placeholders) + tracking → **audit harness**. Positioning prompts (section 27) run through **`positioning-studio`**: **author memory + taste first** → one-liner (≤ 15 words) + messaging hierarchy (audience → problem → promise → proof) + ≥ 3 proof points + ≥ 3 taglines + voice guide (banned words from the taste profile) → `message-map.md` (same message per channel) → **audit harness** (incl. memory/taste checks + voice match). Prompt-library prompts (section 28) run through **`prompt-engineering`**: voice rules from the taste profile → framework prompts (role → context → task → format → constraints) → test loop with a verdict per prompt → **audit harness**. AI-automation prompts (section 29) run through **`ai-automation`**: honest automation-worthiness gate → trigger → steps with tool/input/output contracts → human checkpoints on irreversible actions → cost estimate → build handoff (mcp-agent-builder / vibe-code-webapp / prompt-engineering) → **audit harness**. **Every skill ends in the same audit-harness pattern** — an `audit-*.mjs` automated check → `*-audit.md` → a fresh `<skill>-auditor` subagent scores worthiness (/50, ≥ 35) and signs PASS / FIX NEEDED before delivery. Paid-ad prompts (section 16) run through **`paid-ads-studio`**: forecast first → product-block consistency tokens → self-verified Veo 3.1 video + image ad prompt pack → char-limit-safe copy → Meta + Google campaign blueprint → cost plan → compliance checklist → launch checklist.

Two rules that make these prompts work:

1. **Sloppy prompts still work.** The skill asks ≤3 clarifying questions, fills defaults (15s, Kokoro voice, style by niche), and rewrites weak copy into a hook — then shows you the `video-product.md` spec before rendering anything.
2. **The more you specify, the better the reel.** Niche + audience + duration + style + hook direction beats a one-liner every time.

---

## The anatomy of a premium prompt

| Element | Example | Default if missing |
|---|---|---|
| **Niche / topic** | SaaS onboarding, AI tools, web dev life | asked |
| **Audience** | startup founders, indie hackers, devs | general |
| **Duration** | 15s, 20s, 30s | 15s |
| **Style / format** | word-pop · highlighter · 3d-editorial · card-listicle · chat-thriller · svg-ambient · micro-fiction · quiz-trap · day-counter · notification-drop · thread-court | by niche |
| **Hook direction** | "stop the scroll with a stat" | trend-brief winner |
| **Assets** | `assets/clips/…` folder (video-asset-reels) | text-only |
| **Voice / music** | kokoro am_fenrir (deep male), CC0 bed | kokoro am_fenrir, no bed |
| **Platform** | Reels / TikTok / Shorts | all (caption pack) |

### Blank template (fill the brackets)

> Using the **video-product-pipeline** skill, make a `{15}`-second reel about `{niche}` for `{audience}`. Style: `{format}`. Hook direction: `{optional}`. `{Add a Kokoro voiceover. | No voice, just text.}` `{Use the clips in assets/… | Text-only.}` Platform: `{TikTok / Reels / Shorts}`. Goal: `{saves / shares / signups / follows}`.

---

## 1. SaaS company 🏢

*Best formats:* word-pop (hottakes, metrics), card-listicle (pricing/rules), highlighter (explainers), day-counter (founder growth metrics).

| Prompt | Type |
|---|---|
| "make a vid for my saas" | sloppy |
| "15s reel for our SaaS onboarding tool — audience: startup founders who hate setup. Hook: 'Your onboarding is leaking users.' Style: word-pop, Kokoro voice, no music. Goal: signups." | premium |
| "3 SaaS pricing mistakes founders make — card-listicle, 15s, hook: 'Pricing wrong = dead startup.' Save-bait ending." | premium |
| "Day-counter 18s: 'MRR from $0 to $40k in 90 days' — count-up numerals, self-drawing chart, milestone rows, confetti on the final number, save-bait end card." | premium |

**Idea sparks:** onboarding → churn → revenue stat hooks · "the pricing page trick agencies hate" · founder 0→1 story (results-first) · "SaaS metrics that actually matter" (highlighter receipts) · feature-drop reveal (svg-ambient, luxury).

## 2. AI niche 🤖

*Best formats:* highlighter (tool explainers), card-listicle (tool stacks), chat-thriller (AI stories), micro-fiction (AI sci-fi stories), word-pop (hot takes).

| Prompt | Type |
|---|---|
| "ai video" | sloppy |
| "Highlighter-style 15s: 'AI tools that feel illegal to know' — audience: creators, psychology angle (why AI feels like cheating), numbered cards, stat count-ups, Kokoro voice." | premium |
| "Chat-thriller 18s: 'I asked an AI to run my life for 30 days' — reddit-story energy, typing dots, cliffhanger loop ending." | premium |
| "Micro-fiction 20s: 'A wrong number text from the year 2045…' — word-by-word reveal, red flash on the twist, 'TO BE CONTINUED' stinger, Part 2 comment bait." | premium |

**Idea sparks:** "your AI prompt is weak — do this" · "AI workflow in 60 seconds" · "the agent that does your boring job" · "don't build a wrapper, do this instead" (contrarian).

## 3. Web developer life 💻

*Best formats:* chat-thriller (war stories), notification-drop (dev humor), card-listicle (tips), word-pop (hot takes), svg-ambient (aesthetic).

| Prompt | Type |
|---|---|
| "dev reel" | sloppy |
| "Chat-thriller 15s from my screenshots: 'the moment production broke at 2am' — dev humor, bold captions, typing suspense, cliffhanger ending." | premium |
| "Notification-drop 15s: '[New message] deploy on Friday?' — phone banners dropping with witty takes, punchline shake, relatable dev pain." | premium |
| "3 CSS habits that instantly make you look senior — card-listicle, 15s, hook: '#3 feels illegal.' Save-bait final frame." | premium |

**Idea sparks:** "deploy on Friday? watch this" · "junior vs senior code review" (chat-thriller) · "your portfolio is bad and here's why" (contrarian) · "the 10x dev myth" · aesthetic "code is art" (svg-ambient).

## 4. Money & personal finance 💰

*Best formats:* word-pop (rules), card-listicle (lists), day-counter (debt-free / savings timelines), highlighter (stats with receipts).

| Prompt | Type |
|---|---|
| "money reel" | sloppy |
| "15s word-pop: 'Your savings are leaking. Fix these 3 rules.' — audience: people in debt, calm Kokoro voice, dark bg + neon accent, save-bait CTA." | premium |
| "Highlighter 20s: 'The 60/30/10 rule, with receipts' — stat count-ups, monospace labels, cream + yellow palette." | premium |
| "Day-counter 20s: 'I paid off $28k of debt in 18 months' — DAY counter counting up, chart draw, milestone rows, emerald accents, end card 'Day 1 vs Day 540' save-bait." | premium |

**Idea sparks:** debt-free stories (results-first) · "nobody told you about compound interest" · "how banks actually make money" (contrarian) · "3 money rules that feel illegal to know" (listicle).

## 5. Psychology & facts 🧠

*Best formats:* highlighter (facts/studies), quiz-trap (riddles / "only 2% can"), word-pop (micro-lessons).

| Prompt | Type |
|---|---|
| "psychology facts reel" | sloppy |
| "Highlighter 15s: 'Your brain does this every time you scroll' — one study per beat, count-up stats, yellow highlighter sweeps, curiosity-gap hook." | premium |
| "Quiz-trap 15s: 'Only 2% can spot the hidden word in 3 seconds' — countdown ring drain, option cards, green/red reveal flash, rewatch loop, 'how many did you get?' comment CTA." | premium |

**Idea sparks:** cognitive biases that sell to you · "why you procrastinate (it's not laziness)" · "the dopamine loop explained" · "fake it till you make it — the science" (contrarian).

## 6. Mindset & motivation 🌅

*Best formats:* 3d-editorial (quiet luxury), svg-ambient (aesthetic), word-pop (punchy).

| Prompt | Type |
|---|---|
| "motivational reel" | sloppy |
| "3d-editorial 15s: 'Mastery is subtraction.' — dark minimal, champagne accents, film grain, slow camera push, loop ending, deep male Kokoro voice (am_fenrir)." | premium |

**Idea sparks:** stoic one-liners · "things I wish I knew at 20" · "you're not lazy, you're exhausted" (validation hook) · "quiet quitting your own life".

## 7. Health & fitness 💪

*Best formats:* word-pop (rules), card-listicle (lists), highlighter (science).

| Prompt | Type |
|---|---|
| "fitness reel" | sloppy |
| "15s word-pop: '3 gym rules nobody tells beginners' — bold white on black, neon highlight on 'nobody', fast cuts, CTA: save this." | premium |

**Idea sparks:** "the 5-minute workout that works" · "why you plateau" (science) · "bodybuilder vs beginner mindset" · "walking is underrated" (contrarian).

## 8. Marketing / freelancing / growth 📈

*Best formats:* word-pop (hottakes), card-listicle (frameworks), highlighter (case studies).

| Prompt | Type |
|---|---|
| "marketing reel" | sloppy |
| "word-pop 15s: 'Stop running ads that don't convert' — audience: small business owners, PAS hook, before/after beats, Kokoro am_adam voice, no music." | premium |

**Idea sparks:** "the hook formula agencies charge $5k for" · "your offer is weak" (pain-first) · "how I went 0→10k followers" (results-first) · "3 pricing psychology tricks".

## 9. Storytime / Reddit / drama 🍿

*Best formats:* chat-thriller (always), thread-court (AITA-style verdicts), montage (screenshots).

| Prompt | Type |
|---|---|
| "reddit story reel" | sloppy |
| "Chat-thriller 20s from the screenshots in assets/story/: 'I read this and couldn't sleep' — typing suspense, read receipts, cliffhanger final bubble that forces a rewatch." | premium |
| "Thread-court 20s: 'AITA for refusing to invite my sister to my wedding?' — post card, upvote count-up, comment reaction slides, VERDICT stamp slam, red/green flash, 'what's your verdict?' comment CTA." | premium |

**Idea sparks:** roommate/office drama · "my first client ghosted me" · "the message I should never have sent".

## 10. E-commerce / product aesthetic 📦

*Best formats:* svg-ambient (brand), video-asset-reels aesthetic style (product shots).

| Prompt | Type |
|---|---|
| "product video" | sloppy |
| "Turn the 5 product photos in assets/products/ into a 12s aesthetic reel — luxury lower-third captions, champagne accents, slow push-ins, calm Kokoro voice, 4K." | premium |

**Idea sparks:** unboxing reveal · "designed in a garage" origin story · feature close-ups with macro pacing · limited-drop urgency (word-pop).

---

## 11. Vibe-coded web apps 🧱

*Runs through **`vibe-code-webapp`**: cross-project taste loaded (`creator-portfolio.md`) → detailed idea interview (+ existing-project scan if the folder already has code) → **expert research** (`research-playbook.md`: signals + competitor teardown + TAM/SAM/SOM + channels + pricing + positioning) → **SaaS validator** (`saas-validator.md` + `saas-score.mjs` → `validation.md`: /35 verdict + kill criteria + unit economics + kill guardrail + validation moves) → **build pack assembled from ONE validated JSON** (`pack-builder.mjs` → `PRD.md` + stack blueprint — with a **design source of truth**: Figma via the Figma Developer MCP, Google Stitch `DESIGN.md`, or the open-source pack (`frontend-design.md`); plus **AI rails** when the PRD has AI (`ai-logic.md`) — + **`sitemap.md`** + handoff prompts) + **`TODO.md`** (P0/P1/P2 via `todo.mjs`) → approval of pack AND todo → build **step by step** from `vibe-coder-instructions.md` (BUILD.md, golden loop + design parity) with a detailed `build-report.md` per session + stage tracker (`progress.mjs`) → production audit (`--payments`/`--ai`) → **everything-auditor** final review (app + plan + instructions + memory + reports → hardening/tests/brainstorming) → **scripted deploy** (`deploy-setup.mjs` → host config + CI + filled runbook) + **packaged handoff** (`package-deliverable.mjs` → HANDOFF.md + manifest.json + ZIP) → daily `MEMORY.md` log.*

| Prompt | Type |
|---|---|
| "build me an app for productivity" | sloppy |
| "Vibe-code a SaaS: invoices freelancers actually get paid on — Next.js + Supabase + Stripe, $12/mo. Run the full pipeline (research → validate → PRD → approve → build → audit)." | premium |
| "SaaS validator only: is a local-business review widget worth building? Follow saas-validator.md — score with evidence, run saas-score.mjs, check kill criteria + unit economics, write validation.md. Be brutally honest." | validate only |
| "Existing project: add subscriptions to my app — scan it first, then interview me for what to change, then pack + TODO and wait for my approval." | existing project |
| "Design-first: here's my Figma link — connect the Figma Developer MCP, extract the real tokens, and build the pack from the actual design (frontend-design.md)." | design-first (Figma) |
| "No design yet — generate one with Google Stitch from the sitemap pages, map DESIGN.md into the design system, then write the pack." | design-first (Stitch) |
| "Start from memory: read MEMORY.md and continue the build from where we left off." | memory (daily) |
| "Build a landing page + waitlist for my AI-meeting-notes idea — Vite + Tailwind, SEO + analytics ready, deploy to Vercel. Skip payments." | premium (non-SaaS) |
| "The PRD has a chat copilot — lock the AI rails (ai-logic.md): streaming, stop/abort, cost caps, evals, then build and audit with --ai." | AI features |
| "Keep the vibe loop going: from my current app state + TODO list, build the next highest-priority open task, run it, commit." | iterate |
| "Final review: spawn the everything-auditor — check the app, the plan, the instructions, memory and reports, then apply hardening + test fixes, brainstorm next ideas, and suggest skill improvements." | final review |

**Idea sparks:** "freelancer payment pain" · "AI tool for X" (use the AI rails) · "internal tool that kills a spreadsheet" · "waitlist-first SaaS" · "the app nobody built well yet" · "I have a Figma file — build from it".

## 12. Email marketing ✉️

*Runs through **`email-marketing`**: plan (goal + audience + ESP + sender) → **subject-line pack** (3–5 high-CTR variants + A/B plan) → **bulletproof responsive `email.html`** (tables + inline CSS + dark mode + compliance footer) + **`plain.txt`** → **`validate-email.mjs`** (spam-trigger scan, CAN-SPAM compliance, E-E-A-T signals → `validation-report.md`) → **`preview-email.mjs`** desktop + mobile screenshots → auditor subagent sign-off → deliverable folder.*

| Prompt | Type |
|---|---|
| "write me an email" | sloppy |
| "Write a product-launch email for our SaaS — audience: existing customers, goal: demo clicks, ESP: Brevo. Spam-free, high-CTR subject lines, strong E-E-A-T (real author + proof)." | premium |
| "Promo email for our Black Friday sale — audience: warm leads who opened last month, goal: sales. No fake urgency, honest deadline, physical address + unsubscribe in the footer." | premium (promo) |
| "Welcome email for new signups — MailerLite, personalized with first name, one CTA, subject line under 50 chars. Make it feel like a real person wrote it." | premium (lifecycle) |
| "Newsletter issue #14 for a finance newsletter — hook-first, one metric with a source, author bio, one CTA. Goal: replies." | premium (newsletter) |
| "Why do our emails land in spam? Audit email.html with the email-marketing skill and fix everything that's failing." | audit/fix |
| "Give me 5 subject lines for an abandoned-cart email — recipient-specific, no spam words, under 50 chars, with an A/B plan." | subject lines only |

**Idea sparks:** product launches · welcome/onboarding flows · abandoned-cart recovery · weekly newsletters · Black Friday promos · event invitations · re-engagement win-back emails.

## 13. Long-form repurposing + LinkedIn ✂️🎥📝💼

*Runs through the four long-form/brand skills: **`podcast-to-shorts`** (transcript → virality-scored clips → FFmpeg 9:16 cuts + captions), **`youtube-video-pipeline`** (brief → script → 10-title pack → thumbnail brief → metadata), **`blog-seo-content`** (keyword cluster → approved brief → E-E-A-T article → meta pack), **`linkedin-personal-brand`** (voice capture → bio → weekly calendar → engagement strategy).*

| Prompt | Type |
|---|---|
| "turn my podcast into shorts" | sloppy |
| "Turn this 1-hour podcast episode into 5 viral shorts — transcript in assets/, cut them 9:16, hook + caption per clip." | premium (podcast→shorts) |
| "Plan a YouTube video: 3 SaaS pricing mistakes founders make — script (hook in 30s), 10 title options under 60 chars, thumbnail brief, description with chapters." | premium (YouTube) |
| "Write a blog post about saas onboarding that ranks AND gets cited by AI search — one keyword, EEAT-heavy (named author + cited stats), meta title/description pack. Approve the brief first." | premium (SEO) |
| "Help me build my LinkedIn presence — capture my voice from these 2 posts I wrote, rewrite my headline + About, and give me a week of posts with one CTA each." | premium (LinkedIn) |
| "Score this podcast transcript for the most viral moments — which 3 clips should I cut first?" | clips only |
| "Give me 10 YouTube titles for a video about {topic} — under 60 chars, 4+ formulas, no clickbait." | titles only |
| "Audit my LinkedIn bio — rewrite it in my voice with proof, no buzzwords, one CTA." | audit/fix |

**Idea sparks:** podcast episodes → 5 shorts/week · YouTube deep-dives repurposed into shorts · SEO article → email newsletter → LinkedIn threads (one idea, full stack).

## 14. Google Flow / Veo cinematic reels 🎬🎥

*Runs through **`veo-cinematic-reels`**: analyze + lock grade/world → **character sheet** (verbatim character/world/grade blocks + Nano Banana reference-image prompts) → **scene script** (hook → agitate → payoff → CTA/loop with continuity) → **prompts.md** — one **rich long-form copy-paste prompt per scene (~150–250 words)** that works in **any video generator** (Flow/Veo 3.1, Kling, Luma, Runway, Hailuo, Vidu, Pika, PixVerse), every prompt carrying the identical character block + grade token + IMAX token + world token, per-scene lens/tempo/lighting, native dialogue/SFX, a labeled **negative prompt** + locked **seed**, and per-tool upload instructions (Ingredients / Elements / image-to-video) — **self-verified** by `scene-prompts.mjs` (exits 1 on drift) → **audit harness**: `audit-reels.mjs` (per-scene token/verify/length/negative/seed/bridge/cinematic checks → `reels-audit.md`) + a fresh **reel-auditor subagent** scoring reel-worthiness (/50) and signing PASS / FIX NEEDED.*

| Prompt | Type |
|---|---|
| "make a veo reel" | sloppy |
| "Make a cinematic action reel — scenes + Google Flow prompts, same character in every scene, IMAX look, teal-orange grade, native dialogue. ~24s, 9:16." | premium (action) |
| "Veo reel for a luxury brand — 6 scenes, editorial grade, slow push-ins, one character in a signature outfit. Give me copy-paste prompts." | premium (luxury) |
| "Character sheet only: my character is a female marine biologist, tropical setting — 3 reference-image prompts for Nano Banana, verbatim block I can reuse." | character sheet only |
| "I have a reference image of the character — build a 30s emotional reel around her, keep her EXACTLY the same in all scenes." | premium (reference image) |
| "Audit my scene-plan.json — regenerate the prompt pack and flag any scene that drifts from the character block." | audit/fix |

**Idea sparks:** cinematic brand reels · action sequences · emotional storytelling · product hero reels · character-led series (same character, new episode each week).

## 15. AI photoshoots 📸🧍🛍️

*Runs through **`photoshoot-studio`**: analyze + lock grade/craft → **subject sheet** (verbatim person OR product block + Nano Banana reference-image prompts → upload as Flow Ingredients / Midjourney `--cref` / Flux reference) → **shot list** (hero → detail → lifestyle → closing) → **prompts.md** — one copy-paste image prompt per shot, every prompt carrying the identical subject block + grade token + craft token, **self-verified** by `shot-prompts.mjs` (exits 1 on drift), plus localized **`Edit:`** inpainting prompts → **audit harness**: `audit-shoot.mjs` (per-shot token/verify/aspect/edit checks → `shoot-audit.md`) + a fresh **shoot-auditor subagent** scoring shoot-worthiness (/50) and signing PASS / FIX NEEDED.*

| Prompt | Type |
|---|---|
| "give me photoshoot prompts" | sloppy |
| "AI photoshoot of a person — same face in EVERY shot: a 29-year-old startup founder, chestnut hair, cream blazer. Editorial look, 5 shots (hero, beauty close-up, full body, candid, environmental), 4:5, warm Kodak grade, edit prompts for background swaps." | premium (person) |
| "Product photoshoot prompts for my matte-black coffee tumbler (label reads BREW & CO · 500ML) — hero on white, floating with a water splash, detail macro, lifestyle on a desk, packaging flat-lay. High-key commercial grade, 1:1." | premium (product) |
| "Subject sheet only: female marine biologist, tropical field vibe — 3 reference-image prompts for Nano Banana + a verbatim block I can reuse in every shot." | subject sheet only |
| "I have reference photos of the person — build a 6-shot editorial pack around her, keep her EXACTLY the same in all shots, 5 different outfits + backgrounds, with an Edit prompt per shot." | premium (reference image) |
| "Audit my shoot-plan.json — regenerate the prompt pack and flag any shot that drifts from the subject block." | audit/fix |

**Idea sparks:** founder/creator editorial packs · model portfolios · beauty close-ups · product hero + floating + packaging sets · lifestyle in-use shots · brand campaign series (same product, new scene each shot).

## 16. Paid ad campaigns 📈💰

*Runs through **`paid-ads-studio`**: **Ads Wizard first** — for any "I want to create X ads" prompt the skill asks exactly **3 questions in order** (1. platform: Meta / Google / Both · 2. goal: Sales / Leads / Traffic · 3. budget + AOV, with defaults if skipped) before anything is built, then locks the brief → **forecast first** (`forecast-ads.mjs` — conservative/base/aggressive scenarios: impressions, clicks, conversions, CPA, ROAS, shown BEFORE any creative) → lock the **product block + grade + craft** consistency tokens (reference-image Ingredients) → **`prompts.md`** — copy-paste **Veo 3.1 video ad prompts** (9:16 Reels, 16:9 in-stream, 6s bumper) + **image ad prompts** (Nano Banana Pro / Midjourney / Flux at 1:1, 4:5, 1.91:1), every prompt carrying the verbatim product block, **self-verified** by `ad-prompts.mjs` (exits 1 on drift) → **`copy.md`** — hook-first copy inside Meta (≤125/≤40/≤30) and Google (≤30/≤90) char limits, anti-fluff enforced by `ad-copy.mjs` (exits 1 on violation) → **`campaign-blueprint.md`** (Meta ODAX + Advantage+ audiences · Google Demand Gen + PMax + Search) → **`cost-plan.md`** (ramp, learning phase, kill/scale rules) → **`guidelines-checklist.md`** (2026 AI-content compliance) → **`launch-checklist.md`** (manual copy-paste launch order) → **audit harness** — `audit-ads.mjs` runs the automated checks (hooks, char limits, fluff, consistency, forecast, compliance → `ad-audit.md`, exit 1 on any FAIL) then a fresh **ads-auditor subagent** scores hook worthiness (/50, ≥35 = worth running) and signs **PASS / FIX NEEDED** before delivery.*

| Prompt | Type |
|---|---|
| "make me an ad campaign" | sloppy → **Ads Wizard** |
| "i want to create ads for my tumbler" | sloppy → **Ads Wizard** (3 questions: platform → goal → budget/AOV) |
| "Run the Ads Wizard only — ask me the 3 questions, then show me the campaign-brief.md. Don't build anything yet." | wizard only |
| "Build a full paid campaign pack for my tumbler store — Meta + Google, $80/day, sales goal, US. Forecast first, then Veo video ads + image ads + copy + blueprint + compliance." | premium (full pack) |
| "Meta-only: Advantage+ sales campaign, $50/day, ecommerce, AOV $40 — forecast, 3 creative concepts, ad copy within char limits." | premium (Meta) |
| "Google-only: Demand Gen prospecting + PMax capture for $30/day — audience signals, asset group copy, AI labels, forecast." | premium (Google) |
| "Forecast only: is a $50/day Meta sales campaign viable for a $40 product? Conservative to aggressive scenarios with CPA and ROAS." | forecast only |
| "Veo video ads only: 9:16 Reels hook + 16:9 in-stream + 6s bumper for my product — same product in every clip, copy-paste prompts." | creatives only |
| "Audit my ads-plan.json — regenerate the prompt pack and flag any ad that drifts from the product block." | audit/fix |
| "Run the full audit harness on my campaign folder — automated checks first, then spawn the ads-auditor subagent with the hook-worthiness scorecard and give me the PASS/FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** product launches · seasonal promos (Black Friday, summer) · app installs · local business leads · SaaS free-trial signups · retargeting creative refreshes (the `Edit:` variant bank) · cross-platform retargeting stacks.

## 17. Episodic story series 📖🎬

*Runs through **`serial-story-reels`**: ≤3 clarifying questions (story idea → genre from `genre-presets.md` → characters: original or the user's uploaded reference images → episodes/scenes/aspect with defaults 3/4/9:16) → lock ONE grade + world + cinematic token → **story bible** (season arc + per-episode hooks + cliffhangers, validated by `series-arc.mjs`, exit 1 on any missing hook/cliffhanger/undefined character) → **character sheet** (verbatim character blocks + 2–3 reference-image prompts per character → upload to Flow's Ingredients ONCE, reuse for EVERY episode) → **`prompts.md`** — one copy-paste **Veo 3.1 prompt per scene**, grouped by episode, every prompt carrying the VERBATIM character blocks + grade + cinematic token, **self-verified word-by-word** by `episode-prompts.mjs` (exits 1 on drift), first/last-frame bridging 🔗 across scenes AND episode boundaries → **`voiceover.md`** (every line per episode with delivery direction — native Veo audio or Kokoro post pass with voice-anchor note) → **audit harness** — `audit-series.mjs` runs the automated checks (arc re-validation, per-scene token consistency, verify/bridge counts, voiceover coverage, cinematic language, sheet + bible → `series-audit.md`, exit 1 on any FAIL) then a fresh **series-auditor subagent** scores consistency-worthiness (/50, ≥35 = good to go) and signs **PASS / FIX NEEDED** before delivery.*

| Prompt | Type |
|---|---|
| "make me a story series with episodes" | sloppy → ≤3 questions (story → genre → characters) |
| "Create an episodic love story — 3 episodes, same 2 characters in every episode, cinematic action + proper voiceover, Google Flow / Veo prompts, 9:16." | premium (love-story-action) |
| "Comic story series: a rookie hero vs. a villain — 3 episodes, hook + cliffhanger each, comic-pop grade, punchy VO." | premium (comic) |
| "I have photos of 2 characters — build a 3-episode thriller series around them, keep them EXACTLY the same in every episode." | premium (user uploads) |
| "Episodes 4–6: continue my series — same characters, same grade, new arc with a mid-season cliffhanger. Keep everything consistent." | premium (season 2) |
| "Story bible only: 4-episode fantasy arc — logline, season arc, hooks + cliffhangers, cast list. Validate it with series-arc.mjs." | bible only |
| "Character sheet only: two characters for a series — verbatim blocks + 3 reference-image prompts each, locked world + grade." | character sheet only |
| "Audit my series-plan.json — regenerate the prompt pack and flag any prompt that drifts from the character blocks or the grade." | audit/fix |
| "Run the full audit harness on my series folder — automated checks first (arc, per-scene tokens, voiceover coverage, cinematic language), then spawn the series-auditor subagent with the consistency-worthiness scorecard and give me the PASS / FIX NEEDED verdict." | audit (harness) |
| "Run the full audit harness on my reel pack — `audit-reels.mjs` first, then spawn the reel-auditor subagent with the reel-worthiness scorecard and give me the PASS / FIX NEEDED verdict." | audit (harness) |
| "Run the full audit harness on my photoshoot pack — `audit-shoot.mjs` first, then the shoot-auditor subagent with the shoot-worthiness scorecard and the PASS / FIX NEEDED verdict." | audit (harness) |
| "Run the audit harness on my clip pack (podcast-to-shorts), blog pack (blog-seo-content), title pack (youtube-video-pipeline), brand pack (linkedin-personal-brand), carousel deck, text/asset reel, storyboard, or audio plan — automated checks first, then the matching auditor subagent, and give me the PASS / FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** episodic love stories (meet → grow → fracture → reconcile) · comic origins (origin → training → big fight) · action sagas (setup → escalation → finale) · thriller serials (incident → dig → trap → reveal) · fantasy journeys (call → journey → confrontation) · character-led brands (the same founder in a new episode each week).

| Skill | Example prompt |
|---|---|
| **video-asset-reels** | "Make a 15s documentary-style reel from assets/footage/: hook 'Nobody is talking about this', one clip per beat, captions, Kokoro voiceover, 4K." |
| **voice-sfx-audio** | "Add a Kokoro voiceover to reel.html synced to the beats, plus a CC0 ambient bed ducked under the voice, mix to -14 LUFS." |
| **hook-storyboard-retention** | "Write a scroll-stopping hook + 15s storyboard for a finance reel — trend-research the niche first, brainstorm 5 angles, score them." |
| **Caption pack only** | "Generate the caption.md for output/{name}/ — 500–900 chars per platform, no hashtags." |

## 18. Social media content plans 📅🚀

*Runs through **`social-media-content-plan`**: the **Platform Wizard (exactly 3 questions)** — 1. which platforms (Instagram · X · LinkedIn · TikTok · YouTube (Shorts + long-form) · Facebook · Threads, **max 4**) · YouTube gets a dual-system section (Shorts completion/swipe velocity + long-form CTR/retention/session time) · 2. niche + audience + goal · 3. current state + time budget — then `platform-playbook.mjs` grounds the facts → **honest reset framing** (`algorithm-reset.md`: no reset button, no guarantees — the reset is a **14-day re-training sprint** of cadence + niche clustering + first-hour engagement velocity) → **`strategy.md`** (per platform: how that algorithm ranks in 2026, sprint rules, native formats, cadence + best times, hashtag/keyword strategy, pitfalls) → **`pillars.md`** (3–4 narrow pillars with shares summing to 100%, ≥ 8-hook bank, angle bank) → **`calendar.md`** (deterministic 30 days via `build-calendar.mjs` from `plan.json` — every post gets pillar / format / hook / one CTA / metric-to-watch) → **`engagement.md`** (the **first-60-minute protocol**: reply to every comment, comment with ONE insight on 5–10 niche accounts, daily budget) → **`metrics.md`** (dwell / completion / save-share / follower-conversion + day-7/14/21/30 review loop) → **`companion-skills.md`** (the **companion gate** — `check-skills.mjs` scans for the producer skills that actually build the posts — text-motion-reels / veo-cinematic-reels / video-asset-reels / carousel-post-images / linkedin-personal-brand / youtube-video-pipeline / voice-sfx-audio / video-product-pipeline / hook-storyboard-retention — and `--install` adds the missing ones so the 30 days are executable) → **audit harness** — `audit-content-plan.mjs` runs the automated checks (platform coverage, reset framing, pillars, calendar, engagement, metrics, fluff blocklist → `content-plan-audit.md`, exit 1 on any FAIL) then a fresh **content-plan-auditor subagent** scores plan worthiness (/50, ≥ 35 = worth posting) and signs **PASS / FIX NEEDED** before delivery.*

| Prompt | Type |
|---|---|
| "my account is dead, fix it" | sloppy → **Platform Wizard** (3 questions) |
| "Build me a 30-day content plan to reset the algorithm — Instagram + X. Niche: fat loss for busy professionals. Goal: thousands of views, +500 followers/30 days. Time budget: 5 h/week." | premium |
| "LinkedIn + Instagram content plan for my startup-coaching brand — 3 questions first, then strategy, pillars, 30-day calendar, engagement protocol, and the metrics loop." | premium (multi-platform) |
| "TikTok-only reset: I post erratically and reach is flat — cadence lock + niche cluster + completion engineering, 14-day sprint." | premium (sprint) |
| "Run the audit harness on my content-plan folder — automated checks first, then spawn the content-plan-auditor with the plan-worthiness scorecard and give me the PASS / FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** stalled accounts (reach flat) · new accounts starting from zero · rebrands (new niche = new cluster) · seasonal resets (new year, back-to-school) · single-platform deep dives (TikTok cadence, LinkedIn dwell) · repurposing calendars (turn a podcast into a 30-day plan).

## 19. X growth — fast content planning + daily posts 🐦🚀

*Runs through **`x-growth`**: the agent locks the **growth goal + ONE niche + voice** → researches what's working on X (last ~14 days) → writes the **growth content plan** (`content-plan.json`: goal · KPIs · ≥ 3 pillars · cadence · 7+ drafted posts in the **top-creator format** — 500–800 char micro-essays: hook line ≤ 100 chars → story → bullet points → payoff → CTA, roles `hook` / `value` / `story` / `proof` / `cta` / `loop`, each mapped to a pillar) → `post-writer.mjs` **assembles + validates** (**ZERO hashtags** — a single `#` fails the plan, exit 1; the 500–800 window; hook lines ≤ 100; ≥ 3 lines + ≥ 2 bullets — no walls of text; anti-fluff + bait-spam blocklists) → `content-plan.md` (goal, KPIs, cadence table, engagement schedule, day-7 review) + `posts.md` (the week of drafted copy) → **audit harness** — `audit-x.mjs` runs the automated checks (posts, 500–800 window, hook lines, format, zero-hashtag gate, story mix, pillars, plan sections → `x-audit.md`, exit 1 on any FAIL) then a fresh **x-auditor subagent** scores growth-plan worthiness (/50, ≥ 35 = worth running) and signs **PASS / FIX NEEDED** before delivery.*

| Prompt | Type |
|---|---|
| "plan my X content for the week" | sloppy → goal + ≤3 questions (niche, audience, voice) |
| "Plan a fast-growth week on X for my solo SaaS — goal: 2k → 4k followers in 30 days, voice: first-person founder. NO hashtags." | premium |
| "Turn last week's newsletter into 3 X posts with contrarian hooks — no hashtags." | repurpose (→ newsletter-growth) |
| "Audit my X content plan before I post — automated checks first, then the x-auditor scorecard and the PASS / FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** niche hot takes · personal failure stories ("the mistake that cost me X") · teardowns with screenshots · contrarian takes on widely-shared advice · series posts that chain follows ("next week: the numbers") · quote-post commentary on niche news. **Hashtags are banned in every post — the copy carries the reach.**

## 20. Editorial newsletters 📬📈

*Runs through **`newsletter-growth`** (Beehiiv / Substack / ConvertKit): the agent picks the **subject formula** (`templates/issue-template.md` — curiosity / number / how-to / pain / story / pattern interrupt, ≤ 60 chars) → writes the **story-first issue plan** (`issue-plan.json`: subject + formula · story `hook → conflict → payoff` · 2–4 value receipts · ONE CTA · ONE growth plug) → `issue-writer.mjs` **assembles + validates** (subject ≤ 60, story spine present, ≥ 2 value items, CTA + growth plug, anti-fluff — exit 1 on any FAIL) → `issue.md` (word window 350–900, read time) + `growth-plan.md` (welcome sequence, referral loop, cross-promos, analytics review) → **audit harness** — `audit-newsletter.mjs` runs the automated checks (subject, story spine, anti-fluff, CTA/growth, word window, growth plan → `newsletter-audit.md`, exit 1 on any FAIL) then a fresh **newsletter-auditor subagent** scores issue-worthiness (/50, ≥ 35 = worth sending) and signs **PASS / FIX NEEDED** before send.*

| Prompt | Type |
|---|---|
| "write my newsletter" | sloppy → subject formula + ≤3 questions (audience, voice, goal) |
| "Write this week's issue — story-first, niche: SaaS pricing for founders, goal: replies + forwards. Voice: first-person." | premium |
| "Build my welcome sequence (5 emails) + referral loop for my Substack." | growth plan |
| "Audit my issue draft — automated checks first, then the newsletter-auditor scorecard and the PASS / FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** weekly story-first issues ("the mistake that cost me X") · niche deep dives with receipts · issue swaps with same-audience newsletters · welcome sequences · referral-loop experiments · repurposing threads/podcasts into issues.

## 21. MCP servers + AI agents 🔌🤖

*Runs through **`mcp-agent-builder`**: the agent runs the **discovery interview** (connector, users, action surface, auth, deployment model, target IDEs/CLIs — never scaffolds blind) → writes **`mcp-prd.md`** (problem, users, tools/resources/prompts, auth + compliance, non-goals, success metrics) → **`mcp-architecture.md`** (ONE deployment model: stdio / remote HTTP / MCPB, with matching transport + auth flow + error handling + security + testing) → `mcp-plan.json` → **`scaffold-server.mjs`** generates a **runnable `@modelcontextprotocol/sdk` server** (`server/` — package.json, one `server.tool()` handler per plan tool in mock mode, README with run + connect steps, per-IDE `config/` snippets, `.env.example`, exit 1 on bad plans) → **`agent-design.md`** (system prompt + tool wiring + guardrails) → **`ide-cli-matrix.md`** (exact connect commands: Claude Code `claude mcp add`, Cursor `.cursor/mcp.json`, Codex `config.toml`, Gemini CLI, OpenCode, Cline, Windsurf, VS Code, Zed) → approval gate → **audit harness** — `audit-mcp.mjs` (PRD, architecture, scaffold, agent wiring, IDE matrix, secrets → `mcp-audit.md`, exit 1 on any FAIL) then a fresh **mcp-auditor subagent** scores the pack (/50, ≥ 35 = worth shipping) and signs **PASS / FIX NEEDED** before delivery. Built-in example: **"social-poster"** — an Instagram + X posting/analytics MCP server (full pack in `examples/social-poster/`).*

| Prompt | Type |
|---|---|
| "build me an mcp server that posts to instagram" | sloppy → discovery interview (connector, auth, deployment, clients) |
| "Build an MCP server that posts approved drafts to Instagram and X and pulls engagement analytics — remote HTTP, OAuth, connect it in Claude Code and Cursor. Full path: PRD → architecture → scaffold → agent design." | premium |
| "Turn my SaaS API into MCP tools so any agent in any CLI can use it — stdio deployment." | refactor/package |
| "Audit my MCP pack before delivery — automated checks first, then the mcp-auditor scorecard and the PASS / FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** wrap your own SaaS API as MCP tools · local-file or localhost servers (filesystem, dev tools) · OAuth-connected social/analytics servers · "agent that can X" full builds · packaging a local server as an MCPB bundle · publishing a server to the MCP Registry.

## 22. Ebook lead magnets 📕🎨

*Runs through **`ebook-builder`**: the agent starts from **author memory + taste** — reads `ebook-memory.md` (identity, voice fingerprint, design defaults, past builds; created at Stage 0 on first run via `templates/taste-profile.md` in ≤ 3 questions + an optional writing sample, updated at Stage 8) so every headline + body + CTA is written in the author's voice with zero banned words — then analyzes the topic + goal, **presents the two-mode choice** (like the carousel), and runs the **design picker** (`templates/design-picker.md`, starting from the remembered defaults) — locking **ONE of six layouts** (`editorial-classic` / `modern-bold` / `minimal-luxury` / `playful-pop` / `technical-dark` / `nature-calm`) + ONE of **30 palettes** (5 per layout, e.g. `electric-blue`) + ONE accent + ONE type pairing + ONE of **6 cover styles** (full-bleed / solid / split / pattern / scene-frame / duotone) + ONE motif family (step-cards / timeline / checklist / scenario / quote / chapter-dividers / comparison / framework-map) + mood + texture (`templates/design-options.md`) → writes the **page map** (cover opens a loop → 4–8 chapters escalate → payoff → CTA page, drafted in the author's voice) + the **cover brief** (`templates/cover-brief.md` — one idea, title ≤ 6 words, thumbnail-readable) → writes the single source of truth `ebook.html` (one `.page` per book page, `data-layout` + `data-palette` + `data-motif` on every page, `data-cover-style` on the cover, `.scene-tag` per page) → **Mode 1 browser render**: `render-ebook.mjs --pdf` → A4 `ebook.pdf` + `cover.png` + `pages/*.png` (2× = 2160×3056) via headless Chrome, text pixel-perfect **or Mode 2 image-model**: `render-ebook.mjs --mode model` → `prompts.md` (photoreal cover + interior scene prompts with the deck's exact copy + design tokens) → dispatch to Nano Banana / Midjourney / Flux at 4K → approval gate → **audit harness** — `audit-ebook.mjs` (pages, cover, layout + palette + motif consistency, cover style, copy limits, fluff, **memory/taste: `ebook-memory.md` present + taste banned-words clear**, output → `ebook-audit.md`, exit 1 on any FAIL) then a fresh **ebook-auditor subagent** scores ebook-worthiness (/50, ≥ 35 = worth publishing, incl. **copy punch + voice match**) and signs **PASS / FIX NEEDED** before delivery → **Stage 8 writes the build back to `ebook-memory.md`** (topic, design, verdict, what the author changed) so the next ebook starts smarter. Built-in examples: **"The 5-Page Pricing Fix"** (`examples/pricing-guide/`, Modern Bold · Electric Blue) and **"The Shipping Playbook"** (`examples/dev-shipping-playbook/`, Technical Dark · Terminal Green) — decks + generated prompts, each with the author's `ebook-memory.md`.*

| Prompt | Type |
|---|---|
| "build me an ebook about money habits" | sloppy → memory + taste (Stage 0) → design picker (layout + palette + cover style + motif) + ≤3 questions (audience, goal, length, tone) |
| "Build me another ebook — same voice as the last one." | memory (taste): reads `ebook-memory.md`, keeps your voice + design defaults + banned words |
| "Build a lead-magnet ebook: the 5-Page SaaS Pricing Fix — Modern Bold, 7 pages, killer cover, A4 PDF, browser render." | premium |
| "Make a premium ebook for my brand — Minimal Luxury layout, photoreal cover via image prompts, Mode 2." | premium (image-model) |
| "Turn my blog post into a designed 12-page ebook with the Editorial Classic layout." | repurpose |
| "Audit my ebook pack — automated checks first, then the ebook-auditor scorecard and the PASS / FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** checklist lead magnets · framework guides · "day in the life" ebooks · repurposing blog posts / threads / podcast transcripts into a designed PDF · premium brand ebooks (Minimal Luxury) · funnel offers ("get part 2" CTA loops).

## 23. YouTube thumbnails 🖼️🎯

*Runs through **`thumbnail-studio`**: the agent analyzes the video's title + angle → **CTR teardown** of the niche (`thumbnail-teardown.md`: what the winning thumbnails do, what's saturated, the ONE idea the video sells) → writes `thumbnail-plan.json` (3–5 variants, each = ONE idea + overlay ≤ 5 words + scene + style) → `thumbnail-prompts.mjs` **builds + self-verifies** (variant count, overlay cap, idea + emotion, 1280×720 canvas, anti-cliché blocklist — exit 1 on drift) → `thumbnails.md` (per-variant: concept, overlay, scene, photoreal image-gen prompt for Nano Banana / Midjourney / Flux) → `ab-test.md` (2 variants, identical title, test window, niche CTR benchmarks from `templates/ctr-benchmarks.md`) → **audit harness** — `audit-thumbs.mjs` (teardown, variant count, overlay caps, anti-cliché, A/B plan, output → `thumbs-audit.md`, exit 1 on any FAIL) then a fresh **thumbs-auditor subagent** scores thumbnail-worthiness (/50, ≥ 35 = worth shipping) and signs **PASS / FIX NEEDED** before delivery. Built-in example: **"3 Pricing Mistakes"** (`examples/pricing-video/`).*

| Prompt | Type |
|---|---|
| "make thumbnails for my video" | sloppy → CTR teardown + ≤3 questions (title, niche, style) |
| "Design 3 thumbnails for my SaaS pricing video — teardown my niche first, ONE idea per thumbnail, ≤ 5-word overlay, photoreal prompts + an A/B plan." | premium |
| "Thumbnails only: 4 variants for 'Why nobody clicks your pricing page' — curiosity-gap angles, prompts at 1280×720." | thumbnails only |
| "Audit my thumbnail pack — automated checks first, then the thumbs-auditor scorecard and the PASS / FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** curiosity-gap overlays ("why nobody does this") · result/threat formulas ("the mistake that costs $12k") · comparison splits ("your way vs mine") · number reveals · breaking the niche's saturated pattern (per the teardown).

## 24. Repurposing hub 🔁🌐

*Runs through **`content-repurposing-hub`**: the agent captures the source (blog post / podcast / video / thread / idea) + the ONE story it sells → extracts the **angle bank** (hook entries, beats, aha, quotable line, proof) → writes `repurpose-plan.json` (≥ 2 platforms, each with format / native angle / hook / producer skill / CTA) → `repurpose-writer.mjs` **builds + validates** (source + story, platform count, per-platform fields, **anti-repost hook-overlap check** — no two pieces open with the same line, hooks ≤ 280 chars, anti-fluff — exit 1 on any FAIL) → `hub-plan.md` (angle bank + per-platform cards, the handoff to the producer skills) + `calendar.md` (staggered cross-post order, lead platform first) → **audit harness** — `audit-repurpose.mjs` (source, platform count, native angles, no duplicates, CTAs, calendar → `repurpose-audit.md`, exit 1 on any FAIL) then a fresh **repurpose-auditor subagent** scores hub-worthiness (/50, ≥ 35 = worth shipping) and signs **PASS / FIX NEEDED** before delivery. Built-in example: **"The 5-Page Pricing Fix hub"** (`examples/pricing-guide-hub/`).*

| Prompt | Type |
|---|---|
| "repurpose my blog post everywhere" | sloppy → source + ≤3 questions (goal, platforms, audience) |
| "Repurpose my pricing-guide blog post — X thread, LinkedIn post, newsletter issue and a carousel, all NATIVE (no copy-paste), staggered calendar, one CTA each." | premium |
| "Turn this podcast episode into a thread + a LinkedIn post + a newsletter issue — different angle per platform." | premium (repurpose) |
| "Audit my hub pack — automated checks first, then the repurpose-auditor scorecard and the PASS / FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** one blog post → full stack (thread + newsletter + carousel + Shorts) · podcast episode → clip + thread + issue · "repurpose last week's best content" · cross-channel launch of a new idea (angled per platform).

## 25. Sponsorship pipeline 💰🤝

*Runs through **`sponsorship-pipeline`**: the agent interviews (niche, platforms + audience stats, content formats, existing sponsorships, goals, contact) → **`rate-card.mjs`** computes the rate card from the niche's CPM/RPM benchmarks (`rate-card.md` — honest ranges, never guarantees) → writes **`media-kit.md`** (the sponsor's problem first: niche + audience + engagement + the offer + contact) → writes **`outreach.md`** (≥ 2 personalized pitches with **problem / proof / offer / ask**, negotiation scripts + the day 3/7/14 follow-up cadence, FTC disclosure #ad/#sponsored built in, **zero `{placeholder}` text survives**) → **`tracking.md`** (pipeline columns + a row per outreach + follow-up dates) → **audit harness** — `audit-sponsor.mjs` (media kit, rate card honesty, outreach structure + disclosure + no placeholders, tracking → `sponsor-audit.md`, exit 1 on any FAIL) then a fresh **sponsor-auditor subagent** scores deal-worthiness (/50, ≥ 35 = worth sending) and signs **PASS / FIX NEEDED** before anything is sent. Built-in example: **"Alex Rivera — SaaS creator deals"** (`examples/saas-creator-deals/`).*

| Prompt | Type |
|---|---|
| "help me make money from brand deals" | sloppy → interview (niche, stats, formats, goals) |
| "Build my sponsorship pack — niche: SaaS, 48k YouTube + 12k newsletter. Rate card from benchmarks, media kit, 3 personalized pitches, tracking." | premium |
| "What should I charge for a sponsored video in the fitness niche with 30k followers?" | rate card only |
| "Audit my sponsorship pack before I send anything — automated checks first, then the sponsor-auditor scorecard and the PASS / FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** first-time sponsor outreach · media kit refresh before a campaign push · rate-card rebenchmark after closed deals · pitch-writing for a specific brand (their campaign + your proof) · newsletter-sponsor packages (the open-rate story).

## 26. Skill builder (meta) 🛠️

| Prompt | Type |
|---|---|
| "Add a new skill for {topic} to the repo." | `skill-builder` scaffolds → fill the placeholders → wire README/USAGE/prompt-examples → validate → audit |

## 27. Positioning 🎯

*Runs through **`positioning-studio`**: the agent starts from **author memory + taste** (`positioning-memory.md`: identity, voice fingerprint, banned words, past builds — read at Stage 0, written at the end) → analyzes product + audience + competitors (≤ 3 questions if vague) → fills the **positioning card** → writes **`positioning.md`** (## One-liner ≤ 15 words → ## Messaging hierarchy: Audience / Problem / Promise / Proof → ## Proof points ≥ 3 specific bullets → ## Taglines ≥ 3, ≤ 8 words → ## Voice guide from the taste profile, banned words included) → optional **`message-map.md`** (the SAME message rephrased for landing page / email / social) → approval gate → **audit harness** — `audit-positioning.mjs` (one-liner cap, hierarchy completeness, proof points, taglines, fluff + taste banned-words, message map → `positioning-audit.md`, exit 1 on any FAIL) then a fresh **positioning-auditor subagent** scores positioning-worthiness (/50, ≥ 35 = worth shipping) and signs **PASS / FIX NEEDED** before delivery. Built-in example: **"ClipDeck"** (`examples/saas-tool-positioning/` — one-liner + message map + memory).*

| Prompt | Type |
|---|---|
| "Give my product a positioning — one-liner, taglines, and a voice guide that sounds like me." | premium (memory + taste) |
| "My content feels random — give me one message to lift everywhere." | hierarchy + message map |
| "My one-liner is weak. Rebuild it with proof points I can actually claim." | positioning refresh |
| "Audit my positioning pack — automated checks first, then the positioning-auditor scorecard and the PASS / FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** product launch positioning · rebrand one-liner refresh · positioning for a service/agency · the message map before a content push (same message, every channel).

## 28. Prompt libraries 🧠

*Runs through **`prompt-engineering`**: the agent starts from **author memory + taste** (`prompt-memory.md` — voice rules come from the taste profile) → picks 3–6 real weekly use cases (≤ 3 questions) → writes **`prompt-library.md`** (## Voice rules first, then one section per prompt with **Role → Context → Task → Format → Constraints**; every prompt references the voice rules + banned words) → runs the **test loop** (**`test-results.md`**: tool, test input, output quality, verdict pass/needs-work per prompt — weak prompts rewritten and re-run) → approval gate → **audit harness** — `audit-prompts.mjs` (framework sections on every prompt, no placeholder gaps, voice rules carry taste banned-words, test verdicts per prompt → `prompts-audit.md`, exit 1 on any FAIL) then a fresh **prompt-auditor subagent** scores prompt-library-worthiness (/50, ≥ 35 = worth keeping) and signs **PASS / FIX NEEDED** before delivery. Built-in example: **"Creator prompt library"** (`examples/creator-prompt-library/` — hooks, newsletter intro, competitor teardown, carousel repurpose, all tested).*

| Prompt | Type |
|---|---|
| "Build me a prompt library for my content workflow — prompts that make AI sound like me." | premium (voice + framework) |
| "I have prompts that sort of work. Organize them and test them properly." | library refresh + test loop |
| "Write me one prompt that turns a blog post into a carousel outline, in my voice." | single framework prompt |
| "Audit my prompt library — framework checks first, then the prompt-auditor scorecard and the PASS / FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** a research prompt set for a niche · email prompts in your voice · code-review prompts for your stack · repurposing prompts that feed the producer skills.

## 29. AI workflows 🤖⚙️

*Runs through **`ai-automation`**: the agent reads **`automation-memory.md`** (past verdicts — the NOs matter most) → analyzes the job (input → steps → output, frequency, failure cost) → runs the **automation-worthiness gate** (frequent? rule-following? worth it? — writes an honest **verdict: automatable / not automatable** and stops if NO) → writes **`automation-design.md`** (## Trigger → ## Workflow steps, each with **Tool/agent + Input + Output + Human checkpoint + Error handling** → ## Human checkpoints — every send/publish/delete/charge/deploy step is checkpoint yes → ## Cost + risk (per-run estimate + top failure mode + guardrail) → ## Build handoff naming `mcp-agent-builder` / `vibe-code-webapp` / `prompt-engineering` / none) → approval gate → **audit harness** — `audit-automation.mjs` (worthiness verdict, trigger, step contracts, checkpoints on irreversible steps, cost, handoff → `automation-audit.md`, exit 1 on any FAIL) then a fresh **automation-auditor subagent** scores automation-worthiness (/50, ≥ 35 = worth building) and signs **PASS / FIX NEEDED** before delivery. Built-in example: **"Weekly content pipeline agent"** (`examples/content-pipeline-agent/` — collect → draft → author review → publish with checkpoints + cost).*

| Prompt | Type |
|---|---|
| "Design an AI workflow that turns my week's posts into a newsletter — and tell me honestly if it's worth automating." | premium (worthiness gate) |
| "Should I automate my comment replies?" | worthiness verdict only (often NO — honest) |
| "Where should a human stay in the loop in my AI workflow?" | checkpoint design |
| "How much would this agent cost to run per month?" | cost estimate |
| "Audit my automation design — contracts first, then the automation-auditor scorecard and the PASS / FIX NEEDED verdict." | audit (harness) |

**Idea sparks:** content pipeline agents · research roundup agents · invoice/scheduling automation (with checkpoints) · "should I automate this at all" sanity checks.
| "Scaffold a skill called my-skill with 2 scripts and 3 templates." | `scaffold-skill.mjs` → contract-complete folder |
| "Audit my new skill against the repo contract — any flags?" | `audit-scaffold.mjs --docs` → scaffold-auditor scorecard (/50 ≥ 35) → PASS / FIX NEEDED |
| "Which skills in this repo still fail the audit harness?" | loop `audit-scaffold.mjs` over `skills/*` → fix quality-bar / banner / examples / docs gaps to zero flags |

**Idea sparks:** build a personal skill library · convert a repeated workflow into a skill · refresh an existing skill up to the quality-bar contract · add worked examples to a skill that lacks them.

## Prompt quality ladder (how the skill upgrades you)

| You say | The pipeline does |
|---|---|
| "make a vid about money" | asks ≤3 questions, hunts trends, brainstorms 5 angles, scores them |
| "money reel, savings, 15s, text-only" | picks word-pop, writes a hook, builds the full `video-product.md` spec |
| Full premium prompt (above) | locks the angle immediately, spec is faster, approval is one click |

---

> **One more thing:** every example above ends with `video-product.md` waiting for your **approve / edit / reject** — nothing renders before you say yes.
