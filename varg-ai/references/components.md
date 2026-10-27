# Compose with varg's TSX components

This reference is a planning guide, not a replacement for current component
props. Before writing TSX, read the connected `render_video` description and
the [component documentation](https://docs.varg.ai/sdk/components), or adapt
working code returned by `get_template` / `get_lineage`.

The remotely evaluated source exports a varg composition. Its built-ins include
`Render`, `Clip`, `Image`, `Video`, `Speech`, `Music`, `Captions`, `Subtitle`,
`Title`, `Overlay`, `TalkingHead`, `Split`, `Grid`, `Slider`, `Swipe`, and
`Packshot`. Availability of a component does not establish its accepted props.

## Canvas and timeline

- `Render` defines the canvas. Choose dimensions from the requested deliverable:
  vertical social, landscape, or square. The canvas and source generation ratio
  are related but separate decisions.
- `Clip` organizes the timeline. Use the actual source lengths and narration
  timing; account for transition overlap when calculating the final duration.
- Decide crop versus contain explicitly. Reframing a landscape source into a
  portrait canvas can cut off faces, products, captions, or interface controls.
- Use the current documented transition props. Do not borrow syntax from a
  different video framework.

## Media and layers

Use completed MCP output URLs as media sources. A source URL is an existing
asset; a model/prompt expression may generate a new asset and create a new cost.
Choose deliberately between them and inspect the render estimate accordingly.

Keep primary action and important text in readable safe areas. `Overlay`,
`Title`, `Subtitle`, `Split`, and `Grid` can support product UI, captions,
comparisons, and end cards; choose the actual documented props or a working
template rather than inventing a generic CSS/HTML layout inside the render DSL.

When displaying a real product interface, preserve the user's recording or
screenshot as a composited layer. A generative model should not redraw exact
application controls or claim invented screens are real product footage.

## Voice, music, and captions

Choose one owner for dialogue: native clip audio, a separate speech track, or
an intentional mix. Avoid playing a generated voiceover on top of a second
copy already present in the source video.

Generate narration through MCP, then use its actual duration to plan the cut.
For accurate captions, obtain transcription/word timings through the discovered
transcription capability. Do not fabricate timestamps or assume speech
generation always returns segmented alignment.

Use the current `Captions`/`Subtitle` input format from the documentation or a
working template. Determine whether that component also plays the audio so
the same voice is not mixed twice.

Music should match the composition's length and remain below the voice.
Plan fades/ducking and ending behavior explicitly; do not assume a music
component infers the intended duration. If the source has unwanted native
audio, use a schema-supported setting or a discovered media operation to remove
it rather than treating a convenience flag as a universal mute switch.

## Generation inside TSX

The remote evaluator supports varg model helpers and media expressions. Use
them only with current model identifiers and documented syntax. Do not carry
over SDK payload shapes into unrelated MCP tools, or add provider credentials
to composition source.

For reliable iteration, prefer separately generated, approved media followed
by an assets-only composition. See [cloud-render.md](cloud-render.md) for
estimation, submission, and reuse of an existing render's source.

## Before delivery

Inspect the completed video when the client offers playback or video-analysis
tools. Check source order, duration, ratio, crop, dialogue timing, caption
readability, duplicate audio, and the last frame. Report what was actually
checked; a successful job status alone is not a visual-quality review.
