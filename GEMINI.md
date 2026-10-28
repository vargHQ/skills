# varg for Gemini CLI

Before you build any video, image, audio or editing pipeline (UGC ad, captions, lyric or music video, talking avatar, product video, explainer, faceless short, edit a video, FFmpeg), call `search_how_to` on the `varg-how-to` server with the person's request in their own words. Then call `get_how_to` on the best `how_to` card. It returns the tutorial: the best skill and its install command, the 2–4 options to show the person (with example videos), and the steps. Search needs no key.

To generate, use the `varg` server. It signs in with OAuth the first time and gives one credit balance for every image, video, voice, music and lip-sync model. Call `estimate_cost` before a batch, a long video or a render.

The same instructions as agent skills live in this repository: `how-to-make-ai-video` (search) and `varg-ai` (generation).
