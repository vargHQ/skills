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
  version: "2.0.4"
  openclaw:
    requires:
      env:
        - VARG_API_KEY
      anyBins:
        - curl
        - bun
    primaryEnv: VARG_API_KEY
    homepage: https://varg.ai
compatibility: >-
  Requires VARG_API_KEY (get at https://varg.ai).
  Cloud mode: curl only (zero dependencies).
  Local mode: bun runtime + ffmpeg.
allowed-tools: Bash(bun:*) Bash(bunx:*) Bash(npx:*) Bash(curl:*) Bash(mkdir:*) Bash(echo:*) Bash(chmod:*) Read Write Edit
---

## Version Check (run once per session)

This skill is version **2.0.4**. Before first use each session, check for updates:

```bash
curl -sf https://raw.githubusercontent.com/vargHQ/skills/main/varg-ai/SKILL.md | grep 'version:' | head -1
```

If the remote version is newer than 2.0.4, update and re-read this file:

```bash
npx -y skills update
```

## Setup (REQUIRED before first use)

Before generating anything, check authentication and determine rendering mode.
**Do NOT run interactive CLI tools** (like `bunx vargai init`) -- they require stdin which agents cannot provide. Use the curl-based flow below instead.

### 1. Check for API key

```bash
echo "${VARG_API_KEY:-}" && cat ~/.varg/credentials 2>/dev/null
```

If `VARG_API_KEY` is set (via env or credentials file), skip to step 2.

If neither exists, authenticate the user. Try Option A first, fall back to Option B.

**Option A: User already has an API key**

Ask the user if they have a `VARG_API_KEY`. If yes, tell them to export it in their terminal:

```bash
export VARG_API_KEY=<their_key>
```

**Important:** Do NOT ask the user to paste the raw key to you. Ask them to run the `export` command themselves. Then skip to "Save credentials" below.

**Option B: Sign up / sign in via email (OTP)**

1. Ask the user for their **email address**.
2. Send a one-time code to their email:
```bash
curl -s -X POST https://app.varg.ai/api/auth/cli/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"USER_EMAIL"}'
```
3. Tell the user: **"Check your inbox for a 6-digit verification code from varg.ai"**
4. Ask the user for the code, then verify and capture the response in one step:
```bash
VARG_AUTH=$(curl -s -X POST https://app.varg.ai/api/auth/cli/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"USER_EMAIL","code":"THE_6_DIGIT_CODE"}')
export VARG_API_KEY=$(echo "$VARG_AUTH" | grep -o '"api_key":"[^"]*"' | cut -d'"' -f4)
echo "Authenticated. Balance: $(echo "$VARG_AUTH" | grep -o '"balance_cents":[0-9]*' | cut -d: -f2) credits"
```
The response contains `{"api_key":"varg_xxx","email":"...","balance_cents":0,"access_token":"..."}`.
The key is now in `$VARG_API_KEY` -- never reference the raw value directly.

**Save credentials**

Once `VARG_API_KEY` is set (from either option), save it globally and verify. Always reference `$VARG_API_KEY` -- never the raw value:

```bash
mkdir -p ~/.varg && echo "{\"api_key\":\"$VARG_API_KEY\",\"email\":\"USER_EMAIL\",\"created_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > ~/.varg/credentials && chmod 600 ~/.varg/credentials
```

Verify the key works:

```bash
curl -s -H "Authorization: Bearer $VARG_API_KEY" https://api.varg.ai/v1/balance
```

You should get `{"balance_cents": ...}`. If you get 401, the key is invalid -- ask the user to double-check it.

Also add to the project `.env` if one exists:

```bash
echo "VARG_API_KEY=$VARG_API_KEY" >> .env
```

**Check balance and add credits**

Check `balance_cents` from the verify-otp response or the balance check above. If balance is 0 (or too low for the user's task), the user needs credits before generating anything. 1 credit = 1 cent. A typical video costs $2-5 (200-500 credits).

Available packages:

| Package ID | Credits | Price |
|---|---|---|
| `credits-2000` | 2,000 | $20 |
| `credits-5000` | 5,000 | $50 |
| `credits-10000` | 10,000 (recommended) | $100 |
| `credits-20000` | 20,000 | $200 |
| `credits-50000` | 50,000 | $500 |
| `credits-100000` | 100,000 | $1,000 |

Ask the user which package they'd like, then:

- **If you have the `access_token`** (from Option B email OTP), capture it and create a Stripe checkout session:
```bash
VARG_ACCESS_TOKEN=$(echo "$VARG_AUTH" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
curl -s -X POST https://app.varg.ai/api/billing/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VARG_ACCESS_TOKEN" \
  -H "Origin: https://app.varg.ai" \
  -d '{"packageId":"PACKAGE_ID"}'
```
Response: `{"url":"https://checkout.stripe.com/..."}`

Tell the user to open that URL in their browser to complete payment. Credits are added immediately after payment.

- **If you only have the API key** (from Option A), direct the user to **https://app.varg.ai/dashboard** to purchase credits manually.

### 2. Determine rendering mode

| bun | ffmpeg | Mode |
|-----|--------|------|
| No  | No     | **Cloud Render** -- read [cloud-render.md](references/cloud-render.md) |
| Yes | No     | **Cloud Render** -- read [cloud-render.md](references/cloud-render.md) |
| Yes | Yes    | **Local Render** (recommended) -- read [local-render.md](references/local-render.md) |

## Critical Rules

Everything you know about varg is likely outdated. Always verify against this skill and its references before writing code.

1. **Never guess model IDs** -- consult [models.md](references/models.md) for current models, pricing, and constraints.
2. **Function calls for media, JSX for composition** -- `Image({...})` creates media, `<Clip>` composes timeline. Never write `<Image prompt="..." />`.
3. **Cache is sacred** -- identical prompt + params = instant $0 cache hit. When iterating, keep unchanged prompts EXACTLY the same. Never clear cache.
4. **One image per Video** -- `Video({ prompt: { images: [img] } })` takes exactly one image. Multiple images cause errors.
5. **Duration constraints differ by model** -- kling-v3: 3-15s (integer only). kling-v2.5: ONLY 5 or 10. Check [models.md](references/models.md).
6. **Gateway namespace** -- use `providerOptions: { varg: {...} }`, never `fal`, when going through the gateway (both modes).
7. **Renders cost money** -- 1 credit = 1 cent. A typical 3-clip video costs $2-5. Use preview mode (local) or cheap models to iterate.
8. **API key hygiene** -- Never write a raw API key value into a bash command. After obtaining a key (from the user or OTP response), immediately `export VARG_API_KEY=...` and use `$VARG_API_KEY` in all subsequent commands. This prevents keys from leaking into conversation context and terminal history.

## Quick Start

### Cloud Render (no bun/ffmpeg needed)

```bash
# Submit TSX code to the render service
curl -s -X POST https://render.varg.ai/api/render \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"code": "const img = Image({ model: varg.imageModel(\"nano-banana-pro\"), prompt: \"a cabin in mountains at sunset\", aspectRatio: \"16:9\" });\nexport default (<Render width={1920} height={1080}><Clip duration={3}>{img}</Clip></Render>);"}'

# Poll for result (repeat until "completed" or "failed")
curl -s https://render.varg.ai/api/render/jobs/JOB_ID \
  -H "Authorization: Bearer $VARG_API_KEY"
```

Full details: [cloud-render.md](references/cloud-render.md)

### Local Render (bun + ffmpeg)

```tsx
/** @jsxImportSource vargai */
import { Render, Clip, Image } from "vargai/react"
import { createVarg } from "vargai/ai"

const varg = createVarg({ apiKey: process.env.VARG_API_KEY! })

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

```bash
bunx vargai render video.tsx --preview   # free preview
bunx vargai render video.tsx --verbose   # full render (costs credits)
```

Full details: [local-render.md](references/local-render.md)

### Single Asset (no video composition)

For one-off images, videos, speech, or music without building a multi-clip template:

```bash
curl -X POST https://api.varg.ai/v1/image \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -d '{"model": "nano-banana-pro", "prompt": "a sunset over mountains"}'
```

Full API reference: [gateway-api.md](references/gateway-api.md)

## How to Write Video Code

Video code has two layers: **media generation** (function calls) and **composition** (JSX).

```tsx
// 1. GENERATE media via function calls
const img = Image({ model: ..., prompt: "..." })
const vid = Video({ model: ..., prompt: { text: "...", images: [img] }, duration: 5 })
const voice = Speech({ model: ..., voice: "rachel", children: "Hello!" })

// 2. COMPOSE via JSX tree
export default (
  <Render width={1080} height={1920}>
    <Music model={...} prompt="upbeat electronic" duration={10} volume={0.3} />
    <Clip duration={5}>
      {vid}
      <Title position="bottom">Welcome</Title>
    </Clip>
    <Captions src={voice} style="tiktok" withAudio />
  </Render>
)
```

### Component Summary

| Component | Type | Purpose |
|-----------|------|---------|
| `Image()` | Function call | Generate still image |
| `Video()` | Function call | Generate video (text-to-video or image-to-video) |
| `Speech()` | Function call | Text-to-speech audio |
| `<Render>` | JSX | Root container -- sets width, height, fps |
| `<Clip>` | JSX | Timeline segment -- duration, transitions |
| `<Music>` | JSX | Background audio (always set `duration`!) |
| `<Captions>` | JSX | Subtitle track from Speech |
| `<Title>` | JSX | Text overlay |
| `<Overlay>` | JSX | Positioned layer |
| `<Split>` / `<Grid>` | JSX | Layout helpers |

Full props: [components.md](references/components.md)

### Provider Differences (Cloud vs Local)

Both modes use `varg.*` for all models. The only difference is imports:

| Cloud Render | Local Render |
|---|---|
| No imports needed (globals are auto-injected) | `import { ... } from "vargai/react"` + `import { createVarg } from "vargai/ai"` |
| `varg.imageModel("nano-banana-pro")` | `varg.imageModel("nano-banana-pro")` |
| `varg.videoModel("kling-v3")` | `varg.videoModel("kling-v3")` |
| `varg.speechModel("eleven_v3")` | `varg.speechModel("eleven_v3")` |

**Always use `varg.*Model()`** with `VARG_API_KEY`. It handles routing, caching, billing, and works with a single key. See [byok.md](references/byok.md) for using your own provider keys.

## Cost & Iteration

- **1 credit = 1 cent.** nano-banana-pro = 5 credits, kling-v3 = 150 credits, speech = 20-25 credits.
- **Cache saves money.** Keep unchanged prompts character-for-character identical across iterations.
- **Preview first** (local mode only): `--preview` generates free placeholders to validate structure.
- Full pricing: [models.md](references/models.md)

## References

Load these on demand based on what you need:

| Need | Reference | When to load |
|------|-----------|-------------|
| Render via API | [cloud-render.md](references/cloud-render.md) | No bun/ffmpeg, or user wants cloud rendering |
| Render locally | [local-render.md](references/local-render.md) | bun + ffmpeg available |
| Patterns & workflows | [recipes.md](references/recipes.md) | Talking head, character consistency, slideshow, lipsync |
| Model selection | [models.md](references/models.md) | Choosing models, checking prices, duration constraints |
| Component props | [components.md](references/components.md) | Need detailed props for any component |
| Better prompts | [prompting.md](references/prompting.md) | User wants cinematic / high-quality results |
| REST API | [gateway-api.md](references/gateway-api.md) | Single-asset generation or Render API details |
| Debugging | [common-errors.md](references/common-errors.md) | Something failed or produced unexpected results |
| Full examples | [templates.md](references/templates.md) | Need complete copy-paste-ready templates |
| BYOK keys | [byok.md](references/byok.md) | Using your own provider API keys for $0 billing |
