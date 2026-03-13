# varg AI Agent Skills

A collection of [Agent Skills](https://agentskills.io) for AI video, image, speech, and music generation using the varg platform.

## Installation

```bash
npx skills add vargHQ/skills
```

## Available Skills

### varg-ai

Generate AI videos, images, speech, and music using the varg SDK and gateway API.

**Use when:**
- Creating videos, animations, talking characters
- Building TikTok/Reels/Shorts content
- Generating slideshows with AI images
- Making talking head videos with lipsync
- Product showcases and commercials
- Single-asset generation (one-off images, video clips, speech, music)

**Requirements:**
- Bun runtime
- `VARG_API_KEY` (recommended -- single key for all providers) or `FAL_KEY` (direct fal.ai access)
- Optional: `ELEVENLABS_API_KEY`, `REPLICATE_API_TOKEN`, `HIGGSFIELD_API_KEY`

**Features:**
- JSX-based video composition with AI-powered media generation
- 10+ video models, 12+ image models, 6+ speech models
- Character consistency across multi-scene videos
- Automatic caching (same prompt = instant $0 cache hit)
- Music, captions, lipsync, transitions, layouts
- Gateway REST API for single-asset generation
- Preview mode (free placeholders for structure validation)

## Quick Start

```bash
# 1. Install the skill
npx skills add vargHQ/skills

# 2. Set your API key
export VARG_API_KEY=varg_xxx

# 3. Run setup to verify environment
bun scripts/setup.ts

# 4. Render your first video
bunx vargai render hello.tsx --preview    # Free preview
bunx vargai render hello.tsx --verbose    # Full render
```

## Skill Structure

```
varg-ai/
├── SKILL.md                # Core instructions
├── references/
│   ├── models.md           # Complete model catalog with pricing
│   ├── components.md       # All JSX components and props
│   ├── prompting.md        # Prompt engineering guide
│   ├── gateway-api.md      # REST API for single-asset generation
│   ├── common-errors.md    # Debugging and gotchas
│   └── templates.md        # 6 ready-to-use templates
└── scripts/
    └── setup.ts            # Environment setup and verification
```

## Example Prompts

```
Create a 15-second TikTok video about a warrior princess
Generate a talking head video with a friendly tech host
Make a product showcase for wireless earbuds
Create a slideshow of nature scenes with ambient music
Generate a single hero image for a landing page
```

## Documentation

- [vargHQ/sdk](https://github.com/vargHQ/sdk) -- Full SDK documentation
- [vargHQ/templates](https://github.com/vargHQ/templates) -- Video template examples
- [Agent Skills Spec](https://agentskills.io/specification) -- Agent Skills format

## License

MIT
