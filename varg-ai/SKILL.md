---
name: varg-ai
description: >-
  Create and edit videos, images, speech, and music through the varg MCP server.
  Use for AI media generation, talking characters, consistent-character scenes,
  UGC and product ads, slideshows, voiceovers, lipsync, captions, media analysis,
  and finished video composition. Also use to continue an existing varg job,
  adapt a varg template, or make variations of a previous varg output.
  Connect with client-managed OAuth; discover live tools, models, and prices.
license: MIT
metadata:
  author: vargHQ
  version: "3.0.0"
compatibility: >-
  Requires the hosted varg MCP server at https://mcp.varg.ai/mcp, connected
  in a client supporting remote Streamable HTTP and OAuth. A varg account
  with sufficient credits is needed for generation. MCP Apps support enables
  inline upload widgets. No local generation runtime is required.
---

# varg media workflows

Use the connected varg MCP tools for every varg operation. The server owns
model routing, billing, file storage, and jobs. Tool names below are server
names; use the actual names exposed by your client, including its prefix.

## 1. Connect and select the account

Look for varg MCP tools in the client's available tools. If they are missing,
ask the user to add **`https://mcp.varg.ai/mcp`** as a remote MCP server and
complete the browser-based OAuth connection. Then wait for the tools to become
available. Installing this skill alone does not establish the connection.

Let the client handle login, consent, refresh, and credential storage. Do not
look for credentials, ask for secrets in chat, or substitute a shell, SDK, or
direct-provider workflow when the connector is unavailable. See
[connection.md](references/connection.md).

Use `get_current_team` when establishing which account will pay. If the user
requests a different team, discover it with `list_teams`, then use `set_team`
with its returned ID. Switching persists for this connection; existing jobs
remain owned by the account that created them. Keep that scope while polling.
Do not switch accounts to work around access errors or an insufficient balance.

## 2. Discover the capability and exact input

- `list_tools` lists varg capabilities; it is not the MCP protocol's tool list.
- `list_models({ tool: "video" })` finds current models for a capability.
- `get_tool({ tool: "video", model: selectedModel })` returns the selected
  model's input schema, output schema, and example.
- For a paginated model catalog use
  `get_tool({ tool: "video", list_models: true, page: 1, limit: 25 })`.

Discover the actual identifiers and constraints before building the request:
duration, aspect ratio, resolution, references, native audio, and provider options
vary by model. Follow the live schema rather than remembered model names, aliases,
prices, or SDK payloads. See [models.md](references/models.md).

Prefer `call_tool` for schema-driven work. Generation fields go **inside `input`**:

```js
// selectedModel and generationInput come from discovery and the user's brief.
const generationInput = {
  model: selectedModel,
  prompt: "Ocean waves at sunset, one steady camera shot",
  duration: 5,
  aspect_ratio: "9:16"
};

estimate_cost({ tool: "video", input: generationInput });

// Once the intended work and cost are authorized:
call_tool({ tool: "video", input: generationInput, wait: false });
```

The five-second example is valid only for a model whose returned schema accepts
those fields and values. `workspace_id`, when supported by `call_tool`, belongs
outside `input`. Provider-specific fields follow the discovered
`input.provider_options` schema. See [mcp-tools.md](references/mcp-tools.md).

## 3. Resolve reference media and voices

Reuse existing library assets, returned URLs, and approved references before
generating replacements. For a previous varg output use `get_lineage` to recover
its actual input and change only what the user asked to change.

For local or chat-attached files, use `upload_file_widget` if the client supports
MCP Apps, or the client's supported file-transfer flow. A local path is not
readable by the hosted server. For a reachable remote file, `upload_file({ url })`
imports it. Continue with the returned media URL, not an upload-session URL.
See [files.md](references/files.md).

Use `search_voices` to discover a voice for `generate_speech`. For schema-driven
requests, use `search_presets` and `apply_presets`: feed the returned `payload`
into `call_tool.input`. A preset ID is not a provider voice ID.

## 4. Quote the work and respect the budget

Estimate the exact planned input with `estimate_cost`, and check the **available**
balance with `check_balance`. Explain the account, selected model, and price in
the returned credit units.

Inspect the result, not just whether the tool call succeeded:

- `valid: false` is not a usable quote. Resolve its validation errors first.
- For a render, prefer `pricing.total_user_price_credits`, inspect `breakdown`,
  and disclose warnings or missing child-generation prices. A flat render fee
  is not necessarily the total cost of generating its inputs.
- A `preview` render is not a promise of free placeholders or free generation.
- A timeout, cancelled job, or failed later step does not imply a refund.

If the user requested a quote first, has not approved the proposed work, or the
plan exceeds the agreed budget/scope, wait for approval. An explicit generation
request within an already agreed plan does not need another approval loop.
Estimate again when the model, input, or requested work changes materially.

## 5. Submit once and follow the existing job

Use `call_tool` for the discovered generation capability and **`render_video`**
for TSX video composition. Most generation workflows are job-backed; images,
speech, and music may finish during the tool call, while video and render
normally return a `job_id` first.

Keep every returned job ID. Use `get_job({ job_id })` to continue it. A waiting
timeout is not a generation failure, and repeating a submission can create a
second billable job. Recover a lost response with `list_jobs` before considering
a retry. Do not treat an MCP request ID as a generation idempotency key.

| Status | Next action |
|---|---|
| `queued`, `submitting`, `running` | Follow the same job; space out status checks |
| `awaiting_confirmation` | Review the intermediate result and use `confirm_job` after the user's decision |
| `completed` | Read the actual output URLs or inline data |
| `failed` | Explain the error; fix the cause before proposing a paid retry |
| `cancelled` | Report cancellation and any known charges; do not promise the remote work stopped |

Cancel with `cancel_job` when requested, and inspect its response. See
[jobs.md](references/jobs.md) for result shapes, recovery, and partial charges.

## 6. Compose and deliver

For a finished cut, generate or select assets first, then assemble them with
remote TSX using `render_video({ code, mode: "strict", wait: false })`.
Use [cloud-render.md](references/cloud-render.md) and
[components.md](references/components.md) before writing composition code.
This is varg's composition DSL, not arbitrary browser React or another video framework.

For a template, `find_templates` discovers options and `get_template` retrieves
the TSX. Use `use_template` for an unchanged template, or edit the retrieved code,
estimate it, and submit through `render_video`. See
[templates.md](references/templates.md).

Deliver the real URLs returned by the completed job, with the requested format,
duration, and any known limitations. Job outputs can be a single `url`, an
`outputs` array, or inline `data`. Never fabricate a file URL or claim an unfinished
job completed. Use `get_job_cost` if the user needs the full run cost, including
child generations, rather than only the render job's own charge.

## Workflow references

| Need | Read |
|---|---|
| Connect, authorize, reconnect | [connection.md](references/connection.md) |
| Tool names and argument wrappers | [mcp-tools.md](references/mcp-tools.md) |
| Model, voice, and cost selection | [models.md](references/models.md) |
| Uploads, library files, lineage | [files.md](references/files.md) |
| Poll, recover, confirm, cancel | [jobs.md](references/jobs.md) |
| Remote TSX composition | [cloud-render.md](references/cloud-render.md), [components.md](references/components.md) |
| Talking head, UGC, product, consistent-character, slideshow workflows | [recipes.md](references/recipes.md) |
| Adapt a published template | [templates.md](references/templates.md) |
| Image, video, dialogue, and music prompts | [prompting.md](references/prompting.md) |
| Diagnose a failed operation | [common-errors.md](references/common-errors.md) |
