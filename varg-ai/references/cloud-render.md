# Cloud Render Mode

Send TSX code to the varg render service via HTTP. No local dependencies needed -- just a `VARG_API_KEY` and `curl`.

The render service handles all asset generation (images, video, speech, music) and video composition (ffmpeg) in the cloud. You get back a URL to the final `.mp4`.

## TSX Format

In cloud mode, **no imports are needed**. All components and providers are auto-injected as globals.

**Available globals:**

| Category | Names |
|----------|-------|
| Components | `Render`, `Clip`, `Image`, `Video`, `Speech`, `Music`, `Captions`, `Title`, `Subtitle`, `Overlay`, `Split`, `Grid`, `Slot`, `Slider`, `Swipe`, `Packshot`, `TalkingHead` |
| Providers | `varg` (recommended), `fal`, `elevenlabs`, `higgsfield`, `openai`, `replicate`, `google`, `together` |
| Data | `VOICES` (voice name to ElevenLabs ID mapping) |

The user's `VARG_API_KEY` (from the `Authorization` header) is automatically used for all AI generation calls. No `createVarg()` needed. Use `varg.*` for all models -- same syntax as local render mode.

### Minimal Example

```tsx
const img = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "a cozy cabin in mountains at sunset, warm golden light",
  aspectRatio: "16:9"
});

export default (
  <Render width={1920} height={1080}>
    <Clip duration={3}>{img}</Clip>
  </Render>
);
```

### Full Example (video + speech + music + captions)

```tsx
const hero = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "cinematic portrait of a warrior princess, golden hour lighting",
  aspectRatio: "9:16"
});

const scene = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "warrior walks forward through misty forest, camera follows", images: [hero] },
  duration: 5
});

const voice = Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "rachel",
  children: "In a world beyond imagination..."
});

export default (
  <Render width={1080} height={1920} fps={30}>
    <Music model={varg.musicModel("music_v1")} prompt="epic orchestral, rising tension" duration={10} volume={0.3} />
    <Clip duration={5}>
      {scene}
      <Title position="bottom">The Last Guardian</Title>
    </Clip>
    <Captions src={voice} style="tiktok" withAudio />
  </Render>
);
```

## Restrictions

- Must have `export default` returning a `<Render>` element
- No named exports (`export const x = ...` is forbidden)
- No external imports (`vargai/*` imports are allowed but stripped -- globals replace them)
- No `require()` calls
- Image `src` values must be `http://` or `https://` URLs
- Max 5 concurrent jobs, 10 requests/minute per user
- 15-minute job timeout

## Workflow

### Step 1: Write TSX code to a file

Write the TSX code to a local `.tsx` file for reference and iteration:

```bash
cat > video.tsx << 'EOF'
const img = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "a sunset over mountains",
  aspectRatio: "16:9"
});

export default (
  <Render width={1920} height={1080}>
    <Clip duration={3}>{img}</Clip>
  </Render>
);
EOF
```

### Step 2: Submit to render service

```bash
curl -s -X POST https://render.varg.ai/api/render \
  -H "Authorization: Bearer $VARG_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"code\": $(cat video.tsx | jq -Rs .)}"
```

Response (`202 Accepted`):

```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "rendering",
  "estimated_duration_ms": 35000
}
```

> **Note**: The submit and poll examples use [`jq`](https://jqlang.github.io/jq/) for JSON parsing. If `jq` is not available, extract fields with `grep -o '"job_id":"[^"]*"' | cut -d'"' -f4`.

### Step 3: Poll for result

Poll every 10-15 seconds until `status` is `"completed"` or `"failed"`:

```bash
curl -s https://render.varg.ai/api/render/jobs/JOB_ID \
  -H "Authorization: Bearer $VARG_API_KEY"
```

Completed response:

```json
{
  "status": "completed",
  "output_url": "https://s3.varg.ai/renders/xxx.mp4",
  "files": [
    { "url": "https://...", "mediaType": "image/png", "metadata": { "type": "image", "prompt": "..." } }
  ],
  "duration_ms": 45000
}
```

On success, present the `output_url` to the user. The `files` array contains all intermediate assets (images, audio).

On failure:

```json
{
  "status": "failed",
  "error": "Insufficient balance",
  "error_category": "quota_exceeded"
}
```

### Alternative: SSE Stream

Instead of polling, use Server-Sent Events for real-time updates:

```bash
curl -N https://render.varg.ai/api/render/jobs/JOB_ID/stream \
  -H "Authorization: Bearer $VARG_API_KEY"
```

For the full Render API reference (rate limits, error codes, all endpoints), see [gateway-api.md](gateway-api.md).
