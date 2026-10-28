#!/usr/bin/env node
// Write edit.json for the guide reel from the voiceover's word timings: every laptop screen is cut
// in on the word that names it, so the picture changes exactly when the voice moves on.
//
//   node guide-edl.mjs words.json clips/ > edit.json
//
// clips/ holds (5 s image-to-video clips unless noted):
//   hook1.mp4 hook2.mp4          the hook, two clips (any length)
//   productA.mp4                 research page, pen: photo → product cost → sell price
//   productB.mp4                 research page, pen: profit → demand chart → "Generate my store"
//   store.mp4                    store product page, pen: price → Add to cart
//   home.mp4                     research tool landing page
//   settings.mp4                 store settings: free shipping, payments, Launch
//   adpaste.mp4 ads.mp4          AI ad tool: paste link / the generated videos
//   flow.mp4                     TikTok · Reels · Shorts → your store
//   orders.mp4                   orders paid and shipped
//   skyline.mp4                  the ending
// The script must follow references/script.md (the anchors below are its words); words.json is a
// transcription with word timestamps ({ "words": [{ "word", "start", "end" }] }).
// Runs with node 18+ or bun; needs ffprobe.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const [wordsPath, clipsDir = "clips"] = process.argv.slice(2);
if (!wordsPath) {
  console.error("usage: node guide-edl.mjs words.json clips/ > edit.json");
  process.exit(1);
}
const raw = JSON.parse(readFileSync(wordsPath, "utf8"));
const W = (raw.words ?? raw.data?.words).map((w) => ({ t: w.word.toLowerCase().replace(/[^a-z0-9$.]/g, ""), start: w.start, end: w.end }));

const find = (phrase, after = 0) => {
  const seq = phrase.split(" ");
  for (let i = 0; i + seq.length <= W.length; i++) {
    if (W[i].start >= after && seq.every((s, k) => W[i + k].t.startsWith(s))) return i;
  }
  throw new Error(`anchor "${phrase}" not found after ${after}s: does the script follow references/script.md?`);
};
const at = (phrase, after = 0, back = 0) => W[find(phrase, after) - back].start;
const len = (f) => Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", join(clipsDir, f)]).stdout.toString());

const buy = at("can be purchased", 0, 1); // starts at "It"/"They"
const sold = at("sold", buy);
const even = at("even after", sold);
const here = at("here is how", even);
const first = at("first", here);
const offer = at("offer", first);
const then = at("then go", offer);
const itWill = at("it will", then);
const start = at("start posting", itWill);
const when = at("when a customer", start);
const comment = at("comment", when);
const end = W[W.length - 1].end + 0.5;

const shots = [];
const add = (file, from, to, inPoint = 0, zoom = 1) => {
  const dur = +(to - from).toFixed(3);
  const avail = len(file) - inPoint - 0.05;
  const s = { file: join(clipsDir, file), in: inPoint, dur };
  if (zoom !== 1) s.zoom = zoom;
  if (dur > avail) s.speed = +Math.max(0.6, avail / dur).toFixed(3); // slow a short clip down a little
  shots.push(s);
};
const h1 = Math.min(len("hook1.mp4") - 0.3, buy / 2);
add("hook1.mp4", 0, h1, 0.2);
add("hook2.mp4", h1, buy, 0.3);
add("productA.mp4", buy, sold);
add("store.mp4", sold, even, 0.3);
add("productB.mp4", even, here);
add("productA.mp4", here, first, 0, 1.1); // "without even touching the product": back on the photo
const mid = first + (offer - first) * 0.45;
add("home.mp4", first, mid, 0.4);
add("productB.mp4", mid, offer, 2.6, 1.08); // "…and generate a free store": the button
add("settings.mp4", offer, then);
add("adpaste.mp4", then, itWill, 0.3);
add("ads.mp4", itWill, start);
add("flow.mp4", start, when, 0.2);
add("orders.mp4", when, comment);
add("skyline.mp4", comment, end, 0.3);

console.log(JSON.stringify({ out: "reel.mp4", voiceover: "vo.mp3", captions: "captions.ass", fontsdir: "fonts", hook: +buy.toFixed(2), shots }, null, 1));
console.error(`${shots.length} shots, ${shots.reduce((a, s) => a + s.dur, 0).toFixed(2)} s, hook ${buy.toFixed(2)} s`);
