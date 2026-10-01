# Prompting Guide for varg Video Generation

Use this when video outputs look generic, inconsistent, or lack motion. Rich prompts dramatically improve Wan/Kling results.

## The 4D Formula

Every video prompt should cover four dimensions:

1. Subject: who/what is the focus
2. Scene: where it happens and what it looks like
3. Motion: how things move and with what intensity
4. Cinematic controls: how the camera and lighting behave

Template:

```text
[Subject] + [Scene] + [Motion] + [Cinematic controls]
```

## Subject

Describe appearance, materials, clothing, and expression.

Weak: "a woman"

Stronger:

```text
a young woman with shoulder-length auburn hair, wearing a worn leather jacket,
green eyes reflecting determination, jaw set with quiet resolve
```

## Scene

Layer in environment, lighting, and mood.

Weak: "in a city"

Stronger:

```text
on a rain-slicked Tokyo street at night, neon signs reflecting pink and blue on
wet pavement, steam rising from a nearby food stall, warm light spilling from a
ramen shop window
```

## Motion

Be explicit about movement, amplitude, and pacing.

Weak: "walking"

Stronger:

```text
walking slowly through the crowd, shoulders hunched against the rain, one hand
raised to shield her eyes, droplets catching the neon light as they fall
```

## Cinematic Controls

Use film language to control results:

- Camera movement: push-in, pull-out, pan, tilt, tracking shot, static camera
- Shot type: extreme close-up, close-up, medium, wide, over-the-shoulder
- Composition: rule of thirds, centered, symmetrical, low angle, high angle
- Lighting: soft light, hard light, rim light, backlight, golden hour, moonlight

Example cinematic suffix:

```text
medium close-up, golden hour, dramatic rim light from behind, slow push-in,
shallow depth of field, cinematic, film grain, anamorphic lens flare
```

## Character Consistency

Generate a character once and reuse it across clips.

```tsx
import { render, Render, Clip, Image, Video } from "vargai/react";
import { fal } from "vargai/ai";

const hero = Image({
  prompt:
    "portrait, centered composition. warrior princess with crimson hair, emerald eyes, battle-worn silver armor, a thin scar across her left cheek",
  model: fal.imageModel("flux-schnell"),
  aspectRatio: "9:16",
});

await render(
  <Render width={1080} height={1920}>
    <Clip duration={4}>
      <Video
        model={fal.videoModel("wan-2.5")}
        prompt={{
          images: [hero],
          text:
            "wide shot on a windswept cliff, cape billowing in the wind, dust particles in golden light, slow camera pull-out",
        }}
      />
    </Clip>
    <Clip duration={3}>
      <Video
        model={fal.videoModel("wan-2.5")}
        prompt={{
          images: [hero],
          text:
            "medium close-up, she draws her sword in one fluid motion, blade catches the dying sunlight, slow push-in",
        }}
      />
    </Clip>
  </Render>,
  { output: "output/hero.mp4", cache: ".cache/ai" },
);
```

## Repair Strategy When Results Are Weak

1. Add missing dimensions from the 4D formula.
2. Increase specificity about motion and camera.
3. Reduce complexity: fewer subjects, simpler scene.
4. Lock consistency: reuse `Image(...)` outputs across clips.
