# MCP media workflow recipes

## Contents

- [Single asset](#single-asset)
- [Talking head or lipsync](#talking-head-or-lipsync)
- [Consistent-character scenes](#consistent-character-scenes)
- [Product or UGC ad](#product-or-ugc-ad)
- [Slideshow or longer sequence](#slideshow-or-longer-sequence)
- [Remix or variation](#remix-or-variation)

Every recipe uses the connected MCP tools. First establish account scope,
discover the model schema, resolve references, and estimate the intended work.
Respect the user's budget and approval boundary. Retain all returned job IDs
and asset URLs so a later step can reuse them.

## Single asset

1. Clarify the subject, target ratio, intended use, and whether a reference is required.
2. Use `list_models` and model-specific `get_tool` for image, video, speech, or music.
3. For image editing or image-to-video, import/upload the reference and use its
   returned URL in the schema's correct field.
4. Build the exact `call_tool.input`, estimate it, and submit once when authorized.
5. Follow the job or read a completed immediate result. Deliver its real URL.

Do not build a full composition when the user requested only one image, voice
track, or clip.

## Talking head or lipsync

1. Determine whether the input is a still character image or existing video.
   Discover a model that supports that input together with audio.
2. Cast a voice using `search_voices` or presets. Generate the approved script
   as speech through MCP and retain its actual audio URL and duration.
3. Import/select the face or source video. Estimate a compatible talking-head
   or lipsync request using those exact media inputs.
4. Generate the performance, follow its job, and inspect mouth timing and identity.
5. If requested, transcribe the actual voice track for word-level captions,
   then compose the finished cut through `render_video`.

Use one dialogue track. If the generated clip already contains the supplied
voice, do not play that voice a second time in the composition. Native-audio
generation is an alternative only when the discovered model supports the
requested performance and its timing.

## Consistent-character scenes

1. Establish the characters, outfits, location, and shot list from the brief.
   Reuse the user's real references rather than inventing a new identity.
2. Resolve identity, wardrobe, location, and product references to reachable
   file URLs. Select models that support the needed reference roles/count.
3. Create scene images and review them before animation when the user requests
   images-first approval or when identity continuity needs that checkpoint.
4. Animate approved scene images with one focused action per shot. Keep the
   character and environment descriptions consistent across requests.
5. Reuse completed takes, generate only missing/rejected scenes, and compose
   with `render_video` after inspecting the sources.

Maintain a small scene ledger: scene number, approved reference URLs, generation
input, job ID, output URL, duration, audio ownership, and review status. A
network timeout does not invalidate a previously submitted scene job.

## Product or UGC ad

1. Translate the brief into hook, demonstration/proof, and closing action.
   Preserve the requested duration, format, brand constraints, and audience.
2. Import product photography, logos, and real UI footage. Use them as explicit
   source layers or model references; do not claim generated UI is the product.
3. Choose voice-led, native-dialogue, or music-led timing. For voiceover-led
   work, generate speech first and use real timing for the shot plan.
4. Discover and quote the media generations. Execute the authorized plan, keeping
   each completed asset available for reuse.
5. Build a remote composition with footage, narration, captions, music, and an
   end card as requested. Estimate the composition and inspect its total/warnings.
6. Submit `render_video` once, follow its job, and review the finished file.

If a later text overlay changes, reuse existing footage. A composition edit
does not inherently require regenerating all source media.

## Slideshow or longer sequence

1. Decide whether the user wants still images, moving shots, or a mix.
2. Plan scene durations against actual narration/music timing. Split long
   narratives into model-supported shots instead of exceeding duration limits.
3. Reuse supplied images or generate only needed new assets. Estimate the full
   planned set and obtain approval when required.
4. Compose the sequence remotely. Use current component documentation or a
   retrieved template for crops, transitions, titles, and captions.
5. Inspect timing and the ending. Reuse completed scenes during revisions.

A slideshow needs no image animation if the user only wants a static-image cut.
Do not invent a free preview mode or promise that all repeated generations will
be cached at zero cost.

## Remix or variation

1. Use `get_lineage({ url })` or `get_lineage({ file_id })` for a varg output.
2. Identify the originating model/input or TSX and the exact requested change.
3. Preserve unaffected assets, prompts, and settings. Check the live schema for
   any field being changed.
4. Estimate the revised generation or composition. Explain what will be newly
   generated versus reused before crossing a new approval/budget boundary.
5. Submit once and follow the new job while retaining the original output.

If lineage is unavailable, ask for the missing brief/source rather than
pretending the original recipe was recovered.
