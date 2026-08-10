# Genre Presets — episodic story series (serial-story-reels)

Pick ONE preset at Stage 1. **Lock the grade token + world block verbatim for the WHOLE series** — never two grades, never a world switch. The preset also steers camera vocabulary, action physics, and voiceover tone per episode.

---

## 1. Comic story (`genre: comic`)

| Element | Locked token / guidance |
|---|---|
| **Grade** | `Grade: vivid comic-pop palette, saturated primaries, bold inky outlines, halftone shading accents, clean highlights, punchy contrast, slight cel-shaded feel.` |
| **World** | `World: a bright sunlit city with oversized architecture, bold graphic shadows, floating motion lines, speech-bubble echoes in the air. One recurring element: a comic-style burst symbol whenever someone lands a hit.` |
| **Camera** | high-energy: whip pans, dynamic low-angle tracking, dramatic Dutch angles, speed-ramp on every impact |
| **Action physics** | exaggerated comic physics — impacts that send characters flying in arcs, dust comets, motion lines, squash-and-stretch on landings, but still weighty and grounded (never floaty) |
| **VO tone** | punchy, dramatic, onomatopoeia-friendly ("POW!", "THWACK!") as SFX; dialogue snappy and bold |

## 2. Love story (`genre: love-story`)

| Element | Locked token / guidance |
|---|---|
| **Grade** | `Grade: neon-noir romantic, deep teal shadows, warm magenta-neon highlights on skin, soft halation, anamorphic flares, cinematic 35mm film grain, dreamy contrast.` |
| **World** | `World: a city at night wrapped in soft neon glow, rainy streets reflecting pink and teal light, steam rising from vents, quiet pockets of warm light. One recurring element: a neon heart sign glimpsed in the background of key scenes.` |
| **Camera** | slow push-ins, 85mm portrait close-ups, gentle orbiting around the couple, soft-focus background |
| **Action physics** | no violence unless the plot needs it; movement is gesture-level — reaching hands, a turn of the head, running through rain in slow motion |
| **VO tone** | intimate, warm, breathy; internal-monologue VO over scenes; dialogue low and close-mic'd |

## 3. Action (`genre: action`)

| Grade | `Grade: gritty action look, desaturated steel-blue shadows, warm tungsten highlights, hard contrast, rain-glossed surfaces, heavy grain, handheld energy.` |
|---|---|
| **World** | `World: a rain-soaked urban night, wet asphalt with neon and headlight reflections, industrial spaces, sirens in the distance, steam from manholes. One recurring element: a flickering neon diner sign always in the background.` |
| **Camera** | handheld urgency, low-angle tracking, 24mm wide for scale, whip pans on impacts, speed-ramp on punches/kicks |
| **Action physics** | ONE dominant motion per 6s clip (a spinning kick that connects, a leap across a gap) with motion blur, realistic weight and gravity, dust/water kicked up |
| **VO tone** | clipped, urgent, commanding; one-liners delivered through exertion |

## 4. Thriller (`genre: thriller`)

| Grade | `Grade: cold desaturated blue-grey thriller grade, crushed blacks, sickly green monitor glow, clinical highlights, fine grain, oppressive contrast.` |
|---|---|
| **World** | `World: an anonymous modern city at night, glass towers, empty parking garages, CCTV-perspective spaces, harsh fluorescent light, shadows with no source. One recurring element: a static-filled security monitor always in the background.` |
| **Camera** | locked-off static frames, slow dolly-ins on suspects, CCTV-style POV, extreme close-ups on eyes/hands, handheld only for chase beats |
| **Action physics** | tense and minimal — door handles, footsteps, a hand reaching for a drawer; chases are quick, clipped bursts with speed-ramp |
| **VO tone** | whispered, measured, paranoid; dialogue sparse and loaded; long silences |

## 5. Fantasy (`genre: fantasy`)

| Grade | `Grade: epic fantasy grade, rich amber-gold highlights, cool misty shadows, volumetric light, medium-format film look, ultra-fine grain.` |
|---|---|
| **World** | `World: an ancient misty realm with moss-covered stone, floating embers, shafts of god-ray light through canopy, distant mountains. One recurring element: a glowing rune that reacts to the protagonist's presence.` |
| **Camera** | crane ups for scale, 35mm medium shots for character, aerial establishing for the realm, slow-motion for magic/ember moments |
| **Action physics** | magic with weight — embers swirl on a wave of the hand, a shield shatters into light shards, swords with realistic heft and follow-through |
| **VO tone** | measured, resonant, slightly formal; spells chanted; narration in a storyteller cadence |

---

## Episode structure per genre (see `episode-arc.md`)

| Genre | Typical season | Hook style | Cliffhanger style |
|---|---|---|---|
| Comic | 3 episodes (origin → training → big fight) | a bold visual gag or "the hit that shouldn't connect" | the villain reveals a connection to the hero |
| Love story | 3–4 episodes (meet → grow → fracture → reconcile) | a chance encounter frozen mid-moment | a misunderstanding caught on camera / a door closing |
| Action | 3–5 episodes (setup → escalation → finale) | mid-chase cold open | the antagonist escapes with the prize |
| Thriller | 4–5 episodes (incident → dig → trap → reveal) | a clue that shouldn't exist | the protagonist realizes they're being watched |
| Fantasy | 3–5 episodes (call → journey → confrontation) | a power awakening mid-battle | the mentor reveals the prophecy's cost |

---

## Rules that hold across ALL genres

1. **ONE grade, ONE world, ONE cinematic token** — chosen at Stage 1, appended verbatim to every prompt in the series.
2. **Scene-level additions go in CONTEXT, never the tokens** — e.g. "rain now soaking their coat" lives in the scene context, not the character block.
3. **Action = one dominant motion per clip** — multi-beat sequences split into bridged scenes (🔗) with timestamp pacing.
4. **VO tone is per-genre** — write the delivery direction into every dialogue line (`Dialogue: she says, breathless and desperate, "..."`).
