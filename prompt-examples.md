# Prompt Examples — deepak-skill 🎬

Copy-paste any prompt below into your agent (Claude Code, Cursor, Codex, Gemini CLI, …) once the skills are installed. Every video prompt runs through the **`video-product-pipeline`**: trend research → brainstorm + viral scorecard → `video-product.md` → **your approval** → generate → audit. Web-app prompts (section 11) run through **`vibe-code-webapp`** instead: research → evaluate → `PRD.md` → **your approval** → build → audit. Email prompts (section 12) run through **`email-marketing`**: subject-line pack → bulletproof HTML + plain text → spam/compliance validation → preview → auditor sign-off. Long-form + brand prompts (section 13) run through **`podcast-to-shorts` / `youtube-video-pipeline` / `blog-seo-content` / `linkedin-personal-brand`**: score → approve → generate → audit. Google Flow/Veo scene-prompt prompts (section 14) run through **`veo-cinematic-reels`**: character sheet → scene script → self-verified copy-paste prompt pack. AI-photoshoot prompts (section 15) run through **`photoshoot-studio`**: subject sheet → shot list → self-verified copy-paste image prompt pack (person + product modes, edit/inpaint prompts).

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
| **Style / format** | word-pop · highlighter · 3d-editorial · card-listicle · chat-thriller · svg-ambient | by niche |
| **Hook direction** | "stop the scroll with a stat" | trend-brief winner |
| **Assets** | `assets/clips/…` folder (video-asset-reels) | text-only |
| **Voice / music** | kokoro am_fenrir (deep male), CC0 bed | kokoro am_fenrir, no bed |
| **Platform** | Reels / TikTok / Shorts | all (caption pack) |

### Blank template (fill the brackets)

> Using the **video-product-pipeline** skill, make a `{15}`-second reel about `{niche}` for `{audience}`. Style: `{format}`. Hook direction: `{optional}`. `{Add a Kokoro voiceover. | No voice, just text.}` `{Use the clips in assets/… | Text-only.}` Platform: `{TikTok / Reels / Shorts}`. Goal: `{saves / shares / signups / follows}`.

---

## 1. SaaS company 🏢

*Best formats:* word-pop (hottakes, metrics), card-listicle (pricing/rules), highlighter (explainers).

| Prompt | Type |
|---|---|
| "make a vid for my saas" | sloppy |
| "15s reel for our SaaS onboarding tool — audience: startup founders who hate setup. Hook: 'Your onboarding is leaking users.' Style: word-pop, Kokoro voice, no music. Goal: signups." | premium |
| "3 SaaS pricing mistakes founders make — card-listicle, 15s, hook: 'Pricing wrong = dead startup.' Save-bait ending." | premium |

**Idea sparks:** onboarding → churn → revenue stat hooks · "the pricing page trick agencies hate" · founder 0→1 story (results-first) · "SaaS metrics that actually matter" (highlighter receipts) · feature-drop reveal (svg-ambient, luxury).

## 2. AI niche 🤖

*Best formats:* highlighter (tool explainers), card-listicle (tool stacks), chat-thriller (AI stories), word-pop (hot takes).

| Prompt | Type |
|---|---|
| "ai video" | sloppy |
| "Highlighter-style 15s: 'AI tools that feel illegal to know' — audience: creators, psychology angle (why AI feels like cheating), numbered cards, stat count-ups, Kokoro voice." | premium |
| "Chat-thriller 18s: 'I asked an AI to run my life for 30 days' — reddit-story energy, typing dots, cliffhanger loop ending." | premium |

**Idea sparks:** "your AI prompt is weak — do this" · "AI workflow in 60 seconds" · "the agent that does your boring job" · "don't build a wrapper, do this instead" (contrarian).

## 3. Web developer life 💻

*Best formats:* chat-thriller (war stories), card-listicle (tips), word-pop (hot takes), svg-ambient (aesthetic).

| Prompt | Type |
|---|---|
| "dev reel" | sloppy |
| "Chat-thriller 15s from my screenshots: 'the moment production broke at 2am' — dev humor, bold captions, typing suspense, cliffhanger ending." | premium |
| "3 CSS habits that instantly make you look senior — card-listicle, 15s, hook: '#3 feels illegal.' Save-bait final frame." | premium |

**Idea sparks:** "deploy on Friday? watch this" · "junior vs senior code review" (chat-thriller) · "your portfolio is bad and here's why" (contrarian) · "the 10x dev myth" · aesthetic "code is art" (svg-ambient).

## 4. Money & personal finance 💰

*Best formats:* word-pop (rules), card-listicle (lists), highlighter (stats with receipts).

| Prompt | Type |
|---|---|
| "money reel" | sloppy |
| "15s word-pop: 'Your savings are leaking. Fix these 3 rules.' — audience: people in debt, calm Kokoro voice, dark bg + neon accent, save-bait CTA." | premium |
| "Highlighter 20s: 'The 60/30/10 rule, with receipts' — stat count-ups, monospace labels, cream + yellow palette." | premium |

**Idea sparks:** debt-free stories (results-first) · "nobody told you about compound interest" · "how banks actually make money" (contrarian) · "3 money rules that feel illegal to know" (listicle).

## 5. Psychology & facts 🧠

*Best formats:* highlighter (facts/studies), word-pop (micro-lessons).

| Prompt | Type |
|---|---|
| "psychology facts reel" | sloppy |
| "Highlighter 15s: 'Your brain does this every time you scroll' — one study per beat, count-up stats, yellow highlighter sweeps, curiosity-gap hook." | premium |

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

*Best formats:* chat-thriller (always), montage (screenshots).

| Prompt | Type |
|---|---|
| "reddit story reel" | sloppy |
| "Chat-thriller 20s from the screenshots in assets/story/: 'I read this and couldn't sleep' — typing suspense, read receipts, cliffhanger final bubble that forces a rewatch." | premium |

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

*Runs through **`veo-cinematic-reels`**: analyze + lock grade/world → **character sheet** (verbatim character/world/grade blocks + Nano Banana reference-image prompts → upload to Flow's Ingredients) → **scene script** (hook → agitate → payoff → CTA/loop with continuity) → **prompts.md** — one copy-paste Veo 3.1 prompt per scene, every prompt carrying the identical character block + grade token + IMAX token, **self-verified** by `scene-prompts.mjs` (exits 1 on drift).*

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

*Runs through **`photoshoot-studio`**: analyze + lock grade/craft → **subject sheet** (verbatim person OR product block + Nano Banana reference-image prompts → upload as Flow Ingredients / Midjourney `--cref` / Flux reference) → **shot list** (hero → detail → lifestyle → closing) → **prompts.md** — one copy-paste image prompt per shot, every prompt carrying the identical subject block + grade token + craft token, **self-verified** by `shot-prompts.mjs` (exits 1 on drift), plus localized **`Edit:`** inpainting prompts.*

| Prompt | Type |
|---|---|
| "give me photoshoot prompts" | sloppy |
| "AI photoshoot of a person — same face in EVERY shot: a 29-year-old startup founder, chestnut hair, cream blazer. Editorial look, 5 shots (hero, beauty close-up, full body, candid, environmental), 4:5, warm Kodak grade, edit prompts for background swaps." | premium (person) |
| "Product photoshoot prompts for my matte-black coffee tumbler (label reads BREW & CO · 500ML) — hero on white, floating with a water splash, detail macro, lifestyle on a desk, packaging flat-lay. High-key commercial grade, 1:1." | premium (product) |
| "Subject sheet only: female marine biologist, tropical field vibe — 3 reference-image prompts for Nano Banana + a verbatim block I can reuse in every shot." | subject sheet only |
| "I have reference photos of the person — build a 6-shot editorial pack around her, keep her EXACTLY the same in all shots, 5 different outfits + backgrounds, with an Edit prompt per shot." | premium (reference image) |
| "Audit my shoot-plan.json — regenerate the prompt pack and flag any shot that drifts from the subject block." | audit/fix |

**Idea sparks:** founder/creator editorial packs · model portfolios · beauty close-ups · product hero + floating + packaging sets · lifestyle in-use shots · brand campaign series (same product, new scene each shot).

## Asset & audio-only prompts

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
