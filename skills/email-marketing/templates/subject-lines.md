# Subject Lines — high-CTR playbook (email-marketing skill)

Use this reference when building the `subject-lines.md` deliverable for a campaign.

---

## Hard rules (every variant)

| Rule | Why |
|---|---|
| **33–50 characters** | Mobile clients cut off at ~33–40 chars. Front-load the hook in the first 4 words. |
| **No ALL-CAPS, no `!!!`, no `???`** | Triggers spam filters + reads as shouting. |
| **No spam trigger words** (see SKILL.md blocklist) | `free`, `urgent`, `last chance`, `guaranteed`, `amazing`… → filters + trust loss. |
| **Accurate promise** | The body must deliver the subject's promise in the first paragraph — mismatch = spam complaints = reputation damage. |
| **Specific > generic** | "Your onboarding is leaking users" > "Improve your onboarding". Numbers > adjectives. |
| **≤ 1 emoji, only if on-brand** | Emojis can lift opens for consumer brands, hurt for B2B/finance. |
| **Preheader synergy** | Preheader completes the subject's thought (40–90 chars), never repeats it. |

---

## The formulas (pick 3–5 per campaign, mix at least 2 types)

| # | Formula | Pattern | Example | Best for |
|---|---|---|---|---|
| 1 | **Pain + outcome** | Name the pain, promise the fix | "Your onboarding is leaking users" | SaaS, B2B, lifecycle |
| 2 | **Curiosity gap** | State the outcome, hide the how | "The email metric nobody watches (until it's late)" | Newsletters, content |
| 3 | **Specific number** | Lead with the receipt | "42% more replies with one line" | Case studies, reports |
| 4 | **Question / pattern interrupt** | Low-friction, personal | "quick question about your Q3 list?" | Warm follow-ups, B2B |
| 5 | **Announcement** | Novelty power words | "Introducing: real-time comments" | Launches, features |
| 6 | **Recipient-specific** | Reference their action | "Still thinking about that CRM you explored?" | Abandoned cart, lifecycle |
| 7 | **Time-boxed, honest** | Real deadline, no fake urgency | "Available until Feb 14" | Promos, events |
| 8 | **Name + context** | Personalization with meaning | "Priya, your 14-day trial starts now" | Onboarding, welcome |
| 9 | **How-to / result** | Promise a transformation | "How we cut email replies from 2 days to 9 minutes" | B2B, case studies |
| 10 | **Pattern interrupt (lowercase)** | Casual, peer-to-peer feel | "thoughts?" | Executive / warm prospects |

---

## Building the subject-lines.md deliverable

For each campaign, write **3–5 variants** from the formulas, then:

1. Mark the **winner** with a ✅ and a one-line rationale (why it wins for THIS audience/goal).
2. Add an **A/B plan** — test ONE variable at a time:
   - Length: short (≤ 35) vs specific (35–50)
   - Type: Question vs Number vs Pain+outcome
   - Personalization: with `{{FIRST_NAME}}` vs without
   - Emoji: with vs without (consumer only)
3. Run every variant through the blocklist + the 33–50 char rule (check `validate-email.mjs --subject "…"`).
4. Pair each subject with its **preheader** — the preheader extends the hook and hints at the CTA.

## Preheader rules
- 40–90 chars, completes the subject's thought, includes a CTA hint ("…here's the 3-step fix.")
- Never repeats the subject verbatim.
- Written FIRST in the HTML body (hidden div) — see `email-template.html`.

## Example pack (SaaS welcome email)

| Variant | Formula | Subject + preheader | Notes |
|---|---|---|---|
| ✅ **Winner** | Name + context | "Priya, your 14-day trial starts now" · preheader: "Set up in 6 minutes — here's the fastest path." | Personal + specific + honest timeline |
| A/B | Pain + outcome | "Your onboarding is leaking users" · preheader: "3 quick fixes — the first takes 2 minutes." | Strong B2B hook, no fluff |
| A/B | Question | "Ready to see your first live dashboard?" · preheader: "We kept the setup under 6 minutes." | Low friction, action-oriented |
| A/B | Recipient-specific | "You signed up for the Beta — it's live" · preheader: "Priya, the Beta list got access first." | References a real action = trust |
| A/B | Announcement | "The Beta you asked for is live" · preheader: "Includes the two features you voted for." | Novelty + social proof |

> **A/B plan:** send variant 1 to 15% of the list vs variant 2 to 15% for 3 days → winner goes to the remaining 70%. Measure CTR first, open rate second (post-iOS 15 opens are inflated).
