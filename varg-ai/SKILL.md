---
name: varg-ai
description: >-
  Generate AI videos, images, speech, and music using varg SDK.
  Use when creating videos, animations, talking characters, slideshows,
  product showcases, social content, or single-asset generation.
  JSX-based video composition with AI-powered media generation.
  Triggers: "create a video", "generate video", "make a slideshow",
  "talking head", "product video", "generate image", "text to speech",
  "varg", "vargai", "render video", "lip sync", "captions".
compatibility: Requires bun runtime. VARG_API_KEY or FAL_KEY required.
---

## Prerequisites

Before generating anything, verify the environment:

1. Run `bun scripts/setup.ts` (from the skill directory) to check API keys and connectivity
2. Required: `VARG_API_KEY` (single gateway key) **or** `FAL_KEY` (direct fal.ai access)
3. Optional: `ELEVENLABS_API_KEY` (speech/music), `REPLICATE_API_TOKEN`, `HIGGSFIELD_API_KEY`
4. Quick smoke test: `bunx vargai hello`

If using the varg gateway (recommended), a single `VARG_API_KEY` covers all providers.

## Critical Rules

Everything you know about varg is likely outdated. Always verify against this skill and its references before writing code.

1. **Never guess model IDs** -- consult [models.md](references/models.md) for current models, pricing, and constraints.
2. **Function calls for media, JSX for composition** -- `Image({...})` creates media, `<Clip>` composes timeline. Never write `<Image prompt="..." />`.
3. **Cache is sacred** -- identical prompt + params = instant $0 cache hit. When iterating, keep unchanged prompts EXACTLY the same to avoid regeneration. Never clear cache. Use `--no-cache` only for intentional re-renders.
4. **One image per Video** -- passing multiple images in `Video({ prompt: { images: [...] } })` causes errors. Pass exactly one.
5. **Render in background** -- render jobs take 3-15+ minutes and cost real money ($0.05-$5+ per generation). Use `nohup bun run render video.tsx > output/render.log 2>&1 &`.
6. **Gateway namespace** -- when using the varg gateway, write `providerOptions: { varg: {...} }`, never `fal`.
7. **Duration constraints differ by model** -- kling-v3 allows 3-15s (integer). kling-v2.5 allows ONLY 5 or 10. Check [models.md](references/models.md) before setting duration.
8. **Preview before paying** -- run `bunx vargai render video.tsx --preview` to validate structure with free placeholders before spending credits.

## Two Modes of Operation

### Mode 1: Full Video Rendering (TSX Templates)

Write a `.tsx` file that composes multi-clip videos with transitions, music, captions, and voiceover. The varg SDK renders it into a final `.mp4`.

```bash
bunx vargai render video.tsx --verbose
```

### Mode 2: Single Asset Generation (Gateway API)

Use the gateway REST API directly for one-off images, videos, speech, or music without building a template. See [gateway-api.md](references/gateway-api.md).

```bash
curl -X POST https://api.varg.ai/v1/image \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -d '{"model": "nano-banana-pro", "prompt": "a sunset over mountains"}'
```

## Video Template Anatomy

Every template follows this pattern:

```tsx
/** @jsxImportSource vargai */
import { Render, Clip, Music, Captions, Title, Image, Video, Speech } from "vargai/react"
import { createVarg } from "@vargai/gateway"

const varg = createVarg({ apiKey: process.env.VARG_API_KEY! })

// Step 1: Generate media via function calls
const hero = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "cinematic portrait of a warrior princess, golden hour lighting",
  aspectRatio: "9:16"
})

const scene = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "warrior walks forward through misty forest, camera follows", images: [hero] },
  duration: 5
})

const voice = Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "rachel",
  children: "In a world beyond imagination..."
})

// Step 2: Compose via JSX tree
export default (
  <Render width={1080} height={1920} fps={30}>
    <Music model={varg.musicModel("music_v1")} prompt="epic orchestral, rising tension" duration={10} volume={0.3} />
    <Clip duration={5}>
      {scene}
      <Title position="bottom">The Last Guardian</Title>
    </Clip>
    <Captions src={voice} style="tiktok" />
  </Render>
)
```

### Key Layers

| Layer | Purpose | Example |
|-------|---------|---------|
| `<Render>` | Root container -- sets dimensions, fps | `<Render width={1080} height={1920}>` |
| `<Clip>` | Timeline segment -- duration, transitions, trimming | `<Clip duration={5} transition={{ name: "fade", duration: 0.5 }}>` |
| `Image()` | Generate still image | `Image({ model, prompt, aspectRatio })` |
| `Video()` | Generate video (text-to-video or image-to-video) | `Video({ model, prompt, duration })` |
| `Speech()` | Text-to-speech | `Speech({ model, voice, children: "text" })` |
| `<Music>` | Background audio | `<Music model prompt duration volume />` |
| `<Captions>` | Subtitle track | `<Captions src={speech} style="tiktok" />` |
| `<Title>` | Text overlay | `<Title position="bottom">Text</Title>` |
| `<Overlay>` | Positioned overlay | `<Overlay left={10} top={10} width={200}>` |

For complete props reference, see [components.md](references/components.md).

### Render Commands

```bash
bunx vargai render video.tsx --verbose       # Full render (costs credits)
bunx vargai render video.tsx --preview        # Preview with placeholders (free)
bunx vargai render video.tsx --no-cache       # Force regeneration (ignores cache)
```

## Character Consistency (Multi-Scene)

When a character or product appears across multiple clips, use this 3-step workflow:

1. **Reference image** -- generate (or receive) a character hero shot
2. **Scene images via /edit** -- use `nano-banana-pro/edit` to place the character into each scene, always passing the reference via `images: [ref]`
3. **Animate via i2v** -- pass each scene image to `Video()` for image-to-video generation

This ensures the character looks the same in every scene. Never generate scene images from scratch.

```tsx
// 1. Character reference
const ref = Image({
  prompt: "a man in a dark suit, dramatic side lighting, neutral background",
  model: varg.imageModel("nano-banana-pro"),
  aspectRatio: "9:16"
})

// 2. Scene images -- swap character into different environments
const scene1 = Image({
  prompt: { text: "same man sitting at a wooden desk, warm lamp light", images: [ref] },
  model: varg.imageModel("nano-banana-pro/edit"),
  aspectRatio: "9:16"
})
const scene2 = Image({
  prompt: { text: "same man standing by a tall window, cold grey daylight", images: [ref] },
  model: varg.imageModel("nano-banana-pro/edit"),
  aspectRatio: "9:16"
})

// 3. Animate each scene
const vid1 = Video({
  prompt: { text: "man looks up from desk, slight head turn", images: [scene1] },
  model: varg.videoModel("kling-v3"),
  duration: 5
})
const vid2 = Video({
  prompt: { text: "man turns from window, eyes cast down", images: [scene2] },
  model: varg.videoModel("kling-v3"),
  duration: 5
})

export default (
  <Render width={1080} height={1920}>
    <Clip duration={5}>{vid1}</Clip>
    <Clip duration={5} transition={{ name: "fade", duration: 0.3 }}>{vid2}</Clip>
  </Render>
)
```

## Key Patterns & Recipes

### Talking Head (character + speech + lipsync + captions)

```tsx
const character = Image({ model: varg.imageModel("nano-banana-pro"), prompt: "friendly host" })
const animated = Video({ model: varg.videoModel("kling-v3"), prompt: { text: "person talking naturally", images: [character] }, duration: 10 })
const voice = Speech({ model: varg.speechModel("eleven_v3"), voice: "rachel", children: "Welcome to our channel!" })
const synced = Video({ model: varg.videoModel("sync-v2-pro"), prompt: { video: animated, audio: voice } })

export default (
  <Render width={1080} height={1920}>
    <Clip duration={10}>{synced}</Clip>
    <Captions src={voice} style="tiktok" />
  </Render>
)
```

### Longer Videos (chained clips)

Each clip is 3-15 seconds (kling-v3). Chain multiple clips with transitions for longer videos:

```tsx
<Render width={1080} height={1920}>
  <Clip duration={5}>{vid1}</Clip>
  <Clip duration={5} transition={{ name: "fade", duration: 0.5 }}>{vid2}</Clip>
  <Clip duration={10} transition={{ name: "wipeleft", duration: 0.3 }}>{vid3}</Clip>
</Render>
```

### Slideshow (data-driven)

```tsx
const slides = ["sunset over ocean", "mountain peak at dawn", "forest path in autumn"]
const images = slides.map(prompt => Image({ model: varg.imageModel("nano-banana-pro"), prompt }))

export default (
  <Render width={1920} height={1080}>
    {images.map((img, i) => (
      <Clip key={i} duration={3} transition={i > 0 ? { name: "slideleft", duration: 0.5 } : undefined}>
        {img}
      </Clip>
    ))}
  </Render>
)
```

### Speech + Music + Captions (full audio)

```tsx
const speech = Speech({ model: varg.speechModel("turbo"), voice: "adam", children: "Welcome to the showcase" })

export default (
  <Render width={1080} height={1920}>
    <Music model={varg.musicModel("music_v1")} prompt="gentle ambient" volume={0.2} duration={10} ducking />
    <Clip duration={10}>
      {video}
      <Captions src={speech} style="tiktok" position="bottom" />
    </Clip>
  </Render>
)
```

**Important**: Always set `duration` on `<Music>` to match the total video length. Without it, ElevenLabs generates ~60s of audio which extends the video beyond intended length.

## Iteration & Cost Awareness

- **Cache-aware editing**: When modifying a render, keep unchanged prompt strings EXACTLY the same. Even minor whitespace changes cause a cache miss and re-generation ($$$).
- **Preview first**: Use `--preview` to validate structure with free placeholders before paying for generations.
- **Credit costs**: nano-banana-pro = 5 credits, kling-v3 = 150 credits, speech = 20-25 credits. See [models.md](references/models.md) for full pricing.
- **1 credit = 1 cent**. A typical 3-clip video costs $2-5.

## Output Format Persistence

When iterating on a previous request, preserve the output format (image, video, audio) unless explicitly told otherwise.

**Explicit format-change triggers**: "animate", "make it move", "create a video", "turn into a video", "add motion", "sequence", "multiple scenes"

**Ambiguous instructions** (e.g., "add effects", "enhance"): Ask for clarification. Example: "Want this as a static image with visual FX, or animated?"

## References

- [models.md](references/models.md) -- Complete model catalog with pricing, constraints, and provider options
- [components.md](references/components.md) -- All JSX components: props, types, and usage patterns
- [prompting.md](references/prompting.md) -- Video and image prompt engineering guide
- [gateway-api.md](references/gateway-api.md) -- Single-asset generation via REST API
- [common-errors.md](references/common-errors.md) -- Debugging, gotchas, and constraint violations
- [templates.md](references/templates.md) -- Complete working templates ready to copy-paste
