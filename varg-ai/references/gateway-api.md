# Gateway API Reference

The varg gateway at `api.varg.ai` provides a unified REST API for generating images, videos, speech, and music with a single API key. Use this for one-off asset generation without building a full TSX template.

## Authentication

```
Authorization: Bearer varg_xxx
```

Get your API key at the varg dashboard.

## Base URL

```
https://api.varg.ai/v1
```

---

## Endpoints

### Generate Image

```bash
POST /v1/image
```

```json
{
  "model": "nano-banana-pro",
  "prompt": "a sunset over mountains, cinematic, golden hour",
  "aspect_ratio": "16:9"
}
```

### Generate Video

```bash
POST /v1/video
```

```json
{
  "model": "kling-v3",
  "prompt": "a bird soaring over mountains, aerial shot",
  "duration": 5,
  "aspect_ratio": "16:9"
}
```

With image input (image-to-video):
```json
{
  "model": "kling-v3",
  "prompt": "person starts walking forward",
  "files": [{ "url": "https://s3.varg.ai/uploads/character.png" }],
  "duration": 5
}
```

### Generate Speech

```bash
POST /v1/speech
```

```json
{
  "model": "eleven_v3",
  "text": "Welcome to our product showcase.",
  "voice": "rachel"
}
```

### Generate Music

```bash
POST /v1/music
```

```json
{
  "model": "music_v1",
  "prompt": "upbeat electronic, rising energy",
  "duration": 15
}
```

### Transcribe Audio

```bash
POST /v1/transcription
```

```json
{
  "model": "whisper",
  "audio_url": "https://example.com/audio.mp3"
}
```

### Upload File

```bash
POST /v1/files
Content-Type: application/octet-stream
```

Binary body. Max 50MB. Returns a public URL.

---

## Job Lifecycle

All generation endpoints return `202 Accepted` with a job reference:

```json
{
  "job_id": "abc123",
  "status": "queued",
  "model": "kling-v3",
  "created_at": "2026-01-15T10:30:00Z",
  "cache": { "hit": false }
}
```

### Poll for Result

```bash
GET /v1/jobs/{job_id}
```

Returns current status. When `status: "completed"`:

```json
{
  "job_id": "abc123",
  "status": "completed",
  "output": {
    "url": "https://s3.varg.ai/o/abc123.mp4",
    "media_type": "video/mp4"
  }
}
```

### SSE Stream (real-time updates)

```bash
GET /v1/jobs/{job_id}/stream
Accept: text/event-stream
```

Receives real-time status events. Preferred over polling.

### Cancel Job

```bash
DELETE /v1/jobs/{job_id}
```

---

## Cache Behavior

Identical requests (same model + prompt + parameters) return cached results instantly at zero cost.

- Cache TTL: 30 days
- Cache headers: `X-Cache: HIT|MISS`, `X-Cache-Key`, `X-Cache-TTL`
- To bypass cache: `Cache-Control: no-cache`

---

## BYOK (Bring Your Own Key)

Use your own provider API keys for $0 varg billing. Pass keys as headers alongside your `Authorization` header:

```bash
curl -X POST https://api.varg.ai/v1/image \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -H "X-Provider-Key-Fal: $FAL_KEY" \
  -d '{"model": "nano-banana-pro", "prompt": "a sunset over mountains"}'
```

| Provider | Header |
|----------|--------|
| fal.ai | `X-Provider-Key-Fal` |
| ElevenLabs | `X-Provider-Key-ElevenLabs` |
| Higgsfield | `X-Provider-Key-Higgsfield` |
| Replicate | `X-Provider-Key-Replicate` |

When a BYOK header is present, the gateway routes through your key and doesn't deduct credits. You still need `VARG_API_KEY` for gateway authentication.

For the full BYOK guide (TypeScript client, cloud render, local render, provider key setup), see [byok.md](byok.md).

---

## TypeScript Client

For programmatic access from TypeScript:

```typescript
import { createVarg } from "vargai/ai"

const varg = createVarg({ apiKey: process.env.VARG_API_KEY! })

// Use as Vercel AI SDK provider
import { generateImage } from "ai"

const result = await generateImage({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "a sunset over mountains"
})
```

The `vargai/ai` package implements the Vercel AI SDK `ProviderV3` interface, exposing:
- `varg.imageModel(id)` -- returns `ImageModelV3`
- `varg.videoModel(id)` -- returns `VideoModelV3`
- `varg.speechModel(id)` -- returns `SpeechModelV3`
- `varg.musicModel(id)` -- returns `MusicModelV3`

---

## Account & Usage

```bash
GET /v1/balance      # Credit balance
GET /v1/usage        # Usage records (optional: ?from=2026-01-01&to=2026-01-31)
GET /v1/pricing      # Model pricing
GET /v1/voices       # Available ElevenLabs voices
```

---

## Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Invalid request (check model ID, prompt format) |
| 401 | Invalid or missing API key |
| 402 | Insufficient credits |
| 404 | Job not found |
| 429 | Rate limited (240 requests/minute) |
| 502 | Provider error (fal/elevenlabs/etc. failed) |

Error response format:
```json
{
  "error": "InsufficientBalanceError",
  "message": "Insufficient balance. Required: 150 credits, available: 50 credits"
}
```

---

## Render API (Video Composition)

For composing multi-clip videos with transitions, music, captions, and effects, use the render service. This takes TSX code and produces a final `.mp4` video. The render service handles all asset generation (images, video, speech, music) and ffmpeg composition in the cloud.

### Base URL

```
https://render.varg.ai
```

### Submit Render Job

```bash
POST /api/render
Authorization: Bearer varg_xxx
Content-Type: application/json
```

Request body:

```json
{
  "code": "<TSX code string with export default>",
  "verbose": false,
  "mode": "strict"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | `string` | Yes | TSX code with `export default`. No imports needed -- all components are globals. |
| `verbose` | `boolean` | No | Enable verbose logging (default: false) |
| `mode` | `"strict" \| "preview"` | No | `"preview"` uses cheaper placeholders |

Response (`202 Accepted`):

```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "rendering",
  "estimated_duration_ms": 35000,
  "queue": { "active": 3, "waiting": 0 }
}
```

### Poll Job Status

```bash
GET /api/render/jobs/{job_id}
Authorization: Bearer varg_xxx
```

Response (`200 OK`):

```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "output_url": "https://s3.varg.ai/renders/1710345600_abc123.mp4",
  "files": [
    {
      "url": "https://s3.varg.ai/cache/def456.png",
      "mediaType": "image/png",
      "metadata": { "type": "image", "model": "flux-schnell", "prompt": "..." }
    }
  ],
  "duration_ms": 45000,
  "created_at": "2026-03-13T12:00:00Z",
  "completed_at": "2026-03-13T12:00:45Z"
}
```

Status values: `"rendering"`, `"completed"`, `"failed"`.

On failure, `error` and `error_category` fields are included:

```json
{
  "status": "failed",
  "error": "Insufficient balance",
  "error_category": "quota_exceeded"
}
```

Error categories: `quota_exceeded`, `rate_limited`, `timeout`, `invalid_source`, `internal`.

### SSE Stream (Real-Time Updates)

```bash
GET /api/render/jobs/{job_id}/stream
Authorization: Bearer varg_xxx
Accept: text/event-stream
```

Receives real-time status events. Preferred over polling for long-running renders:

```
event: status
data: {"job_id":"...","status":"rendering","started_at":"..."}

:keepalive

event: status
data: {"job_id":"...","status":"completed","output_url":"https://...","files":[...]}
```

### List Jobs

```bash
GET /api/jobs?limit=50
Authorization: Bearer varg_xxx
```

Returns recent render jobs for the authenticated user.

### Rate Limits

| Limit | Value |
|-------|-------|
| Requests per minute | 10 per user |
| Concurrent jobs | 5 per user |
| Job timeout | 15 minutes |

Rate limit info is returned in response headers:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 2026-03-13T12:01:00.000Z
```

### Cloud Render TSX Format

No imports needed -- all components and providers are auto-injected as globals. The user's API key (from the `Authorization` header) is used for all AI generation calls automatically.

**Available globals:**

| Category | Globals |
|----------|---------|
| Components | `Render`, `Clip`, `Image`, `Video`, `Speech`, `Music`, `Captions`, `Title`, `Subtitle`, `Overlay`, `Split`, `Grid`, `Slot`, `Slider`, `Swipe`, `Packshot`, `TalkingHead` |
| Providers | `fal`, `elevenlabs`, `higgsfield`, `openai`, `replicate`, `google`, `together` |
| Data | `VOICES` (voice name to ElevenLabs ID mapping) |

**Restrictions:**

- Must have `export default` returning a `<Render>` element
- No named exports (`export const x = ...` is forbidden)
- No external imports (`vargai/*` imports are allowed but stripped)
- No `require()` calls
- `Image` `src` values must be `http://` or `https://` URLs

**Minimal working example:**

```tsx
export default (
  <Render width={1080} height={1920}>
    <Clip duration={5}>
      <Video prompt="a cat playing piano" model={varg.videoModel("kling-v3")} duration={5} />
    </Clip>
  </Render>
);
```

**Full example with multiple clips:**

```tsx
const img = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "cinematic portrait, golden hour lighting",
  aspectRatio: "9:16"
});

const vid = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "person walks forward, camera follows", images: [img] },
  duration: 5
});

const voice = Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "rachel",
  children: "Welcome to our show!"
});

export default (
  <Render width={1080} height={1920} fps={30}>
    <Music model={varg.musicModel("music_v1")} prompt="epic orchestral" duration={10} volume={0.3} />
    <Clip duration={5}>
      {vid}
      <Title position="bottom">Welcome</Title>
    </Clip>
    <Captions src={voice} style="tiktok" withAudio />
  </Render>
);
```

### Render API Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Invalid TSX code, missing `export default`, or Zod validation failure |
| 401 | Missing or invalid Bearer token |
| 429 | Rate limit or concurrency limit exceeded (`Retry-After` header included) |
| 503 | Queue unavailable (Redis/BullMQ down) |
