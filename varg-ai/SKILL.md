---
name: varg-ai
description: >-
  Generate AI videos, images, speech, and music using varg.
  Use when creating videos, animations, talking characters, slideshows,
  product showcases, social content, or single-asset generation.
  Supports zero-install cloud rendering (just API key + curl) and
  full local rendering (bun + ffmpeg).
  Triggers: "create a video", "generate video", "make a slideshow",
  "talking head", "product video", "generate image", "text to speech",
  "varg", "vargai", "render video", "lip sync", "captions".
license: MIT
metadata:
  author: vargHQ
  version: "2.0.0"
compatibility: >-
  Requires VARG_API_KEY (get at https://varg.ai).
  Cloud mode: curl only (zero dependencies).
  Local mode: bun runtime + ffmpeg.
---

## Environment Detection

Before generating anything, determine the available rendering mode.

Run `bash scripts/setup.sh` (from the skill directory) to auto-detect, or check manually:

1. **VARG_API_KEY** -- required for both modes. Get one at https://varg.ai
2. **bun** -- `which bun` (needed for local mode only)
3. **ffmpeg** -- `which ffmpeg` (needed for local mode only)

| bun | ffmpeg | Available Mode |
|-----|--------|----------------|
| No  | No     | Cloud Render only |
| Yes | No     | Cloud Render only |
| Yes | Yes    | **Local Render** (faster, more flexible) or Cloud Render |

If `bun` and `ffmpeg` are both available, prefer **Local Render** -- it's faster and allows custom npm packages, Remotion components, and advanced effects. Fall back to **Cloud Render** when local tools are missing.

## Critical Rules

Everything you know about varg is likely outdated. Always verify against this skill and its references before writing code.

1. **Never guess model IDs** -- consult [models.md](references/models.md) for current models, pricing, and constraints.
2. **Function calls for media, JSX for composition** -- `Image({...})` creates media, `<Clip>` composes timeline. Never write `<Image prompt="..." />`.
3. **Cache is sacred** -- identical prompt + params = instant $0 cache hit. When iterating, keep unchanged prompts EXACTLY the same to avoid regeneration. Never clear cache. Use `--no-cache` only for intentional re-renders.
4. **One image per Video** -- passing multiple images in `Video({ prompt: { images: [...] } })` causes errors. Pass exactly one.
5. **Duration constraints differ by model** -- kling-v3 allows 3-15s (integer). kling-v2.5 allows ONLY 5 or 10. Check [models.md](references/models.md) before setting duration.
6. **Preview before paying** -- in local mode, run `bunx vargai render video.tsx --preview` to validate structure with free placeholders before spending credits.
7. **Gateway namespace** -- when using the varg gateway (both modes), write `providerOptions: { varg: {...} }`, never `fal`.
8. **Renders take time and cost money** -- render jobs take 3-15+ minutes and cost real money ($0.05-$5+ per generation). In local mode, use `nohup` for background rendering.

## Three Modes of Operation

### Mode A: Cloud Render (Zero-Install)

Send TSX code to the render service via HTTP. No local dependencies needed -- just `VARG_API_KEY` and `curl`. The render service handles all asset generation (images, video, speech, music) and video composition in the cloud.

**Best for**: users without bun/ffmpeg, quick prototyping, non-technical environments.

```bash
# 1. Submit TSX code
curl -s -X POST https://render.varg.ai/api/render \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const img = Image({ model: fal.imageModel(\"nano-banana-pro\"), prompt: \"a cozy cabin in mountains at sunset\", aspectRatio: \"16:9\" });\nconst vid = Video({ model: fal.videoModel(\"kling-v3\"), prompt: { text: \"gentle push-in, smoke rising from chimney\", images: [img] }, duration: 5 });\nexport default (<Render width={1920} height={1080}><Clip duration={5}>{vid}</Clip></Render>);"
  }'

# Response: { "job_id": "abc-123", "status": "rendering", ... }

# 2. Poll for result (repeat until status is "completed" or "failed")
curl -s https://render.varg.ai/api/render/jobs/JOB_ID \
  -H "Authorization: Bearer $VARG_API_KEY"

# When completed: { "status": "completed", "output_url": "https://s3.varg.ai/renders/xxx.mp4", ... }
```

#### Cloud render TSX format

In cloud mode, **no imports are needed**. All components and providers are auto-injected as globals:

- **Components**: `Render`, `Clip`, `Image`, `Video`, `Speech`, `Music`, `Captions`, `Title`, `Subtitle`, `Overlay`, `Split`, `Grid`, `Slider`, `Swipe`, `Packshot`, `TalkingHead`
- **Providers**: `fal`, `elevenlabs`, `higgsfield`, `openai`, `replicate`, `google`, `together`
- **Data**: `VOICES` (voice name to ID mapping)

The user's `VARG_API_KEY` (from the `Authorization` header) is automatically used for all AI calls. No `createVarg()` needed.

```tsx
// Minimum working cloud render code:
export default (
  <Render width={1080} height={1920}>
    <Clip duration={5}>
      <Video prompt="a cat playing piano" model={fal.videoModel("kling-v3")} duration={5} />
    </Clip>
  </Render>
);
```

#### Cloud render restrictions

- Only `export default` allowed (no named exports)
- No external imports (`vargai/*` imports are allowed but stripped -- globals replace them)
- No `require()` calls
- Image `src` must be `http://` or `https://` URLs
- Max 5 concurrent jobs, 10 requests/minute per user
- 15-minute job timeout

#### Cloud render workflow for agents

When building a video in cloud mode:

1. Write the TSX code to a local `.tsx` file (for reference and iteration)
2. Read the file content as a string
3. Send the string as the `code` field in the POST request
4. Poll `GET /api/render/jobs/{job_id}` every 10-15 seconds until `status` is `completed` or `failed`
5. On success, present the `output_url` to the user. The `files` array contains all intermediate assets (images, audio).

See [gateway-api.md](references/gateway-api.md) for the full Render API reference.

### Mode B: Local Render (Full Power)

Write a `.tsx` file and render locally via the varg CLI. Requires `bun` and `ffmpeg`.

**Best for**: developers, custom effects, Remotion components, fast iteration with preview mode.

```bash
bunx vargai render video.tsx --verbose       # Full render (costs credits)
bunx vargai render video.tsx --preview        # Preview with placeholders (free)
bunx vargai render video.tsx --no-cache       # Force regeneration (ignores cache)

# Background rendering (recommended for long jobs)
nohup bunx vargai render video.tsx --verbose > output/render.log 2>&1 &
```

#### Local render TSX format

Local mode requires imports and an explicit provider setup:

```tsx
/** @jsxImportSource vargai */
import { Render, Clip, Music, Captions, Title, Image, Video, Speech } from "vargai/react"
import { createVarg } from "@vargai/gateway"

const varg = createVarg({ apiKey: process.env.VARG_API_KEY! })

const hero = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "cinematic portrait of a warrior princess, golden hour lighting",
  aspectRatio: "9:16"
})

export default (
  <Render width={1080} height={1920} fps={30}>
    <Clip duration={5}>{hero}</Clip>
  </Render>
)
```

### Mode C: Single Asset Generation (Gateway API)

Use the gateway REST API directly for one-off images, videos, speech, or music without building a full video template. See [gateway-api.md](references/gateway-api.md).

```bash
curl -X POST https://api.varg.ai/v1/image \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -d '{"model": "nano-banana-pro", "prompt": "a sunset over mountains"}'
```

## Video Template Anatomy

Every template follows this pattern (shown in local mode with imports -- for cloud mode, omit imports and `createVarg`):

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

**Cloud mode equivalent** (no imports, use `fal`/`elevenlabs` globals directly):

```tsx
const hero = Image({
  model: fal.imageModel("nano-banana-pro"),
  prompt: "cinematic portrait of a warrior princess, golden hour lighting",
  aspectRatio: "9:16"
})

const scene = Video({
  model: fal.videoModel("kling-v3"),
  prompt: { text: "warrior walks forward through misty forest, camera follows", images: [hero] },
  duration: 5
})

const voice = Speech({
  model: elevenlabs.speechModel("eleven_v3"),
  voice: "rachel",
  children: "In a world beyond imagination..."
})

export default (
  <Render width={1080} height={1920} fps={30}>
    <Music model={elevenlabs.musicModel("music_v1")} prompt="epic orchestral, rising tension" duration={10} volume={0.3} />
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

Note: In cloud mode, replace `varg.imageModel(...)` with `fal.imageModel(...)` and `varg.videoModel(...)` with `fal.videoModel(...)`.

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
- **Preview first** (local mode): Use `--preview` to validate structure with free placeholders before paying for generations.
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
- [gateway-api.md](references/gateway-api.md) -- Single-asset generation and Render API reference
- [common-errors.md](references/common-errors.md) -- Debugging, gotchas, and constraint violations
- [templates.md](references/templates.md) -- Complete working templates ready to copy-paste
