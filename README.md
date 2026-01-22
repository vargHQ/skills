# vargai Agent Skills

A collection of [Agent Skills](https://agentskills.io) for AI video and content generation.

## Installation

```bash
npx add-skill vargHQ/skills
```

## Available Skills

### varg-video-generation

Generate AI videos using varg SDK React engine with declarative JSX syntax.

**Use when:**
- Creating videos, animations, talking characters
- Building TikTok/Reels/Shorts content
- Generating slideshows with AI images
- Making talking head videos

**Requirements:**
- Bun runtime
- `FAL_API_KEY` (required) - Get at https://fal.ai/dashboard/keys
- `ELEVENLABS_API_KEY` (optional) - For music/voice generation

**Features:**
- Declarative JSX syntax for video composition
- Automatic caching (same props = instant cache hit)
- Parallel generation where possible
- Support for images, video, music, voice, and captions

## Usage

After installation, the skill is automatically available to your AI agent.

**Example prompts:**
```
Create a 10 second TikTok video about cats
Generate a talking character video with a robot
Make a slideshow with AI images of sunsets
Create an animated video with background music
```

## Alternative Installation

### Using bunx (with full setup wizard)

```bash
bunx vargai
```

This runs an interactive setup that:
- Prompts for API keys
- Creates project structure
- Installs the skill
- Creates example files

### Manual (clone SDK)

```bash
git clone https://github.com/vargHQ/sdk
cd sdk
# Skill auto-loads via .claude/rules/
```

## Skill Structure

```
skills/varg-video-generation/
├── SKILL.md           # Main instructions
├── scripts/
│   └── setup.ts       # Setup script
└── references/
    └── templates.md   # Code templates
```

## Documentation

- [vargHQ/sdk](https://github.com/vargHQ/sdk) - Full SDK documentation
- [Agent Skills Spec](https://agentskills.io/specification) - Agent Skills format

## License

MIT
