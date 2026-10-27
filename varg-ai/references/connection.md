# Connect to varg

## Required connection

Add `https://mcp.varg.ai/mcp` as a **remote Streamable HTTP** MCP server in the
client. Authorize a varg account in the browser window the client opens, choose
the intended personal or team account, and approve the connection.

The client manages OAuth discovery, authorization-code flow with PKCE, token
refresh, and secure storage. For a client using dynamic client registration,
let it register itself; do not invent a client ID or secret. Follow the client's
own configuration format rather than copying another client's keys blindly.

The root plugin configuration uses this Claude Code-compatible shape:

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

A standalone Agent Skill contains instructions only. If varg tools are absent,
ask the user to add/enable the connection and finish authorization. Do not scan
their computer for credentials or replace OAuth with a different execution path.

## Check readiness without generating

1. Inspect the varg tools exposed by the client. Prefixes are client-specific.
2. Use `list_tools` or `list_models` to verify discovery.
3. Use `get_current_team` and `check_balance` to confirm account scope and
   available credits before planning billable work.

Discovery, balance, and status reads do not themselves request media generation.
An estimate is a planning operation, not approval to submit the generation.

## Team and folder scope

- `list_teams({})` returns accessible team IDs and memberships.
- `get_current_team({})` describes this connection's active account and default folder.
- `set_team({ team_id: returnedTeamId })` changes its persistent account scope.
- `set_team({ team_id: null })` selects the personal account.
- `list_workspaces({})` discovers folders in the current account.
- When setting a default folder, use its returned UUID as `workspace_id` in
  `set_team`. Omitting that field clears the previous default.

Use the scope the user requested; do not create access by changing teams.
Previously submitted jobs keep their original billing owner. A job can become
invisible after switching to another account, so restore its original scope
before diagnosing a missing-job error.

For a generation that must land in a specific folder, prefer
`call_tool({ tool, input, workspace_id: folderId })`. Do not assume every
convenience generation helper applies the connection's default folder.

## Expired or broken authorization

Ask the client to reconnect or reauthorize varg. Do not handle access or refresh
tokens yourself. For a connector configured against an old authorization flow,
remove/re-add the connection using the current MCP URL and OAuth discovery.

Before retrying a failed write, recover its job status using an existing ID or
`list_jobs`. Reconnection does not cancel a generation already in progress.

If the client cannot use remote MCP with OAuth, explain that this skill needs
a compatible connection. For local references it also needs MCP Apps uploads
or another client-managed byte-transfer feature; see [files.md](files.md).
