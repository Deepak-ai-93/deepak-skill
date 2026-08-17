# Prompt framework — the five parts every prompt must have

Every prompt in the library carries ALL five parts. The audit fails a prompt missing any of them.

## The framework

```
## {Use case} — {prompt title}
- **Role:** {who the AI is — name the voice: "a copywriter who writes like {author}: short sentences, no buzzwords"}
- **Context:** {what it needs to know — the product, audience, positioning, or the voice rules reference}
- **Task:** {what to produce — specific, with inputs named: "Write 5 hooks from these 3 angles"}
- **Format:** {exact output shape — count, bullets, length caps, headings, no preamble}
- **Constraints:** {measurable rules — char caps, banned words, "follow the Voice rules", one CTA, no invented numbers}
```

## The five parts, in practice

| Part | It answers | Weak | Strong |
|---|---|---|---|
| **Role** | Who is writing this? | "You are an AI assistant." | "You are a B2B copywriter who writes like {author}: short sentences, plain words, one number per claim." |
| **Context** | What do you know? | (missing) | "The product is ClipDeck, async video feedback for design teams. One-liner: … Voice rules: §Voice rules." |
| **Task** | What do you produce? | "Write a hook." | "Write 5 hooks for a thread about async feedback, from these 3 angles: time saved, fewer meetings, clarity." |
| **Format** | What does it look like? | "Return the hooks." | "Return 5 bullets, each ≤ 100 characters, no intro sentence, no numbering." |
| **Constraints** | What can't you do? | "Make it good." | "No buzzwords (list). Never invent numbers. Follow the Voice rules. One hook may ask a question." |

## Voice rules — write this section FIRST (from the taste profile)

```
## Voice rules
- Tone: {from the taste profile}
- Rhythm: {short declarative / long flowing / mixed}
- **Banned words** (the audit checks these are carried here):
  - {word}
  - {word}
```

Every prompt's Constraints references it: "Follow the Voice rules — never use: {banned words}."

## Anti-drift

- A prompt with no constraints is a suggestion. Constraints are the difference between "write a hook" and a hook that sounds like the author.
- Keep the {slot} names explicit ("keep the {topic} slot") instead of leaving brackets — the audit fails on `[insert…]` and `{{…}}`.
