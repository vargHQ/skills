# Jobs, recovery, and costs

## Submission and waiting

`call_tool`, `generate_video`, `render_video`, and `use_template` normally
return a job ID without waiting. Other convenience generation tools default
to waiting, but their operations are still job-backed.

Choose `wait: false` for long jobs. A client's wait budget can expire while
generation continues. If a result contains `job_id`, preserve it and use:

```js
get_job({ job_id: existingJobId });
```

Do not resubmit merely to wait longer, even if another call offers `wait: true`.
A second submission can create another charge. An MCP request ID is not an
idempotency key for generation.

If the response was lost before a job ID was recorded, use `list_jobs({})` and
match recent jobs to the request in the correct account. Ask when the match is
ambiguous. Do not create a replacement while the original job may be running.

## Status decisions

| Status | Response |
|---|---|
| `queued`, `submitting`, `running` | Follow the existing job, spacing out checks; tell the user it is still running if the interaction cannot wait |
| `awaiting_confirmation` | Inspect the step output and pause for the user's decision |
| `completed` | Deliver the returned files or inline data |
| `failed` | Read the error, explain the cause, and propose the smallest corrected retry |
| `cancelled` | Report the observed state and known charges; do not automatically restart |

Repeated identical status reads are not useful progress. Avoid tight loops.
Switching teams does not move the job; restore its original account scope
before interpreting a 404 as a missing or failed job.

## Paused pipelines

When the job is `awaiting_confirmation`, continued polling will not approve it.
Review the actual `step_output_url` or step outputs with the user, then use:

```js
confirm_job({ job_id: existingJobId, action: "approve" });
```

Use `retry` with schema-valid overrides only when the user wants to redo the
paused step, and `reject` when they want to stop the pipeline. A step retry
may incur a new charge. Completed earlier steps can remain billable.

## Read the real result shape

The MCP result exposes job summaries in structured content and/or JSON text:

- `job_id` and `status` identify the operation.
- A single media result can provide `url`, `media_type`, and `file_id`.
- Multiple media results can appear in `outputs`, with a URL and metadata per item.
- Analysis or transcription can return inline `data` instead of a file URL.
- Waiting may end with `timed_out` while the job remains nonterminal.

Use the output actually returned. Do not assume a REST response path, build
URLs from job IDs, or label partial outputs as the finished requested video.

## Cancellation and partial charges

`cancel_job({ job_id })` requests cancellation. Inspect the returned state and
any error; a provider can refuse cancellation or continue remote work after
the API job changes state. In particular, do not promise that a cancelled
render stopped every child generation or remote render worker.

Disconnecting the client, ending a wait, or reauthorizing OAuth does not cancel
the remote operation. Preserve reusable completed assets and caches.

Use `get_job_cost({ job_id })` to explain the whole run's ledger charges,
including children, retries, or completed steps. A render job's own
`cost_credits` may cover only composition, not every generated input.
