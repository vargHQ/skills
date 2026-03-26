# Bring Your Own Key (BYOK)

Use your own provider API keys with the varg gateway. Requests authenticated with a BYOK key cost $0 in varg credits — you pay the provider directly. You still get gateway benefits: caching, stable URLs, unified API, and job management.

## Why BYOK

- **$0 varg billing** — no credits deducted for BYOK requests
- **Own quotas** — use your provider's rate limits and spending caps
- **Same gateway features** — caching (30-day TTL), R2-backed stable URLs, SSE streaming, job polling all work identically
- **Required**: a `VARG_API_KEY` is still needed for gateway authentication. BYOK replaces only the provider key used for the actual AI generation call.

## How It Works

```
You → gateway (auth via VARG_API_KEY) → resolves provider key → provider API
```

The gateway resolves which provider key to use in this priority order:

| Priority | Source | Billing |
|----------|--------|---------|
| 1 | **Header BYOK** — `X-Provider-Key-*` header on the request | `byok` ($0) |
| 2 | **Saved BYOK** — provider key saved to your account (encrypted, AES-256-GCM) | `byok` ($0) |
| 3 | **Pooled key** — varg's shared provider key | `metered` (credits deducted) |

If you pass a BYOK header, it is used immediately. Your key is never stored by the gateway in header mode — it is used for that single request only.

## Provider Keys

| Provider | Header | Env Variable | Get Key |
|----------|--------|-------------|---------|
| **fal.ai** (images, video) | `X-Provider-Key-Fal` | `FAL_KEY` | [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys) |
| **ElevenLabs** (speech, music) | `X-Provider-Key-ElevenLabs` | `ELEVENLABS_API_KEY` | [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys) |
| **Higgsfield** (soul characters) | `X-Provider-Key-Higgsfield` | `HIGGSFIELD_API_KEY` | [higgsfield.ai](https://higgsfield.ai) |
| **Replicate** (general models) | `X-Provider-Key-Replicate` | `REPLICATE_API_TOKEN` | [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens) |

## Usage

### Gateway API (curl)

Pass BYOK headers alongside your `Authorization` header:

```bash
curl -X POST https://api.varg.ai/v1/image \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -H "X-Provider-Key-Fal: $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "nano-banana-pro", "prompt": "a sunset over mountains"}'
```

You can mix BYOK and metered in the same session. Only the providers where you supply a header key will use BYOK billing — others fall back to pooled keys.

```bash
# Image uses your fal key (BYOK, $0), speech uses pooled elevenlabs key (metered)
curl -X POST https://api.varg.ai/v1/image \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -H "X-Provider-Key-Fal: $FAL_KEY" \
  -d '{"model": "nano-banana-pro", "prompt": "portrait of a warrior"}'

curl -X POST https://api.varg.ai/v1/speech \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -d '{"model": "eleven_v3", "text": "Hello world", "voice": "rachel"}'
```

### Cloud Render

Pass `providerKeys` in the render request body:

```bash
curl -s -X POST https://render.varg.ai/api/render \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\": $(cat video.tsx | jq -Rs .),
    \"providerKeys\": {
      \"fal\": \"$FAL_KEY\",
      \"elevenlabs\": \"$ELEVENLABS_API_KEY\"
    }
  }"
```

The render service accepts keys for these providers:

| Provider | `providerKeys` field |
|----------|---------------------|
| fal.ai | `fal` |
| ElevenLabs | `elevenlabs` |
| Higgsfield | `higgsfield` |
| Replicate | `replicate` |
| OpenAI | `openai` |
| Google | `google` |
| Together | `together` |
| Groq | `groq` |

The last four (OpenAI, Google, Together, Groq) are render-only — they are available as globals in cloud TSX code for direct provider usage but are not routed through the gateway billing system.

### Local Render (TypeScript)

Pass `providerKeys` to `createVarg()`:

```tsx
/** @jsxImportSource vargai */
import { Render, Clip, Image } from "vargai/react"
import { createVarg } from "vargai/ai"

const varg = createVarg({
  apiKey: process.env.VARG_API_KEY!,
  providerKeys: {
    fal: process.env.FAL_KEY,
    elevenlabs: process.env.ELEVENLABS_API_KEY,
  }
})

const img = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "a cabin in mountains at sunset",
  aspectRatio: "16:9"
})

export default (
  <Render width={1920} height={1080}>
    <Clip duration={3}>{img}</Clip>
  </Render>
)
```

The gateway client automatically converts `providerKeys` to the correct `X-Provider-Key-*` headers on every request.

### TypeScript Client (no video composition)

For standalone asset generation via the TypeScript client:

```typescript
import { VargClient } from "vargai/ai"

const client = new VargClient({
  apiKey: process.env.VARG_API_KEY!,
  providerKeys: {
    fal: process.env.FAL_KEY,
    elevenlabs: process.env.ELEVENLABS_API_KEY,
  }
})

const job = await client.createImage({
  model: "nano-banana-pro",
  prompt: "a sunset over mountains"
})

const result = await client.waitForJob(job.job_id)
console.log(result.output?.url)
```

## .env Setup

Store keys in `.env` (Bun auto-loads it, no dotenv needed):

```bash
# Required — gateway authentication
VARG_API_KEY=varg_xxx

# Optional BYOK — supply any or all
FAL_KEY=fal_xxx
ELEVENLABS_API_KEY=el_xxx
HIGGSFIELD_API_KEY=hf_xxx
REPLICATE_API_TOKEN=r8_xxx
```

## Caching with BYOK

Cache works identically with BYOK. The cache key is derived from the request parameters (model, prompt, files, options) — not from which provider key was used. This means:

- A cached result from a metered request can be served to a BYOK request (and vice versa)
- Cache hits are always $0, regardless of billing mode
- `Cache-Control: no-cache` bypasses cache as usual

## Caveats

- **VARG_API_KEY is always required** — BYOK replaces the provider key, not the gateway auth. You need a varg account.
- **Header keys are not stored** — the gateway uses header BYOK keys for that single request, then discards them. They are never written to the database.
- **Rate limits are provider-side** — when using BYOK, your provider account's rate limits apply, not the pooled limits.
- **Key validation is lazy** — the gateway does not pre-validate BYOK keys. If a key is invalid, you'll get a `502` error when the provider rejects it.
- **No partial BYOK for a single request** — each request goes to one provider, so one BYOK header is sufficient per request. Multi-provider composition (e.g., fal image + elevenlabs speech in a render) can use separate keys for each provider.
