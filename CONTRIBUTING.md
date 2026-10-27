# Contributing to varg Skills

## Editing the media skill

`varg-ai` executes through the hosted MCP server and client-managed OAuth.
Keep the skill focused on choosing tools, preparing media, estimating costs,
following jobs, and delivering the result.

- Preserve the skill name and keep `SKILL.md` under 500 lines.
- Put detailed workflows in `references/` and link to them from `SKILL.md`.
- Discover current model IDs, input schemas, constraints, and prices through MCP.
- Use the actual server tool names; client-specific prefixes vary.
- Keep generation inputs inside `call_tool.input` and `estimate_cost.input`.
- Recover a timed-out generation with its existing job ID instead of submitting again.
- Keep authentication in the MCP client. Avoid credential discovery, token handling,
  shell-based generation, and direct-provider fallback instructions.
- Preserve existing assets and caches while iterating.
- Document changes to connection scope, billable work, and destructive file actions accurately.

Before naming a tool, inspect the current hosted contract or its released
implementation at [vargHQ/mcp](https://github.com/vargHQ/mcp). A feature on an
unreleased branch is not sufficient evidence that a user's connector offers it.

## Validation

Run:

```bash
bun run scripts/check-skills.ts
```

Then review the case folders in `varg-ai/evals/` with the skill loaded.
The default evaluation is a simulated tool trace: no credentials are read,
accounts changed, or media generated. Record whether the agent chose the
right connection flow, payload shape, estimate handling, and job recovery.

A real media run needs a connected test account, an agreed credit budget, and
approval for the generation. Report simulated checks separately from live runs.

## Adding another skill

1. Create a lowercase, hyphenated directory at the repository root.
2. Add `SKILL.md` with `name` and `description` frontmatter.
3. Explain its MCP connection requirements and workflow-specific guidance.
4. Add focused reference material and realistic review prompts.
5. Open a PR describing what changed and how it was checked.

The ClawHub workflow publishes skill changes when they reach `main`.

## Reporting issues

Use the issue templates and include the MCP client, the failing tool name, and
a sanitized error or job ID. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
