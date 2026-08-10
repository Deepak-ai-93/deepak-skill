# Prompt Examples — deepak-skill 🎬

Copy-paste any prompt below into your agent (Claude Code, Cursor, Codex, Gemini CLI, …) once the skills are installed. Every video prompt runs through the **`video-product-pipeline`**: trend research → brainstorm + viral scorecard → `video-product.md` → **your approval** → generate → audit. Web-app prompts (section 11) run through **`vibe-code-webapp`** instead: research → evaluate → `PRD.md` → **your approval** → build → audit. Email prompts (section 12) run through **`email-marketing`**: subject-line pack → bulletproof HTML + plain text → spam/compliance validation → preview → auditor sign-off. Long-form + brand prompts (section 13) run through **`podcast-to-shorts` / `youtube-video-pipeline` / `blog-seo-content` / `linkedin-personal-brand`**: score → approve → generate → audit. Google Flow/Veo scene-prompt prompts (section 14) run through **`veo-cinematic-reels`**: character sheet → scene script → self-verified copy-paste prompt pack → **audit harness** (audit-reels.mjs + reel-auditor subagent). Episodic story-series prompts (section 17) run through **`serial-story-reels`**: story bible (arc validated) → character sheets → per-episode prompt pack + voiceover sheet, all self-verified → **audit harness**. AI-photoshoot prompts (section 15) run through **`photoshoot-studio`**: subject sheet → shot list → self-verified copy-paste image prompt pack (person + product modes, edit/inpaint prompts) → **audit harness**. **Every skill ends in the same audit-harness pattern** — an `audit-*.mjs` automated check → `*-audit.md` → a fresh `<skill>-auditor` subagent scores worthiness (/50, ≥ 35) and signs PASS / FIX NEEDED before delivery. Paid-ad prompts (section 16) run through **`paid-ads-studio`**: forecast first → product-block consistency tokens → self-verified Veo 3.1 video + image ad prompt pack → char-limit-safe copy → Meta + Google campaign blueprint → cost plan → compliance checklist → launch checklist.

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

*Runs through **`vibe-code-webapp`**: detailed idea interview (+ existing-project scan if the folder already has code) → research → evaluate → **build pack** (`PRD.md` + stack blueprint + **`sitemap.md`** — full sitemap, every frontend page, backend architecture, workflows — + handoff prompts) + **`TODO.md`** (P0/P1/P2 via `todo.mjs`) → approval of pack AND todo → build **step by step** from `vibe-coder-instructions.md` (BUILD.md) with a detailed `build-report.md` per session → production audit → **everything-auditor** final review (app + plan + instructions + memory + reports → hardening/tests/brainstorming) → daily `MEMORY.md` log.*

| Prompt | Type |
|---|---|
| "build me an app for productivity" | sloppy |
| "Vibe-code a SaaS: invoices freelancers actually get paid on — Next.js + Supabase + Stripe, $12/mo. Run the full pipeline (research → evaluate → PRD → approve → build → audit)." | premium |
| "SaaS evaluator only: is a local-business review widget worth building? Score it honestly on the scorecard and tell me BUILD / ITERATE / PIVOT with top 3 risks." | evaluate only |
| "Existing project: add subscriptions to my app — scan it first, then interview me for what to change, then pack + TODO and wait for my approval." | existing project |
| "Start from memory: read MEMORY.md and continue the build from where we left off." | memory (daily) |
| "Build a landing page + waitlist for my AI-meeting-notes idea — Vite + Tailwind, SEO + analytics ready, deploy to Vercel. Skip payments." | premium (non-SaaS) |
| "Keep the vibe loop going: from my current app state + TODO list, build the next highest-priority open task, run it, commit." | iterate |
| "Final review: spawn the everything-auditor — check the app, the plan, the instructions, memory and reports, then apply hardening + test fixes, brainstorm next ideas, and suggest skill improvements." | final review |

**Idea sparks:** "freelancer payment pain" · "AI tool for X" · "internal tool that kills a spreadsheet" · "waitlist-first SaaS" · "the app nobody built well yet".

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

## Prompt quality ladder (how the skill upgrades you)

| You say | The pipeline does |
|---|---|
| "make a vid about money" | asks ≤3 questions, hunts trends, brainstorms 5 angles, scores them |
| "money reel, savings, 15s, text-only" | picks word-pop, writes a hook, builds the full `video-product.md` spec |
| Full premium prompt (above) | locks the angle immediately, spec is faster, approval is one click |

---

> **One more thing:** every example above ends with `video-product.md` waiting for your **approve / edit / reject** — nothing renders before you say yes.
