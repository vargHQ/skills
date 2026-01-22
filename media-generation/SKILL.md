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

## example

```tsx
const hero = <Image prompt="warrior princess, red hair, ghibli style" />;

export default (
  <Render>
    <Clip>
      <Video image={hero} prompt="standing on cliff" />
    </Clip>
    <Clip>
      <Video image={hero} prompt="drawing sword" />
    </Clip>
    <Music prompt="epic orchestral" duration={30} />
  </Render>
);
```

## render

```bash
bunx vargai@latest render video.tsx --verbose
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
