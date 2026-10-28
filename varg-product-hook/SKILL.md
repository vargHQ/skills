---
name: varg-product-hook
description: >-
  Makes the first 5-15 seconds of a product video, the part that stops the scroll: either finds
  a hook that already went viral for this kind of product (TikTok Creative Center, ad spy tools,
  Reels search) and remakes the idea, or generates a realistic UGC-style clip of the product in
  use with Seedance 2.5 on varg from the product's own photos (a backyard-camera fail, a torture
  test, problem then solution, a satisfying close-up, a gift reaction). Use when someone selling
  a product (dropshipping, Shopify, TikTok Shop, Amazon) asks for a viral hook, a scroll-stopper,
  a "TikTok made me buy it" clip, product b-roll that looks like real footage, or "a video of my
  product in use" made from product photos. Not for the full guide reel with the laptop and pen
  (use varg-dropship-reel, which calls this skill for its hook), talking-head UGC ads with an
  actor reading a script (find one with video-skills), or studio packshot spins (use varg-ai).
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
  Needs a VARG_API_KEY with curl (see the varg-ai skill) or the varg MCP connection
  (https://mcp.varg.ai/mcp). Downloading reference clips uses the media-download skill (yt-dlp).
allowed-tools: Bash(curl:*) Bash(jq:*) Bash(ffmpeg:*) Bash(ffprobe:*) Read Write Edit
---

# Product hook

The hook is the first 5-15 seconds of a product reel: real-looking footage of the product doing the one thing that makes people stop. In the dropshipping reels this skill was built from (@tradelle, Sept-Oct 2026), the hook carried the video: a snake biting a leg gaiter, a worker getting sand and grinder sparks thrown at his face mask, a cat's claw lit up by an LED clipper. The voiceover over the hook is a plain product line ("These are the leg guards I wear when I'm outdoors").

Generation runs on varg: the `varg-ai` skill (REST at `https://api.varg.ai/v2`) or the varg MCP server (`https://mcp.varg.ai/mcp`, tools `call_tool` + `get_job`). Every call returns a job; poll `GET /v2/jobs/{id}` until `completed`, the file is at `output.outputs[0].url`.

## 1. Ask two things first

1. **Where the hook comes from**
   - **Remake a proven idea with AI (recommended):** find a hook that already worked for this kind of product, then generate your own version with your product. No rights problems, any angle you want.
   - **Your own footage:** the supplier's video or your own phone clips. Only use supplier or other people's clips with written permission. Sellers get takedowns for reposted AliExpress videos.
2. **Which archetype** (pick from the table in step 3, or let the product decide: protective gear → torture test or backyard camera; pet and home gadgets → problem/solution or satisfying close-up; gifts → reaction).

Also collect: 1-3 product photos (a clean packshot plus one in-use photo if there is one), the product name, and the one benefit to show.

## 2. Find what already works (10 minutes)

| Where | What to look at |
|---|---|
| TikTok Creative Center → Top Ads / Top Products | Filter by your country and category; sort by CTR. Note the first 3 seconds of the top 5 ads. |
| Kalodata, FastMoss | TikTok Shop products with rising sales and the creator videos that sold them. |
| Minea, PiPiADS | Ad spy tools: the ad, how long it has been running, engagement. An ad running 30+ days is profitable. |
| Instagram / TikTok search | `tiktok made me buy it`, `amazon finds`, `backyard camera caught this`, `<product> test`, "where can I buy this" in comments. |
| Product research tools (Tradelle, Sell The Trend, AutoDS) | The product page often embeds the video ads that sell it. |

Save the 2-3 best references with the `media-download` skill (`vdl <url>`) to study the shots. Write down the idea in one line ("snake strikes the gaiter in a swamp, the gaiter holds"); you remake the idea, not the clip.

## 3. Pick the archetype and fill the prompt

Every prompt has five blocks (the order matters for Seedance 2.5):

1. **Identity:** "the <product> from @image1 (exact same product: same shape, colors, material, logo)".
2. **Shot:** "vertical UGC clip shot handheld on an iPhone in <place>, natural light, slight hand shake".
3. **Action:** one clear physical action and its result, in order.
4. **Camera:** close-up or medium, one move at most.
5. **Exclusions:** "Real footage look, no music, no text, no subtitles." Captions and offers go in the edit, never in the prompt.

| Archetype | What happens | Prompt core (blocks 2-4) |
|---|---|---|
| **Backyard camera caught this** | Security-cam angle: something goes wrong, the product saves the day | "Fixed security-camera view from a house corner, slightly wide lens, timestamp-free. A man in overalls clears tall grass with a leaf blower; a large snake lunges at his leg and bites the <product from @image1> on his shin; he jumps back unhurt." |
| **Torture test** | The product takes abuse and holds | "Front-facing phone selfie video by a worker in a garage. He wears the <product from @image1>. A friend throws a handful of sand at his face, then holds an angle grinder near him so sparks spray across the visor; he doesn't flinch." |
| **Problem → solution** | 2-3 s of the annoying problem, then the product fixing it | "Shot 1 (0-3s): backyard camera view, an orange cat climbs the fence and escapes while its owner chases it. Shot 2 (3-8s): handheld, the same cat happily rolls around the lawn inside the <product from @image1>." |
| **Satisfying close-up** | Macro of the product doing its job | "Extreme close-up, hands hold a fluffy cat's paw; the <product from @image1> switches on its LED, lights up the claw so the pink quick shows, snips just the tip; the clipping drops into the guard." |
| **Gift reaction** | Someone unwraps it, puts it on, reacts | "Living room, Father's Day: a dad opens a gift box, pulls out the <product from @image1>, puts it on and laughs; his son films on a phone." |
| **Before / after** | Same spot, two states | "Shot 1: a grimy oven door, a hand sprays the <product from @image1>. Shot 2: same framing, the hand wipes once and the glass is spotless." |

For a hook with a person who must stay the same across several clips, make a character sheet first (`varg-character-design`).

## 4. Generate

Upload the product photos (`POST /v2/files`, MCP `create_upload` → PUT to `proxy_url`), then:

```bash
curl -s -X POST https://api.varg.ai/v2/video \
  -H "Authorization: Bearer $VARG_API_KEY" -H "Content-Type: application/json" \
  -d '{
    "model": "seedance_2_5",
    "prompt": "Vertical UGC product clip shot handheld on an iPhone in a cozy living room, natural window light, slight hand shake. Extreme close-up: a person'\''s hands hold a fluffy orange cat'\''s front paw on a grey blanket. They bring in the pet nail clipper from @image1 (exact same product, same white and pastel-blue colors, same LED light at the blade). The LED switches on and lights up the claw so the pink quick is visible through it; the clipper snips the very tip of the claw cleanly, the clipping drops into the transparent guard. The cat stays calm. Real footage look, no music, no text, no subtitles.",
    "files": [{ "url": "PRODUCT_PACKSHOT_URL" }],
    "aspect_ratio": "9:16",
    "resolution": "720p",
    "duration": 6
  }'
```

- One image in `files` is the first frame on most models, but `seedance_2_5` (≤9 images), `kling_v4` (≤7) and `wan_3` (≤10) take it as a **reference** and build the scene around it. Name each one in the prompt (`@image1`, `@image2`).
- Hooks are 4-8 s per clip; plan 2-3 clips (13 s in total covered the hook in every reel studied). Seedance 2.5 can do 2-3 shots in one 8-12 s clip with "Shot 1 (0-3s): … Shot 2 (3-8s): …".
- Price it first: `POST /v2/estimate` (same body) or MCP `estimate_cost`. A 6 s 720p `seedance_2_5` clip cost 231 credits in our test (Oct 2026). Drafts: `wan_3` at about a quarter of that, then the keeper on `seedance_2_5`.
- Keep `audio` off when a voiceover goes on top. Turn it on (`"audio": true`) for a hook that plays with its own sound (a scream, a snap, a crash), as in "Backyard camera caught this".

## 5. Check before you use it

- **Is it the same product?** Compare shape, color and logo against the packshot frame by frame. If it drifts, add a second photo from another angle as `@image2`, and add "do not change the product's shape, color or size".
- **Does the action read in 1 second with the sound off?** If not, shorten to the moment of impact.
- **Hands and animals:** count fingers, check paws. Regenerate the clip instead of fixing it in the edit.
- **Product scale:** Seedance sometimes makes the product too big or small; say its real size ("palm-sized").
- Re-running with a byte-identical body is a free cache hit; change one word to get a new take.

Tested 2026-10-27: an LED pet nail clipper packshot (`gpt_image_2_5`) + the prompt above on `seedance_2_5` at 6 s 720p gave a usable handheld close-up on the first try: the product stayed recognizable, the LED lit up, and it looked like phone footage.

## Rules

- Don't claim the AI clip is a real customer or a real event. Label AI content where the platform asks for it (TikTok and Instagram AI labels).
- Don't use real brand logos you don't own, real people's faces or celebrity lookalikes.
- Don't repost someone else's video as your hook. Remake the idea with your own product.

## Related skills

`varg-dropship-reel` (the full 60-second guide reel this hook opens), `varg-ai` (models, uploads, prices), `media-download` (save reference clips), `varg-character-design` (a person who stays the same across clips), `video-skills` (other ad formats).
