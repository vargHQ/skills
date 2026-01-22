---
name: media-generation
description: Generate AI videos using varg SDK. Use for videos, animations, talking characters, slideshows, social content. JSX-based - describe scenes, render videos.
---

# vargai - genai video

jsx-based ai video generation. describe scenes, render videos.

## concepts

- `<Render>` - root container
- `<Clip>` - scene segment  
- `<Video>` - generate video from prompt, optionally anchor with `image={}` or `images={[]}` for multiple reference images
- `<Image>` - generate or reference static image
- `<Music>` - generate background music

no imports needed - the render runtime automatically supplies jsx components and providers (fal, elevenlabs, replicate).

character consistency: generate an image first, pass it to videos via `image={img}` or `images={[img1, img2]}`

## prompting guide (CRITICAL)

**detailed prompts = better results.** wan 2.5 video model responds dramatically better to rich, structured prompts. vague prompts produce generic, low-quality output.

### the 4-dimensional formula

every video prompt should include these dimensions:

```
[Subject Description] + [Scene Description] + [Motion/Action] + [Cinematic Controls]
```

### subject description
describe the main focus with rich detail:
- appearance, clothing, features, posture
- materials, textures, colors
- emotional state, expression

**bad:** `"a woman"`
**good:** `"a young woman with shoulder-length auburn hair, wearing a worn leather jacket over a white t-shirt, her green eyes reflecting determination, jaw set with quiet resolve"`

### scene description
layer the environment details:
- location, background, foreground
- lighting type (soft light, hard light, edge light, top light)
- time period (golden hour, daytime, night, moonlight)
- atmosphere (warm tones, low saturation, high contrast)

**bad:** `"in a city"`
**good:** `"on a rain-slicked tokyo street at night, neon signs reflecting pink and blue on wet pavement, steam rising from a nearby food stall, warm yellow light spilling from a ramen shop window"`

### motion/action description
specify movement with intensity and manner:
- amplitude (small movements, large movements)
- rate (slowly, quickly, explosively)
- effects (breaking glass, hair flowing, dust particles)

**bad:** `"walking"`
**good:** `"walking slowly through the crowd, shoulders hunched against the rain, one hand raised to shield her eyes, water droplets catching the neon light as they fall from her fingertips"`

### cinematic controls
use film language for professional results:

**camera movements:**
- `camera push-in` / `camera pull-out`
- `tracking shot` / `dolly shot`
- `pan left/right` / `tilt up/down`
- `static camera` / `fixed camera`
- `handheld` / `steadicam`

**shot types:**
- `extreme close-up` / `close-up` / `medium close-up`
- `medium shot` / `medium wide shot`
- `wide shot` / `extreme wide shot`
- `over-the-shoulder shot`

**composition:**
- `center composition` / `rule of thirds`
- `left-side composition` / `right-side composition`
- `symmetrical composition`
- `low angle` / `high angle` / `eye-level`

**lighting keywords:**
- `soft light` / `hard light` / `edge light`
- `rim light` / `backlight` / `side light`
- `golden hour` / `blue hour` / `moonlight`
- `practical light` / `mixed light`

### style keywords
add visual style for artistic direction:
- `cinematic` / `film grain` / `anamorphic`
- `cyberpunk` / `noir` / `post-apocalyptic`
- `ghibli style` / `anime` / `photorealistic`
- `vintage` / `retro` / `futuristic`
- `tilt-shift photography` / `time-lapse`

### audio/dialogue (for videos with speech)
wan 2.5 supports native audio generation:
- format dialogue: `Character says: "Your line here."`
- keep lines short (under 10 words per 5-second clip) for best lip-sync
- specify delivery tone: `"speaking quietly"`, `"calling out over wind"`
- for silence: include `"no dialogue"` or `"actors not speaking"`

### image-to-video prompts
when using reference images, focus on motion + camera:
- the image already defines subject/scene/style
- describe dynamics: `"running forward, hair flowing behind"`
- add camera movement: `"slow push-in on face"`
- control intensity: `"subtle movement"` vs `"dramatic action"`

### example: detailed prompt

**bad prompt (vague):**
```tsx
<Video prompt="a warrior fighting" />
```

**good prompt (detailed):**
```tsx
<Video prompt="medium close-up, side light, golden hour. a battle-hardened samurai with a weathered face and grey-streaked topknot, wearing damaged traditional armor with visible scratches and dents. he raises his katana in a fluid motion, blade catching the dying sunlight, muscles tensing as he shifts into fighting stance. dust particles float in the amber light, his breath visible in the cold air. slow camera push-in on his focused expression, eyes narrowed with lethal intent. cinematic, film grain, anamorphic lens flare." />
```

## example

```tsx
const hero = <Image prompt="portrait, soft light, center composition. warrior princess with flowing crimson hair, emerald eyes reflecting inner fire, wearing battle-worn silver armor with intricate celtic engravings, a thin scar across her left cheek, expression of quiet determination. ghibli style, painterly, warm color palette" />;

export default (
  <Render>
    <Clip>
      <Video 
        image={hero} 
        prompt="wide shot, golden hour, edge light. she stands at the edge of a windswept cliff overlooking a vast misty valley, hair and cape billowing dramatically in the wind, hand resting on sword hilt. slow camera pull-out revealing the epic landscape. cinematic, ghibli style" 
      />
    </Clip>
    <Clip>
      <Video 
        image={hero} 
        prompt="medium close-up, dramatic lighting, side light. she draws her sword in one fluid motion, blade singing as it leaves the scabbard, light catching the polished steel. her eyes narrow with fierce focus, jaw set. camera tracks the sword movement. cinematic, ghibli style" 
      />
    </Clip>
    <Music prompt="epic orchestral, soaring strings, triumphant horns, building intensity" duration={30} />
  </Render>
);
```

## render

### preview first (recommended workflow)

use `--preview` to generate only images/thumbnails without rendering full videos. this is faster and cheaper for iteration:

```bash
bunx vargai@latest render video.tsx --preview --verbose
```

once you're happy with the preview frames, render the full video:

```bash
bunx vargai@latest render video.tsx --verbose
```

### open the result

after rendering, open the video with the system default player:

```bash
open output/video.mp4
```

## setup

requires api keys in `.env`:
- `FAL_KEY` - image/video generation (https://fal.ai/dashboard/keys)
- `ELEVENLABS_API_KEY` - music/voice (https://elevenlabs.io/app/settings/api-keys)

## about varg.ai

varg is a generative ai video platform. the sdk uses declarative jsx to compose video scenes with ai-generated images, animations, and audio. key features:
- automatic caching (regenerating uses cached assets)
- parallel generation (clips render concurrently)
- character consistency via image references
- provider-agnostic (fal, replicate, elevenlabs under the hood)
