<div align="center">

# AI Video Skills for Claude Code, Codex and Grok

**{{N}} open-source agent skills that turn one request, like "make a UGC ad for my serum", into a finished MP4.**<br>
UGC ads, product videos, music videos, consistent characters, talking avatars, captions, motion graphics and FFmpeg edits.<br>
Seedance 2.5, Kling 4, Veo 3.1, GPT Image 2.6 and ElevenLabs v4 on one key, or free and local with HyperFrames, Remotion and FFmpeg.

[![skills.sh installs][b-skillssh]][skillssh] [![GitHub stars][b-stars]][stars] [![{{N}} skills][b-count]](#all-{{N}}-skills) [![Agent Skills standard][b-std]][std] [![Claude Code plugin][b-cc]](#install) [![MIT license][b-mit]](LICENSE)

{{HERO}}

[Use cases](#what-do-you-want-to-make) · [All {{N}} skills](#all-{{N}}-skills) · [Install](#install) · [How it works](#how-it-works) · [For AI agents](#for-ai-agents) · [FAQ](#faq)

</div>

```bash
npx skills add vargHQ/skills                                   # pick skills and agents
npx skills add vargHQ/skills --skill caption-styles -a codex   # one skill, one agent
```

Agents for `-a`: `claude-code`, `codex`, `grok`, `cursor`, `gemini-cli`, `github-copilot`, `opencode` and 60+ more. Or paste this into your agent: *"Install varg video skills for me by reading https://raw.githubusercontent.com/vargHQ/skills/main/llms.txt"*. Then ask for the result in plain words. The agent reads the matching skill, asks the two or three choices that matter, shows stills before any video is paid for, and hands back the MP4.

## Try these

{{TRY}}

Prices are the measured figures in each skill at provider price (1 credit = $0.01); the agent shows an estimate before it spends anything.

## What do you want to make?

Every row opens a step-by-step guide: the skills to install, the steps the agent runs, what it costs and the questions people ask.

{{USE_CASES}}

## All {{N}} skills

{{TOC}}

{{GALLERY}}

## Install

Works with any agent that reads the [Agent Skills](https://agentskills.io) standard.

{{INSTALL_TABLE}}

Install only the skills you need for the job (each guide above gives its own one-line install). All {{N}} at once make a long skill list, and some agents shorten long lists.

<details>
<summary>More: install inside Claude Code, update, Kiro, OpenCode, manual copy</summary>

- **Inside Claude Code:** `/plugin marketplace add vargHQ/skills`, then `/plugin install varg@varg`. Third-party marketplaces don't auto-update by default: `/plugin` → Marketplaces → varg → Enable auto-update, or run `claude plugin update varg@varg`.
- **Update skills installed with the skills CLI:** `npx skills update`.
- **Pick agents and scope:** `npx skills add vargHQ/skills --skill varg-ai -a claude-code -a codex -g -y` (`-g` global, `-y` no prompts, `--list` to see every skill).
- **OpenCode:** `npx skills add vargHQ/skills -a opencode -g`, or copy one skill folder to `~/.config/opencode/skills/<skill>/`.
- **Kiro:** [`powers/varg-how-to`](powers/varg-how-to/README.md) connects the keyless varg how to MCP. Powers panel → **Add Custom Power** → **Import power from GitHub**.
- **Manual (any agent):** copy a skill folder into your agent's skills directory, for example `~/.claude/skills/<skill>/` (Claude Code) or `~/.agents/skills/<skill>/` (Codex and others).

</details>

## How it works

1. **You ask for the result**, in any language: "a music video for this song", "Hormozi captions on my talk", "the same girl in all six scenes".
2. **The agent picks the skill** by its description and reads its `SKILL.md`: the inputs to ask for, the steps, the prompts, the checks.
3. **Cheap before expensive.** Skills that generate show stills or a storyboard for approval first and call `estimate_cost` before a batch, a long video or a render.
4. **It makes the files**: generation on the [varg API](https://varg.ai) (one key for Seedance, Kling, Veo, Wan, GPT Image, Nano Banana, ElevenLabs, Lyria and 200+ more models, billed at provider price), or a local render with HyperFrames, Remotion, three.js or FFmpeg.
5. **It checks the output**: frames, loudness, text in the safe zone, the product and faces unchanged, before it hands over the MP4.

**No key needed:** {{KEYLESS}}.

**Need a varg account** (sign in to the varg MCP with OAuth, or set `VARG_API_KEY` from [varg.ai](https://varg.ai)): {{KEYED}}.

Cloud mode needs only `curl`. Local rendering needs [Bun](https://bun.sh) and `ffmpeg`; HyperFrames needs Node 22, the Remotion recipes a Remotion 4 project.

## How this fits with other video skills

- **[HyperFrames](https://github.com/heygen-com/hyperframes) and [Remotion](https://github.com/remotion-dev/skills)** are rendering engines with their own skills for writing compositions. The motion skills here give exact presets on top of both (captions, titles, kinetic type, overlays, transitions, maps). Install them side by side.
- **[fal skills](https://github.com/fal-ai-community/skills)** call fal's model API with a fal key. The skills here reach the same kinds of models through one varg key and add the job around the model: script, references, stills first, prompts measured on paid runs, QA.
- **[OpenMontage](https://github.com/calesthio/OpenMontage)** is an open-source production pipeline you run yourself. These skills are smaller units an agent picks per task: one for a UGC ad, one for captions, one for a music video.

## For AI agents

- **Pick a skill by task:** [AGENTS.md](AGENTS.md) maps what the person wants to the skill to read first; [catalog.json](catalog.json) has every skill with its category, key, cost, output and preview; [llms.txt](llms.txt) links every `SKILL.md` and guide as raw Markdown and says how to install.
- **Not in this repo?** Search 2,000+ video skills and tutorials with the keyless varg how to MCP: `claude mcp add --transport http varg-how-to https://api.varg.ai/v2/skills/mcp` (`search_how_to`, then `get_how_to`), or install [`how-to-make-ai-video`](./how-to-make-ai-video/README.md).
- **Generate:** the varg MCP (`https://mcp.varg.ai/mcp`, OAuth) or `VARG_API_KEY` against `https://api.varg.ai/v2`. Model ids, inputs and limits: [varg.ai/models/llms.txt](https://varg.ai/models/llms.txt).
- **Spend:** estimate first and wait for the person's yes before a batch, a long video or a render. Approve stills before video.

## FAQ

### What are agent skills?
Folders with a `SKILL.md`: instructions, scripts and references an AI agent loads when a task matches the skill's description. They follow the open [Agent Skills](https://agentskills.io/specification) format, so the same folder works in Claude Code, Codex, Grok, Cursor, Gemini CLI, Copilot, OpenCode and other tools.

### Do I need an API key?
Not for the skills that plan, write, edit or render locally (listed under [How it works](#how-it-works)). Skills that generate images, video, voice or music use the varg API: sign in to the varg MCP with OAuth, or set `VARG_API_KEY`.

### How much does an AI video cost?
Models are billed at provider price with no markup, 1 credit = $0.01. Figures measured in the skills: a still is a few cents (Nano Banana 2.1 about $0.05, GPT Image 2.6 about $0.03–0.07); a 5-second Seedance 2.5 clip is about $0.64 at 480p to $3.42 at 1080p; a 15-second Kling 4 take at 720p is about $2.36. Each skill page lists its own typical cost, and the agent calls `estimate_cost` before anything expensive. A new varg account gets 50 free credits ($0.50, about ten stills) on its first sign-in, one grant per network, so the first results cost nothing.

### Which models does it use?
Video: Seedance 2.5, Kling 4, Veo 3.1, Wan 3. Images: GPT Image 2.6, Nano Banana 2.1, Flux. Voice: ElevenLabs v4. Music: Lyria, Mureka, ElevenLabs Music. Plus lip sync, try-on, upscaling, transcription and FFmpeg. The full list: [varg.ai/models](https://varg.ai/models/llms.txt).

### Does it work with HyperFrames and Remotion?
Yes. The motion skills give presets for both, and the editing skills give FFmpeg, HyperFrames and Remotion recipes. They render locally for free.

### Is it open source and safe to install?
MIT. Read any `SKILL.md` before you install it. The plugin has no hooks and changes no settings; everything it contacts is listed under [What this plugin connects to](#what-this-plugin-connects-to).

### Can I add my own skill?
Open a pull request with a new folder (see [CONTRIBUTING.md](CONTRIBUTING.md)), or list a skill you keep elsewhere on [varg how to](https://varg.ai/how-to) with [`varg-publish-skill`](./varg-publish-skill/README.md).

## What this plugin connects to

Everything the plugin runs, sends or fetches:

- **varg how to MCP** (`https://api.varg.ai/v2/skills/mcp`): no key. Sends the search text you or the agent type (`search_how_to`) and returns how-to cards. Searches are logged without IP or key (query, MCP client name, top results).
- **varg MCP** (`https://mcp.varg.ai/mcp`): OAuth sign-in to your varg account. Sends generation requests (prompts, uploaded or linked media) and spends your varg credits; results are stored in your varg account and served from `s3.varg.ai`.
- **varg API** (`https://api.varg.ai`): the skills' `curl` examples send `VARG_API_KEY` from your environment as a Bearer token to api.varg.ai only, never to any other host.
- **media-download**: runs `yt-dlp` on your machine against the video link you give it and saves the file locally.
- **paper-shaders** and **varg-previz**: render locally; varg-previz bundles three.js (MIT) in `varg-previz/templates/previz/vendor/` so the previz page works offline.
- **code-to-video-previz**: its Three.js page loads three.js (MIT, pinned version) from jsDelivr and renders with your local Chrome and ffmpeg. Blender and camera solving use the `bpy` package through `uv`. Nothing is uploaded and no account is needed.
- **video-project-github**: runs `git` and `gh` on your computer, creates a private repo on your GitHub account and uploads your project and media there (only with your go-ahead, after you sign in yourself). It never reads or uploads `.env`, adds git hooks to the project, and refuses a public repo. No other network calls.
- **threejs-animatic**: its starter loads three.js (MIT, pinned version) from jsDelivr, runs a Bun server on localhost that saves camera edits into the project folder, and renders with your local Chrome and ffmpeg. **varg-mockups** boards are single HTML files; notes stay in the viewer's browser storage.
- The previews on these pages are images on `s3.varg.ai`; nothing in a README runs code.
- The plugin has no hooks and changes no Claude settings or permissions.

Privacy: https://varg.ai/privacy · Terms: https://varg.ai/terms · Security: [SECURITY.md](./SECURITY.md)

## Contributing

New skills, fixes and previews are welcome: see [CONTRIBUTING.md](CONTRIBUTING.md). These pages are generated from each `SKILL.md` and `.github/readme/*.json` by `bun .github/readme/build.ts`.

Related: [vargHQ/code2video-templates](https://github.com/vargHQ/code2video-templates) (video templates that render from code) · [vargHQ/sdk](https://github.com/vargHQ/sdk) (TypeScript SDK and CLI) · [varg how to](https://varg.ai/how-to) (2,000+ video skills and tutorials)

## Like it? Star it

If one of these skills made a video you will use, a star helps other people and their agents find it: https://github.com/vargHQ/skills

{{AGENT_STAR}}

---

<p align="center"><sub>MIT · made by <a href="https://varg.ai">varg</a> · <a href="https://varg.ai/how-to">varg how to</a><br>{{CREDITS}}</sub></p>

[b-skillssh]: https://skills.sh/b/vargHQ/skills
[skillssh]: https://skills.sh/vargHQ/skills
[b-stars]: https://img.shields.io/github/stars/vargHQ/skills?style=flat&logo=github&color=ff5315
[stars]: https://github.com/vargHQ/skills/stargazers
[b-count]: https://img.shields.io/badge/skills-{{N}}-ff5315
[b-std]: https://img.shields.io/badge/Agent_Skills-standard-111
[std]: https://agentskills.io
[b-cc]: https://img.shields.io/badge/Claude_Code-plugin-D97757?logo=claude&logoColor=white
[b-mit]: https://img.shields.io/badge/license-MIT-blue
