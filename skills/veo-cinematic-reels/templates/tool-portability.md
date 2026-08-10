# Tool Portability — paste the same prompt into any video generator

The scene prompts in `prompts.md` are tool-agnostic. Only the **reference-image mechanics** and the **negative-prompt handling** differ per tool. This cheat sheet is the "how to paste" guide for every generator the skill supports.

---

## The universal paste flow (every tool)

1. **Upload the 2–3 reference images ONCE** (from `character-sheet.md`) the way your tool accepts them — see the table below.
2. **Copy one full scene block** from `prompts.md`: the main prompt, the `Negative prompt:` line, and the `Seed:` line.
3. **Paste at 9:16, 4–8s, 1080p** (4K upscale after).
4. **Bridged scenes (🔗):** set the start frame to the previous scene's last frame.
5. **Never edit the character block** — paste verbatim; regenerate (don't reword) if the face drifts.

---

## Per-tool reference table

| Tool | Reference images | Negative prompt | Seed | Clip | Notes |
|---|---|---|---|---|---|
| **Google Flow / Veo 3.1** | **Ingredients** panel — front / ¾ / full-body refs; bridged cuts via Frames→video | No field — the labeled line reads as harmless plain text inside the prompt | API only (same seed across scenes) | 4–8s | Native dialogue + SFX; 9:16 native aspect |
| **Kling AI** | **Elements** — upload 1–4 refs, tag `<<<element_1>>>` in each prompt | ✅ dedicated field — paste the `Negative prompt:` line there | ✅ advanced settings | 5–10s | Strongest motion physics; start/end-frame controls |
| **Luma Dream Machine** | image-to-video — reference image is the first frame | ✅ dedicated field | ✅ | 5s | Fast b-roll + atmospheric looks |
| **Runway Gen-4 / 4.5** | image-to-video — reference image as start frame | ✅ (in prompt or field) | ✅ | 5–10s | Camera controls + generative inpainting for fixes |
| **Hailuo / MiniMax** | upload the reference image alongside the text prompt | ✅ dedicated field | ✅ | 5–6s | Budget-friendly; smooth action |
| **Vidu** | reference-to-video from a master character image | ✅ dedicated field | ✅ | 4–8s | Fast, low-cost iteration |
| **Pika 2.5** | image + prompt; fix drift with **Modify Region** | ✅ dedicated field | ❌ | 5–8s | Short-form social; stylized looks |
| **PixVerse V6** | image reference + prompt | ✅ dedicated field | ✅ | 5–15s | 1080p; multi-shot scene support |

---

## When the tool ISN'T in the table

1. Find where it accepts **reference images** (usually labeled "character", "subject", "elements", "reference", or "image-to-video").
2. Upload the same 2–3 clean refs ONCE; reuse them for every scene.
3. Paste the full prompt block as-is. If the tool has a negative field, move the `Negative prompt:` line into it.
4. If it has no seed option, skip the `Seed:` line — the character block + reference images carry consistency alone.

---

## Consistency rules that hold on EVERY tool

- **One verbatim character block** in every prompt — the anti-drift anchor.
- **One grade token + one world token** in every prompt — the look never changes mid-reel.
- **Same 2–3 reference images** for every scene.
- **Same seed** when the tool/API supports it.
- **Regenerate, never reword** — editing the character block mid-run breaks consistency permanently.
