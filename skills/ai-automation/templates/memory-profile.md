# Automation memory — the durable file every automation build reads + writes

**File:** `automation-memory.md` — lives at the **working folder root**, NOT inside the skill. Created at **Stage 0** on first run (≤ 3 questions: what repeats, what tools/budget exist), read at the start of EVERY build, updated at the end (Stage 7).

## 1. Author identity

- Name / brand:
- What repeats weekly (the jobs they keep doing by hand):
- Tools / budget (which AI tools, what a run can cost):

## 2. Past automation verdicts (append one line per verdict — NO verdicts matter most)

| Date | Job | Verdict | Why | What happened after |
|---|---|---|---|---|
| | | automatable / not automatable | | built? broke? abandoned? |

## 3. Standing facts (never delete)

- Accounts / APIs available:
- Irreversible actions they will never let run unattended:
- Links / handles:

## Memory rules

- **READ at Stage 0, WRITE at the end. Never skip either.**
- Check the past-verdicts table BEFORE designing — if this job was already judged not automatable, don't redesign it from scratch; re-judge honestly.
- The NO verdicts go in the table too — they're the record that kept the author from wasting a build.
- Keep standing facts until the author changes them.
