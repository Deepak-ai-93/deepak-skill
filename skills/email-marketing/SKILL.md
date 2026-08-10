---
name: email-marketing
description: Design high-converting, spam-free HTML marketing emails for Brevo, MailerLite, Mailchimp, Klaviyo and any ESP — bulletproof responsive code, anti-fluff copywriting, E-E-A-T trust signals (experience, expertise, authority, trustworthiness), and high-CTR subject lines. Includes a validation script (spam-trigger scan, compliance, EEAT signals) and a desktop/mobile preview renderer for visual auditing before send.
---

# skill: email-marketing

**Name:** Email Marketing Design + Copywriting (Brevo / MailerLite / any ESP)
**Description:** Turns a campaign goal into a **send-ready HTML email** that clears three rails at once: **great copy** (hooks, benefits, one CTA), **spam-free deliverability** (no trigger words, healthy text ratio, full compliance), and **E-E-A-T targeting** (real experience, expertise, authority and trust signals baked into the content). Ships a **subject line pack** (high-CTR formulas, A/B variants), a **bulletproof responsive HTML email**, a **plain-text version**, and a **validation report** — all in one folder, ready to paste into Brevo / MailerLite / Mailchimp / Klaviyo.

---

## The quality bar (non-negotiable — read before anything else)

Every email must clear all four rails. If any fails, rewrite / regenerate it.

| Rail | Rule |
|---|---|
| **Spam-free deliverability** | No spam-trigger words in subject or body, no ALL-CAPS sentences, no `!!!` or `???`, healthy text:image ratio (≥ 50% text), alt text on every image, `List-Unsubscribe` + visible unsubscribe link, physical postal address in footer, plain-text version included, no JavaScript/forms/flash, minimal links (1–3 core), no deceptive subject/body mismatch. Gmail + Yahoo bulk rules: SPF/DKIM/DMARC, < 0.1% spam complaints, one-click unsubscribe. |
| **E-E-A-T in the content** | The email reads like it came from a **real, qualified person** — Experience (firsthand use/story/screenshots), Expertise (author name + credentials, accurate claims), Authoritativeness (named sources, links to proof, real metrics), Trustworthiness (real sender, testimonials, physical address, easy unsubscribe). Never anonymous-brand-fluff. |
| **Copy that converts** | Hook first, benefit-led, specific beats generic, one idea per section, **one CTA** per email. If the copy could describe any brand, rewrite it. |
| **Subject line → high CTR** | 33–50 chars, front-loaded with the hook, specific + benefit or curiosity, no ALL-CAPS, no spam words, accurate to the body (no clickbait mismatch), A/B variants provided. |

**Deliverable contract — one folder, five files:**
1. `subject-lines.md` — 3–5 high-CTR subject lines (winner marked) + rationale + A/B plan
2. `email.html` — bulletproof responsive HTML (table-based, inline CSS, dark-mode aware, 600px)
3. `plain.txt` — plain-text fallback version (helps spam filters + accessibility)
4. `validation-report.md` — output of `validate-email.mjs` (spam scan + compliance + EEAT)
5. `preview/` — desktop + mobile screenshots from `preview-email.mjs` (visual audit)

---

## When to use

- "Write an email for our newsletter / launch / welcome flow / promo"
- "Design an HTML email for Brevo / MailerLite / Mailchimp / Klaviyo"
- "Make our emails stop landing in spam" / "improve open rates"
- Any campaign that needs subject lines, HTML, and copy that people actually trust

**ESP compatibility notes (Brevo, MailerLite, Mailchimp, Klaviyo, HubSpot, …):**
- The HTML uses **tables + inline CSS only** (no div layouts, no `class=`-dependent styling) — the universal format every ESP accepts and every email client renders. No embedded `<style>` beyond the one dark-mode `<style>` block (supported everywhere modern).
- **Personalization tags differ per ESP** — keep the `{{PLACEHOLDER}}` syntax in the file, and tell the user to swap for their ESP's tag (Brevo `{{contact.FIRSTNAME}}`, MailerLite `{{first_name}}`, Mailchimp `*|FNAME|*`, Klaviyo `{{ first_name }}`). List the mapping in the delivery notes.
- Unsubscribe: use the ESP's **global unsubscribe merge-tag** in the footer link (never a hardcoded URL), and ensure the ESP adds the `List-Unsubscribe` header automatically (Brevo/MailerLite/Klaviyo do by default; Mailchimp has "Transactional" vs list emails — use the list one).
- Image hosting: all `src=` must be **absolute URLs** (ESP-hosted images or your CDN) — local file paths break in the live send. In preview mode, inline the file paths only for the local screenshot.

---

## Copywriting — the anti-fluff + anti-spam contract

> Copy is the email. If a sentence could appear on any brand's blast, it's fluff — rewrite it. If it could appear on a spam filter's blocklist, it's worse — delete it.

### The blocklist (never use in subject or body)
`free` (unless a literal genuine offer, one time) · `act now` · `urgent` · `limited time` · `last chance` · `don't delay` · `expires` · `hurry` · `guaranteed` · `100%` · `risk-free` · `no cost` · `make money` · `earn cash` · `double your income` · `$$$` · `credit card` · `cash bonus` · `amazing` · `incredible` · `miracle` · `secret` (unless literal) · `shocking` · `life-changing` · `winner` · `click here` (as link text — use descriptive anchors) · `verify your account` · `confirm your identity` · `dear friend` · `unlock` · `game-changer` · `supercharge` · `level up` · `unleash` · `boost` · `empower` · `revolutionize` · `leverage` · `transform your` · `today's fast-paced world`. ALL-CAPS words, `!!!`, and `???` are also blocked in the subject line.

### The 8 copy rules
1. **Hook first.** First 2 lines must earn the read (a real pain, a real stat, a specific promise). No "We hope this email finds you well."
2. **Specific beats generic.** "Cut setup from 40 minutes to 6" beats "save time." Numbers and receipts everywhere.
3. **Benefits over features.** "Ship updates your customers will actually see" beats "we added changelog notifications."
4. **One idea per paragraph, one CTA per email.** Skimmable: short sentences, one idea per line, bold the payoff.
5. **Write like a person talks.** First person, contractions, no corporate voice, no semicolon-dense sentences.
6. **E-E-A-T everywhere** (§ below) — the proof IS the copy: who you are, what you've done, where the claim comes from.
7. **Honest subject line.** The body must immediately deliver the subject's promise — mismatch = spam complaints = reputation death.
8. **End with one clear command.** Single CTA button + one supporting link max. "Want to see it live? → [Button]".

### E-E-A-T in email — how the four pillars show up
| Pillar | In an email this looks like | Example line |
|---|---|---|
| **Experience** | Firsthand story, real usage, screenshots, "I did this and here's what happened" | "We ran this onboarding flow on 4,000 new signups last month — here's what the data said." |
| **Expertise** | Named author + credential/role, accurate specifics, no overclaiming | "— Priya Nair, Head of Product (led the redesign). Reply to this email and you get her, not a bot." |
| **Authoritativeness** | Named sources, linked proof, real metrics, press/partners mentioned | "Per [Gartner's 2025 research on email compliance](https://…), 83% of deliverability failures trace to authentication." |
| **Trustworthiness** | Real sender name, testimonials, physical address, easy unsubscribe, transparent intent | "You're getting this because you joined the Beta waitlist. [Change preferences] · [Unsubscribe] — no hard feelings." |

**Minimum EEAT block in every email:** signed-from a real person (name + role + link to bio/LinkedIn), one piece of real proof (testimonial, metric, screenshot, or named source), physical address + unsubscribe in the footer, and a reply-to that's a human. B2C promo can be lighter; B2B/health/finance must be heavy.

---

## Subject lines — the high-CTR playbook

### Hard rules
- **33–50 characters** (mobile cuts off ~33–40) — front-load the hook in the first 4 words.
- **No ALL-CAPS, no `!!!`, no spam words** (blocklist above). One emoji max, only if the brand already uses them.
- **Accurate promise** — the body pays it off in the first paragraph.
- **Specific > generic**: "Your onboarding is leaking users" > "Improve your onboarding".

### Proven formulas (pick per campaign type, deliver 3–5 variants)
| Formula | Pattern | Example | Best for |
|---|---|---|---|
| Pain + outcome | Name the pain, promise the fix | "Your onboarding is leaking users" | SaaS, B2B |
| Curiosity gap | State the outcome, hide the how | "The email metric nobody watches (until it's late)" | Newsletters |
| Specific number | Lead with the receipt | "42% more replies with one line" | Case studies, reports |
| Question / pattern interrupt | Low-friction, personal | "quick question about your Q3 list?" | Warm follow-ups, B2B |
| Announcement | Novelty power words | "Introducing: one-click unsubscribe (for real)" | Launches, features |
| Recipient-specific | Reference their action | "Still thinking about that CRM you explored?" | Abandoned carts, lifecycle |
| Time-boxed, honest | Real deadline, no fake urgency | "Available until Feb 14" (never "last chance!!") | Promos, events |

### Preheader (the second subject line)
Write a **preheader that extends the hook** — 40–90 chars, completes the subject's thought, includes the CTA hint ("…here's the 3-step fix."). Never repeat the subject.

---

## HTML email engineering — the bulletproof rules

1. **Tables, not divs.** Layout with `<table role="presentation">`, `<td>`, inline `width`/`bgcolor`/`padding`. Gmail strips `<head>` styles and some div layouts.
2. **Inline styles everywhere**, 600px max container, centered.
3. **One `<style>` block for dark mode only** (`@media (prefers-color-scheme: dark)` + `<meta name="color-scheme" content="light dark">`); use `mso-` conditionals only where truly needed (Outlook buttons) — keep it minimal.
4. **Web-safe fonts** (Arial/Helvetica, Georgia, Courier) or a single well-supported Google Font with fallback chain. No JS, no forms, no video, no Flash.
5. **Every `<img>` needs `alt`, `width`, `height`, `style="display:block"`** — and `src` absolute URLs. Logos should be images; body text should be text (never image-only text).
6. **Buttons**: `border-radius` + `padding` + `background-color` on an `<a>` with an `mso` VML fallback or a padded-table button — must work in Outlook too.
7. **Preheader text** in the very first `<body>` element (a hidden div with `mso-hide:all`).
8. **Footer compliance block (every send):** physical postal address · "You're receiving this because…" permission line · unsubscribe link (ESP merge-tag) · preferences link · sender name. Under 200 words total — the footer is not a dumping ground.
9. **Plain-text version** always (ESP auto-generates or you provide `plain.txt`) — some filters flag HTML-only.
10. **Test before send**: `validate-email.mjs` (automated) + `preview-email.mjs` at 600px desktop + 320px mobile (visual) — Gmail, Apple Mail, Outlook, and dark mode.

---

## Workflow (6 stages)

### Stage 1 — Analyze the brief (ask ≤3 questions if vague)
Extract: **campaign type** (welcome / promo / newsletter / launch / lifecycle / transactional) · **audience + segment** · **goal** (opens / clicks / replies / sales) · **ESP** (Brevo / MailerLite / Mailchimp / Klaviyo — drives merge-tag syntax) · **sender identity** (real person name + role — required for EEAT) · **offer/pain** (what's the one thing they get).

### Stage 2 — Plan the email (the map)
Write the block map before any copy: **preheader → subject → greeting (personalized) → hook (2 lines max) → value (2–4 benefit bullets with proof) → EEAT block (author/testimonial/data) → single CTA → sign-off (real person) → footer (compliance)**. Decide the ONE CTA. Note the text:image ratio target (≥ 50% text) while planning visuals.

### Stage 3 — Subject line pack → `subject-lines.md`
Write **3–5 variants** from the playbook, mark the winner with rationale, add an A/B plan (one variable at a time: length vs question vs number). Check every variant against the blocklist + 33–50 char rule + preheader synergy. Save to `subject-lines.md`.

### Stage 4 — Write the copy (subject + preheader + body + plain.txt)
Write body copy against the anti-fluff contract and the EEAT pillars. Then write `plain.txt` — same content, no HTML, same order, links as bare URLs (spam filters and accessibility love it).

### Stage 5 — Build `email.html` from the template
Start from `templates/email-template.html` (bulletproof base: tables, inline styles, dark-mode block, preheader, footer compliance block). Fill with the approved copy, keep `{{PLACEHOLDER}}` tags for personalization + merge-tags for unsubscribe. Keep the design: max 2 fonts, 1–2 accent colors, generous whitespace, one button.

### Stage 6 — Validate + preview + audit (before delivery)
1. `node scripts/validate-email.mjs --html email.html --subject "…"` → `validation-report.md` — auto-checks spam triggers, ALL-CAPS, `!!!`, alt text, unsubscribe/address presence, link count, text ratio, EEAT signals. **Fix every FAIL and every high-priority WARN.**
2. `node scripts/preview-email.mjs --html email.html` → `preview/` desktop (600px) + mobile (320px) screenshots (requires Chrome + `playwright`).
3. **Auditor subagent** (fresh context) reviews the screenshots + HTML + copy:
   - Subject: ≤ 50 chars, hook front-loaded, accurate to body, no spam words?
   - Copy: hook first, specific > generic, one CTA, no blocklist words, reads like a person?
   - EEAT: author + role + proof present? testimonials/metrics/sources real and named? footer address + unsubscribe?
   - HTML: tables + inline styles, alt text everywhere, absolute image URLs, dark-mode block, mobile 320px renders clean?
   - Compliance: permission line, physical address, unsubscribe, plain-text version present?
   Any FAIL → fix → re-validate → re-preview → re-audit.

---

## Production checklist

- [ ] Brief analyzed: type / audience / goal / ESP / sender identity / one offer
- [ ] Block map written: preheader → subject → hook → value+proof → EEAT → one CTA → sign-off → footer
- [ ] `subject-lines.md`: 3–5 variants, 33–50 chars, hook first, no spam words/ALL-CAPS/`!!!`, winner + A/B plan
- [ ] Body copy: hook first, benefits over features, one idea per paragraph, one CTA, anti-fluff + anti-spam blocklist cleared
- [ ] E-E-A-T: real sender + role, one real proof (testimonial/metric/source), physical address, human reply-to
- [ ] `email.html`: tables + inline styles, 600px, dark-mode block, alt text on all images, absolute URLs, preheader, bulletproof button
- [ ] `plain.txt` written (same content, bare URLs)
- [ ] Footer: permission line + physical address + unsubscribe (ESP merge-tag) + preferences
- [ ] `validate-email.mjs` → `validation-report.md`, all FAILs + high WARNs fixed
- [ ] `preview-email.mjs` → desktop + mobile screenshots verified (no overflow, dark mode OK)
- [ ] Auditor subagent signed off: subject, copy, EEAT, HTML, compliance
- [ ] Delivered: `subject-lines.md` + `email.html` + `plain.txt` + `validation-report.md` + `preview/` + ESP merge-tag mapping note
