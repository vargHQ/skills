# Complete Templates

Copy-paste-ready templates. All use the varg gateway (`VARG_API_KEY`).

Each template is shown in **local mode** (with imports and `createVarg`). For **cloud mode**, just omit the imports -- `varg` is auto-injected as a global. Same `varg.*Model()` syntax works in both modes.

---

## Cloud Render Quick Start

These examples show the complete cloud render workflow using `curl`. No bun or ffmpeg needed.

### Submit a video render

> **Note**: These examples use [`jq`](https://jqlang.github.io/jq/) for JSON parsing. If `jq` is not available, see the grep-based fallback below each snippet.

```bash
# Write TSX code to a file first (for reference/iteration)
cat > video.tsx << 'TEMPLATE'
const img = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "a cozy cabin in the mountains at sunset, warm golden light, snow on peaks",
  aspectRatio: "16:9"
});

const vid = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "gentle camera push-in, smoke rising from chimney, birds flying across sky", images: [img] },
  duration: 5
});

export default (
  <Render width={1920} height={1080}>
    <Clip duration={5}>{vid}</Clip>
  </Render>
);
TEMPLATE

# Submit to render service (requires jq)
JOB_ID=$(curl -s -X POST https://render.varg.ai/api/render \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"code\": $(cat video.tsx | jq -Rs .)}" \
  | jq -r '.job_id')

echo "Job submitted: $JOB_ID"
```

<details>
<summary>Without jq</summary>

```bash
# Read TSX and escape it for JSON (no jq needed)
CODE=$(sed 's/\\/\\\\/g; s/"/\\"/g; s/$/\\n/' video.tsx | tr -d '\n' | sed 's/\\n$//')

RESPONSE=$(curl -s -X POST https://render.varg.ai/api/render \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"code\": \"$CODE\"}")

JOB_ID=$(echo "$RESPONSE" | grep -o '"job_id":"[^"]*"' | cut -d'"' -f4)
echo "Job submitted: $JOB_ID"
```

</details>

### Poll for result

```bash
# Poll until status is "completed" or "failed"
while true; do
  RESULT=$(curl -s "https://render.varg.ai/api/render/jobs/$JOB_ID" \
    -H "Authorization: Bearer $VARG_API_KEY")
  STATUS=$(echo "$RESULT" | jq -r '.status')
  echo "Status: $STATUS"
  if [ "$STATUS" = "completed" ]; then
    echo "$RESULT" | jq -r '.output_url'
    break
  elif [ "$STATUS" = "failed" ]; then
    echo "$RESULT" | jq -r '.error'
    break
  fi
  sleep 10
done
```

<details>
<summary>Without jq</summary>

```bash
while true; do
  RESULT=$(curl -s "https://render.varg.ai/api/render/jobs/$JOB_ID" \
    -H "Authorization: Bearer $VARG_API_KEY")
  STATUS=$(echo "$RESULT" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  echo "Status: $STATUS"
  if [ "$STATUS" = "completed" ]; then
    echo "$RESULT" | grep -o '"output_url":"[^"]*"' | cut -d'"' -f4
    break
  elif [ "$STATUS" = "failed" ]; then
    echo "$RESULT" | grep -o '"error":"[^"]*"' | cut -d'"' -f4
    break
  fi
  sleep 10
done
```

</details>

### Cloud render: Talking Head

```bash
cat > talking-head.tsx << 'TEMPLATE'
const character = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "friendly female tech host, professional studio background, warm smile, looking at camera",
  aspectRatio: "9:16"
});

const animated = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "woman talks naturally to camera, subtle hand gestures", images: [character] },
  duration: 10
});

const voice = Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "rachel",
  children: "Hey everyone! Welcome back. Today we are going to talk about something really exciting."
});

const synced = Video({
  model: varg.videoModel("sync-v2-pro"),
  prompt: { video: animated, audio: voice }
});

export default (
  <Render width={1080} height={1920}>
    <Clip duration={10}>{synced}</Clip>
    <Captions src={voice} style="tiktok" position="bottom" withAudio />
  </Render>
);
TEMPLATE

curl -s -X POST https://render.varg.ai/api/render \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"code\": $(cat talking-head.tsx | jq -Rs .)}"
```

---

## Local Render Templates

The following templates use local mode with imports. Run with `bunx vargai render <file> --verbose`.

---

## 1. Hello World -- Single Image + Video

The simplest possible template: one image, one video, one clip.

```tsx
/** @jsxImportSource vargai */
import { Render, Clip, Image, Video } from "vargai/react"
import { createVarg } from "vargai/ai"

const varg = createVarg({ apiKey: process.env.VARG_API_KEY! })

const img = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "a cozy cabin in the mountains at sunset, warm golden light, snow on peaks",
  aspectRatio: "16:9"
})

const vid = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "gentle camera push-in, smoke rising from chimney, birds flying across sky", images: [img] },
  duration: 5
})

export default (
  <Render width={1920} height={1080}>
    <Clip duration={5}>{vid}</Clip>
  </Render>
)
```

**Cost**: ~155 credits ($1.55) -- 5 (image) + 150 (video)

---

## 2. Talking Head -- Character + Speech + Lipsync + Captions

Full talking-head pipeline with AI-generated character.

```tsx
/** @jsxImportSource vargai */
import { Render, Clip, Image, Video, Speech, Captions } from "vargai/react"
import { createVarg } from "vargai/ai"

const varg = createVarg({ apiKey: process.env.VARG_API_KEY! })

// 1. Generate character
const character = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "friendly female tech host, professional studio background, warm smile, looking at camera",
  aspectRatio: "9:16"
})

// 2. Animate character
const animated = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "woman talks naturally to camera, subtle hand gestures, professional demeanor", images: [character] },
  duration: 10
})

// 3. Generate voiceover
const voice = Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "rachel",
  children: "Hey everyone! Welcome back to the channel. Today we're going to talk about something really exciting."
})

// 4. Lipsync video to speech
const synced = Video({
  model: varg.videoModel("sync-v2-pro"),
  prompt: { video: animated, audio: voice }
})

export default (
  <Render width={1080} height={1920}>
    <Clip duration={10}>{synced}</Clip>
    <Captions src={voice} style="tiktok" position="bottom" withAudio />
  </Render>
)
```

**Cost**: ~310 credits ($3.10) -- 5 (image) + 150 (video) + 25 (speech) + 80 (lipsync) + 50 (captions/transcription)

---

## 3. Product Showcase -- 4-Scene Commercial

Multi-scene product video with consistent character, transitions, music, and packshot.

```tsx
/** @jsxImportSource vargai */
import { Render, Clip, Music, Captions, Title, Image, Video, Speech, Packshot } from "vargai/react"
import { createVarg } from "vargai/ai"

const varg = createVarg({ apiKey: process.env.VARG_API_KEY! })

// -- Config --
const PRODUCT = "sleek wireless earbuds, matte black, premium finish"
const BRAND = "AuraSound"

// -- Character reference (for consistency) --
const model_ref = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "young woman, casual streetwear, confident expression, neutral background",
  aspectRatio: "9:16"
})

// -- Scene 1: Hero product shot --
const heroImg = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: `${PRODUCT}, floating against dark gradient, dramatic studio lighting`,
  aspectRatio: "9:16"
})
const heroVid = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "slow 360 rotation, light rays catching surface, camera orbits", images: [heroImg] },
  duration: 5
})

// -- Scene 2: Lifestyle (character using product) --
const lifestyleImg = Image({
  model: varg.imageModel("nano-banana-pro/edit"),
  prompt: { text: "same woman wearing wireless earbuds, walking through city street, golden hour", images: [model_ref] },
  aspectRatio: "9:16"
})
const lifestyleVid = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "woman walks confidently, bobbing head to music, city blurs behind", images: [lifestyleImg] },
  duration: 5
})

// -- Scene 3: Close-up detail --
const detailImg = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: `extreme close-up of ${PRODUCT}, touch controls glowing blue, soft bokeh`,
  aspectRatio: "9:16"
})
const detailVid = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "finger taps earbud, blue pulse radiates outward, satisfying click", images: [detailImg] },
  duration: 5
})

// -- Voiceover --
const voice = Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "adam",
  children: `Introducing ${BRAND}. Premium sound. Zero compromise. Experience music the way it was meant to be heard.`
})

export default (
  <Render width={1080} height={1920} fps={30}>
    <Music model={varg.musicModel("music_v1")} prompt="modern electronic, premium feel, building energy" duration={20} volume={0.25} ducking />
    <Clip duration={5}>{heroVid}<Title position="bottom">{BRAND}</Title></Clip>
    <Clip duration={5} transition={{ name: "fade", duration: 0.5 }}>{lifestyleVid}</Clip>
    <Clip duration={5} transition={{ name: "wipeleft", duration: 0.3 }}>{detailVid}</Clip>
    <Clip duration={3} transition={{ name: "fade", duration: 0.5 }}>
      <Packshot
        url={`${BRAND.toLowerCase()}.com`}
        text="Shop Now"
        colors={{ background: "#0a0a0a", text: "#ffffff", button: "#3b82f6", buttonText: "#ffffff" }}
        blinking
      />
    </Clip>
    <Captions src={voice} style="karaoke" position="bottom" withAudio />
  </Render>
)
```

**Cost**: ~510 credits ($5.10) -- 20 (4 images) + 450 (3 videos) + 25 (speech) + 30 (music)

---

## 4. Data-Driven Slideshow

Generate a slideshow from an array of prompts. Easy to customize.

```tsx
/** @jsxImportSource vargai */
import { Render, Clip, Music, Image } from "vargai/react"
import { createVarg } from "vargai/ai"

const varg = createVarg({ apiKey: process.env.VARG_API_KEY! })

const slides = [
  "sunrise over a calm ocean, golden light reflecting on water",
  "misty mountain peaks at dawn, layers of purple and orange",
  "autumn forest path, golden leaves falling, dappled sunlight",
  "northern lights over a frozen lake, vivid green and purple",
  "desert sand dunes at sunset, long shadows, warm orange tones",
]

const images = slides.map(prompt =>
  Image({ model: varg.imageModel("nano-banana-pro"), prompt, aspectRatio: "16:9" })
)

const totalDuration = slides.length * 3

export default (
  <Render width={1920} height={1080}>
    <Music model={varg.musicModel("music_v1")} prompt="peaceful ambient, gentle piano, nature sounds" duration={totalDuration} volume={0.4} />
    {images.map((img, i) => (
      <Clip key={i} duration={3} transition={i > 0 ? { name: "dissolve", duration: 0.8 } : undefined}>
        {img}
      </Clip>
    ))}
  </Render>
)
```

**Cost**: ~55 credits ($0.55) -- 25 (5 images) + 30 (music)

---

## 5. Split Screen Comparison

Side-by-side layout with two videos.

```tsx
/** @jsxImportSource vargai */
import { Render, Clip, Split, Image, Video, Title } from "vargai/react"
import { createVarg } from "vargai/ai"

const varg = createVarg({ apiKey: process.env.VARG_API_KEY! })

const beforeImg = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "messy cluttered desk, papers everywhere, dim lighting",
  aspectRatio: "9:16"
})
const beforeVid = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "camera slowly reveals the chaos, papers flutter", images: [beforeImg] },
  duration: 5
})

const afterImg = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "perfectly organized minimalist desk, clean lines, bright natural light",
  aspectRatio: "9:16"
})
const afterVid = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "camera glides across clean surface, light catches polished wood", images: [afterImg] },
  duration: 5
})

export default (
  <Render width={1080} height={1920}>
    <Clip duration={5}>
      <Split direction="horizontal">
        {beforeVid}
        {afterVid}
      </Split>
      <Title position="top">Before vs After</Title>
    </Clip>
  </Render>
)
```

**Cost**: ~310 credits ($3.10) -- 10 (2 images) + 300 (2 videos)

---

## 6. Character Consistency -- Multi-Scene Story

The ref -> edit -> animate pattern for a consistent character across 3 scenes.

```tsx
/** @jsxImportSource vargai */
import { Render, Clip, Music, Image, Video } from "vargai/react"
import { createVarg } from "vargai/ai"

const varg = createVarg({ apiKey: process.env.VARG_API_KEY! })

// 1. Character reference
const ref = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "a woman in her 30s, dark hair in a ponytail, wearing a leather jacket, determined expression",
  aspectRatio: "9:16"
})

// 2. Edit into 3 different scenes
const scenes = [
  { env: "standing on a rooftop at night, city skyline behind, wind in hair", motion: "woman looks out over the city, hair blowing, camera slowly pulls back" },
  { env: "inside a dimly lit bar, neon signs, smoky atmosphere", motion: "woman turns on the barstool, eyes scanning the room, camera tracks left" },
  { env: "walking down a rain-soaked alley, reflections on wet pavement", motion: "woman walks forward purposefully, rain falling around her, tracking shot" },
]

const sceneImages = scenes.map(s =>
  Image({
    model: varg.imageModel("nano-banana-pro/edit"),
    prompt: { text: `same woman ${s.env}`, images: [ref] },
    aspectRatio: "9:16"
  })
)

const sceneVideos = scenes.map((s, i) =>
  Video({
    model: varg.videoModel("kling-v3"),
    prompt: { text: s.motion, images: [sceneImages[i]] },
    duration: 5
  })
)

export default (
  <Render width={1080} height={1920}>
    <Music model={varg.musicModel("music_v1")} prompt="dark atmospheric, deep bass, tension building" duration={15} volume={0.3} />
    {sceneVideos.map((vid, i) => (
      <Clip key={i} duration={5} transition={i > 0 ? { name: "fade", duration: 0.3 } : undefined}>
        {vid}
      </Clip>
    ))}
  </Render>
)
```

**Cost**: ~500 credits ($5.00) -- 20 (4 images) + 450 (3 videos) + 30 (music)

---

## Render Commands

```bash
# Full render (costs credits)
bunx vargai render template.tsx --verbose

# Preview with placeholders (free)
bunx vargai render template.tsx --preview

# Render in background (recommended for long jobs)
nohup bunx vargai render template.tsx --verbose > output/render.log 2>&1 &
echo "PID: $!"
```
