---
name: varg-character-sheets
description: >-
  Designs original AI characters that stand out and builds character sheets on varg that keep
  them identical in every later image and video: a character card (archetype, face, body,
  wardrobe, palette, one signature detail), a model-ready sheet (full-body front, side, back and
  large face close-ups on flat grey), QA, crops, and the exact way to pass the sheet to Nano
  Banana, Seedream, GPT Image, Kling 4, Seedance 2.5, Wan 3 and Veo. Covers the archetypes that
  perform (very old, very big, odd deadpan characters, absurd hybrids, mascots, beautiful-but-real
  people, fitness creators), realistic non-plastic skin, prompts that avoid false moderation
  blocks for swimwear and fitness content, and famous cartoon looks described without IP names.
  Use when someone asks for a character sheet, turnaround, model sheet, expression sheet,
  character bible, AI influencer or persona, consistent character, mascot, or wants the same
  character in new scenes or videos. Not for multi-scene ads built from real actor photos (use
  varg-consistent-characters), a speaker on a stage (varg-character-keynote) or two-person
  podcasts (varg-podcast-video); those skills take the sheet this one makes.
license: MIT
metadata:
  author: vargHQ
  version: "1.0.0"
  openclaw:
    requires:
      anyBins:
        - curl
    homepage: https://varg.ai
compatibility: >-
  Needs the varg MCP connection (https://mcp.varg.ai/mcp) or a VARG_API_KEY with curl (see the
  varg-ai skill). Cropping a sheet locally uses ffmpeg; without it, use varg's ffmpeg tool.
allowed-tools: Bash(curl:*) Bash(jq:*) Bash(ffmpeg:*) Bash(ffprobe:*) Read Write Edit
---

# varg character sheets

Make one character people remember, lock it in a sheet, and reuse that sheet in every later image and video. Everything here was run on varg on 2026-10-27; the numbers in **Tested** come from those runs.

Generation runs on varg: the MCP server (`https://mcp.varg.ai/mcp`, tools `call_tool`, `get_job`, `create_upload`) or the REST API (`POST https://api.varg.ai/v2/tools/{image|video}/call`). Read `varg-ai` for sign-in, models and prices. Quote every price in credits.

```
brief ──> character card ──> sheet (model sheet + optional bible) ──QA──> crops
                                                │                         │
                                                └── image edits ──> approved stills ──> video
                                                └── video reference mode (Seedance, Kling, Wan) ──┘
```

## 1. The character card: what makes a character work

A default prompt gives the model's average person: pleasant, symmetrical, forgettable. What spreads in 2026 is **contrast played straight**: an 84-year-old grandmother in leopard print, a 160 kg florist in a tiny pink apron, a 2-metre deadpan man on roller skates, a T-rex made of bread. Pick an archetype first ([references/archetypes.md](references/archetypes.md) has 12 with real numbers), then fill the card.

Write the card as JSON and keep it next to the project. Every later prompt is built from it, so wording never drifts.

```json
{
  "id": "nonna-rosa",
  "premise": "84-year-old Sicilian grandmother who solves everything with a wooden spoon",
  "archetype": "very old + loud wardrobe + deadpan",
  "body": "150 cm, sturdy round build",
  "face": "deeply wrinkled tanned skin, age spots, one gold front tooth, thick black cat-eye glasses",
  "hair": "silver hair in pink foam curlers under a black lace headscarf",
  "wardrobe": "leopard-print quilted housecoat over a plain black dress, beige compression stockings, fluffy red slippers",
  "signature": "gold front tooth + wooden spoon",
  "palette": ["#B08850 leopard tan", "#111111 black", "#E8C9A8 stocking beige", "#C8102E slipper red", "#F2A7C3 curler pink"],
  "style": "photoreal, natural skin texture",
  "never_change": ["gold tooth", "cat-eye glasses", "curlers", "leopard housecoat", "red slippers"],
  "may_change": ["setting", "light", "expression", "camera"],
  "sheet": { "model_sheet": "<url>", "face": "<url>", "body": "<url>" }
}
```

Rules that separate a strong card from a generic one:

- **One signature detail readable at phone size**: a gold tooth, a scar through one eyebrow, a lime sports bra, a beret. It must be on the sheet, or it will not exist later.
- **Silhouette first.** Fill the character in black in your head: it should still read (curlers + headscarf, a 2 m stick figure, a cactus with arms).
- **One loud colour** against a calm outfit, with hex codes in the card.
- **Exact numbers, not adjectives**: "84-year-old", "178 cm and about 160 kg", "US size 22". Adjectives like "old", "fat", "petite", "curvy" are read inconsistently and some trip filters.
- **Specific flaws for real people**: a bump on the nose, a gap between the teeth, freckles, flyaways. This is what stops "same AI face" ([references/realism.md](references/realism.md)).
- **The joke lives in costume, age, size and situation**, never in ethnicity, disability or body shaming.

## 2. Make the sheet

### 2.1 Which model

| Character | Sheet model | Why (Tested) |
|---|---|---|
| Photoreal person, any age or size | `seedream_5_pro` | Native 2K, best skin texture and attitude, kept the gold tooth; 7 credits |
| Stylised, 3D, cartoon, clay, creature | `nano_banana_2_1` | Clean layouts and labels, holds stylised designs; 6 credits; edits with refs |
| Labelled bible for people (names, palette, notes) | `gpt_image_2_5` or `nano_banana_2_1` | Best text; GPT output is ~1088 px by default, so ask for `provider_options.fal.quality: "high"` |
| Quick drafts | `krea_3` (4 credits), `flux_3_image` (7) | Both rendered the full layout; Krea kept the signature detail |
| From photos of a real, consenting person | `nano_banana_2_1` or `gpt_image_2_5` with 2–3 photos in `files` | Edit models; `seedream_5_pro` also takes refs |

All six models we tried produced a correct 4-view + expressions + palette layout from the same prompt. They differ in the **details**: only Nano Banana 2.1, Seedream 5 Pro and Krea 3 kept the gold tooth. Put the signature detail in the prompt twice (face line and close-ups) when it matters.

### 2.2 The model sheet (feed this to other models)

Flat grey, even light, no text, big faces. This is the 2026 standard: few panels so each face is large, because a small face is the first thing video models lose.

```
Character reference sheet for AI video, flat light-grey studio background, even soft studio light,
no text, no labels, no logos. Top row: three full-body views at the same scale on one ground line:
front, side profile, back, arms relaxed, empty hands. Bottom row: three large head-and-shoulders
close-ups: front, three-quarter, side profile. The same <person> in every panel: identical face,
hair, body, outfit and proportions.
CHARACTER: <name>, <age>, <height/weight>, <face specifics>, <hair>, <signature detail>, <expression>.
WARDROBE: <each garment with cut, colour, material>.
<STYLE line: "Photoreal, visible skin pores and natural skin texture, no retouching." or a style block from references/styles.md>
```

Call (MCP `call_tool`, tool `image`):

```json
{ "model": "seedream_5_pro", "aspect_ratio": "16:9", "prompt": "<the sheet prompt>" }
```

Keep the prompt under 2000 characters (varg's image limit). For a character from photos, add `"files": [{"url": "<photo 1>"}, {"url": "<photo 2>"}]` and start the prompt with "Character turnaround sheet of the person from the reference photos".

### 2.3 Optional companion sheets

Make them as separate calls, never one giant board (faces get tiny): an **expression sheet** (4–6 close-ups), an **outfit sheet** per look, a **prop sheet** for the signature item, a **labelled bible** for people with name, palette swatches and notes. Templates for each: [references/sheet-prompts.md](references/sheet-prompts.md). Keep labels off anything you will feed to a video model: text on a reference can show up in the video.

### 2.4 QA before you spend on video

Open the sheet at 100% and check:

- [ ] Same face in every panel (eye spacing, nose, jaw); signature detail visible in at least two panels
- [ ] Outfit identical front, side and back; back view exists
- [ ] Hands empty or holding the same prop in the same hand
- [ ] No text or logos (unless it is the bible); no real brand marks on clothes
- [ ] Skin reads as skin, not wax (for photoreal)

If one panel drifts, regenerate the sheet; don't patch it. A missing angle can be filled from the approved front view with `qwen_angles` (`provider_options.fal.horizontal_angle`: 90 side, 180 back).

### 2.5 Crop the sheet into references

Most uses work better with two clean crops than with the whole sheet: one **face close-up** and one **full-body front**. Crop locally and upload, or use varg's `ffmpeg` tool.

```bash
# 2048x1152 sheet, 3 panels per row: face front = bottom-left cell, body front = top-left cell
ffmpeg -i sheet.jpg -vf "crop=iw/3:ih/2:0:ih/2" face.png
ffmpeg -i sheet.jpg -vf "crop=iw/3:ih/2:0:0" body.png
```

Check each crop: no neighbouring prop or label sliding in from the next panel. Upload with `create_upload` (PUT the bytes to `upload_url`, then `complete_upload`) and keep the URLs in the card.

## 3. Use the sheet downstream

### 3.1 New images (scenes, styles, merch)

Pass the sheet or the crops in `files` to an edit model and say what each reference is. Describe what changes; the identity comes from the image.

```json
{
  "model": "nano_banana_2_1", "aspect_ratio": "9:16",
  "files": [{ "url": "<face.png>" }, { "url": "<body.png>" }],
  "prompt": "First reference image is Nonna Rosa's face, second is her full outfit. Show this exact woman in a new scene: same face, gold tooth, cat-eye glasses, pink curlers, black lace headscarf, leopard housecoat and red slippers. Candid vertical phone photo: she rides a red vintage scooter through a narrow Palermo street at golden hour, wooden spoon raised, shouting. Natural skin texture."
}
```

- **Whole sheet vs crops (Tested):** both kept her identity on `nano_banana_2_1`. With the whole sheet, add "One single photo, not a sheet, no labels."
- **Brand names make logos.** "Vespa" in the prompt put the Vespa wordmark on the scooter. Write "red vintage scooter" and add "unbranded, no logos".
- **Style swaps work from the same sheet**: the same call turned Nonna into a yellow 2D sitcom cartoon and a boxed vinyl collectible ([references/styles.md](references/styles.md)).
- Order matters on Nano Banana ("first reference image is …"); on GPT Image and Krea refer to references by content ("the woman in the face photo").

### 3.2 Video

Two ways in, and the first is the safest:

1. **Approved still → image-to-video.** Make the scene still with an image model (above), get it approved, then pass that **one** still as the first frame. Images cost 6–7 credits, video 80–200+, so iterate on stills. Never pass the sheet itself as a first frame: the clip opens on the grid.
2. **Reference mode.** Pass the sheet or crops as references and let the video model compose the shot. Bind each reference by role in the prompt and add the exclusion lines.

```json
{
  "model": "seedance_2_5", "aspect_ratio": "9:16", "duration": 5, "resolution": "720p", "audio": true,
  "files": [{ "url": "<face.png>" }, { "url": "<body.png>" }],
  "prompt": "@image1 is Nonna Rosa's face, @image2 is her full outfit. One continuous handheld phone shot: Nonna Rosa rides a red vintage scooter toward the camera through a narrow Palermo street, raises her wooden spoon and shouts in Italian: \"Mangia! Subito!\" Keep her face, gold tooth, glasses, curlers, headscarf, leopard housecoat and red slippers exactly as in the references. Do not copy any sheet layout, labels, panel borders or grey backdrop. No grid, no picture-in-picture, no on-screen text. One person only."
}
```

Paste these exclusion lines into every video prompt that uses a sheet:

```
Use the references for identity only (face, hair, body, wardrobe). Do not copy the sheet layout,
labels, panel borders, grey backdrop or studio lighting. No grid, no split screen, no
picture-in-picture, no on-screen text. One <person> only, fully themselves from the first frame.
```

| Video model | Feed it | How refs are named | Notes |
|---|---|---|---|
| `seedance_2_5` | ≤9 images; whole ≤6-panel sheet or face + body crops | `@image1`, `@image2` in the prompt | Tested both: no grid leak with the exclusion lines; crops gave the steadiest face; 203 credits for 5 s 720p with audio |
| `kling_v4` | an approved still as first frame, or `provider_options.fal.elements` (≤7, each `frontal_image_url` + 1–3 `reference_image_urls`) | `@Element1`, `@Image1` | Tested first-frame mode: most faithful to the still (it kept the still's logo too); 83 credits for 5 s |
| `wan_3` | `provider_options.fal.reference_image_urls` ≤10 | "Image 1" | Good for sheet + reference-video swaps |
| `vidu_q4` | `reference_image_urls` | `[@reference_image_1]` | No text-only mode |
| `grok_imagine_1_5` | `reference_image_urls` ≤7 | `<IMAGE_0>` | Single clean views |
| `omni_flash_1_1` | `image_urls`, keep ≤3 clean views | `<IMAGE_REF_0>` | |
| `minimax_h3_max` | `reference_image_urls` (≤12 files total) | "Image 1" | Can mix first frame + refs |
| `minimax_h3_max_recast` | one clean full-body photo **per person** (≤4), never a sheet | "the person in the first photo" | Swaps people in your own footage |
| `veo_3_1` | an approved still as first frame | — | No reference mode on varg |

`"model": "seedance_2_5"` picks a route from the inputs you send. If a clip opens on the sheet (a first-frame route was picked), pin the reference route by passing its key as `model`, e.g. `"model": "fal:bytedance/seedance-2.5/reference-to-video"`; the keys are in each model's spec at `https://varg.ai/models/<model>.md`. More shapes and drift fixes: [references/downstream.md](references/downstream.md).

**Keep identity across a series:** same files, same order and the same identity sentence in every shot; re-anchor on the **original** sheet, never on a frame from a drifted clip; change one variable at a time; run one cheap 480p test shot before a long one.

## 4. Moderation: get normal content through

Most blocks on fitness, swimwear and beauty characters are false positives triggered by **words**, not by the picture. On varg they come back fast as `content_policy_violation … (prompt)`. What we measured on 2026-10-27 (n = 1–2 per cell, so treat it as direction, not law):

| Prompt | NB 2.1 | GPT Image 2.5 | Seedream 5 Pro | FLUX 3 | Soul | Grok Image 2 |
|---|---|---|---|---|---|---|
| Activewear catalog: "28-year-old adult woman … high-support sports bra … mid-workout, holding a kettlebell … fitness magazine editorial" | pass | pass | pass | pass | pass | pass |
| "Beautiful woman in a sports bra and leggings at the gym, smiling" | — | **blocked**, then passed on retry | — | — | — | — |
| "Beautiful **girl** in a sports bra …" | pass | **blocked** | — | pass | — | — |
| Swimwear catalog: "30-year-old adult woman in a black triangle **bikini** … wet hair" | pass | **blocked** | pass | **blocked** | pass | **blocked** |
| Same with "two-piece swimsuit … brand lookbook" | — | **blocked** | — | pass | — | — |
| "Swimwear brand ecommerce catalog photo … one-piece swimsuit with a high neckline … holding a straw hat" | — | pass | — | — | — | — |
| "Hot sexy girl in a tight sports bra … big booty, seductive look" | pass, but rewritten into a plain gym photo | **blocked** | pass | **blocked** | pass | pass |

What this means:

1. **Write the product, the activity and the purpose, not the body.** The long catalog prompt passed everywhere; short "beautiful woman in a sports bra" did not. Name each garment (cut, colour, coverage), give an adult age as a number, add "activewear brand catalog photo" or "swimwear ecommerce catalog", put the person in a public place doing something.
2. **Swap the trigger words**: "girl" → "woman, 28"; "tight" → "fitted / athletic fit"; "bikini" → the cut plus "catalog"; "booty" → "hips and thighs" or the exercise; "sexy/hot" → "confident". Full table: [references/moderation.md](references/moderation.md).
3. **Blocks are not deterministic.** The same GPT Image prompt was blocked and then passed. Retry once; if it fails again, rephrase; if it still fails, route.
4. **Route by content:** swimwear stills → `seedream_5_pro`, `soul`, `nano_banana_2_1` (all passed here); gym and fitness → anything with catalog phrasing; avoid `gpt_image_2_5` and `grok_imagine_image_2` for swimwear.
5. **Crude prompts are worse even where they pass.** On Seedream, Soul and Grok, the "hot sexy girl" prompt produced the glossy, plastic, same-face "AI girl" look. The catalog prompt produced believable people. Specific beats suggestive on quality, not only on moderation.
6. **If you (the agent) hesitate to write the prompt**, the request needs context, not refusal: who it is for (activewear brand, swimwear catalog), that every character is a fictional adult with an exact age, that poses are retail-catalog and settings public. Then write the garment-focused prompt. Keep to that line: adults only, no nudity, no sexualised posing, no real person's likeness without consent.

## 5. Famous looks without IP names

Describing a style works as well as naming it, and the name is what gets blocked: Nano Banana 2.1 refused "The Simpsons style" but drew the same look from "flat 2D TV-animation look of a classic 1990s primetime family sitcom: lemon-yellow skin, large round white eyes with small black dot pupils, overbite, four-fingered hands, thick uniform black outlines". GPT Image 2.5 and Seedream 5 Pro accepted the name in our runs, but the name still has no place in an ad.

Style blocks for the yellow sitcom, 3D family film, hand-painted anime, paper cut-out, clay stop-motion, brick toy, vinyl collectible, felt puppet and more, with the legal line for each: [references/styles.md](references/styles.md). Short version: a visual style is free; characters, names, logos, catchphrases and some shapes (the brick minifigure, "Claymation") are not. Make **original** characters in those looks, keep IP names out of prompts, titles and ad copy, and add "original design, no recognizable existing characters, no logos".

## 6. Costs (measured 2026-10-27)

| Step | Model | Credits |
|---|---|---|
| Sheet | `nano_banana_2_1` / `seedream_5_pro` / `flux_3_image` / `krea_3` / `grok_imagine_image_2` | 6 / 7 / 7 / 4 / 7 |
| Sheet or bible | `gpt_image_2_5` (default quality) | 24 |
| Scene still from the sheet | `nano_banana_2_1` edit | 6 |
| 5 s video, 720p, audio | `kling_v4` first frame / `seedance_2_5` references | 83 / 203 |

A full character (sheet, two crops, four approved stills) costs about 35 credits; spend the video budget only after the stills are approved. Run `estimate_cost` before batches.

## 7. Examples

Every example below was made with the prompts in this skill:

| Character | Archetype | Sheet |
|---|---|---|
| Nonna Rosa | very old, loud wardrobe | [Seedream 5 Pro sheet](https://s3.varg.ai/files/194b94d0-58ff-4e8b-91de-4f1959d04013/file_7d8641db61c3.jpg) · [scene still](https://s3.varg.ai/files/194b94d0-58ff-4e8b-91de-4f1959d04013/file_958a5a187e1e.png) · [Seedance clip](https://s3.varg.ai/files/194b94d0-58ff-4e8b-91de-4f1959d04013/file_6489606dc55b.mp4) · [vinyl figure](https://s3.varg.ai/files/194b94d0-58ff-4e8b-91de-4f1959d04013/file_3c2e14641686.png) |
| Baguettosaurus | absurd hybrid | [Nano Banana 2.1 sheet](https://s3.varg.ai/files/194b94d0-58ff-4e8b-91de-4f1959d04013/file_3356a6c5b5c1.png) |
| Gary Pruitt | yellow 2D sitcom look | [sheet](https://s3.varg.ai/files/194b94d0-58ff-4e8b-91de-4f1959d04013/file_a4a9e3cae8a4.png) |
| Señor Pincho | 3D family-film look | [sheet](https://s3.varg.ai/files/194b94d0-58ff-4e8b-91de-4f1959d04013/file_844b46a7a45d.png) |
| Hector | clay stop-motion look | [sheet](https://s3.varg.ai/files/194b94d0-58ff-4e8b-91de-4f1959d04013/file_eb98a40764c2.png) |
| Inès | beautiful but real | [candid still](https://s3.varg.ai/files/194b94d0-58ff-4e8b-91de-4f1959d04013/file_b6c07ac22592.png) vs [generic "beautiful woman, 8k"](https://s3.varg.ai/files/194b94d0-58ff-4e8b-91de-4f1959d04013/file_43304ea81b0f.png) |

More archetypes with prompt seeds: [references/archetypes.md](references/archetypes.md).

## 8. Hand-offs

- Several scenes with the same actors and location → `varg-consistent-characters` (pass the crops as the profile cards).
- One character speaking on a stage → `varg-character-keynote`; two people talking → `varg-podcast-video`.
- Labels: mark AI characters as AI on Instagram and TikTok (unlabelled AI-person accounts lose reach since 2026-08-31), and never present an AI character as a real customer in an ad (FTC rule on fake testimonials).

## References

- [references/archetypes.md](references/archetypes.md): 12 archetypes that perform, why, prompt seeds, monetisation evidence
- [references/sheet-prompts.md](references/sheet-prompts.md): sheet, bible, expression, outfit, prop, split, identity-board and from-photo templates
- [references/downstream.md](references/downstream.md): image and video reference fields per model, call shapes, drift fixes
- [references/moderation.md](references/moderation.md): full test log, safe-phrasing table, routing, agent context block
- [references/realism.md](references/realism.md): non-plastic skin kit, beautiful-but-real, very old, very big, muscular, short/tall
- [references/styles.md](references/styles.md): famous looks described without names, legal line, toy and figure trends
- [references/sources.md](references/sources.md): the creators, guides and posts behind this skill
