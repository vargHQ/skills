# Model Catalog

1 credit = 1 cent. $1 = 100 credits.

## Video Models

Use with `varg.videoModel("id")` or `fal.videoModel("id")`.

| Model ID | Credits | Duration | Notes |
|----------|---------|----------|-------|
| `kling-v3` | 150 | 3-15s (integer) | **Best quality (default)**. O3 Pro tier. |
| `kling-v3-standard` | 100 | 3-15s (integer) | O3 Standard tier. Good quality, cheaper. |
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

Use with `varg.imageModel("id")` or `fal.imageModel("id")`.

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

Use with `varg.speechModel("id")` or `elevenlabs.speechModel("id")`.

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

`adam`, `alice`, `aria`, `bill`, `brian`, `callum`, `charlie`, `charlotte`, `chris`, `daniel`, `eric`, `george`, `jessica`, `laura`, `liam`, `lily`, `matilda`, `rachel`, `river`, `roger`, `sarah`, `will`

Classic voices: `rachel`, `domi`, `sarah`, `antoni`, `elli`, `josh`, `arnold`, `adam`, `sam`

### Speech Usage

```tsx
const voice = Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "rachel",
  children: "Welcome to our product showcase."
})
```

---

## Music Model (ElevenLabs)

Use with `varg.musicModel("music_v1")` or `elevenlabs.musicModel()`.

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
| Video (budget) | `kling-v3-standard` | 100 |
| Video (cheapest) | `ltx-2-19b-distilled` | 50 |
| Speech | `eleven_v3` or `turbo` | 20-25 |
| Music | `music_v1` | 30 |
| Lipsync | `sync-v2-pro` | 80 |
