# Model Catalog

1 credit = 1 cent. $1 = 100 credits.

## Video Models

Use with `varg.videoModel("id")`.

| Model ID | Credits | Duration | Notes |
|----------|---------|----------|-------|
| `kling-v3` | 150 | 3-15s (integer) | **Best quality (default)**. O3 Pro tier. |
| `kling-v3-standard` | 100 | 3-15s (integer) | O3 Standard tier. Good quality, cheaper. |
| `seedance-2-preview` | 250 | **5 or 10 ONLY** | ByteDance Seedance 2. Excellent quality. Auto watermark removal. |
| `seedance-2-fast-preview` | 150 | **5 or 10 ONLY** | ByteDance Seedance 2 Fast. Faster generation, auto watermark removal. |
| `kling-v2.6` | 150 | 3-15s (integer) | Native audio support: `providerOptions: { varg: { generate_audio: true } }` |
| `kling-v2.5` | 100 | **5 or 10 ONLY** | Legacy. Any other duration causes 422 error. |
| `kling-v2.1` | 100 | 5 or 10 | Legacy. |
| `kling-v2` | 100 | 5 or 10 | Legacy. |
| `wan-2.5` | 80 | varies | Fast and affordable. |
| `wan-2.5-preview` | 60 | varies | Preview version. |
| `minimax` | 80 | varies | Alternative provider. |
| `ltx-2-19b-distilled` | 50 | varies | **Cheapest**. Uses `num_frames` not `duration`, `video_size` not `aspect_ratio`. Native audio support. |
| `grok-imagine` | 100 | varies | xAI model. Native audio support. |

### Video Editing / Motion Control

| Model ID | Credits | Notes |
|----------|---------|-------|
| `grok-imagine-edit` | 100 | Video editing via xAI. |
| `kling-v2.6-motion` | 150 | Motion control (camera trajectories). |
| `kling-v2.6-motion-standard` | 100 | Motion control, standard tier. |

### Lipsync Models

| Model ID | Credits | Notes |
|----------|---------|-------|
| `sync-v2` | 50 | Standard lipsync. |
| `sync-v2-pro` | 80 | Higher quality lipsync. |
| `lipsync` | 50 | Basic lipsync. |
| `omnihuman-v1.5` | varies | Advanced human motion. |
| `veed-fabric-1.0` | varies | VEED fabric lipsync. |

### Lipsync Model Selection Guide

| Model | Pipeline | Input | Speed | Quality | Best For |
|-------|----------|-------|-------|---------|----------|
| `veed-fabric-1.0` | Image + audio -> video | Still image + audio | Fast (~30-50s) | Good | Speech-first workflows, narrator clips |
| `sync-v2-pro` | Video + audio -> video | Pre-animated video + audio | Medium (~60-90s) | Best | High-quality talking heads, facial detail |
| `sync-v2` | Video + audio -> video | Pre-animated video + audio | Medium | Good | Budget alternative to sync-v2-pro |
| `omnihuman-v1.5` | Image + audio -> video | Still image + audio | Slow | Variable | Full-body motion, experimental |

**Decision matrix:**
- **"I have a speech audio and a character image"** -> `veed-fabric-1.0` (simplest, fastest)
- **"I have an animated video and want to add lip movement"** -> `sync-v2-pro` (best quality)
- **"I need full-body gestures matching speech"** -> `omnihuman-v1.5` (experimental)

**VEED Fabric workflow** (speech-first):
```tsx
const portrait = Image({ model: varg.imageModel("nano-banana-pro"), prompt: "..." });
const talking = Video({
  model: varg.videoModel("veed-fabric-1.0"),
  keepAudio: true,
  prompt: { images: [portrait], audio: speechSegment },
  providerOptions: { varg: { resolution: "720p" } },  // 480p or 720p only
});
```

**sync-v2-pro workflow** (animate-then-lipsync):
```tsx
const portrait = Image({ ... });
const animated = Video({ model: varg.videoModel("kling-v3"), prompt: { images: [portrait], text: "person talking" }, duration: 5 });
const talking = Video({
  model: varg.videoModel("sync-v2-pro"),
  keepAudio: true,
  prompt: { images: [animated], audio: speechSegment },
});
```

### Video Prompt Format

**Text-to-video** (string prompt):
```tsx
Video({ model: varg.videoModel("kling-v3"), prompt: "a cat playing piano", duration: 5 })
```

**Image-to-video** (object prompt with ONE image):
```tsx
Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "cat starts playing keys", images: [catImage] },
  duration: 5
})
```

**Lipsync** (video + audio):
```tsx
Video({
  model: varg.videoModel("sync-v2-pro"),
  prompt: { video: animatedCharacter, audio: voiceover }
})
```

### Common Provider Options (video)

```tsx
Video({
  model: varg.videoModel("kling-v2.6"),
  prompt: "...",
  duration: 5,
  aspectRatio: "9:16",
  providerOptions: {
    varg: {
      generate_audio: true,   // Native audio (kling-v2.6, ltx, grok)
      resolution: "2K",       // Higher resolution
    }
  }
})
```

---

## Image Models

Use with `varg.imageModel("id")`.

| Model ID | Credits | Prompt Format | Notes |
|----------|---------|---------------|-------|
| `nano-banana-pro` | 5 | `string` | **Best default**. Text-to-image. |
| `nano-banana-pro/edit` | 5 | `{ text, images }` | Reference-based editing. Always pass reference via `images: [ref]`. |
| `nano-banana-2` | 5 | `{ text, images? }` | Newer model (slower). |
| `nano-banana-2/edit` | 5 | `{ text, images }` | Explicit edit mode. |
| `flux-schnell` | 5 | `string` | Fast text-to-image. |
| `flux-dev` | 8 | `string` | Better quality Flux. |
| `flux-pro` | 10 | `string` | Best Flux quality. |
| `recraft-v3` | 10 | `string` | Stylized / design images. |
| `recraft-v4-pro` | 10 | `string` | Latest Recraft. |
| `seedream-v4.5/edit` | 5 | `{ text, images }` | ByteDance image editing. |
| `qwen-angles` | 8 | `{ text, images }` | Multi-angle generation from reference. |
| `qwen-image-2` | varies | `string` | Qwen image generation. |
| `qwen-image-2-pro` | varies | `string` | Qwen pro tier. |
| `soul` | 15 | `string` | Higgsfield character generation. 80+ style presets. |

### Image Prompt Examples

**Text-to-image** (nano-banana-pro, flux):
```tsx
Image({ model: varg.imageModel("nano-banana-pro"), prompt: "a sunset over the ocean", aspectRatio: "16:9" })
```

**Reference editing** (nano-banana-pro/edit):
```tsx
Image({
  model: varg.imageModel("nano-banana-pro/edit"),
  prompt: { text: "same person in a tropical beach setting", images: [referenceImage] },
  aspectRatio: "9:16"
})
```

### Aspect Ratios (images and videos)

| Ratio | Pixels | Use Case |
|-------|--------|----------|
| `16:9` | 1920 x 1080 | YouTube, landscape video |
| `9:16` | 1080 x 1920 | TikTok, Reels, Shorts |
| `1:1` | 1080 x 1080 | Instagram feed, square |
| `4:3` | 1440 x 1080 | Classic TV, presentations |
| `3:4` | 1080 x 1440 | Portrait photos |
| `4:5` | 1080 x 1350 | Instagram portrait (recommended for feed) |

Most models support all standard ratios.

---

## Speech Models (ElevenLabs)

Use with `varg.speechModel("id")`.

| Model ID | Credits | Notes |
|----------|---------|-------|
| `turbo` | 20 | Alias for `eleven_turbo_v2`. Fast, recommended. |
| `eleven_turbo_v2` | 20 | Fast English TTS. |
| `eleven_turbo_v2_5` | 20 | Updated turbo. |
| `eleven_flash_v2` | 20 | Ultra-fast. |
| `eleven_flash_v2_5` | 20 | Updated flash. |
| `eleven_multilingual_v2` | 25 | Multi-language support. |
| `eleven_v3` | 25 | Latest, highest quality. |

### Available Voices

ElevenLabs default (premade) voices. Pass the `voice_id` directly in the `voice` prop.

| Name | Voice ID | Gender | Accent | Style |
|------|----------|--------|--------|-------|
| Adam | `pNInz6obpgDQGcFmaJgB` | Male | American | Dominant, firm |
| Alice | `Xb7hH8MSUJpSbSDYk0k2` | Female | British | Clear, engaging |
| Bella | `hpp4J3VqNfWAUOO0d1Us` | Female | American | Professional, warm |
| Bill | `pqHfZKP75CvOlQylNhV4` | Male | American | Wise, mature |
| Brian | `nPczCjzI2devNBz1zQrb` | Male | American | Deep, resonant |
| Callum | `N2lVS1w4EtoT3dr4eOWO` | Male | American | Husky, character |
| Charlie | `IKne3meq5aSn9XLyUdCD` | Male | Australian | Confident, energetic |
| Chris | `iP95p4xoKVk53GoZ742B` | Male | American | Charming, casual |
| Daniel | `onwK4e9ZLuTAKqWW03F9` | Male | British | Steady, broadcast |
| Eric | `cjVigY5qzO86Huf0OWal` | Male | American | Smooth, trustworthy |
| George | `JBFqnCBsd6RMkjVDRZzb` | Male | British | Warm, storyteller |
| Harry | `SOYHLrjzK2X1ezoPC6cr` | Male | American | Fierce, character |
| Jessica | `cgSgspJ2msm6clMCkdW9` | Female | American | Playful, bright |
| Laura | `FGY2WhTYpPnrIDTdsKH5` | Female | American | Enthusiastic, quirky |
| Liam | `TX3LPaxmHKxFdv7VOQHJ` | Male | American | Energetic, social media |
| Lily | `pFZP5JQG7iQjIQuC4Bku` | Female | British | Velvety, refined |
| Matilda | `XrExE9yKIg1WjnnlVkGX` | Female | American | Knowledgeable, professional |
| River | `SAz9YHcvj6GT2YYXdXww` | Neutral | American | Relaxed, informative |
| Roger | `CwhRBWXzGAHq8TQ4Fs17` | Male | American | Laid-back, casual |
| Sarah | `EXAVITQu4vr4xnSDxMaL` | Female | American | Mature, reassuring |
| Will | `bIHbv24MWmeRgasZH58o` | Male | American | Relaxed, optimistic |

**Recommended:** `Sarah`, `Brian`, `Matilda`, `George`, `Jessica` cover most use cases.

> Any valid ElevenLabs `voice_id` can also be passed directly — not limited to this list.

### Speech Usage

```tsx
const voice = Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "EXAVITQu4vr4xnSDxMaL",
  children: "Welcome to our product showcase."
})
```

---

## Music Model (ElevenLabs)

Use with `varg.musicModel("music_v1")`.

| Model ID | Credits | Notes |
|----------|---------|-------|
| `music_v1` | 30 | AI music generation. Always set `duration`. |

### Music Usage

```tsx
<Music
  model={varg.musicModel("music_v1")}
  prompt="upbeat electronic, rising energy"
  duration={15}
  volume={0.3}
  ducking    // Auto-lower under speech
/>
```

**Important**: Always set `duration` on Music. Without it, ElevenLabs generates ~60s which extends the video.

---

## Transcription Models

| Model ID | Credits | Notes |
|----------|---------|-------|
| `whisper` | 10 | OpenAI Whisper via fal. |
| `whisper-large-v3` | 10 | Whisper large model. |

---

## Quick Reference: Recommended Defaults

| Task | Model | Credits |
|------|-------|---------|
| Image (default) | `nano-banana-pro` | 5 |
| Image editing | `nano-banana-pro/edit` | 5 |
| Image (fast) | `flux-schnell` | 5 |
| Video (default) | `kling-v3` | 150 |
| Video (premium) | `seedance-2-preview` | 250 |
| Video (budget) | `kling-v3-standard` | 100 |
| Video (fast, ByteDance) | `seedance-2-fast-preview` | 150 |
| Video (cheapest) | `ltx-2-19b-distilled` | 50 |
| Speech | `eleven_v3` or `turbo` | 20-25 |
| Music | `music_v1` | 30 |
| Lipsync | `sync-v2-pro` | 80 |
