# varg AI Agent Skills

A collection of [Agent Skills](https://agentskills.io) for AI video, image, speech, and music generation using the varg platform.

Works with **Claude Code**, **OpenCode**, **ClawHub**, and any tool that supports the [Agent Skills](https://agentskills.io) standard.

## Installation

### ClawHub (recommended)

```bash
# Install a specific skill
npx clawhub@latest install vargai

# Or install all skills from this repo
npx clawhub@latest install vargai
```

### Claude Code

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

| Skill | Description | ClawHub Slug |
|-------|-------------|--------------|
| [varg-ai](./varg-ai/) | AI video, image, speech, and music generation | `vargai` |

## Requirements

- `VARG_API_KEY` (get at [varg.ai](https://varg.ai)) -- required for all skills
- **Cloud mode**: curl only (zero dependencies)
- **Local mode**: bun runtime + ffmpeg

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
bunx vargai render hello.tsx --preview    # Free preview
bunx vargai render hello.tsx --verbose    # Full render
```

## Documentation

- [vargHQ/sdk](https://github.com/vargHQ/sdk) -- Full SDK documentation
- [vargHQ/templates](https://github.com/vargHQ/templates) -- Video template examples
- [Agent Skills Spec](https://agentskills.io/specification) -- Agent Skills format
- [ClawHub](https://clawhub.ai) -- Skill registry

## License

MIT
