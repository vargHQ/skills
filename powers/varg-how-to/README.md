# varg how to (Kiro power)

Video how-to search for AI agents: 2,000+ video skills, tutorials and FFmpeg recipes. No key.

varg how to answers "how do I make this video" for an AI agent. One call to `search_how_to` with the person's request, in their words and in any language, returns ranked cards from 2,000+ checked AI video agent skills, how-to tutorials, FFmpeg recipes, video formats, prompts and styles. A UGC ad, captions, a lyric video, a talking avatar, a product video, an explainer or an edit of existing footage each come back with exact install commands for Claude Code, Codex, Cursor and Gemini CLI. `get_how_to` returns the full tutorial as Markdown: the best skill, the 2–4 choices to show the person with example videos, and the steps. No account or key. To generate, connect the varg MCP (mcp.varg.ai), which puts 200+ image, video, voice and music models behind one key.

This folder is a power in the [Agent Plugins](https://agent-plugins.org) format: `plugin.json` plus `mcp.json`.

## Install in Kiro

Powers panel → **Add Custom Power** → **Import power from GitHub** → paste:

```
https://github.com/vargHQ/skills/tree/main/powers/varg-how-to
```

## MCP server

| | |
|---|---|
| Endpoint | `https://api.varg.ai/v2/skills/mcp` (Streamable HTTP, stateless, JSON) |
| Auth | none: no account or key |
| Tools | `search_how_to {query, kind?, limit?}`, `get_how_to {kind, slug}`. Both are read-only and idempotent |
| Official MCP Registry | `ai.varg/how-to` |

Other clients:

```bash
claude mcp add --transport http varg-how-to https://api.varg.ai/v2/skills/mcp
```

```json
{ "mcpServers": { "varg-how-to": { "type": "http", "url": "https://api.varg.ai/v2/skills/mcp" } } }
```

## Try it

- "make a UGC ad for my skincare serum"
- "add TikTok style captions to this video"
- "turn my song into a lyric video"
- "cut my podcast into shorts"
- "how do I make a talking avatar video"

## Links

- Website: https://varg.ai/how-to
- Docs: https://varg.ai/how-to/llms.txt
- Privacy policy: https://varg.ai/privacy. Searches are logged without IP or key (query, client name, top results)
- Terms: https://varg.ai/terms
- Support: hello@varg.ai or [GitHub issues](https://github.com/vargHQ/skills/issues)
- License: MIT (this power); the hosted service runs under https://varg.ai/terms
