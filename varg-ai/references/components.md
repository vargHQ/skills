# Component Reference

All components are available as globals when rendering via the render service or imported from `"vargai/react"` when using the SDK directly.

## `<Render>` -- Root Container

Every template must export a `<Render>` as the default export.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | 1920 | Output width in pixels |
| `height` | `number` | 1080 | Output height in pixels |
| `fps` | `number` | 30 | Frames per second |
| `normalize` | `boolean` | false | Normalize audio levels |
| `shortest` | `boolean` | false | End video at shortest track |

```tsx
// Vertical (9:16 for TikTok/Reels)
<Render width={1080} height={1920} fps={30}>

// Horizontal (16:9 for YouTube)
<Render width={1920} height={1080}>

// Square (1:1 for Instagram)
<Render width={1080} height={1080}>
```

---

## `<Clip>` -- Timeline Segment

Defines a section of the timeline. Clips play sequentially.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | auto | Duration in seconds. Should match inner Video duration. |
| `transition` | `{ name, duration }` | none | Transition from previous clip |
| `cutFrom` | `number` | 0 | Trim start (seconds). Use `0.3` to skip AI warm-up frames. |
| `cutTo` | `number` | end | Trim end (seconds). Source duration must be >= cutTo. |

### Transitions

Available `name` values: `fade`, `dissolve`, `wipeleft`, `wiperight`, `wipeup`, `wipedown`, `slideleft`, `slideright`, `slideup`, `slidedown`, and all FFmpeg xfade transitions.

```tsx
<Clip duration={5} transition={{ name: "fade", duration: 0.5 }}>
  {video}
</Clip>

// Punchy cuts with trimming
<Clip cutFrom={0.3} cutTo={2.5} duration={2.2}>
  {video}  // Source must be >= 2.5s
</Clip>
```

---

## `Image()` -- Image Generation

**Must be called as a function, not JSX.**

| Prop | Type | Description |
|------|------|-------------|
| `model` | `ImageModelV3` | Required. e.g. `varg.imageModel("nano-banana-pro")` |
| `prompt` | `string \| { text, images }` | Text prompt or edit prompt with references |
| `aspectRatio` | `string` | `"16:9"`, `"9:16"`, `"1:1"`, `"4:3"`, `"3:4"` |
| `providerOptions` | `object` | Model-specific options |

```tsx
// Text-to-image
const img = Image({
  model: varg.imageModel("nano-banana-pro"),
  prompt: "cinematic portrait, golden hour",
  aspectRatio: "9:16"
})

// Reference editing
const edited = Image({
  model: varg.imageModel("nano-banana-pro/edit"),
  prompt: { text: "same person on a beach", images: [referenceImage] },
  aspectRatio: "9:16"
})
```

---

## `Video()` -- Video Generation

**Must be called as a function, not JSX.**

| Prop | Type | Description |
|------|------|-------------|
| `model` | `VideoModelV3` | Required. e.g. `varg.videoModel("kling-v3")` |
| `prompt` | `string \| { text?, images?, audio?, video? }` | Prompt with optional media inputs |
| `duration` | `number` | Duration in seconds. Check model constraints! |
| `aspectRatio` | `string` | `"16:9"`, `"9:16"`, `"1:1"` |
| `providerOptions` | `object` | Model-specific options |

```tsx
// Text-to-video
const vid = Video({
  model: varg.videoModel("kling-v3"),
  prompt: "a bird soaring over mountains, aerial shot",
  duration: 5
})

// Image-to-video (ONE image only)
const animated = Video({
  model: varg.videoModel("kling-v3"),
  prompt: { text: "person starts walking forward", images: [characterImage] },
  duration: 5
})

// Lipsync (video + audio)
const synced = Video({
  model: varg.videoModel("sync-v2-pro"),
  prompt: { video: animatedCharacter, audio: voiceover }
})
```

---

## `Speech()` -- Text-to-Speech

**Must be called as a function, not JSX.**

| Prop | Type | Description |
|------|------|-------------|
| `model` | `SpeechModelV3` | Required. e.g. `varg.speechModel("eleven_v3")` |
| `voice` | `string` | Voice name (see [models.md](models.md) for list) |
| `children` | `string` | Text to speak |

```tsx
const narration = Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "rachel",
  children: "Welcome to our product showcase."
})
```

---

## `<Music>` -- Background Audio

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MusicModelV3` | - | Required for AI music. `varg.musicModel("music_v1")` |
| `prompt` | `string` | - | Music description |
| `src` | `string` | - | URL for pre-made audio (instead of AI generation) |
| `duration` | `number` | - | **Required**. Must match total video length. |
| `volume` | `number` | 1.0 | Volume (0-1) |
| `loop` | `boolean` | false | Loop the audio |
| `ducking` | `boolean` | false | Auto-lower volume under speech |
| `start` | `number` | 0 | Offset in seconds |

```tsx
<Render width={1080} height={1920}>
  <Music
    model={varg.musicModel("music_v1")}
    prompt="upbeat electronic, rising energy"
    duration={15}
    volume={0.3}
    ducking
  />
  <Clip duration={15}>{video}</Clip>
</Render>
```

---

## `<Captions>` -- Subtitle Track

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `Speech result` | - | Speech element to transcribe |
| `srt` | `string` | - | SRT content (alternative to src) |
| `style` | `string` | `"tiktok"` | `tiktok`, `karaoke`, `bounce`, `typewriter` |
| `position` | `string` | `"bottom"` | `top`, `center`, `bottom` |

```tsx
const speech = Speech({ ... })

<Captions src={speech} style="tiktok" position="bottom" />
```

### Caption Styles

- **tiktok** -- Bold white text, large, social-media style
- **karaoke** -- Cyan highlighted word-by-word
- **bounce** -- Impact font with bounce animation
- **typewriter** -- Green monospace, typing effect

---

## `<Title>` -- Text Overlay

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `string` | `"center"` | `top`, `center`, `bottom` |
| `color` | `string` | `"white"` | Text color |
| `outline` | `boolean` | true | Text outline for readability |
| `children` | `string` | - | Title text |

```tsx
<Clip duration={5}>
  {video}
  <Title position="bottom" color="white">Product Name</Title>
</Clip>
```

---

## `<Subtitle>` -- Simple Subtitle

| Prop | Type | Description |
|------|------|-------------|
| `children` | `string` | Subtitle text |

---

## `<Overlay>` -- Positioned Layer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `left` | `number` | 0 | X position (pixels) |
| `top` | `number` | 0 | Y position (pixels) |
| `width` | `number` | auto | Width (pixels) |
| `height` | `number` | auto | Height (pixels) |
| `volume` | `number` | 1.0 | Audio volume for overlay content |

```tsx
<Clip duration={5}>
  {backgroundVideo}
  <Overlay left={50} top={50} width={300} height={300}>
    {logoImage}
  </Overlay>
</Clip>
```

---

## Layout Components

### `<Split>` -- Side-by-Side

```tsx
<Split direction="horizontal">
  {leftVideo}
  {rightVideo}
</Split>
```

### `<Grid>` -- N x M Grid

```tsx
<Grid columns={2} rows={2}>
  {video1}
  {video2}
  {video3}
  {video4}
</Grid>
```

### `<Slot>` -- Grid/Split Slot

Used inside Grid or Split for fine positioning.

### `<Slider>` -- Carousel

```tsx
<Slider direction="horizontal">
  {image1}
  {image2}
  {image3}
</Slider>
```

### `<Swipe>` -- Swipe Animation

```tsx
<Swipe direction="left">
  {image1}
  {image2}
</Swipe>
```

---

## `<Packshot>` -- End Card

| Prop | Type | Description |
|------|------|-------------|
| `logo` | `string` | Logo URL |
| `url` | `string` | Website URL text |
| `text` | `string` | CTA button text |
| `colors` | `object` | `{ background, text, button, buttonText }` |
| `blinking` | `boolean` | Animate CTA button |

```tsx
<Clip duration={3}>
  <Packshot
    logo="https://s3.varg.ai/logos/brand.png"
    url="brand.com"
    text="Shop Now"
    colors={{ background: "#000", text: "#fff", button: "#ff0000", buttonText: "#fff" }}
    blinking
  />
</Clip>
```

---

## `<TalkingHead>` -- Animated Character

Combines image generation, animation, speech, and lipsync into one component.

| Prop | Type | Description |
|------|------|-------------|
| `character` | `string` | Character description prompt |
| `voice` | `string` | Voice name |
| `model` | `VideoModelV3` | Video model for animation |
| `lipsyncModel` | `VideoModelV3` | Lipsync model |
| `children` | `string` | Speech text |

```tsx
<TalkingHead
  character="friendly female host, studio background"
  voice="rachel"
  model={varg.videoModel("kling-v3")}
  lipsyncModel={varg.videoModel("sync-v2-pro")}
>
  Welcome to our show! Today we're going to talk about...
</TalkingHead>
```
