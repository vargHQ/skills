# Prompt Engineering Guide

## The 4-Dimensional Video Prompt Formula

Great video prompts combine four dimensions:

```
[Subject] + [Scene/Environment] + [Motion/Action] + [Cinematic Controls]
```

### Example

**Weak**: "a woman walking"

**Strong**: "A young woman in a red dress walks confidently down a rain-soaked Tokyo street at night, neon signs reflecting in puddles. Slow push-in tracking shot, shallow depth of field, anamorphic lens flare."

---

## Subject Description

Be specific about appearance, clothing, expression:

- "A man in his 30s with short dark hair and a tailored navy suit"
- "A golden retriever puppy with floppy ears"
- "A weathered lighthouse on a rocky cliff"

For characters appearing in multiple scenes, generate a reference image first and use `nano-banana-pro/edit` to maintain consistency (see SKILL.md character consistency section).

---

## Scene / Environment

Set the location, time, weather, atmosphere:

- "in a sunlit Parisian cafe, morning light streaming through tall windows"
- "on a foggy mountain trail at dawn, pine trees fading into mist"
- "inside a futuristic space station corridor, cool blue ambient lighting"

---

## Motion / Action

Describe what happens in the scene. Be specific about movement direction and speed:

- "walks slowly toward camera, coat swaying slightly"
- "turns head to the left and smiles gently"
- "the camera orbits around the subject as cherry blossoms drift down"
- "waves crash against rocks in slow motion"

### Movement Vocabulary

| Movement | Description |
|----------|-------------|
| push in / push forward | Camera moves toward subject |
| pull back / pull out | Camera moves away |
| dolly left/right | Camera slides horizontally |
| tracking shot | Camera follows subject movement |
| orbit / arc | Camera circles around subject |
| crane up/down | Camera rises/descends vertically |
| static / locked-off | No camera movement |
| handheld | Subtle organic shake |
| tilt up/down | Camera pivots vertically on axis |
| pan left/right | Camera pivots horizontally on axis |
| zoom in/out | Lens zoom (different from dolly) |

---

## Cinematic Controls

### Shot Types

| Shot | Use |
|------|-----|
| Extreme close-up (ECU) | Eyes, texture, details |
| Close-up (CU) | Face, emotion |
| Medium close-up (MCU) | Head and shoulders |
| Medium shot (MS) | Waist up |
| Medium wide (MW) | Knees up |
| Wide shot (WS) | Full body in environment |
| Extreme wide (EWS) | Landscape, establishing |
| Over-the-shoulder (OTS) | Conversation perspective |
| Point-of-view (POV) | Through character's eyes |
| Bird's eye / overhead | Looking straight down |
| Low angle | Looking up at subject (power) |
| Dutch angle | Tilted frame (tension) |

### Lighting Keywords

- **Golden hour** -- warm, soft, long shadows
- **Blue hour** -- cool, moody, pre-dawn/post-sunset
- **Rembrandt lighting** -- dramatic triangle on face
- **High key** -- bright, minimal shadows (commercial)
- **Low key** -- dark, high contrast (noir, drama)
- **Backlit / silhouette** -- subject against light source
- **Neon** -- colorful artificial lighting
- **Volumetric** -- visible light rays through atmosphere
- **Practical lighting** -- light sources visible in frame

### Style Keywords

- **Cinematic** -- film-like quality, shallow DOF
- **Photorealistic** -- indistinguishable from photography
- **Anamorphic** -- wide aspect, lens flares, oval bokeh
- **Documentary** -- handheld, natural lighting
- **Film grain** -- textured, vintage feel
- **HDR** -- high dynamic range, vivid colors
- **Muted / desaturated** -- subdued color palette
- **Hyperreal** -- heightened reality, ultra-vivid
- **Aerial / drone** -- elevated perspective

---

## Image-to-Video Prompt Tips

When animating a reference image, your prompt should describe **the motion**, not re-describe the image:

**Good**: "person slowly turns head to the right and smiles, camera pushes in slightly"

**Bad**: "a beautiful woman with brown hair wearing a blue dress in a garden" (this re-describes the image instead of adding motion)

### Key i2v Tips

1. **Focus on motion** -- what moves, how, and in which direction
2. **Keep it short** -- 1-2 sentences of clear action
3. **Reference the existing image** -- "the person", "the object", "the scene"
4. **Add camera movement** -- even subtle push-in or drift adds production value
5. **Avoid contradictions** -- don't describe appearance that conflicts with the reference image

---

## Music Prompt Tips

Music prompts describe a vibe, not lyrics:

- "upbeat electronic, rising energy, synth arpeggios"
- "gentle ambient piano, warm and reflective, slow tempo"
- "cinematic orchestral, epic brass and strings, building tension"
- "lo-fi hip hop, chill beats, vinyl crackle, jazzy chords"
- "dark atmospheric, deep bass, industrial textures"

Keep music prompts under 30 words. Focus on: genre, mood, instruments, tempo, energy level.

---

## Anti-Patterns

Avoid these common prompting mistakes:

1. **Too vague**: "a nice video" -- be specific about subject, scene, action
2. **Too long**: 200-word prompts often confuse models. Aim for 1-3 sentences.
3. **Contradictory**: "a sunny rainy day" -- pick one atmosphere
4. **Meta-instructions**: "make it look good" or "high quality" -- describe what "good" looks like
5. **Multiple subjects doing different things**: Keep each clip focused on one clear action
6. **Re-describing the reference image** in i2v: Describe motion instead
7. **Negative prompts in video**: Most video models don't support negative prompts well. State what you want, not what you don't want.
