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
  version: "2.0.5"
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
  Requires VARG_API_KEY (get at https://varg.ai/dashboard/api).
  Cloud mode: curl only (zero dependencies).
  Local mode: bun runtime + ffmpeg.
allowed-tools: Bash(bun:*) Bash(bunx:*) Bash(npx:*) Bash(curl:*) Bash(mkdir:*) Bash(echo:*) Bash(chmod:*) Bash(grep:*) Bash(head:*) Bash(cut:*) Bash(tr:*) Bash(printf:*) Read Write Edit
---

## Version Check (run once per session)

This skill is version **2.0.5**. Before first use each session, check for updates:

```bash
curl -sf https://raw.githubusercontent.com/vargHQ/skills/main/varg-ai/SKILL.md | grep 'version:' | head -1
```

If the remote version is newer than 2.0.5, update and re-read this file:

```bash
npx -y skills update
```

## Setup (REQUIRED before first use)

Before generating anything, find an API key and determine rendering mode.
**Do NOT run interactive CLI tools** (like `bunx vargai init` or `bunx vargai login`) -- they require stdin which agents cannot provide. CLI email (OTP) login is also disabled server-side: `/api/auth/cli/send-otp` returns 403, so don't call it.

### 1. Find an API key (before asking the user anything)

Most users already have a key somewhere. Look for it yourself first -- this checks the environment, then `~/.varg/credentials`, then the project's `.env` / `.env.local`, and loads the first key it finds into `$VARG_API_KEY` without printing it:

```bash
[ -n "${VARG_API_KEY:-}" ] || VARG_API_KEY=$(grep -o '"api_key"[^,}]*' ~/.varg/credentials 2>/dev/null | head -1 | cut -d'"' -f4)
[ -n "${VARG_API_KEY:-}" ] || VARG_API_KEY=$(grep -hE '^(export )?VARG_API_KEY=' .env .env.local 2>/dev/null | head -1 | cut -d= -f2- | tr -d "\"' \r")
export VARG_API_KEY
if [ -n "$VARG_API_KEY" ]; then
  curl -s -o /dev/null -w "key found -- HTTP %{http_code} (200 = valid, 401 = invalid)\n" -H "Authorization: Bearer $VARG_API_KEY" https://api.varg.ai/v2/billing/balance
else
  echo "no key found"
fi
```

- **200** -- the key works. Save it (step 1b) and continue to the balance check.
- **401** -- the key was revoked or mistyped. Tell the user, then do step 1a.
- **no key found** -- do step 1a.

Some agent shells don't keep variables between commands. If `$VARG_API_KEY` is empty in a later command, start that command with:

```bash
export VARG_API_KEY="${VARG_API_KEY:-$(grep -o '"api_key"[^,}]*' ~/.varg/credentials 2>/dev/null | head -1 | cut -d'"' -f4)}"
```

### 1a. No key: one message to the user

Ask once, with everything in a single message -- don't first ask whether they have a key, the steps are the same either way. Send them:

> To generate with varg I need an API key:
> 1. Open **https://varg.ai/dashboard/api** and sign in (or create an account).
> 2. Generate an API key and copy it.
> 3. Run this in your terminal and paste the key when prompted -- it stays out of this chat and your shell history:
>    ```bash
>    mkdir -p ~/.varg && printf 'varg API key: ' && read -rs K && echo && (umask 077 && printf '{"api_key":"%s"}\n' "$K" > ~/.varg/credentials) && unset K
>    ```
> Tell me when it's done.

When they reply, re-run the step 1 block. Do NOT ask the user to paste the raw key into the chat, and don't ask them to `export` it -- an `export` in their terminal doesn't reach your already-running shell, but the credentials file does.

### 1b. Save the key for next time

If the key came from the environment or `.env`, save it to `~/.varg/credentials` so future sessions find it (skipped if the file already exists). Always reference `$VARG_API_KEY` -- never the raw value:

```bash
[ -f ~/.varg/credentials ] || (mkdir -p ~/.varg && umask 077 && printf '{"api_key":"%s"}\n' "$VARG_API_KEY" > ~/.varg/credentials)
```

For local render (bun auto-loads `.env`), also add it to the project `.env` -- only if that file exists, is gitignored, and has no key yet:

```bash
[ -f .env ] && git check-ignore -q .env 2>/dev/null && ! grep -q '^VARG_API_KEY=' .env && echo "VARG_API_KEY=$VARG_API_KEY" >> .env
```

**Check balance and add credits**

```bash
curl -s -H "Authorization: Bearer $VARG_API_KEY" https://api.varg.ai/v2/billing/balance
```

You should get `{"available": ..., "total_balance": ..., ...}` (values in credits). If `available` is 0 (or too low for the user's task), the user needs credits before generating anything. 1 credit = 1 cent. A typical video costs $2-5 (200-500 credits).

Available packages:

| Package ID | Credits | Price |
|---|---|---|
| `credits-2000` | 2,000 | $20 |
| `credits-5000` | 5,000 | $50 |
| `credits-10000` | 10,000 (recommended) | $100 |
| `credits-20000` | 20,000 | $200 |
| `credits-50000` | 50,000 | $500 |
| `credits-100000` | 100,000 | $1,000 |

Direct the user to **https://varg.ai/devs/billing** to buy credits, then re-check the balance.

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
5. **Duration constraints differ by model** -- kling_v3: 3-15s (integer only). kling_v2_5: ONLY 5 or 10. Check [models.md](references/models.md).
6. **Gateway namespace** -- use `providerOptions: { varg: {...} }`, never `fal`, when going through the gateway (both modes).
7. **Renders cost money** -- 1 credit = 1 cent. A typical 3-clip video costs $2-5. Use preview mode (local) or cheap models to iterate.
8. **API key hygiene** -- Never write a raw API key value into a bash command. Load keys into `$VARG_API_KEY` with the setup snippets (from env, `~/.varg/credentials`, or `.env`) and use `$VARG_API_KEY` in all subsequent commands -- never `echo` or `cat` the key itself. This prevents keys from leaking into conversation context and terminal history.

## Quick Start

### Cloud Render (no bun/ffmpeg needed)

```bash
# Submit TSX code to the render service — returns a job: {"id": "job_xxx", "status": "queued", ...}
curl -s -X POST https://api.varg.ai/v2/render \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"code": "const img = Image({ model: varg.imageModel(\"nano_banana_pro\"), prompt: \"a cabin in mountains at sunset\", aspectRatio: \"16:9\" });\nexport default (<Render width={1920} height={1080}><Clip duration={3}>{img}</Clip></Render>);"}'

# Poll for result (repeat until "completed" or "failed"; video at output.outputs[0].url)
curl -s https://api.varg.ai/v2/jobs/JOB_ID \
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
  model: varg.imageModel("nano_banana_pro"),
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
curl -X POST https://api.varg.ai/v2/image \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "nano_banana_pro", "prompt": "a sunset over mountains"}'
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
| `varg.imageModel("nano_banana_pro")` | `varg.imageModel("nano_banana_pro")` |
| `varg.videoModel("kling_v3")` | `varg.videoModel("kling_v3")` |
| `varg.speechModel("eleven_v3")` | `varg.speechModel("eleven_v3")` |

**Always use `varg.*Model()`** with `VARG_API_KEY`. It handles routing, caching, billing, and works with a single key. BYOK via the API is not available in v2 — see [byok.md](references/byok.md) for what works (local-render direct provider modules only).

## Cost & Iteration

- **1 credit = 1 cent.** grok_imagine_image = 4 credits, nano_banana_pro = 126 credits, kling_v3 (5s) = 221 credits, sora_2 (5s) = 105 credits, speech = ~105 credits. Live catalog: `GET https://api.varg.ai/v2/pricing` (no auth). Estimate any request: `POST /v2/estimate`.
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
