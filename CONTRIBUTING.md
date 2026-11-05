# Contributing to varg skills

Thanks for helping. New skills, fixes, better prompts and better previews are all welcome.

## Add a skill

1. Create a folder at the repo root, lowercase with hyphens, named for the task people search for (`product-photo-to-video`, not `pp2v`).
2. Add `SKILL.md` with cross-compatible frontmatter:

   ```yaml
   ---
   name: my-new-skill            # must match the folder name
   description: >-
     What it makes and when to use it, in the words people type:
     "Use when someone asks for … , … or …". Put trigger phrases here.
   license: MIT
   metadata:
     author: vargHQ
     version: "1.0.0"
     openclaw:                   # ClawHub runtime requirements, only if needed
       requires:
         env:
           - VARG_API_KEY
         anyBins:
           - curl
       primaryEnv: VARG_API_KEY
       homepage: https://varg.ai
   compatibility: >-
     What it needs to run (API key, bun, ffmpeg, Chrome …).
   allowed-tools: Bash(curl:*) Read Write Edit
   ---
   ```

   | Field | Standard | Purpose |
   |---|---|---|
   | `name` | Agent Skills | Skill id, same as the folder |
   | `description` | Agent Skills | What and when; agents pick skills by it |
   | `license` | Agent Skills | MIT |
   | `metadata.version` | Agent Skills | Semver |
   | `metadata.openclaw` | ClawHub | Env vars and binaries |
   | `compatibility` | Agent Skills | Human-readable requirements |
   | `allowed-tools` | Claude Code / OpenCode | Pre-approved tools |

   Keep `SKILL.md` under 500 lines; put detail in `references/` and helpers in `scripts/`.
3. Add it to `.claude-plugin/plugin.json` → `skills`.
4. Describe it for the README in `.github/readme/skills.json` (title as people search it, tagline, category, three example requests, stack, key and cost, preview) and add it to at least one guide in `.github/readme/use-cases.json`.
5. Make a preview: a real result, 480×300 animated WebP plus a 960×600 JPG, uploaded to s3.varg.ai (never commit media).
6. Run `bun .github/readme/build.ts`. It rewrites the README, the guides, the skill's `README.md`, `llms.txt` and `catalog.json`, and fails if anything is missing.
7. Test it with a fresh agent: give it a realistic request and only the skill. Then open a PR. On merge, CI publishes changed skills to ClawHub.

## Improve a skill

Fix instructions, add examples, update model ids and prices (check them against https://varg.ai/models/llms.txt). Bump `metadata.version`.

## Add a guide

A guide is one task people search for. Add an entry to `.github/readme/use-cases.json` (`slug` is the task as typed, `h1` the exact phrasing with the most searches, then the skills in the order the agent runs them) and run the build.

## Report a problem

Use the issue templates. Say which agent you use (Claude Code, Codex, Cursor, Gemini CLI …) and paste the request you gave it.

## Rules

English only. Credit third-party work to its author. No real people's names or likenesses in examples. Never commit `.env`, keys or tokens. Read the [Code of Conduct](CODE_OF_CONDUCT.md).
