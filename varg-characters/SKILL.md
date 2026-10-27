---
name: varg-characters
description: >-
  Create AI characters with varg: character reference cards, photorealistic
  humans, model selection, and identity consistency across multiple scenes.
  Use when generating a new character from a text description, making a
  character look like a real photo (not AI-plastic), choosing which image
  model to use, or keeping the same face/outfit/body across many scene images.
  Triggers: "create a character", "generate a person", "photorealistic
  character", "same character in different scenes", "character reference",
  "consistent character", "which model for characters", "AI influencer",
  "UGC creator".
license: MIT
metadata:
  author: vargHQ
  version: "1.0.0"
---

# Skill: varg-characters

Create a character once, then reuse it everywhere. This skill covers the
image layer only: cards, photorealism, model choice, multi-scene stills.

Prerequisites: `varg-ai` skill (auth, render modes, full model catalog,
component syntax). To animate the character or make it talk, continue with
`varg-character-video`. For 2+ characters talking to each other, see
`varg-dialogue-scenes`. If the client provides **real photos** of a person,
use `varg-consistent-characters` instead — this skill is for characters
generated from scratch.

## Core principle: the character card

Never describe a character from scratch in every prompt — text descriptions
drift. Generate ONE frozen **character card** and derive everything from it:

```
text description ──gen──> card (frozen) ──edit──> scene1, scene2, ... sceneN
```

A good card is:

- **Full body, head-to-toe framing** — scenes can crop in, never out.
- **Neutral standing pose, arms at sides, facing camera** — composites into
  any scene; a dynamic pose does not.
- **Plain light grey studio background, even soft lighting** — no scene
  style leaks into later composites.
- **Fixed outfit, described precisely** — the card's clothes ARE the outfit
  for the whole project. Pick clothes that work for every planned scene.

```tsx
const heroCard = Image({
  model: varg.imageModel("nano_banana_pro"),
  prompt: "Full-body character reference card. A woman in her early 30s, \
shoulder-length wavy auburn hair, light freckles across nose and cheeks, \
hazel eyes, slim athletic build, 170cm. She wears a fitted forest-green \
crewneck sweater, straight-leg dark jeans, white leather sneakers. \
Standing straight facing camera, neutral relaxed pose, arms at her sides. \
Plain light grey studio background, even soft lighting, head-to-toe \
framing, photorealistic",
  aspectRatio: "9:16",
})
```

Be exhaustive on identity anchors: age, hair (color, length, texture), eye
color, distinguishing marks (freckles, scar, dimples), build, height. These
are what you'll recap in every scene prompt.

## Photorealism

AI characters fail as "real people" in predictable ways: plastic skin,
over-symmetric faces, studio-perfect everything. Counter each one in the
prompt.

### The photorealism prompt stack

Add these layers on top of the identity description:

| Layer | Keywords that work |
|---|---|
| Skin | "natural skin texture, visible pores, slight skin imperfections" |
| Camera | "shot on 85mm lens, f/2.8, shallow depth of field" or "shot on iPhone, casual snapshot" |
| Light | "soft window light", "overcast daylight", "practical lighting" — avoid "studio lighting" for candid looks |
| Imperfection | "flyaway hairs, slightly asymmetric smile, natural unposed moment" |
| Context | real-world clutter: "lived-in apartment", "street with pedestrians in background" |

Anti-patterns that CAUSE plastic look: "beautiful", "perfect", "flawless
skin", "8k ultra detailed", "masterpiece". Describe reality, not quality.

### Two realism registers

- **Editorial / cinematic**: 85mm portrait, Rembrandt or golden-hour light,
  film grain. Use for brand videos.
- **UGC / candid**: "shot on iPhone front camera, slightly grainy, casual
  selfie framing, natural indoor lighting". Use for TikTok-style content —
  a too-polished image reads as an ad and kills trust.

```tsx
const ugcCreator = Image({
  model: varg.imageModel("nano_banana_pro"),
  prompt: "Full-body character reference card. A man in his late 20s, short \
black curly hair, trimmed beard, brown eyes, medium build. He wears a plain \
white t-shirt, olive chinos, grey running shoes. Standing relaxed facing \
camera, arms at his sides. Plain light grey background, even soft light. \
Photorealistic, natural skin texture with visible pores, slight under-eye \
shadows, casual snapshot look, shot on iPhone",
  aspectRatio: "9:16",
})
```

## Model selection

Verify live pricing with `GET https://api.varg.ai/v2/pricing` (no auth).

| Task | Model | ~Credits | Why |
|---|---|---|---|
| Character card (default) | `nano_banana_pro` | 126 | Best identity detail + prompt adherence |
| Scene composites from card | `nano_banana_pro/edit` | 126 | Multi-reference editing (up to 14 images), best identity lock |
| Cheaper card/scenes | `nano_banana_2` / `nano_banana_2/edit` | 68 | Same workflow, lower fidelity |
| Photoreal portrait specialist | `phota` | 38 | Tuned for photorealistic humans |
| Stylized character presets | `soul` | 21 | Higgsfield, 80+ style presets |
| Cheap draft iteration | `grok_imagine_image` | 4 | Explore identity ideas before paying for nano banana |
| Angle variants of a scene | `qwen_angles` | 9 | Camera rotation around an existing image (see below) |
| Alternative editor | `seedream_v4_5/edit` | 53 | ByteDance edit model, multi-image |

Recommended flow: draft the identity with `grok_imagine_image` (4 cr per
try), then lock the final card with `nano_banana_pro`.

## Consistency across scenes

### 1. Scene composites via /edit

Every scene is ONE `nano_banana_pro/edit` call that receives the card (and
optionally a location card) as references:

```tsx
// Shared preamble — byte-identical in every scene prompt
const SAME = "First reference image is Anna (early 30s, wavy auburn hair, \
freckles, forest-green sweater, dark jeans). Keep her face, hair, body and \
outfit exactly as in the reference image."

const scene1 = Image({
  model: varg.imageModel("nano_banana_pro/edit"),
  prompt: { text: `${SAME} Medium shot: she sits at a cafe table by the \
window, holding a coffee cup, warm morning light`, images: [heroCard] },
  aspectRatio: "9:16",
})
const scene2 = Image({
  model: varg.imageModel("nano_banana_pro/edit"),
  prompt: { text: `${SAME} Wide shot: she walks through a park in autumn, \
leaves on the ground, overcast light`, images: [heroCard] },
  aspectRatio: "9:16",
})
```

Rules:

- The `SAME` preamble names each reference by position ("First reference
  image is...") and pins identity + outfit. Reuse it **verbatim** across all
  scenes — this is also what makes cache hits work.
- Scene text describes only what changes: framing, pose, gesture,
  expression, environment.
- **Never re-describe clothing** in a scene prompt — that causes outfit
  drift. If a scene needs a different outfit, make a second card
  (`heroCardGym`) via /edit from the first card: "exact same woman, now
  wearing ...".
- The "one image per prompt" limit applies to `Video()` only — `/edit`
  image models accept up to 14 reference images.

### 2. Location card (optional, for repeated locations)

If several scenes share a location, generate an **empty** location card
(no people) once and pass it alongside the character card:

```tsx
const cafeLoc = Image({
  model: varg.imageModel("nano_banana_pro"),
  prompt: "Empty cozy specialty coffee shop interior, big window, wooden \
tables, plants, morning light. No people. Photorealistic, 9:16 framing",
  aspectRatio: "9:16",
})
const scene3 = Image({
  model: varg.imageModel("nano_banana_pro/edit"),
  prompt: { text: `${SAME} Second reference image is the coffee shop \
location — keep it exactly as in the reference. She orders at the counter, \
seen from a medium-wide angle`, images: [heroCard, cafeLoc] },
  aspectRatio: "9:16",
})
```

### 3. Angle variants via qwen_angles

To get the same still from another camera angle without re-describing
anything, rotate the camera with `qwen_angles`:

```tsx
const scene1Side = Image({
  model: varg.imageModel("qwen_angles"),
  prompt: { text: "", images: [scene1] },
  aspectRatio: "9:16",
  providerOptions: { varg: {
    horizontal_angle: 45,   // 0=front, 90=right side, 180=back, 270=left
    vertical_angle: 0,      // -30=low angle .. 90=bird's-eye
    zoom: 7,                // 0=wide .. 5=medium .. 10=close-up
  } },
})
```

~9 credits per variant — much cheaper than a new composite, and physically
consistent with the source frame. Great for shot/reverse-shot coverage
(see `varg-dialogue-scenes`).

### 4. Cache discipline (critical)

Identical prompt + params = free cache hit, locally AND server-side on
api.varg.ai. Keep prompts **byte-identical** between iterations, scripts and
templates — copy-paste, never retype. Editing one scene's prompt regenerates
only that scene; everything else stays cached at $0.

## Approval pass: stills before anything else

Images are ~126 credits; videos are ~221+. Always generate and show all
stills for approval before animating anything (standalone bun script,
run in background):

```ts
import { Image } from "vargai/react"
import { createVarg } from "vargai/ai"
const varg = createVarg({ apiKey: process.env.VARG_API_KEY! })
// ...define heroCard, cafeLoc, scene1..N exactly as above...

async function save(name: string, el: ReturnType<typeof Image>) {
  const resolved = await el                 // await triggers generation (cached)
  await Bun.write(`output/project/${name}.png`, await resolved.file.data())
}
await Promise.all([save("card", heroCard), save("location", cafeLoc)])
await Promise.all([save("scene1", scene1), save("scene2", scene2)])
```

```bash
nohup bun run images.ts > output/images.log 2>&1 &
echo "started PID $!"
```

Then **Read the PNGs as images** and QA before showing the user.

## QA checklist (read every generated still)

- **Identity**: same face, hair, marks as the card — edit models can age,
  slim, or de-freckle a person between scenes; regenerate the outlier only.
- **Outfit**: exact same clothes as the card (color, cut, shoes). Drift
  means a scene prompt re-described clothing — fix wording, not the card.
- **Realism**: check hands (finger count), teeth, eyes (matching gaze
  direction), skin (no plastic sheen), text in background (no gibberish).
- **Framing**: matches intent (full-body vs close-up), subject not cropped
  at joints.
- **Location**: consistent with the location card if one is used.

## Content-moderation gotcha

Body-part wording ("rear", "booty", revealing descriptions) in an **image**
prompt can silently stall generation ~10 min. Rephrase to neutral anatomy
("hips and thighs"). Spoken dialogue lines inside video prompts usually
pass fine.

## Cost reference

| Item | ~Credits |
|---|---|
| Draft identity explorations (grok, 5 tries) | 20 |
| Final character card (nano_banana_pro) | 126 |
| Location card | 126 |
| Scene composite (each) | 126 |
| Angle variant (qwen_angles) | 9 |
| Re-render with unchanged prompts | 0 (cache) |
