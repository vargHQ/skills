# Choose models and voices from live discovery

## Start with the capability

Use `list_tools` to discover what the connected server offers, then narrow the
catalog with `list_models({ tool: selectedCapability })`. For a paginated list
of detailed model entries, use `get_tool` with `list_models: true` and follow
its pagination rather than assuming the first page is the whole catalog.

Select a model against the requested outcome:

| Need | Check before choosing |
|---|---|
| New image | Prompt following, text rendering, aspect ratio, resolution |
| Image editing | Accepted reference media and how edits preserve the subject/product |
| Text-to-video | Supported durations, motion quality, native audio, framing |
| Animate an image | Image-reference fields, duration, motion and camera constraints |
| Edit/remix a video | Source-video support, reference limits, timing constraints |
| Speaking character | Whether the tool accepts image + audio or video + audio |
| Speech | Supported language, voice input, pronunciation and delivery controls |
| Music | Duration, instrumental/vocal options, output constraints |
| Transcription | Audio input and whether word-level timing is returned |
| Media operations | The actual operation schema for trim, resize, inspect, or audio removal |

Do not infer an input mode from a model's name. A talking-head model that takes
a still image is not interchangeable with a lipsync model that takes a video.

## Inspect the selected model

```js
get_tool({ tool: selectedCapability, model: selectedModel });
```

Read `input_schema`, `output_schema`, and `example`. Use the exact returned
identifier, including a route identifier when one is intentionally selected.
Do not normalize underscores/hyphens, append provider prefixes, or substitute
a remembered alias.

Validate duration, ratio, resolution, references, native-audio controls, and
provider options. A helper's broad duration range does not establish what an
individual model accepts. Build `call_tool.input` from this schema, not from
SDK-specific arguments.

## Price the actual request

Call `estimate_cost({ tool: selectedCapability, input: generationInput })` after
resolving references and presets. Inspect `valid`, pricing, and any warnings.
Use the returned credit fields rather than a copied price table or a guessed
currency conversion. Compare the quote against available credits and the
approved budget.

For a render containing new generations, inspect total pricing and its
breakdown. Disclose unavailable child prices; a composition fee alone is not
a complete quote. See [cloud-render.md](cloud-render.md).

Describe tradeoffs concretely—cost, latency, source support, motion, audio,
and output quality—without universal claims that one model is always cheapest
or best. If the chosen route is unavailable, discover and quote a replacement
before changing the plan.

## Voice selection

Use `search_voices` with a description of the desired read: language, accent,
age impression, pace, warmth, and energy. A returned provider voice identifier
can be used where the offered `generate_speech` schema accepts it.

For generic calls, `search_presets`/`get_preset` return application fragments.
Use `apply_presets({ payload, presets })`, review accepted/rejected fragments,
and estimate the resulting payload before execution. A varg preset identifier
is not itself an ElevenLabs or other provider voice identifier.

Cast the voice before building scene timings. Use the actual generated audio
and transcription for timing instead of assuming a fixed number of spoken
words fits every speaker and language.
