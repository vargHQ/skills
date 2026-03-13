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

## Native Audio / Dialogue Prompts

Some video models support native audio generation (speech, sound effects, ambient audio baked into the video). Enable with `providerOptions: { varg: { generate_audio: true } }`.

**Supported models**: `kling-v2.6`, `ltx-2-19b-distilled`, `grok-imagine`

### Dialogue Formatting

Format spoken lines explicitly in the prompt:

```
Character says: "Your line here."
```

**Tips:**
- Keep dialogue short -- under 10 words per 5-second clip for best lip-sync quality
- Specify delivery tone: `"speaking quietly"`, `"calling out over wind"`, `"whispering nervously"`
- For multiple speakers: `Man says: "Hello." Woman replies: "Hi there."`
- For silence: include `"no dialogue"` or `"actors not speaking"` or `"ambient sounds only"`
- Describe environmental audio: `"birds chirping"`, `"rain on windows"`, `"crowd murmur"`

### Examples

```tsx
// Character with dialogue
Video({
  model: varg.videoModel("kling-v2.6"),
  prompt: "woman at a cafe table, she picks up her coffee and says: \"This is perfect.\" Warm smile, gentle ambient cafe sounds.",
  duration: 5,
  providerOptions: { varg: { generate_audio: true } }
})

// Atmospheric scene (no dialogue)
Video({
  model: varg.videoModel("kling-v2.6"),
  prompt: "aerial shot of ocean waves crashing on rocky shore, no dialogue, ambient ocean sounds, wind, seagulls in distance",
  duration: 8,
  providerOptions: { varg: { generate_audio: true } }
})
```

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

## Rich Prompting Examples

These demonstrate the 4-dimensional formula at full quality. Study the level of detail -- this is what produces cinematic results.

### Example 1: Warrior Princess (character + environment + action + cinematic)

**Hero image prompt:**
```
portrait, soft light, center composition. warrior princess with flowing crimson
hair reaching past her shoulders, piercing emerald eyes reflecting inner fire,
wearing battle-worn silver armor with intricate celtic knot engravings, a thin
scar across her left cheek from an old battle, expression of quiet determination
mixed with weariness. ghibli style, painterly brushstrokes, warm color palette
with golden undertones
```

**Scene 1 (i2v) -- cliff edge establishing shot:**
```
wide shot, golden hour, dramatic edge lighting from behind. she stands at the
edge of a windswept cliff overlooking a vast misty valley with ancient ruins
below, her crimson hair and tattered cape billowing dramatically in the wind,
one hand resting on sword hilt at her side. slow camera pull-out revealing the
epic landscape, dust particles catching the amber sunlight. cinematic, ghibli
style, film grain, anamorphic lens
```

**Scene 2 (i2v) -- intimate close-up:**
```
close-up, Rembrandt lighting, shallow depth of field. she draws her sword slowly,
the blade catching firelight, jaw set with resolve, eyes narrowing as she stares
into the darkness ahead. subtle rack focus from sword edge to her face. warm
amber tones, candlelight flicker, bokeh in background
```

### Example 2: Skincare TikTok (influencer + product + energy)

**Character image prompt (with reference editing):**
```
extreme close-up face shot, ring light reflection in eyes, surprised expression
with wide eyes and raised eyebrows, mouth slightly open in excitement, looking
directly at camera. young woman with short platinum blonde hair, minimal makeup,
silver hoop earrings, wearing oversized vintage band t-shirt. clean white
background, professional studio lighting, tiktok creator aesthetic
```

**Speech (fast, energetic delivery):**
```
Oh my god you guys, I literally cannot believe this actually works! I've been
using this for like two weeks and my skin has never looked better. Link in bio,
seriously go get it!
```

### Example 3: Nature Documentary (atmosphere + detail)

**4-panel grid prompts (one per element):**

- **Water**: `"extreme close-up of ocean wave crashing against volcanic black rocks, slow motion 120fps, crystal clear turquoise water exploding into white foam spray, individual water droplets suspended in golden hour sunlight, mist rising. cinematic, national geographic style, shallow depth of field on water texture"`
- **Fire**: `"intimate close-up of flames dancing in stone fireplace, warm orange and yellow tongues of fire licking weathered logs, glowing embers pulsing beneath, sparks occasionally rising. cozy cabin atmosphere, shallow focus on flame tips, hygge aesthetic"`
- **Rain**: `"macro shot of rain droplets hitting window glass, each drop creating expanding ripples and trails, city lights blurred into colorful bokeh beyond the glass, melancholic blue hour lighting. asmr visual aesthetic, slow motion, focus pulling between drops"`
- **Sky**: `"timelapse of cumulus clouds drifting across deep blue sky, dramatic god rays breaking through cloud gaps, cloud shadows moving across distant mountain range. epic landscape, wide angle, peaceful meditative mood, nature documentary cinematography"`

### Key Takeaways from These Examples

1. **Specify exact visual details** -- hair color, clothing, expression, not just "a woman"
2. **Layer the atmosphere** -- lighting type + time of day + weather + mood
3. **Name the camera work** -- "slow camera pull-out", "rack focus", "push-in"
4. **Include texture words** -- "dust particles", "bokeh", "film grain", "mist rising"
5. **Reference art styles** -- "ghibli style", "national geographic", "tiktok creator aesthetic"
6. **Keep i2v prompts focused on motion** -- the image already defines the look

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
