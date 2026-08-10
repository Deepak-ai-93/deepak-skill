# Episode Arc — serialized structure (serial-story-reels)

Every episode is a **self-contained loop** that also advances the season. Two mandatory elements per episode (validated by `series-arc.mjs`):

- **Hook** — the 3-second open loop that stops the scroll (a question planted, a moment frozen mid-action).
- **Cliffhanger** — the end-of-episode loop that makes the viewer click Episode 2 (a reveal, a reversal, a choice about to be made).

---

## The episode skeleton (scenes_per_episode: 4)

| Scene | Beat | Job | Hook/cliffhanger role |
|---|---|---|---|
| 1 | **Hook** | Open mid-moment, no cold titles | plants the question |
| 2 | **Rising** | Agitate the stakes, escalate tension | deepens the question |
| 3 | **Turn** | The reversal / the choice / the cost | changes the question |
| 4 | **Cliffhanger** | End on the loop — a reveal, a door opening, a hand reaching | re-opens the question for next episode |

---

## Hook formulas (first scene)

| Formula | Example |
|---|---|
| **Mid-action cold open** | Scene 1 starts on the punch already thrown, the chase already running. |
| **Frozen moment + payoff** | A hand reaches for a door handle; freeze before the door opens. |
| **Wrong-context line** | Dialogue that doesn't fit what's on screen (dramatic irony). |
| **Visual question** | A prop the audience doesn't understand yet (a key, a scar, a photo). |

## Cliffhanger formulas (last scene)

| Formula | Example |
|---|---|
| **The reveal** | The masked figure lowers the mask — it's someone the protagonist knows. |
| **The reversal** | The ally was the antagonist all along (or vice versa). |
| **The rising threat** | The antagonist gains the prize / a timer starts / a door closes on the escape. |
| **The choice** | Protagonist must choose between two loves / two loyalties / two lives. |

---

## Season arc patterns

| Pattern | Episodes | Arc |
|---|---|---|
| **Mini-series** | 2–3 | Setup → escalation → payoff (comic: origin → big fight) |
| **Standard** | 3–4 | Meet → grow → fracture → reconcile (love story) |
| **Serialized** | 4–5 | Incident → dig → trap → reveal → choice (thriller) |
| **Saga** | 5+ | Call → journey → setbacks → ally reveal → confrontation → new threat (fantasy) |

**Continuity rule:** each episode's last frame is the next episode's first frame (bridge flag 🔗). The cast, lighting, and world carry across the boundary.

---

## Series-plan.json episode block (what the scripts validate)

```json
{
  "id": "e1",
  "title": "The First Beat",
  "hook": "A spinning roundhouse kick frozen mid-air as the lights cut out.",
  "cliffhanger": "The masked figure lowers the hood — it's her childhood best friend.",
  "scenes": [
    {
      "id": "s1",
      "action": "Maya throws a spinning roundhouse kick that connects with the bag",
      "camera": "low-angle tracking, 24mm wide, speed-ramp on impact",
      "context": "rooftop gym at night, neon sign buzzing, rain starting",
      "dialogue": "She mutters, winded, \"One more round. Then the roof.\"",
      "sfx": "SFX: heavy bag snapping, rain starting to hit the tin roof. Ambient: distant traffic.",
      "characters": ["maya"],
      "bridge": false
    }
  ]
}
```

**Validation rules (exit 1 if violated):**
- ≥2 episodes
- every episode has a `hook` and a `cliffhanger`
- every episode has ≥1 scene
- every scene's `characters` array references defined character IDs
- `grade`, `cinematic`, `world`, `logline`, `title` present
