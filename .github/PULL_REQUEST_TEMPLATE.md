## What

Brief description of what this PR does.

## Why

Why is this change needed?

## How to test

1. Run `bun run scripts/check-skills.ts`.
2. Install the skill and connect the hosted varg MCP server with OAuth.
3. Describe the prompts and read-only checks you used. Obtain approval before paid generation.

## Checklist

- [ ] SKILL.md under 500 lines
- [ ] Tool names, payloads, and job handling match the hosted MCP contract
- [ ] No credential lookup, local-generation setup, or direct-provider fallback
- [ ] Tested with at least one AI tool (Claude Code, Cursor, etc.)
- [ ] No breaking changes (or documented below)
