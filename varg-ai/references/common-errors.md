# Troubleshooting MCP media workflows

## Connection or permissions

**No varg tools:** the skill is installed but the MCP connection is missing,
disabled, or unauthorized. Add/enable `https://mcp.varg.ai/mcp` and let the
client complete OAuth. Do not look for another execution credential.

**Authorization expired:** reconnect or reauthorize in the client. Recover any
existing job before retrying a write; losing the connection did not cancel it.

**A file or job is missing after switching teams:** use `get_current_team` and
restore the account that owns it. Do not switch to an unrelated account to
bypass an access error.

## Input validation

**Unknown model, invalid duration, aspect ratio, references, or provider fields:**
discover the current model ID and call model-specific `get_tool`. Rebuild the
input from that schema. Do not normalize identifiers or copy a payload from
a different SDK/capability.

**The outer tool accepts the call but validation fails:** put generation fields
inside `call_tool.input` / `estimate_cost.input`. `render_video` instead takes
top-level `code`, `mode`, and `wait`. Read the error before attempting a retry.

**Wrong voice identifier:** discover the voice or apply a preset. A varg preset
ID is not a provider-native voice ID.

**A tool mentioned in a source branch is absent:** use the connected client's
offered contract. Do not invent an equivalent batch, upload, or render-docs tool.

## Files

**Local path rejected:** the hosted server cannot read the client filesystem.
Use `upload_file_widget`, a client-managed transfer, or URL import; see
[files.md](files.md).

**Upload prepared but no asset available:** `create_upload` creates a session,
not the transfer. Wait for bytes to upload and registration to complete. Use
the public media URL, not the upload-session URL.

**Remote URL cannot be fetched:** check accessibility, media type, expiry, and
the selected tool's limits. Obtain an authorized supported transfer instead
of weakening access controls or repeatedly submitting generation jobs.

## Estimates, balance, and jobs

**Estimate returned `valid: false`:** fix validation first. MCP transport success
does not mean the price is valid.

**Render quote warns that only its flat fee is known:** child-generation pricing
may be missing. Explain the incomplete total and resolve it or agree a revised
bounded plan before spending. Preview mode is not a zero-cost guarantee.

**Insufficient available credits:** tell the user the quoted cost and available
balance. They can manage credits at [varg.ai](https://varg.ai). Do not silently
change the paying account or model to force a generation through.

**Wait timed out:** preserve the job ID and call `get_job`. If the response was
lost, inspect `list_jobs`. Do not submit a duplicate to continue waiting.

**Job is `awaiting_confirmation`:** inspect the intermediate result and get the
user's decision. Use `confirm_job`; continued polling cannot approve it.

**Generation failed:** inspect the returned error and correct the cause before
proposing another paid run. Keep completed intermediate assets and caches.

**Cancellation failed or work still appears active:** report the actual response.
Remote providers/renderers may continue and completed work can remain billable.
Use `get_job_cost` to explain the full run's charges; see [jobs.md](jobs.md).

## Composition quality

**TSX rejected:** use varg's composition DSL and its supported export/import
contract. Consult current component docs or working template source, not an
unrelated React/video framework.

**Speech cut off:** use the actual audio duration, shorten the approved copy,
or extend/split the shot within its model's constraints.

**Double voice or music:** choose one audio owner. Check whether the video or
caption component already includes the same track before layering it again.

**Bad opening frames or wrong crop:** inspect the completed source and use a
discovered trim/reframe operation when that is sufficient. Regenerate only
when editing the existing asset cannot satisfy the requested change.

**Captions drift:** transcribe the actual final audio and use returned timings.
Do not estimate word timestamps from a script or assume speech generation
always returns aligned segments.
