# varg — media generation skills over MCP

Create videos, images, speech, and music, then compose finished videos with the
hosted [varg MCP server](https://varg.ai/mcp). The skill teaches the workflow;
the connected MCP server supplies the tools, live models, prices, and jobs.

- **Server:** `https://mcp.varg.ai/mcp`
- **Transport:** remote Streamable HTTP
- **Authentication:** OAuth, managed by your MCP client

You need a varg account and a client that supports remote MCP with OAuth.
Generation uses the connected account's credits. Model discovery, estimates,
and job lookups let the agent plan and track the work before spending more.

## Install

### Claude Code plugin

```text
/plugin marketplace add vargHQ/skills
/plugin install varg@varg
```

The plugin bundles the `varg-ai` skill and the hosted MCP configuration.
Complete the client's browser-based OAuth connection when prompted. The
`.claude-plugin/plugin.json` manifest is also usable by Grok Build.

### Cursor plugin

The repository includes `.cursor-plugin/plugin.json`. It loads the same skill
and explicitly references `.mcp.json`. Use Cursor's plugin installation flow
and authorize the varg MCP connection.

### Standalone skill

Install `varg-ai/` using your client's Agent Skills installer, or copy that
directory into its supported skills directory. It is also published as
`vargai` on [ClawHub](https://clawhub.ai).

**Installing a standalone skill does not connect an MCP server.** Add the
remote URL in the client's MCP settings and finish OAuth separately. A client
with Agent Skills support alone cannot execute these workflows.

For clients using Claude Code's configuration shape:

```json
{
  "mcpServers": {
    "varg": {
      "type": "http",
      "url": "https://mcp.varg.ai/mcp"
    }
  }
}
```

Other clients may use different configuration keys. Let the client discover
the authorization server and manage the connection. See
[connection instructions](varg-ai/references/connection.md).

## Try it

> Using varg, estimate a five-second vertical video of ocean waves at sunset.
> Show the model, cost in credits, and the account that would pay. Wait for my
> approval before generating it.

The agent should discover a suitable model, read its schema, estimate the
exact input, and wait. After approval it submits once, follows the job, and
returns the actual media URL.

## Included skill

| Skill | Capabilities |
|---|---|
| [varg-ai](varg-ai/SKILL.md) | Model discovery, images, video, speech, music, transcription, media operations, remote TSX composition, templates, files, and job recovery |

The skill uses live schemas instead of a frozen catalog of model IDs and prices.
Reference uploads use the client's upload UI or reachable URLs. The hosted
server cannot read files on the agent's computer.

## Upgrading from 2.x

Version 3 uses hosted MCP and OAuth for execution. Reconnect the MCP server in
your client, then replace the old skill with this version. The former shell
setup, direct generation requests, provider credentials, and local-render
instructions have been removed from this package.

Remote video composition is still available through `render_video`; it does
not require a local SDK or video runtime. SDK development documentation lives
separately at [docs.varg.ai](https://docs.varg.ai).

## Development

```bash
bun run scripts/check-skills.ts
```

This checks skill metadata, relative links, plugin manifests, and legacy
execution instructions without authenticating or generating media.
Behavioral review cases are in `varg-ai/evals/`.
See [CONTRIBUTING.md](CONTRIBUTING.md) for the editing workflow.

## License

[MIT](LICENSE)
