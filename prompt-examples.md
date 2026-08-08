# Prompt Examples — deepak-skill 🎬

Copy-paste any prompt below into your agent (Claude Code, Cursor, Codex, Gemini CLI, …) once the skills are installed. Every prompt runs through the **`video-product-pipeline`**: trend research → brainstorm + viral scorecard → `video-product.md` → **your approval** → generate → audit.

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
| **Voice / music** | kokoro af_heart, CC0 bed | kokoro, no bed |
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
| "3d-editorial 15s: 'Mastery is subtraction.' — dark minimal, champagne accents, film grain, slow camera push, loop ending, soft female Kokoro voice." | premium |

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
