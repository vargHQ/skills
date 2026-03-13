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

Use your own provider API keys for $0 billing:

```
X-Provider-Key-Fal: fal_xxx
X-Provider-Key-ElevenLabs: el_xxx
X-Provider-Key-Higgsfield: hf_xxx
X-Provider-Key-Replicate: r8_xxx
```

When a BYOK header is present, the gateway routes through your key and doesn't deduct credits.

---

## TypeScript Client

For programmatic access from TypeScript:

```typescript
import { createVarg } from "@vargai/gateway"

const varg = createVarg({ apiKey: process.env.VARG_API_KEY! })

// Use as Vercel AI SDK provider
import { generateImage } from "ai"

const result = await generateImage({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "a sunset over mountains"
})
```

The `@vargai/gateway` package implements the Vercel AI SDK `ProviderV3` interface, exposing:
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
