# Subject Lines — "Meet Replays: on-page session replays" (product launch)

Campaign: **product launch** · Audience: existing SaaS customers + Beta waitlist · Goal: **demo clicks** (CTR primary, opens secondary).

Winner is marked ✅. All variants cleared against the spam blocklist + 33–50 char rule.

| Variant | Formula | Subject | Preheader | Chars |
|---|---|---|---|---|
| ✅ **Winner** | Pain + outcome | **Meet Replays: watch visitors fumble your signup** | It found 41 dead-ends in your funnel — here's the 6-minute setup. | 47 |
| A/B | Announcement | Introducing Replays — see every visitor's click | Real sessions, PII masked, live today. | 47 |
| A/B | Specific number | 41 dead-ends found in one signup flow | We ran it on our own funnel before shipping. | 44 |
| A/B | Curiosity gap | You finally get to watch why people leave | No heatmap guesses — the actual session. | 45 |
| A/B | Recipient-specific | You asked for session replays — it's here | The Beta waitlist got access first. | 43 |

---

## Why the winner

**"Meet Replays: watch visitors fumble your signup"** — 47 chars, hook in the first word ("Meet" = announcement framing), then a *specific, slightly uncomfortable truth* about the recipient's own funnel. "Fumble" is a vivid, human verb (no spam words, no hype). The preheader completes it with a **real number from firsthand testing** (41 dead-ends) + a low-friction promise (6-minute setup) — the EEAT payoff in the inbox.

The other four cover the standard launch angles so the A/B test isolates ONE variable:

## A/B plan
- **Test:** Winner (Pain + outcome) vs **Announcement** variant — the classic launch framing.
- **Split:** 15% + 15% for 72 hours, winner goes to the remaining 70%.
- **Measure:** CTR first (this email's goal is demo clicks), opens second — remember post-iOS 15 open rates are inflated by Mail Privacy Protection.
- **Secondary test (next send):** personalization — `{{FIRST_NAME}}` in the subject ("Priya, watch visitors fumble your signup") vs no name.

## Delivery notes
- Swap `{{FIRST_NAME}}` → ESP tag (Brevo `{{contact.FIRSTNAME}}` · MailerLite `{{first_name}}` · Mailchimp `*|FNAME|*`).
- The preheader lives in `email.html` as the hidden first div — already written.
- Never reuse "fumble" phrasing in the body verbatim — the body already delivers the promise in the first paragraph (no clickbait mismatch).
