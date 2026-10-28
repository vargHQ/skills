# varg — AI Agent Skills for Video, Image, Speech & Music Generation

A collection of [Agent Skills](https://agentskills.io) for AI video, image, speech, and music generation using the varg platform. One skill to access Seedance 2.5, Kling 4, Wan 3, Veo 3.1, Nano Banana 2.1, GPT Image 2.5, ElevenLabs v4 and 200+ more models — zero code, just prompt.

<p align="center">
  <a href="https://github.com/vargHQ/skills/stargazers"><img src="https://img.shields.io/github/stars/vargHQ/skills" alt="GitHub stars"></a>
  <a href="https://github.com/vargHQ/skills/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License"></a>
</p>

Works with **Claude Code**, **Cursor**, **Windsurf**, **OpenCode**, **ClawHub**, and any tool that supports the [Agent Skills](https://agentskills.io) standard.

## Installation

### ClawHub (recommended)

```bash
# Install a specific skill
npx clawhub@latest install vargai

# Or install all skills from this repo
npx clawhub@latest install vargai
```

### Claude Code plugin

Installs the `varg-ai` skill and the hosted varg MCP server (`https://mcp.varg.ai/mcp`, sign in with OAuth on first use):

```bash
claude plugin marketplace add vargHQ/skills
claude plugin install varg@varg
```

Or inside Claude Code: `/plugin marketplace add vargHQ/skills`, then `/plugin install varg@varg`.

### Claude Code (manual)

```bash
# Clone into personal skills directory (available in all projects)
git clone https://github.com/vargHQ/skills.git ~/.claude/skills/varg

# Or symlink individual skills
ln -s /path/to/skills/varg-ai ~/.claude/skills/varg-ai
```

### OpenCode

```bash
# Clone into any supported skills directory
git clone https://github.com/vargHQ/skills.git ~/.opencode/skills/varg

# Also works with:
#   ~/.agents/skills/
#   .opencode/skills/ (project-level)
```

### Agent Skills CLI

```bash
npx skills add vargHQ/skills --yes
```

## Available Skills

**Find the right skill:** not sure which skill fits a video request? Start with [video-skills](./video-skills/). It searches the varg Skills catalog ([skills.varg.ai](https://skills.varg.ai)) for the format and lists the options to offer before anything is generated.

| Skill | Description | ClawHub Slug |
|-------|-------------|--------------|
| [varg-ai](./varg-ai/) | AI video, image, speech, and music generation | `vargai` |
| [varg-previz](./varg-previz/) | Plan multi-shot AI videos: story, anchors, a three.js grey-box previz with auto cameras, Seedance video-to-video packs | — |
| [varg-video-editing](./varg-video-editing/) | Which service to edit existing footage with, job by job (cuts, talking-head cleanup, Shorts, captions, AI restyle and swaps, dubbing, upscaling, QA, handing off to Resolve/Premiere/Final Cut), plus the rules that keep cuts frame-accurate and in sync | — |
| [varg-video-edit-library](./varg-video-edit-library/) | 206 named edits for footage you already have, each with the look, when to use it, the common mistake, timings and a recipe for FFmpeg, HyperFrames, Remotion and CapCut: cuts and pacing (J/L cuts, match cuts, speed ramps), transitions (CapCut-style, every FFmpeg xfade, Remotion TransitionSeries, HyperFrames and GL shaders), headlines, quotes, end cards, UI walkthroughs, cursors, device mockups, code and terminal, AI agent flows, numbers and charts, logo walls, grids and backdrops | — |
| [media-download](./media-download/) | Save videos/audio by link from X, YouTube, Instagram, Facebook, TikTok and 1800+ sites (yt-dlp), and Pinterest images by pin, board or search (gallery-dl). Local, no API key | — |
| [short-form-ffmpeg-cookbook](./short-form-ffmpeg-cookbook/) | Short-form FFmpeg cookbook: copyable commands for Reels. Crop to 9:16, burn captions (SRT/ASS), trim and join, music with ducking; every command tested. Local, no API key | — |
| [paper-shaders](./paper-shaders/) | Frame-exact Paper Shaders backgrounds, textures and logo stings for HyperFrames and Remotion videos | `paper-shaders` |
| [video-skills](./video-skills/) | Finds the right skill for any AI video, image, voice or music job in the varg Skills catalog and shows the options before anything is generated | — |
| [varg-music-video](./varg-music-video/) | Direct an AI music video for a song: beat grid, cast and references, storyboard on downbeats, stills first, Seedance shots, lip-sync pass, lyrics in code, platform masters | — |
| [varg-character-keynote](./varg-character-keynote/) | A 9:16 "character on stage" video in one render: a custom character delivers a punchy line at a keynote with native voice and applause | — |
| [varg-consistent-characters](./varg-consistent-characters/) | Multi-scene ads where the same actors, outfits and location stay consistent: profile cards, location card, stills for approval, native-audio clips, captions and QA | — |
| [varg-character-design](./varg-character-design/) | How to make characters people remember: definition, details, clothing, character card, a sheet that stays consistent, reuse in Nano Banana, Kling 4 and Seedance 2.5; moderation-safe wording and famous looks without IP names | — |
| [varg-character-grandma](./varg-character-grandma/) | Grandma and grandpa characters: age vs behaviour, real wrinkles, a loud signature outfit | — |
| [varg-character-big-guy](./varg-character-big-guy/) | Big guy characters: size shown with visible cues, a small delicate job, played straight | — |
| [varg-character-cringe](./varg-character-cringe/) | Cringe deadpan characters: bizarre but believable, one outfit, one repeated action (the Jean Phil format) | — |
| [varg-character-beautiful-woman](./varg-character-beautiful-woman/) | Very beautiful women who look like real models: casting details, real skin, fashion and swimwear styling, wording that passes filters | — |
| [varg-character-fitness](./varg-character-fitness/) | Fitness characters: real muscle, a signature colour, catalog wording that gets sports bras past false blocks | — |
| [varg-character-absurd](./varg-character-absurd/) | Absurd characters and mascots: food or object + animal + one human detail, in 3D, clay or photoreal looks | — |
| [varg-character-cartoon](./varg-character-cartoon/) | Original characters in famous cartoon looks (yellow sitcom, 3D family film, anime, paper cut-out, clay, puppet), described without IP names | — |
| [varg-podcast-video](./varg-podcast-video/) | Podcast and two-character dialogue videos: studio set, wide master shot, close-ups and cutaways from it, 5 s scenes with native dialogue audio, stitched episode | — |

## Requirements

- `VARG_API_KEY` (get at [varg.ai](https://varg.ai)) or the hosted varg MCP (`https://mcp.varg.ai/mcp`) -- required for varg-ai, varg-previz and the format skills (varg-music-video, varg-character-keynote, varg-consistent-characters, varg-character-design and its category recipes, varg-podcast-video); media-download, short-form-ffmpeg-cookbook, paper-shaders, video-skills, varg-video-edit-library and varg-video-editing need no key (varg-video-editing uses varg only for the paid edits it recommends)
- **Cloud mode**: curl only (zero dependencies)
- **Local mode**: bun runtime + ffmpeg
- **paper-shaders**: Node 22 and ffmpeg for HyperFrames (`npx hyperframes`), or a Remotion 4 project

## Skill Structure

Each skill follows the [Agent Skills specification](https://agentskills.io/specification):

```
skill-name/
├── SKILL.md            # Core instructions (required)
├── references/         # On-demand reference docs
│   ├── models.md       # Model catalog, pricing
│   ├── components.md   # Component reference
│   └── ...
├── scripts/            # Executable setup/helper scripts
│   └── setup.sh
└── assets/             # Static resources (optional)
```

## Adding a New Skill

1. Create a directory at the repo root with your skill name (lowercase, hyphens only):

```bash
mkdir my-new-skill
```

2. Create `my-new-skill/SKILL.md` with cross-compatible frontmatter:

```yaml
---
name: my-new-skill
description: >-
  What this skill does and when to use it.
  Include trigger keywords for auto-discovery.
license: MIT
metadata:
  author: vargHQ
  version: "1.0.0"
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
  Describe environment requirements here.
allowed-tools: Bash(bun:*) Bash(curl:*) Read Write Edit
---

Your skill instructions here...
```

3. Add reference docs in `my-new-skill/references/` (keep `SKILL.md` under 500 lines).

4. Push to `main` -- the GitHub Actions workflow auto-publishes all changed skills to ClawHub via `clawhub sync`.

### Frontmatter Field Reference

| Field | Standard | Purpose |
|-------|----------|---------|
| `name` | Agent Skills | Skill identifier (must match directory name) |
| `description` | Agent Skills | What + when (used for discovery in all tools) |
| `license` | Agent Skills | License (MIT for ClawHub) |
| `metadata.author` | Agent Skills | Author identifier |
| `metadata.version` | Agent Skills | Semver version string |
| `metadata.openclaw` | ClawHub | Runtime requirements, env vars, binaries |
| `compatibility` | Agent Skills | Human-readable requirements description |
| `allowed-tools` | Claude Code / OpenCode | Pre-approved tools (experimental in OpenCode) |

All fields are cross-compatible -- tools ignore fields they don't recognize.

## Quick Start

```bash
# 1. Install the skill
npx clawhub@latest install vargai

# 2. Set your API key
export VARG_API_KEY=varg_xxx

# 3. Run setup to verify environment
bash varg-ai/scripts/setup.sh

# 4. Render your first video
bunx vargai@alpha render hello.tsx --preview    # Free preview
bunx vargai@alpha render hello.tsx --verbose    # Full render
```

## Documentation

- [vargHQ/sdk](https://github.com/vargHQ/sdk) -- Full SDK documentation
- [vargHQ/templates](https://github.com/vargHQ/templates) -- Video template examples
- [Agent Skills Spec](https://agentskills.io/specification) -- Agent Skills format
- [ClawHub](https://clawhub.ai) -- Skill registry

## License

MIT
