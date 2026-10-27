# Prompting for media generation

Use the selected model's live schema for fields and limits. The examples below
are creative guidance, not model IDs or executable tool payloads.

## Images

Describe the subject, setting, action or pose, framing, light, and material
detail. Give constraints that matter to the result rather than stacking vague
quality adjectives.

> A red ceramic mug on a warm off-white tabletop, three-quarter view at eye
> level, soft window light from the left, subtle ceramic texture, empty
> background, editorial product photography.

For an edit, state what should change and what must remain recognizable:

> Keep the person's face, hair, outfit, and pose. Replace only the background
> with a bright modern café. Match the original light direction and camera angle.

Reference roles matter: identity, wardrobe, location, product, and composition
references are not interchangeable. Resolve actual files and the selected
model's reference capabilities before promising preservation.

## Video

Build a shot from **subject + environment + action + cinematography**. Keep a
short shot centered on one understandable action.

> A barista finishes a rosetta in a white cup at a quiet café counter. Steam
> rises from the cup. Slow push-in from a medium shot to a close-up, warm
> morning window light, natural hand motion, continuous take.

For image-to-video, the reference already defines much of the scene. Focus the
prompt on motion, timing, expression, and camera behavior; do not accidentally
request a different person, outfit, or product.

Useful camera vocabulary: locked-off, slow push-in, pull-back, lateral tracking,
gentle orbit, handheld, over-the-shoulder, close-up, wide establishing shot.
Choose a coherent move rather than combining several incompatible moves in a
few seconds.

Separate scenes when they require different locations, actions, or camera
setups. For a cut with consistent characters, establish references first and
reuse them across shots; see [recipes.md](recipes.md).

## Dialogue and voiceover

Specify the speaker, language, exact words, tone, pace, and whether the speech
belongs inside the clip or on a separate narration track.

> A relaxed adult voice, conversational American English, warm but not salesy.
> Read exactly: “One brief. A finished video. Ready to share.” Leave a small
> pause between the sentences.

Estimate spoken length as a planning heuristic, then use real audio timing.
Different voices and languages have different pacing. Shorten copy, extend
the scene within the model's supported durations, or split the shot if the
line does not fit. Do not silently truncate a sentence.

For lipsync, use the actual audio asset as the timing source. Do not ask a
video model to invent replacement dialogue while also supplying a finished
voice track unless that is intentionally supported by the selected model.

## Music

Describe mood, instrumentation, tempo impression, energy curve, vocal intent,
and the role of the music under the scene.

> Light electronic instrumental for a calm product demo: muted synth chords,
> a restrained pulse, no vocals, a gentle lift halfway through, and a clean
> ending. Leave space for spoken narration.

Set duration and instrumental/vocal options through the model's current schema.
Prompt text does not replace required fields or guarantee a sample-accurate
ending. Fit the completed track to the composition with supported media tools.

## Iteration

Describe a concrete correction: less camera motion, slower speech, one fewer
action, a wider crop, or a clearer product silhouette. Reuse approved inputs
and outputs and change only the necessary request. Preserve unchanged prompts
and parameters where possible without promising a guaranteed free cache hit.
