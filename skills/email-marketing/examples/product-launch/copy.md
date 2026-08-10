# Copy Breakdown — product launch example ("Meet Replays")

This file explains every copy decision in `email.html` so you can replicate the pattern for any campaign. Sections map to the SKILL.md contract: **hook → value + proof → E-E-A-T → one CTA → sign-off → footer**.

---

## 1. Subject + preheader (the open)

- **Subject:** "Meet Replays: watch visitors fumble your signup" — Pain + outcome formula, 49 chars, hook front-loaded. "Fumble" is vivid but human; no hype, no ALL-CAPS, no `!!!`. The word "visitors" makes it specific to THEM, not a generic promo.
- **Preheader:** "It found 41 dead-ends in your funnel — here's the 6-minute setup." Completes the thought, adds a real number (EEAT), promises low friction. Never repeats the subject.
- **Anti-spam check:** zero blocklist words, no emoji (B2B SaaS), no fake urgency. The promise (watch your funnel) is delivered in the first paragraph.

## 2. Greeting + hook (first 2 lines earn the read)

> "Hi {{FIRST_NAME}}, — Your signup page is leaking. Now you can watch it happen."

- Personalization + a **specific, uncomfortable truth** in line one. No "We hope this email finds you well."
- Second line converts the pain into a concrete product: session recordings, first click to leave, no heatmap guesses, *why* people drop off.

## 3. Value — three benefits, one idea each

| Benefit | It's a benefit, not a feature | Proof built in |
|---|---|---|
| "See the exact dead-end" | Outcome = you stop guessing | "the replay shows the moment a visitor stalls" |
| "Setup in 6 minutes" | Outcome = no engineering ticket | "one snippet, works on any stack" |
| "Privacy-safe by default" | Outcome = watch without the headache | "PII is masked automatically" |

Each line: **bold payoff → one supporting clause.** Skimmable, no fluff adjectives.

## 4. E-E-A-T block (the trust centerpiece)

> “We ran Replays on our own signup flow before shipping it — across 2,400 sessions it surfaced 41 concrete dead-ends, and fixing the top three lifted our completion rate 11% in a week.” — **Maya Chen, Product Lead at Northbeam**

- **Experience:** firsthand usage ("we ran it on our own flow") — not a claim about the world, a claim about what *we did*.
- **Expertise:** named author with a real role; the metrics (2,400 sessions, 41 dead-ends, 11%) are specific and plausible — no "best in class" vagueness.
- **Trustworthiness:** attributed quote with a name + role, honest framing ("before shipping it").
- **Authoritativeness:** the numbers are the authority; a "see how it works" demo link backs it with proof.

## 5. One CTA

- **Button:** "Watch your first replay" — one verb + one concrete outcome, not "Learn more" or "Get started today".
- One supporting link max ("See how it works (2-minute demo)") — two possible actions, both pointing at the demo, not a link farm.

## 6. Sign-off from a real person

> "— Maya Chen, Product Lead at Northbeam · I led the redesign this shipped from — reply to this email and you get me, not a bot."

- Real name + role + an invitation to **reply to a human** (the #1 trust signal and a deliverability favorite — replies boost sender reputation).

## 7. Footer (compliance + trust)

- **Physical address** (CAN-SPAM requirement): "1124 Congress Ave, Suite 210, Austin, TX 78701".
- **Permission line:** "You're receiving this because you signed up for Northbeam updates or joined the Replays Beta waitlist" — honest about consent.
- **Update preferences + Unsubscribe** — both ESP merge-tags (`{{UNSUBSCRIBE_URL}}`), never hardcoded.
- Keep under 200 words; it's a footer, not a landing page.

---

## Anti-spam checklist used here

- [x] No blocklist words in subject or body (`free`, `guaranteed`, `amazing`, `urgent`, `!!!`…)
- [x] No ALL-CAPS sentences; one bold emphasis per line max
- [x] Text-rich: ~210 words vs 1 logo image — far above the image-ratio floor
- [x] Alt text on the logo; absolute image URL placeholder noted
- [x] 2 external links (CTA + demo) — under the 1–3 core-link guideline
- [x] Table layout + inline styles + dark-mode block + color-scheme meta
- [x] Plain-text version required next to this file (`plain.txt`)
- [x] Permission line + physical address + ESP unsubscribe merge-tag
- [ ] **Before send:** run `validate-email.mjs` + `preview-email.mjs` → auditor sign-off (SKILL.md Stage 6)

## Placeholder swap sheet (for delivery to the user)

| Tag | Brevo | MailerLite | Mailchimp | Klaviyo |
|---|---|---|---|---|
| `{{FIRST_NAME}}` | `{{contact.FIRSTNAME}}` | `{{first_name}}` | `*|FNAME|*` | `{{ first_name }}` |
| `{{UNSUBSCRIBE_URL}}` | `{{unsubscribe}}` | `{{unsubscribe}}` | `*|UNSUB|*` | `{{ unsubscribe }}` |
| `{{WEBSITE_URL}}` / `{{CTA_URL}}` | your links | your links | your links | your links |
| `{{YEAR}}` | `{{year}}` | `{{current_year}}` | `*|CURRENT_YEAR|*` | `{{ 'now' | date: '%Y' }}` |
