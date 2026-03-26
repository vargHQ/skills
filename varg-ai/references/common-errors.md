# Common Errors & Debugging

## Duration Constraint Violations

### kling-v2.5: "422 Unprocessable Entity"

**Cause**: kling-v2.5 only accepts duration `5` or `10`. Any other value (3, 7, 12, etc.) fails.

**Fix**: Use exactly `duration: 5` or `duration: 10`. Or switch to kling-v3 which accepts any integer 3-15.

### kling-v3: duration must be integer 3-15

**Cause**: Non-integer or out-of-range duration.

**Fix**: Use integers only: `3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15`.

---

## Multiple Images in Video Prompt

**Error**: Generation fails or produces unexpected results.

**Cause**: `Video({ prompt: { images: [img1, img2] } })` -- passing more than one image.

**Fix**: Pass exactly ONE image:
```tsx
// CORRECT
Video({ prompt: { text: "...", images: [singleImage] }, ... })

// WRONG
Video({ prompt: { text: "...", images: [img1, img2] }, ... })
```

---

## Wrong Provider Options Namespace

**Error**: Provider options are silently ignored.

**Cause**: Using `providerOptions: { fal: {...} }` when generating through the varg gateway.

**Fix**: Use the `varg` namespace when using `createVarg()`:
```tsx
// CORRECT (gateway)
providerOptions: { varg: { generate_audio: true } }

// WRONG (gateway)
providerOptions: { fal: { generate_audio: true } }

// CORRECT (direct fal provider)
providerOptions: { fal: { generate_audio: true } }
```

Rule: match the namespace to the provider you're using. Gateway = `varg`. Direct fal = `fal`.

---

## JSX Syntax for Media Creation

**Error**: Image/Video/Speech don't generate anything.

**Cause**: Using JSX syntax `<Image prompt="..." />` instead of function calls.

**Fix**: Media generation must use function calls:
```tsx
// CORRECT
const img = Image({ model: varg.imageModel("nano-banana-pro"), prompt: "..." })

// WRONG
const img = <Image model={varg.imageModel("nano-banana-pro")} prompt="..." />
```

JSX is only for composition components: `<Render>`, `<Clip>`, `<Music>`, `<Captions>`, `<Title>`, `<Overlay>`, `<Split>`, `<Grid>`, `<Packshot>`.

---

## nano-banana-pro/edit: Missing Images

**Error**: "images is required" or generation produces generic image ignoring reference.

**Cause**: Using `nano-banana-pro/edit` with a plain string prompt instead of `{ text, images }`.

**Fix**:
```tsx
// CORRECT
Image({
  model: varg.imageModel("nano-banana-pro/edit"),
  prompt: { text: "same person on a beach", images: [referenceImage] }
})

// WRONG
Image({
  model: varg.imageModel("nano-banana-pro/edit"),
  prompt: "same person on a beach"
})
```

---

## nano-banana-pro (non-edit): Wrong Prompt Format

**Error**: Unexpected results or errors.

**Cause**: Passing `{ text, images }` object to `nano-banana-pro` (non-edit variant).

**Fix**: `nano-banana-pro` (without `/edit`) takes a plain string:
```tsx
// CORRECT
Image({ model: varg.imageModel("nano-banana-pro"), prompt: "a sunset over the ocean" })

// WRONG
Image({ model: varg.imageModel("nano-banana-pro"), prompt: { text: "a sunset", images: [] } })
```

---

## Music Duration Not Set

**Error**: Video output is unexpectedly long (30-60+ seconds).

**Cause**: `<Music>` without `duration` prop. ElevenLabs generates ~60s of audio by default, which extends the entire video.

**Fix**: Always set `duration` to match total video length:
```tsx
<Music model={varg.musicModel("music_v1")} prompt="upbeat" duration={15} />
```

---

## Clip Duration Mismatch

**Error**: Black frames, audio desync, or unexpected pacing.

**Cause**: `<Clip duration={10}>` wrapping a `Video({ duration: 5 })`. The clip duration doesn't match the inner video.

**Fix**: Match clip duration to video duration:
```tsx
const vid = Video({ ..., duration: 5 })
<Clip duration={5}>{vid}</Clip>
```

Or use `cutFrom`/`cutTo` to trim:
```tsx
const vid = Video({ ..., duration: 5 })
<Clip cutFrom={0.3} cutTo={2.5}>{vid}</Clip>
```

---

## 402 Insufficient Balance

**Error**: `"Insufficient balance. Required: X credits, available: Y credits"`

**Cause**: Not enough credits for the requested generation.

**Fix**: 
- Check balance: `GET /v1/balance`
- Use cheaper models (see [models.md](models.md))
- Use BYOK headers to bypass billing

---

## Cache Miss When Prompt Changed Slightly

**Error**: Generation runs again instead of hitting cache, costing additional credits.

**Cause**: Even minor changes to prompts (extra space, different capitalization, reworded sentence) produce a different cache key.

**Fix**: When iterating on a multi-clip render, keep unchanged prompts EXACTLY the same -- character-for-character. Only modify the specific parts that need to change.

---

## Import Statements in Render Service

**Error**: Code fails to evaluate in the render service.

**Cause**: The render service strips import statements and provides globals. Only `vargai/*` imports are allowed.

**Fix for render service**: Don't import anything. All components and providers are auto-provided as globals:
```tsx
// In render service (no imports needed)
const img = Image({ model: varg.imageModel("nano-banana-pro"), prompt: "..." })
export default <Render>...</Render>
```

**Fix for local CLI rendering**: Use the JSX pragma and imports:
```tsx
/** @jsxImportSource vargai */
import { Render, Clip, Image, Video } from "vargai/react"
import { createVarg } from "vargai/ai"
```

---

## Timeout / Stalled Renders

**Error**: Render job stays in "processing" or times out after 10-15 minutes.

**Cause**: Complex renders with many AI generation calls can take 15+ minutes. Video models like kling-v3 take 2-5 minutes per clip.

**Fix**:
- Use `--preview` first to validate structure
- Break very long sequences into separate render jobs
- Use faster/cheaper models for prototyping (flux-schnell, ltx-2-19b-distilled)
- Check job status via SSE stream: `GET /v1/jobs/{id}/stream`

---

## Warm-Up Frames in AI Video

**Issue**: First 0.3-0.5 seconds of AI-generated video often contains static/blurry frames as the model "warms up."

**Fix**: Use `cutFrom` on clips to trim these frames:
```tsx
<Clip cutFrom={0.3} duration={4.7}>{video}</Clip>
```

This is especially useful for fast-cut edits and montages.

---

## FFmpeg Composition Failure (exit code 254, 1, etc.)

**Error**: `Failed with exit code 254` during the editly/ffmpeg step, AFTER all AI generation succeeds.

**Common causes**:
1. **Missing output directory** -- the `output/` folder doesn't exist. FFmpeg cannot create directories.
   Fix: `mkdir -p output` before rendering, or use `-o /path/that/exists/video.mp4`.
2. **Corrupted input file** -- a temp file was cleaned up or is 0 bytes.
   Fix: Clear `.cache/ai/` and re-render (regenerates all assets).
3. **FFmpeg version incompatibility** -- very old or very new ffmpeg may not support all filters.
   Fix: Use ffmpeg 6.x-8.x. Run `ffmpeg -version` to check.

**Debugging**: Run with `--verbose` flag to see the full ffmpeg command, then run it manually in your terminal to see the actual stderr error message.

**Note**: The SDK currently swallows ffmpeg stderr (fix pending in vargHQ/sdk#167). Until merged, `--verbose` + manual re-run is the only way to see the real error.

---

## Missing Provider API Key

**Error**: `ELEVENLABS_API_KEY not set` or image/video generation returns "Unauthorized".

**Cause**: Using direct provider imports (`fal`, `elevenlabs` from `"vargai/ai"`) without the corresponding API key in `.env`.

**Fix (recommended)**: Use the `varg` provider with a single key:
- Set `VARG_API_KEY` in `.env`
- Use `varg.imageModel(...)`, `varg.speechModel(...)` etc. instead of `fal.*` / `elevenlabs.*`
- All providers route through `api.varg.ai` -- one key for everything

**Fix -- Option B**: Add individual provider keys to `.env`:
```
FAL_API_KEY=fal_xxxxx
ELEVENLABS_API_KEY=sk_xxxxx
```

**Note**: Bun auto-loads `.env` from the project root. No `dotenv` needed.

---

## Cannot Find Module 'vargai/jsx-dev-runtime'

**Error**: `Cannot find module 'vargai/jsx-dev-runtime'` when running `bun run render`.

**Cause**: The render CLI copies your file to an internal cache directory where the `vargai` tsconfig path alias doesn't resolve correctly. This affects Bun <= 1.3.x.

**Fix -- use relative imports**:
```tsx
/** @jsxImportSource ./sdk/src/react/runtime */
import { Render, Clip, Image, Video, Speech } from "./sdk/src/react/index.ts";
import { fal, elevenlabs } from "./sdk/src/ai-sdk/index.ts";
```

This triggers the CLI's "relative import" code path, which imports your file directly from its original location instead of copying it.

**Alternative**: If your file has no relative imports and no top-level await, the standard `@jsxImportSource vargai` + `"vargai/react"` imports should work via the CLI's cache-copy mechanism.

---

## VEED/Lipsync Videos Regenerate Despite Same Prompts

**Symptom**: VEED lipsync videos regenerate (costing credits + time) even though you didn't change any Video prompts.

**Cause**: The cache key for Video includes the duration and URL of speech segments used as audio input. ElevenLabs TTS is non-deterministic -- re-running `Speech()` with identical text/voice/model can produce audio with slightly different durations (by milliseconds). This changes the cache key for all downstream Video elements.

**Cascade**: Speech re-gen -> different segment durations -> different segment URLs -> different Video cache keys -> all VEED videos miss cache -> full regeneration.

**Fix**: When iterating on visuals, keep the `Speech()` call and all its parameters EXACTLY the same. Don't add/remove/reorder speech lines, don't change the voice or model. If you need to change speech content, expect all lipsync videos to regenerate.

**Cost impact**: Each VEED lipsync video costs 50-80 credits ($0.50-0.80). A 4-clip narrator video wastes $2-3 on unnecessary regeneration.
