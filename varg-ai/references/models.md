# Model Catalog

1 credit = 1 cent. $1 = 100 credits.

> Credits below are **estimates** from the live catalog. Always verify with `GET https://api.varg.ai/v2/pricing` (public, no auth) or price the exact request with `POST /v2/estimate` (same body as the generation call, no job created).

## Video Models

Use with `varg.videoModel("id")`.

| Model ID | Credits (~) | Duration | Notes |
|----------|---------|----------|-------|
| `kling_v3` | 221 | 3-15s (integer) | **Best quality (default)**. Pro tier. |
| `kling_v3_standard` | 221 | 3-15s (integer) | Standard tier. |
| `seedance_2_preview` | 394 | **5 or 10 ONLY** | ByteDance Seedance 2. Excellent quality. Auto watermark removal. |
| `seedance_2_fast_preview` | 237 | **5 or 10 ONLY** | ByteDance Seedance 2 Fast. Faster generation, auto watermark removal. |
| `sora_2` | 105 | varies | OpenAI video model. |
| `sora_2_pro` | 315 | varies | OpenAI premium tier. |
| `kling_v2.6` | varies | 3-15s (integer) | Native audio support: `providerOptions: { varg: { generate_audio: true } }` |
| `kling_v2.5` | 147 | **5 or 10 ONLY** | Legacy. Any other duration causes 422 error. |
| `kling_v2.1` | 147 | 5 or 10 | Legacy. |
| `kling_v2` | 147 | 5 or 10 | Legacy. |
| `wan_2.5` | 158 | varies | Fast and affordable. |
| `wan_2.5_preview` | 158 | varies | Preview version. |
| `minimax` | 84 | varies | Alternative provider. |
| `ltx_2_19b_distilled` | 53 | varies | **Cheapest**. Uses `num_frames` not `duration`, `video_size` not `aspect_ratio`. Native audio support. |
| `grok_imagine` | 105 | varies | xAI model. Native audio support. |

### Video Editing / Motion Control

| Model ID | Credits (~) | Notes |
|----------|---------|-------|
| `grok_imagine_edit` | 105 | Video editing via xAI. |
| `sora_2_remix` | 105 | Sora video remix. |
| `kling_v2.6_motion` | 221 | Motion control (camera trajectories). |

### Lipsync Models

| Model ID | Credits (~) | Notes |
|----------|---------|-------|
| `sync_v2` | 53 | Standard lipsync. |
| `sync_v2_pro` | 84 | Higher quality lipsync. |
| `sync_v3` | 105 | Latest sync. |
| `lipsync` | 53 | Basic lipsync. |
| `omnihuman_v1.5` | ~1008 | Advanced human motion. Expensive. |
| `veed_fabric_1.0` | ~473 | VEED fabric lipsync. |

### Lipsync Model Selection Guide

**`veed_fabric_1.0` is the best and recommended model for talking heads.** It takes a still image + audio and produces a talking video directly — simplest pipeline, fastest results, best quality for speech-first workflows.

| Model | Pipeline | Input | Speed | Quality | Best For |
|-------|----------|-------|-------|---------|----------|
| `veed_fabric_1.0` | Image + audio -> video | Still image + audio | Fast (~30-50s) | **Best** | **Talking heads, narrator clips (RECOMMENDED)** |
| `sync_v2` | Video + audio -> video | Pre-animated video + audio | Medium | Good | Adding lip movement to existing video |
| `omnihuman_v1.5` | Image + audio -> video | Still image + audio | Slow | Variable | Full-body motion, experimental |

**Decision matrix:**
- **"I need a talking head"** -> `veed_fabric_1.0` (best, simplest, fastest)
- **"I have a speech audio and a character image"** -> `veed_fabric_1.0`
- **"I have an animated video and want to add lip movement"** -> `sync_v2`
- **"I need full-body gestures matching speech"** -> `omnihuman_v1.5` (experimental)

**VEED Fabric workflow** (recommended — speech-first):
```tsx
const portrait = Image({ model: varg.imageModel("nano_banana_pro"), prompt: "..." });
const talking = Video({
  model: varg.videoModel("veed_fabric_1.0"),
  keepAudio: true,
  prompt: { images: [portrait], audio: speechSegment },
  providerOptions: { varg: { resolution: "720p" } },  // 480p or 720p only
});
```

### Video Prompt Format

**Text-to-video** (string prompt):
```tsx
Video({ model: varg.videoModel("kling_v3"), prompt: "a cat playing piano", duration: 5 })
```

**Image-to-video** (object prompt with ONE image):
```tsx
Video({
  model: varg.videoModel("kling_v3"),
  prompt: { text: "cat starts playing keys", images: [catImage] },
  duration: 5
})
```

**Lipsync — image + audio** (recommended, VEED):
```tsx
Video({
  model: varg.videoModel("veed_fabric_1.0"),
  keepAudio: true,
  prompt: { images: [portrait], audio: voiceover }
})
```

**Lipsync — video + audio** (for pre-animated video):
```tsx
Video({
  model: varg.videoModel("sync_v2"),
  prompt: { video: animatedCharacter, audio: voiceover }
})
```

### Common Provider Options (video)

```tsx
Video({
  model: varg.videoModel("kling_v2.6"),
  prompt: "...",
  duration: 5,
  aspectRatio: "9:16",
  providerOptions: {
    varg: {
      generate_audio: true,   // Native audio (kling_v2.6, ltx, grok)
      resolution: "2K",       // Higher resolution
    }
  }
})
```

---

## Image Models

Use with `varg.imageModel("id")`.

| Model ID | Credits (~) | Prompt Format | Notes |
|----------|---------|---------------|-------|
| `nano_banana_pro` | 126 | `string` | **Best quality**. Text-to-image. |
| `nano_banana_pro/edit` | 126 | `{ text, images }` | Reference-based editing. Always pass reference via `images: [ref]`. |
| `nano_banana_2` | 68 | `{ text, images? }` | Cheaper nano banana. |
| `nano_banana_2/edit` | 68 | `{ text, images }` | Explicit edit mode. |
| `grok_imagine_image` | 4 | `string` | **Cheapest**. xAI image generation. |
| `flux_schnell` | ~5 | `string` | Fast text-to-image. |
| `flux_dev` | 68 | `string` | Better quality Flux. |
| `flux_pro` | 68 | `string` | Best Flux quality. |
| `recraft_v3` | 11 | `string` | Stylized / design images. |
| `seedream_v4.5/edit` | 53 | `{ text, images }` | ByteDance image editing. |
| `qwen_angles` | 9 | `{ text, images }` | Multi-angle generation from reference. |
| `phota` | 38 | `string` | Photorealistic generation. |
| `soul` | 21 | `string` | Higgsfield character generation. 80+ style presets. |

### Image Prompt Examples

**Text-to-image** (nano_banana_pro, flux):
```tsx
Image({ model: varg.imageModel("nano_banana_pro"), prompt: "a sunset over the ocean", aspectRatio: "16:9" })
```

**Reference editing** (nano_banana_pro/edit):
```tsx
Image({
  model: varg.imageModel("nano_banana_pro/edit"),
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

| Model ID | Credits (~) | Notes |
|----------|---------|-------|
| `turbo` | 105 | Alias for `eleven_turbo_v2`. Fast English only. |
| `eleven_turbo_v2` | 105 | Fast English TTS. |
| `eleven_turbo_v2_5` | 105 | Updated turbo. |
| `eleven_flash_v2` | 105 | Ultra-fast. |
| `eleven_flash_v2_5` | 105 | Updated flash. |
| `eleven_multilingual_v2` | 210 | Multi-language support. |
| `eleven_v3` | 210 | Latest, highest quality. |

> Speech is billed per character — the credits above are catalog estimates for a typical utterance. Short lines cost less; use `POST /v2/estimate` with your actual `text` for the real price.

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

| Model ID | Credits (~) | Notes |
|----------|---------|-------|
| `music_v1` | 79 | AI music generation. Always set `duration`. |
| `eleven_music` | 79 | Alias. |

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

| Model ID | Credits (~) | Notes |
|----------|---------|-------|
| `whisper` | 6 | OpenAI Whisper via fal. |
| `whisper_large_v3` | 6 | Whisper large model. |
| `groq_whisper_large_v3_turbo` | 4 | Fastest/cheapest via Groq. |

---

## Quick Reference: Recommended Defaults

| Task | Model | Credits (~) |
|------|-------|---------|
| Image (best quality) | `nano_banana_pro` | 126 |
| Image editing | `nano_banana_pro/edit` | 126 |
| Image (cheap) | `grok_imagine_image` | 4 |
| Image (fast) | `flux_schnell` | ~5 |
| Video (default) | `kling_v3` | 221 |
| Video (premium) | `seedance_2_preview` | 394 |
| Video (affordable) | `sora_2` | 105 |
| Video (fast, ByteDance) | `seedance_2_fast_preview` | 237 |
| Video (cheapest) | `ltx_2_19b_distilled` | 53 |
| Speech (fast) | `eleven_turbo_v2_5` | ~105 |
| Speech (best) | `eleven_v3` | ~210 |
| Music | `music_v1` | 79 |
| Lipsync (cheap, video+audio) | `sync_v2` | 53 |
| Talking Head (image+audio) | `veed_fabric_1.0` | ~473 |

Live catalog: `GET https://api.varg.ai/v2/pricing`.
