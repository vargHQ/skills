---
name: varg-dialogue-scenes
description: >-
  Multi-speaker dialogue videos with varg: two-person podcasts, conversation
  scenes cut across multiple camera angles (wide two-shot, over-the-shoulder,
  close-ups), and per-speaker audio strategy. Use when a video has 2+ people
  talking to each other, when building a podcast/interview clip, or when a
  dialogue needs shot/reverse-shot coverage. Triggers: "podcast video", "two
  people talking", "interview video", "dialogue scene", "conversation",
  "different camera angles", "shot reverse shot".
license: MIT
metadata:
  author: vargHQ
  version: "1.0.0"
---

# Skill: varg-dialogue-scenes

Two or more characters talking to each other, cut like real coverage:
master two-shot, over-the-shoulder (OTS) angles, close-ups.

Prerequisites: `varg-ai` (syntax, models), `varg-characters` (cards,
composites, qwen_angles), `varg-character-video` (lipsync, native audio,
keepAudio rules). Read those first — this skill only adds the multi-speaker
and multi-angle layer.

## The coverage principle

Film dialogue the way editors cut it. Build ONE master scene, then derive
every camera angle from that same master — never generate angles
independently, or the room and blocking will drift.

```
cardA ─┐
cardB ─┼─edit─> MASTER two-shot ─┬─edit/qwen_angles─> OTS-on-A
locCard┘                         ├─────────────────> OTS-on-B
                                 ├─────────────────> close-up A
                                 └─────────────────> close-up B
```

### 1. Cards and master shot

```tsx
// Character cards + location card: see varg-characters
const SAME = "First reference image is Maya (30s, curly dark hair, mustard \
sweater). Second reference image is Tom (40s, grey stubble, navy overshirt). \
Third reference image is the podcast studio with two mics and warm lamps. \
Keep both faces, hair, bodies and outfits exactly as in their reference \
images, and the studio exactly as in the location reference."

const master = Image({
  model: varg.imageModel("nano_banana_pro/edit"),
  prompt: { text: `${SAME} Wide two-shot: Maya on the left and Tom on the \
right sit across a small table with two podcast microphones, both mid- \
conversation, relaxed posture, facing each other`, images: [cardA, cardB, studioLoc] },
  aspectRatio: "16:9",
})
```

Lock the **blocking** in the master: who sits left/right, table, mics,
lamps. Every later angle must agree with it.

### 2. Angle stills from the master

Two techniques — combine them:

**A. /edit with the master as reference** (best for OTS and re-framing):

```tsx
const otsOnMaya = Image({
  model: varg.imageModel("nano_banana_pro/edit"),
  prompt: { text: `${SAME} Fourth reference image is the master wide shot — \
keep seating, table and background identical. Over-the-shoulder shot from \
behind Tom's right shoulder: Tom blurred in foreground, Maya in focus \
speaking, medium close-up`, images: [cardA, cardB, studioLoc, master] },
  aspectRatio: "16:9",
})
const closeTom = Image({
  model: varg.imageModel("nano_banana_pro/edit"),
  prompt: { text: `${SAME} Fourth reference image is the master wide shot — \
same studio, same seat. Close-up of Tom listening, then about to reply, \
shallow depth of field`, images: [cardA, cardB, studioLoc, master] },
  aspectRatio: "16:9",
})
```

**B. qwen_angles camera rotation** (cheap ~9 cr, physically consistent):

```tsx
const masterFromRight = Image({
  model: varg.imageModel("qwen_angles"),
  prompt: { text: "", images: [master] },
  aspectRatio: "16:9",
  providerOptions: { varg: { horizontal_angle: 40, vertical_angle: 5, zoom: 6 } },
})
```

Use qwen_angles for camera moves around the SAME composition; use /edit when
the shot needs different focus/framing logic (OTS blur, singles).

**Approve all stills before any video** (see `varg-characters` approval
pass). A 6-angle set costs ~$7 in stills vs ~$15+ per video iteration.

### 3. Screen direction (the 180° rule)

Keep the camera on one side of the conversation axis: if Maya looks
frame-right in her single, Tom must look frame-left in his. State gaze
direction explicitly in every angle prompt ("Maya looks slightly
frame-right at Tom off-screen"). Violating this makes cuts feel like the
speakers swapped seats.

## Audio strategy: pick ONE per project

| Strategy | How | Pros / cons |
|---|---|---|
| **A. Native audio per clip** (default for podcasts) | each `kling_v3` clip voices its own line via `generate_audio` | most natural in-scene sound; hard cuts only; voices may vary slightly between clips — anchor with "deep calm male voice" / "bright female voice" in every prompt |
| **B. Speech-first per speaker** | two `Speech()` calls (different `voice` ids) → `veed_fabric_1_0` per line on each single | exact wording + reproducible voices; talking heads only (no in-scene acting), assemble alternating clips |

Don't mix strategies within one conversation — the sound texture won't match.

### Strategy A: native-audio dialogue clips

One clip per line (or per exchange). Each clip's still is the angle of
whoever speaks; the prompt quotes the line and describes the listener:

```tsx
const line1 = Video({
  model: varg.videoModel("kling_v3"),
  prompt: {
    text: `Podcast studio, same framing. Maya leans toward the mic and says \
enthusiastically: "So you actually quit your job over this?" Tom's shoulder \
visible in foreground, he nods. Quiet room tone.`,
    images: [otsOnMaya],
  },
  keepAudio: true,
  duration: 4,                       // integer 3-15; ~2.5 words/sec
  providerOptions: { varg: { generate_audio: true } },
})
const line2 = Video({
  model: varg.videoModel("kling_v3"),
  prompt: {
    text: `Same studio. Tom smiles, pauses, and says in a deep calm voice: \
"Best decision I ever made." He taps the table lightly. Quiet room tone.`,
    images: [otsOnTom],
  },
  keepAudio: true,
  duration: 4,
  providerOptions: { varg: { generate_audio: true } },
})
```

- Two-speaker exchange **inside one clip** also works for short beats:
  `Maya says: "Ready?" Tom replies: "Always."` — use the master two-shot as
  the source still.
- Repeat a short voice anchor for each character in every prompt — this is
  what keeps voices recognizable across clips.

### Strategy B: speech-first dialogue

```tsx
const mayaVoice = await Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "EXAVITQu4vr4xnSDxMaL",          // Sarah — female
  children: ["So you actually quit your job over this?"],
})
const tomVoice = await Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "nPczCjzI2devNBz1zQrb",          // Brian — deep male
  children: ["Best decision I ever made.", "And I'd do it again."],
})

const talk1 = Video({ model: varg.videoModel("veed_fabric_1_0"), keepAudio: true,
  prompt: { images: [closeMaya], audio: mayaVoice.segments[0] } })
const talk2 = Video({ model: varg.videoModel("veed_fabric_1_0"), keepAudio: true,
  prompt: { images: [closeTom], audio: tomVoice.segments[0] } })
```

Per-clip audio → hard cuts only. The lipsync stills must show the speaker's
mouth clearly (close-up or medium), facing camera-ish.

## Editing rhythm (what makes it feel like a real podcast)

Assemble angles in this pattern:

1. **Open on the master two-shot** (establish geography, 3-5s).
2. **Cut to the speaker** for each line (OTS or single).
3. **Insert reaction shots** — the listener nodding/smiling — every 3-4
   lines. Generate 1-2 short "listening" clips per character (no dialogue,
   `"no dialogue, he listens and nods, ambient room tone"`).
4. **Return to the wide** for topic changes and the ending.
5. Hard cuts between speakers; no transitions (audio overlap).

```tsx
export default (
  <Render width={1920} height={1080}>
    <Clip duration={4} cutFrom={0.2}>{wideIntro}</Clip>
    <Clip duration={4} cutFrom={0.2}>{line1}</Clip>
    <Clip duration={4} cutFrom={0.2}>{line2}</Clip>
    <Clip duration={3} cutFrom={0.2}>{mayaReacts}</Clip>
    <Clip duration={4} cutFrom={0.2}>{line3}</Clip>
    <Clip duration={4} cutFrom={0.2}>{wideOutro}</Clip>
    <Music model={varg.musicModel("music_v1")} prompt="subtle warm lo-fi bed, \
unobtrusive" duration={23} volume={0.12} ducking />
  </Render>
)
```

For vertical podcast clips (9:16): frame singles tighter (MCU), captions
`position="center"`, and consider a `<Split direction="vertical">` layout
with both speakers stacked for reaction-heavy moments.

## Advanced: reference-to-video (one-clip consistency)

`kling_v3_pro_reference_to_video` generates video from up to 7 reference
images with `@Image1..@ImageN` prompt syntax — useful when a single clip
must contain both characters interacting with camera movement:

```tsx
const duet = Video({
  model: varg.videoModel("kling_v3_pro_reference_to_video"),
  prompt: {
    text: "@Image3 is the scene start frame. The woman from @Image1 and the \
man from @Image2 laugh together, camera slowly orbits the table",
    // images[0] → start frame, images[1] → end frame, images[2+] → appearance refs
    images: [master, master, cardA, cardB],
  },
  duration: 5,
})
```

Image mapping quirk: the **first** image becomes the start frame, the
**second** becomes the end frame, and the **third onward** become appearance
references (`image_urls`). Native audio defaults ON for this model. More
expensive per second — use for hero moments, not every line.

## QA specific to dialogue

On top of the standard checks (`varg-character-video` §5):

```bash
ffmpeg -i out.mp4 -af "silencedetect=noise=-35dB:d=0.35" -f null - 2>&1 | grep silence_
ffmpeg -v error -ss 2 -i out.mp4 -frames:v 1 -vf scale=360:-1 f1.png -y   # per clip
```

- **Voice continuity** (strategy A): transcribe the final mix and listen-map
  each line to its speaker; if a character's voice flipped gender/timbre in
  one clip, regenerate that clip with a stronger voice anchor.
- **Screen direction**: in singles, speakers look toward each other across
  cuts (Maya frame-right ↔ Tom frame-left).
- **Blocking drift**: mic/table/lamp positions match the master in every
  angle; seat swaps are regeneration-worthy.
- **Lip activity**: freeze a frame mid-line — the on-screen speaker's mouth
  must be open/moving, the listener's closed.
- **Overlaps**: no two voices at once (double-audio = a `keepAudio: true`
  clip playing under a Render-level track).

## Cost reference (2-person podcast, 6 clips, ~23s @ 16:9)

| Step | ~Credits |
|---|---|
| 2 cards + studio + master + 4 angles (8 stills) | ~1000 |
| 6 kling_v3 native-audio clips (4s each) | ~1330 |
| Music + transcription QA | ~85 |
| Iterating one angle still / one line clip | ~126 / ~221 |
| Full re-render, unchanged prompts | ~0 (cache) |
