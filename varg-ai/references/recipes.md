# Recipes & Patterns

Common video workflows. All examples use `varg.*` syntax which works in both local and cloud render modes. For cloud mode, just omit imports.

---

## Character Consistency (Multi-Scene)

When a character or product appears across multiple clips, use this 3-step workflow to keep them looking the same:

1. **Reference image** -- generate (or receive) a character hero shot
2. **Scene images via /edit** -- use `nano-banana-pro/edit` to place the character into each scene, always passing the reference via `images: [ref]`
3. **Animate via i2v** -- pass each scene image to `Video()` for image-to-video generation

Never generate scene images from scratch -- they won't look like the same character.

```tsx
// 1. Character reference
const ref = Image({
  prompt: "a man in a dark suit, dramatic side lighting, neutral background",
  model: varg.imageModel("nano-banana-pro"),
  aspectRatio: "9:16"
})

// 2. Scene images -- swap character into different environments
const scene1 = Image({
  prompt: { text: "same man sitting at a wooden desk, warm lamp light", images: [ref] },
  model: varg.imageModel("nano-banana-pro/edit"),
  aspectRatio: "9:16"
})
const scene2 = Image({
  prompt: { text: "same man standing by a tall window, cold grey daylight", images: [ref] },
  model: varg.imageModel("nano-banana-pro/edit"),
  aspectRatio: "9:16"
})

// 3. Animate each scene
const vid1 = Video({
  prompt: { text: "man looks up from desk, slight head turn", images: [scene1] },
  model: varg.videoModel("kling-v3"),
  duration: 5
})
const vid2 = Video({
  prompt: { text: "man turns from window, eyes cast down", images: [scene2] },
  model: varg.videoModel("kling-v3"),
  duration: 5
})

export default (
  <Render width={1080} height={1920}>
    <Clip duration={5}>{vid1}</Clip>
    <Clip duration={5} transition={{ name: "fade", duration: 0.3 }}>{vid2}</Clip>
  </Render>
)
```

**Cost**: ~320 credits ($3.20) -- 15 (3 images) + 300 (2 videos)

---

## Audio-First Workflow (segment-based narration)

Audio drives the video. Generate all narration in a single `Speech()` call with an array of children -- one string per scene. This produces `segments` with word-level timing that determine clip durations, lipsync boundaries, and caption placement. No hardcoded durations.

**When to use:** Any narrated video with 2+ scenes. This replaces making separate `await Speech()` calls per scene.

### Pattern A: Single voiceover (smooth transitions)

Full audio placed at `<Render>` level for continuous playback. Lipsync clips use `keepAudio: false` since audio comes from the voiceover track. Supports crossfade transitions between clips.

```tsx
// 1. AUDIO FIRST -- one call produces segments with timing
const { audio, segments } = await Speech({
  voice: "rachel",
  model: varg.speechModel("turbo"),
  children: [
    "Welcome to the future of content creation.",
    "Our AI generates stunning visuals in seconds.",
    "Try it today and see the difference."
  ]
})

// 2. Generate a portrait for lipsync
const portrait = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "friendly female host, studio background, looking at camera",
  aspectRatio: "9:16"
})

// 3. VISUALS -- durations come from segment timing
const talking1 = Video({
  model: varg.videoModel("veed-fabric-1.0"),
  keepAudio: false,  // audio comes from the voiceover track
  prompt: { images: [portrait], audio: segments[0] },
})
const brollImg = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "sleek product dashboard, glowing UI",
  aspectRatio: "9:16"
})
const talking2 = Video({
  model: varg.videoModel("veed-fabric-1.0"),
  keepAudio: false,
  prompt: { images: [portrait], audio: segments[2] },
})

// 4. COMPOSE -- full audio as voiceover, segments drive clip durations
export default (
  <Render width={1080} height={1920}>
    <Clip duration={segments[0].duration}>{talking1}</Clip>
    <Clip duration={segments[1].duration} transition={{ name: "fade", duration: 0.3 }}>{brollImg}</Clip>
    <Clip duration={segments[2].duration} transition={{ name: "fade", duration: 0.3 }}>{talking2}</Clip>
    {audio}
    <Captions src={audio} style="tiktok" position="bottom" />
    <Music model={varg.musicModel("music_v1")} prompt="gentle ambient" volume={0.2} duration={audio.duration} ducking />
  </Render>
)
```

### Pattern B: Per-clip audio (hard cuts)

Each segment placed as a clip child. Lipsync clips use `keepAudio: true` so the generated video includes its own audio. Use hard cuts only -- transitions cause audio overlap.

```tsx
const { segments } = await Speech({
  voice: "adam",
  model: varg.speechModel("turbo"),
  children: [
    "Scene one narration goes here.",
    "Scene two is a b-roll with voiceover.",
    "Scene three wraps it up."
  ]
})

const portrait = Image({ model: varg.imageModel("nano-banana-pro"), prompt: "male host, studio, looking at camera", aspectRatio: "9:16" })

const talking1 = Video({ model: varg.videoModel("veed-fabric-1.0"), keepAudio: true, prompt: { images: [portrait], audio: segments[0] } })
const brollImg = Image({ model: varg.imageModel("nano-banana-pro"), prompt: "city skyline timelapse", aspectRatio: "9:16" })
const talking2 = Video({ model: varg.videoModel("veed-fabric-1.0"), keepAudio: true, prompt: { images: [portrait], audio: segments[2] } })

export default (
  <Render width={1080} height={1920}>
    <Clip duration={segments[0].duration}>{talking1}</Clip>
    <Clip duration={segments[1].duration}>{brollImg}{segments[1]}</Clip>
    <Clip duration={segments[2].duration}>{talking2}</Clip>
  </Render>
)
```

### Which pattern to use?

| Pattern | Transitions | Audio source | Best for |
|---------|-------------|-------------|----------|
| Single voiceover (A) | Crossfade OK | Full audio at Render level | Smooth narrated videos, b-roll montages |
| Per-clip audio (B) | Hard cuts only | Each segment as clip child | UGC-style, podcast clips, scene-by-scene |

---

## Talking Head (character + speech + lipsync + captions)

Full pipeline: generate a character, animate them, create voiceover, lipsync the audio to the video, add captions.

```tsx
// 1. Generate character
const character = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "friendly female tech host, professional studio background, warm smile, looking at camera",
  aspectRatio: "9:16"
})

// 2. Animate character
const animated = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "woman talks naturally to camera, subtle hand gestures, professional demeanor", images: [character] },
  duration: 10
})

// 3. Generate voiceover
const voice = Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "rachel",
  children: "Hey everyone! Welcome back to the channel. Today we're going to talk about something really exciting."
})

// 4. Lipsync video to speech
const synced = Video({
  model: varg.videoModel("sync-v2-pro"),
  prompt: { video: animated, audio: voice }
})

// 5. Compose
export default (
  <Render width={1080} height={1920}>
    <Clip duration={10}>{synced}</Clip>
    <Captions src={voice} style="tiktok" position="bottom" withAudio />
  </Render>
)
```

**Cost**: ~310 credits ($3.10) -- 5 (image) + 150 (video) + 25 (speech) + 80 (lipsync) + 50 (captions/transcription)

---

## Longer Videos (chained clips)

Each video clip is 3-15 seconds (kling-v3). Chain multiple clips with transitions for longer videos:

```tsx
<Render width={1080} height={1920}>
  <Clip duration={5}>{vid1}</Clip>
  <Clip duration={5} transition={{ name: "fade", duration: 0.5 }}>{vid2}</Clip>
  <Clip duration={10} transition={{ name: "wipeleft", duration: 0.3 }}>{vid3}</Clip>
</Render>
```

**Important**: Match `<Clip duration={X}>` to the inner `Video({ duration: X })`. Mismatched durations cause black frames or audio desync.

---

## Slideshow (data-driven)

Generate a slideshow from an array of prompts. Easy to customize for any topic.

```tsx
const slides = ["sunset over ocean", "mountain peak at dawn", "forest path in autumn"]
const images = slides.map(prompt =>
  Image({ model: varg.imageModel("nano-banana-pro"), prompt, aspectRatio: "16:9" })
)

export default (
  <Render width={1920} height={1080}>
    <Music model={varg.musicModel("music_v1")} prompt="peaceful ambient, gentle piano" duration={9} volume={0.4} />
    {images.map((img, i) => (
      <Clip key={i} duration={3} transition={i > 0 ? { name: "dissolve", duration: 0.8 } : undefined}>
        {img}
      </Clip>
    ))}
  </Render>
)
```

**Tip**: Add `zoom: "in"` or `zoom: "out"` to `Image()` for a Ken Burns effect (slow pan/zoom over still images). Combine with `dissolve` transitions for a classic documentary feel.

**Cost**: ~55 credits ($0.55) -- 15 (3 images) + 30 (music)

---

## Speech + Music + Captions

Full audio setup with background music that ducks under speech:

```tsx
const speech = Speech({
  model: varg.speechModel("turbo"),
  voice: "adam",
  children: "Welcome to the showcase. Today we have something special for you."
})

export default (
  <Render width={1080} height={1920}>
    <Music model={varg.musicModel("music_v1")} prompt="gentle ambient" volume={0.2} duration={10} ducking />
    <Clip duration={10}>
      {video}
      <Captions src={speech} style="tiktok" position="bottom" withAudio />
    </Clip>
  </Render>
)
```

**Important**: Always set `duration` on `<Music>` to match the total video length. Without it, ElevenLabs generates ~60s of audio which extends the video beyond the intended length.

The `ducking` prop automatically lowers music volume when speech is playing.

---

## Personalized Greeting / Birthday Video

### Pattern: AI Narrator + Subject Character Scenes

Mix a consistent AI narrator character (VEED lipsync) with generated scenes featuring the recipient (nano-banana-pro/edit with reference photos).

**Ingredients:**
- 1-3 reference photos of the recipient (portrait headshot = most important)
- Style reference images (optional, for scene aesthetics)
- Speech-first workflow: `await Speech()` -> segments drive clip durations
- Mixed clips: VEED lipsync (narrator) + image+voiceover (recipient scenes)

**Architecture:**

1. **Speech first**: Single `await Speech()` call with all narrator lines as array children. Returns `{ audio, segments }` -- each segment has `.duration` for clip timing.

2. **Narrator character**: Generate a base image (`nano-banana-pro`), then 3-4 angle variants via `nano-banana-pro/edit` referencing the base. Use VEED lipsync for talking clips.

3. **Subject scenes**: Use `nano-banana-pro/edit` with the recipient's portrait headshot as reference image. Add style reference images for environment/aesthetic consistency.

4. **Composition**: Alternate narrator clips and subject scene clips. Narrator clips use VEED `keepAudio: true`. Scene clips use the speech segment as clip child for voiceover.

```tsx
// Upload recipient photos to S3 first
const recipientRef = "https://s3.varg.ai/clients/birthday/portrait.jpg"

const { audio, segments } = await Speech({
  model: varg.speechModel("eleven_multilingual_v2"),
  voice: "adam",
  children: [
    "Happy birthday, dear friend!",
    "From your early days, you've always been special.",
    "Here's to many more adventures ahead!",
  ]
})

const narrator = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "friendly AI robot character, warm smile, studio background",
  aspectRatio: "9:16"
})

const talking = Video({
  model: varg.videoModel("veed-fabric-1.0"),
  keepAudio: true,
  prompt: { images: [narrator], audio: segments[0] },
})

const scene1 = Image({
  model: varg.imageModel("nano-banana-pro/edit"),
  prompt: { text: "same person in a futuristic celebration scene", images: [recipientRef] },
  aspectRatio: "9:16"
})

export default (
  <Render width={1080} height={1920}>
    <Clip duration={segments[0].duration}>{talking}</Clip>
    <Clip duration={segments[1].duration}>{scene1}{segments[1]}</Clip>
    <Captions src={audio} style="tiktok" position="bottom" />
  </Render>
)
```

**Key tips:**
- Keep `Speech()` parameters IDENTICAL between renders (avoids cache invalidation cascade -- see [common-errors.md](common-errors.md))
- Upload reference photos to S3 first (gateway `POST /v1/files`)
- Use descriptive character consistency prompts: "Same man -- dark beard, warm smile, same face"
- VEED Fabric 1.0 is fastest for narrator lipsync (image + audio -> talking video)

---

## Output Format Persistence

When iterating on a previous request, preserve the output format (image, video, audio) unless explicitly told otherwise.

**Explicit format-change triggers**: "animate", "make it move", "create a video", "turn into a video", "add motion", "sequence", "multiple scenes"

**Ambiguous instructions** (e.g., "add effects", "enhance"): Ask for clarification. Example: "Want this as a static image with visual FX, or animated?"
