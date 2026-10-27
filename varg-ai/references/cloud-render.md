# Remote video composition through MCP

Use `render_video` to assemble a finished cut on varg's render service. The
agent authors TSX as a tool input; the server executes the composition remotely.
No local SDK, video runtime, or package installation is required.

## Prefer an assets-first plan

1. Establish canvas ratio, duration, shot order, audio ownership, and captions.
2. Find existing library media or create the required assets with MCP tools.
3. Keep each returned URL and job ID. Inspect the actual media before composing.
4. Author the composition using those real URLs.
5. Estimate the exact render, then submit once within the approved plan.
6. Follow the returned job with `get_job` and deliver its output.

Generating assets separately makes their cost and progress visible and lets
the agent reuse an approved take instead of regenerating it after every edit.
Composition itself can still have a charge.

## TSX contract

Read the connected `render_video` description and `get_tool({ tool: "render" })`.
For detailed component syntax, consult the current
[component documentation](https://docs.varg.ai/sdk/components), a retrieved
template, or an existing render's lineage. A schema containing `code: string`
does not describe the entire composition language.

The service expects an **`export default` varg composition**. It provides varg's
components and model helpers. It is not arbitrary browser React, HTML, or another
framework's timeline format. Arbitrary external imports and runtime package
loading are not part of this contract.

The following shows the composition structure. Replace `RETURNED_VIDEO_URL`
with an actual completed file URL and choose a duration supported by that asset
before estimating or submitting it:

```tsx
export default (
  <Render width={1080} height={1920}>
    <Clip duration={5}>
      <Video src="RETURNED_VIDEO_URL" />
    </Clip>
  </Render>
);
```

See [components.md](components.md) for composition decisions and
[recipes.md](recipes.md) for multi-step workflows.

## Estimate and submit

```js
estimate_cost({
  tool: "render",
  input: { model: "render", code: compositionCode, mode: "strict" }
});

// After validating the quote and authorizing the intended work:
render_video({ code: compositionCode, mode: "strict", wait: false });
```

Estimation requires `input.model` even for a render; the current render schema
uses `"render"`. Verify that identifier with `get_tool({ tool: "render" })`.
The dedicated `render_video` submission instead takes top-level `code`, `mode`,
and `wait`, with no model argument. Prefer it over the generic render capability
for OAuth execution.

Read the estimate's `valid` flag, `breakdown`, warnings, and
`pricing.total_user_price_credits` when present. A composition that contains
generation expressions can create additional billable child jobs. If the
estimate warns that only a flat fee is available, disclose the missing child
prices before seeking approval; do not present the fee as the full run cost.

`mode: "preview"` is a rendering behavior, not a free dry run. It can use
placeholders for failed media while still doing billable work. Use strict mode
for the requested final result unless the user intentionally wants another mode.

## Observe and iterate

`render_video` is asynchronous by default. Preserve its `job_id`, poll with
`get_job`, and distinguish a waiting timeout from a failed generation. Never
submit the same composition again simply to continue waiting.

For an edit, recover the previous TSX with `get_lineage`, keep unchanged asset
URLs and inputs, and change the smallest necessary part. Re-estimate material
changes. If a source failed, diagnose that source instead of blindly rerunning
every completed generation.

For total billed spend, use `get_job_cost` on the run. A render job's own
charge may not include the child assets. Cancellation cannot guarantee that
every remote renderer or provider stopped; see [jobs.md](jobs.md).
