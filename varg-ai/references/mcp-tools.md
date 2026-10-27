# MCP tool reference

These are server tool names, not universal client prefixes. Use the connected
client's actual tool schemas. This reference describes the released hosted
workflow; discover additional tools rather than assuming an unreleased feature
exists.

## Discovery and price planning

| Tool | Input |
|---|---|
| `list_tools` | `{}`; lists varg capability keys |
| `list_models` | `{ tool? }`; current models and routes |
| `get_tool` | `{ tool, model? }`; schema and example |
| `get_tool` model catalog | `{ tool, list_models: true, page?, limit? }`; paginated, maximum limit 50 |
| `estimate_cost` | `{ tool?, input }`; the intended generation payload nested inside `input` |
| `check_balance` | `{}`; use available credits, accounting for reservations |

Capability keys include image, video, speech, music, transcription, media
operations, render, pipelines, and video analysis when offered by the live
registry. `list_tools` does not replace the MCP client's protocol-level discovery.

`get_tool` returns `tool_key`, `description`, `input_schema`, `output_schema`,
and `example`. `list_models` is not a replacement for a selected model's schema.

## Schema-driven execution

```js
call_tool({
  tool: selectedCapability,
  input: validatedGenerationInput,
  wait: false,
  workspace_id: selectedFolderId
});
```

Required fields are `tool` and `input`. `wait` and `workspace_id` are optional
and belong outside `input`. Omit an optional folder when none was requested.
Most generation schemas require `input.model` even though the outer MCP tool
accepts an arbitrary input object.

Provider-specific arguments belong under the exact `input.provider_options`
shape returned by discovery. Reference inputs are capability-specific: many
image/video models accept `files: [{ url }]`, transcription uses `audio_url`,
analysis uses `video_url`, and media operations have their own fields.

The estimator requires `input.model`, including for render estimates. Read the
render schema and use its model identifier (currently `"render"`) alongside
`input.code`. `tool: "render"` alone does not fill in the estimator's model.

For TSX submission use **`render_video`**, whose dedicated route prepares
the account-scoped render authorization for OAuth callers; its arguments are
top-level `code`, `mode`, and `wait`, not an estimation payload.

## Convenience tools

Use these when their offered input schema covers the request. Select models
and estimate their actual inputs before spending; helper defaults are not a
durable model catalog.

| Tool | Required fields | Selected optional fields / default waiting behavior |
|---|---|---|
| `generate_image` | `prompt` | `model`, `aspect_ratio`, `style`, `reference_image`, `count`, `wait` defaults true |
| `generate_video` | `prompt` | `model`, `from_image`, `from_video`, `duration`, `aspect_ratio`, `with_audio`, `wait` defaults false |
| `generate_speech` | `text` | `model`, `voice`, `wait` defaults true |
| `generate_music` | `prompt` | `model`, `duration`, `instrumental`, `wait` defaults true |
| `analyze_video` | `video_url` | `prompt`, `wait` defaults true |
| `render_video` | `code` | `mode` is `strict` or `preview`; `wait` defaults false |

The convenience tools are job-backed too. A waiting call may still return an
unfinished job. Use `get_job`, not another submission, to continue it.

Do not assume an overridden image model honors every `count` value. Likewise,
`generate_video.with_audio: false` does not guarantee an otherwise audio-enabled
model is muted. Check the selected model's schema or remove audio explicitly
with a discovered media operation.

## Jobs and review steps

| Tool | Input |
|---|---|
| `get_job` | `{ job_id }`; status and result of the existing job |
| `list_jobs` | `{}`; recent jobs for recovery, not an invented filtered search |
| `confirm_job` | `{ job_id, action?, overrides? }`; `action` is `approve`, `retry`, or `reject` |
| `cancel_job` | `{ job_id }`; inspect the response, cancellation is best-effort |
| `get_job_cost` | `{ job_id }`; ledger charges for the full run, including children |

Use model-facing `get_job` for polling; widget-private tools are not a workflow
prerequisite. See [jobs.md](jobs.md).

## Voices and presets

`search_voices({ query?, intent?, filters?, limit? })` finds a provider voice
usable with `generate_speech`. `search_presets` has the same search concepts,
with `type: "voice"` for voice presets. `get_preset({ id })` returns full details.

For generic schema-driven generation:

```js
apply_presets({ payload: validatedGenerationInput, presets: [selectedPresetId] });
// Read the acceptance/rejection report, then estimate the returned payload.
call_tool({ tool: selectedCapability, input: appliedResult.payload, wait: false });
```

`payload` is the preset tool's field; `input` is the execution tool's field.
Do not pass a varg `preset_…` identifier directly as a provider voice ID.

## Files, templates, and account tools

- Files: `upload_file_widget`, `upload_file`, `create_upload`, `complete_upload`,
  `list_files`, `get_file`, `get_lineage`; see [files.md](files.md).
- Templates: `find_templates`, `get_template`, `use_template`; see [templates.md](templates.md).
- Accounts: `get_current_team`, `list_teams`, `set_team`, `list_workspaces`,
  `create_workspace`; see [connection.md](connection.md).
- Spend: `get_analytics_summary`, `get_analytics_breakdown`,
  `get_analytics_timeseries`, `get_analytics_files`, `list_analytics_activity`,
  and `get_job_cost`. Inspect the offered filters and time-range schema.

Deleting files or templates and changing persistent account scope are actions,
not discovery. Use `delete_file` or `delete_template` only for an explicit user
request, not to troubleshoot a failed generation or clean up caches.
