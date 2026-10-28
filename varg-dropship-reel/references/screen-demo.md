# The laptop shot: a hand with a pen walks through the screens

Beats 2-4 of the reel, about 40 of its 60 seconds: a MacBook on a black-and-white zigzag tablecloth, filmed from above at an angle on a phone; a right hand holds a thick marker (the cap end is a colored band) and points at each number or button as the voice names it. Each shot lasts 1.5-4 s and cuts on the word. A reel has 15-25 of these shots over 6-10 different screens.

## 1. Capture the screens first

Whatever path you take, you need the real screens as images:

| Screen | What must be readable |
|---|---|
| Research / supplier page | Product photo, **product cost**, shipping cost, the demand chart |
| Store product page | Product, **sell price** (and compare-at price), Add to cart |
| Demand / trend chart | A line going up |
| Tool home pages for each step | Logo, headline ("Your #1 dropshipping product research tool") |
| The "generate / import store" dialog | The one-click button |
| The AI ad tool | "Paste your link" box, then the generated videos |
| Instagram profile / reel grid | The product videos, link in bio |
| Order or fulfilment page | "Fulfilled by …", order list |
| Flow graphic | Logos with arrows: TikTok · Instagram · Facebook → Shopify (make it in any slide tool) |

How: browser at 125-150 % zoom so the key numbers are big, light mode, hide bookmarks bar, `Cmd+Shift+4` (Mac) or `Win+Shift+S`, 16:10 crop. Use your real store and real prices: viewers pause on these frames. Don't add fake review counts or fake sales numbers.

## 2. Pick the path

| | Film it for real | Full AI on varg |
|---|---|---|
| Looks | 100 % real; this is how the originals are made | Close to real at phone resolution (tested, below) |
| Needs | Laptop, phone, tripod or a steady hand, a patterned tablecloth, a marker | Only the screenshots |
| Time | ~30 min for all screens | ~5 min of work per shot + 3-5 min render |
| Cost | Free | ~215 credits per 5 s shot (`gpt_image_2_5` frame ~23 + `seedance_2_5` 5 s 720p ~193); about 8 shots → ~1,700 credits |
| Breaks when | Moiré and glare on the screen | Small text smears; the camera can drift a little; a hand can go wrong |

Mixed is common: film the laptop shots for real (cheap, real), AI only for the hook and the ending.

### Film it for real

- Phone on a tripod or a gooseneck clamp above the laptop at ~45°, screen filling the upper two-thirds of a 9:16 frame, keyboard visible at the bottom. Same angle for every shot.
- Screen brightness at max, room lights dimmed a bit; tap-and-hold on the screen to lock focus and exposure (AE/AF lock). If you see moiré waves, move the phone slightly back or defocus a hair. If you see rolling bands, film at 30 fps (or 25 fps in 50 Hz countries).
- One take per screen: point at each item for 1-2 s in the order the script names them. Cut on the words in the edit.
- A patterned tablecloth (the zigzag in all the originals) and a real marker make it look like a desk, not a studio.

### Full AI (tested 2026-10-27)

**Step A: first frame.** Put the screenshot on a laptop with `gpt_image_2_5` (best at keeping dense text). Pass the screenshot as the reference and ask for the exact screen:

```bash
curl -s -X POST https://api.varg.ai/v2/image \
  -H "Authorization: Bearer $VARG_API_KEY" -H "Content-Type: application/json" \
  -d '{
    "model": "gpt_image_2_5",
    "prompt": "Vertical 9:16 iPhone photo looking down at an angle at an open silver MacBook on a table covered with a black-and-white zigzag patterned tablecloth. The laptop screen fills the upper two-thirds of the frame and shows EXACTLY the screenshot from the reference image, unchanged: same layout, same text, same numbers, same product photo, slightly in perspective, with a faint natural screen glow. The keyboard is visible at the bottom. A right hand enters from the bottom right holding a thick black marker pen with a green cap end, its tip pointing at the <ITEM> on the screen without touching it. Indoor evening light, realistic phone photo, slight lens vignette, no extra text.",
    "files": [{ "url": "SCREENSHOT_URL" }],
    "aspect_ratio": "9:16",
    "quality": "high"
  }'
```

**Step B: the next screens, same desk.** For every later screen, edit the first frame instead of starting over, so the laptop, table, light and hand stay identical:

```
Edit the first image. Keep EXACTLY the same photo: same laptop, same angle, same zigzag tablecloth,
same lighting, same hand and marker pen. Change ONLY what is on the laptop screen: it now shows the
screenshot from the second image. The pen tip now points at <ITEM>. Sharp readable screen text.
```
with `files: [{first frame}, {next screenshot}]`.

**Step C: animate.** Image-to-video on `seedance_2_5`, 5 s, 9:16, 720p, the frame as the only file. Lock the camera and the screen in words, and give the pen a path through the items in script order:

```
Phone on a tripod, camera completely locked, no zoom, no camera movement, no reframing. The laptop
screen content stays exactly the same and perfectly static the whole time, every number and word
unchanged. Only the right hand moves: the marker pen tip glides from the '<ITEM 1>' to the
'<ITEM 2>', pauses, then moves to '<ITEM 3>' and taps the air in front of it twice. Natural relaxed
hand motion, realistic, no text appears, no subtitles.
```

What we saw in the test (LED pet nail clipper, research page with $4.47 / $24.99 / $20.52 and a store page with $24.99):
- `seedance_2_5` kept every big number, the title and the chart correct for the full 5 s; one line of small grey description text went soft. The camera eased back slightly despite "locked"; at phone size nobody notices.
- Editing frame 1 for the second screen kept the same laptop, tablecloth, hand and marker. The two shots cut together like one take.
- The hand looked natural; fingers stayed at five.
- **Verbs matter.** "The pen circles the price" made the model *draw* a red ink circle around the price on the screen and keep it there. Use "points at", "hovers over", "moves to", "taps the air in front of". (If you want the drawn-circle look on purpose, ask for it: it works.)
- Text the pen passes over can scramble for a few frames ("ADD TO CART" became "ADF ADD TO CART" under the pen). Cut away before the pen crosses text the viewer must read, or keep the pen path below the key numbers.

If a number changes or smears in the video: make the key item bigger in the screenshot (zoom the browser), shorten the clip to 4 s, and cut the shot just before the pen covers the number. For text that must stay perfect for a long time (a long list, a dense table), film it for real or put the screenshot back on top in the edit for those frames.

Drafts: `wan_3` costs about a quarter as much and is worth a try for motion tests, then the keeper on `seedance_2_5`. We only tested `seedance_2_5` for this shot (a `kling_v4` comparison job didn't finish within an hour that day).

## 3. Cut it to the voice

One shot per voiceover phrase; cut when the next number or tool name is spoken, not on a fixed beat. A 5 s generated shot usually gives two usable cuts (pen on item 1, pen on item 2). Slight zoom-ins (105-110 %) on alternate cuts hide that two cuts came from one clip.
