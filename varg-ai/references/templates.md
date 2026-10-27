# Discover and adapt templates

## Find a starting point

```js
find_templates({ query: "product showcase", limit: 10 });
```

Search by the user's objective or a returned tag. Results are compact summaries,
not the full source. Use the offered pagination if more results are needed.
`mine: true` searches the connected account's own templates.

Useful objectives include talking head, product ad, slideshow, comparison,
captioned clip, and consistent-character story. Do not assume a title is a
model ID or that every template supports runtime variables.

## Inspect before committing

```js
get_template({ template_id: selectedTemplateId });
```

Read the returned details and TSX source (commonly `document.content`). Check
format, duration, media sources, narration, and whether the code generates new
assets. A template can incur generation charges as well as composition cost.

Read the current render schema, then estimate its code with
`estimate_cost({ tool: "render", input: { model: "render", code } })`.
The estimator requires the model even though `render_video`/`use_template`
submission handles it internally.
Inspect validity, total pricing, breakdown, and warnings. If child pricing is
missing, disclose the uncertainty instead of calling the composition fee the
entire cost.

## Render unchanged

```js
use_template({ template_id: selectedTemplateId, mode: "strict", wait: false });
```

Use this after the intended template and cost are authorized. Preserve the
returned job ID and follow it with `get_job`. A wait timeout is not a reason
to call `use_template` again.

## Customize

`use_template` does not provide a general variables/substitution contract.
For a different script, source asset, ratio, or timing:

1. Fetch the actual source using `get_template`.
2. Resolve new references to real file URLs and retain unaffected assets.
3. Edit the TSX according to the current component contract.
4. Estimate the changed code and respect the approval/budget boundary.
5. Call `render_video({ code, mode: "strict", wait: false })` and follow its job.

See [cloud-render.md](cloud-render.md) for the remote composition contract.
Do not publish, delete, or withdraw a template merely to render or customize it.
