# Voice Reference

The varg platform supports **600+ ElevenLabs voices** for text-to-speech. You can use friendly names (e.g. `"adam"`) or pass any ElevenLabs `voice_id` directly.

## Quick Start

```tsx
// By friendly name (resolved automatically)
const audio = Speech({ model: varg.speechModel("eleven_v3"), voice: "adam", children: "Hello world." })

// By voice_id (any valid ElevenLabs voice_id works)
const audio = Speech({ model: varg.speechModel("eleven_v3"), voice: "JBFqnCBsd6RMkjVDRZzb", children: "Hello world." })

// Default voice (rachel) when omitted
const audio = Speech({ model: varg.speechModel("eleven_v3"), children: "Hello world." })
```

The `voice` parameter accepts:
- **A friendly name** — `"adam"`, `"rachel"`, `"sarah"` etc. Resolved to a voice_id automatically.
- **An ElevenLabs voice_id** — any 20-char alphanumeric string like `"pNInz6obpgDQGcFmaJgB"`. Passed through directly.
- **Nothing** — defaults to Rachel (`21m00Tcm4TlvDq8ikWAM`).

---

## Voice Catalog

### Premade Voices (ElevenLabs built-in)

High-quality, production-ready voices available to all users.

| Name | voice_id | Gender | Age | Accent | Best for |
|------|----------|--------|-----|--------|----------|
| Adam | `pNInz6obpgDQGcFmaJgB` | male | middle_aged | american | social media, narration |
| Alice | `Xb7hH8MSUJpSbSDYk0k2` | female | middle_aged | british | educational, explainers |
| Bella | `hpp4J3VqNfWAUOO0d1Us` | female | middle_aged | american | educational, professional |
| Bill | `pqHfZKP75CvOlQylNhV4` | male | old | american | ads, authoritative |
| Brian | `nPczCjzI2devNBz1zQrb` | male | middle_aged | american | social media, comforting |
| Callum | `N2lVS1w4EtoT3dr4eOWO` | male | middle_aged | american | characters, animation |
| Charlie | `IKne3meq5aSn9XLyUdCD` | male | young | australian | conversational, energetic |
| Chris | `iP95p4xoKVk53GoZ742B` | male | middle_aged | american | conversational |
| Daniel | `onwK4e9ZLuTAKqWW03F9` | male | middle_aged | british | news, educational |
| Eric | `cjVigY5qzO86Huf0OWal` | male | middle_aged | american | conversational, trustworthy |
| George | `JBFqnCBsd6RMkjVDRZzb` | male | middle_aged | british | storytelling, narration |
| Harry | `SOYHLrjzK2X1ezoPC6cr` | male | young | american | characters, animation |
| Jessica | `cgSgspJ2msm6clMCkdW9` | female | young | american | conversational, bright |
| Laura | `FGY2WhTYpPnrIDTdsKH5` | female | young | american | social media, quirky |
| Liam | `TX3LPaxmHKxFdv7VOQHJ` | male | young | american | social media, energetic |
| Lily | `pFZP5JQG7iQjIQuC4Bku` | female | middle_aged | british | educational, velvety |
| Matilda | `XrExE9yKIg1WjnnlVkGX` | female | middle_aged | american | educational, professional |
| Rachel | `21m00Tcm4TlvDq8ikWAM` | female | young | american | default, general purpose |
| River | `SAz9YHcvj6GT2YYXdXww` | neutral | middle_aged | american | conversational, relaxed |
| Roger | `CwhRBWXzGAHq8TQ4Fs17` | male | middle_aged | american | conversational, casual |
| Sarah | `EXAVITQu4vr4xnSDxMaL` | female | young | american | entertainment, confident |
| Will | `bIHbv24MWmeRgasZH58o` | male | young | american | conversational, optimistic |

### Professional Voices

Curated professional voices with distinctive characters.

| Name | voice_id | Gender | Age | Accent | Best for |
|------|----------|--------|-----|--------|----------|
| Adam (Brooding) | `IRHApOXLvnW57QJPQH2P` | male | middle_aged | american | characters, animation |
| Adeline | `5l5f8iK3YPeGga21rQIX` | female | middle_aged | american | narration, storytelling |
| Aja | `eVItLK1UvXctxuaRV2Oq` | female | young | american | villains, characters |
| Arabella | `aEO01A4wXwd1O8GPgGlF` | female | young | australian | conversational |
| Brittney (Meditation) | `pjcYQlDFKMbcOUp6F5GD` | female | young | american | meditation, ASMR |
| Brittney (Social) | `kPzsL2i3teMYv0FxEYQ6` | female | young | american | social media, fun |
| David (ASMR) | `UvFmc37lQcxsSts1KwSb` | male | middle_aged | american | ASMR, whisper |
| Declan Sage | `kqVT88a5QfII1HNAEPTJ` | male | middle_aged | american | narration, captivating |
| Edward | `goT3UYdM9bhm0n2lmKQx` | male | middle_aged | british | dark characters, sexy |
| El Abuelo Charlie | `Yb8JGzcZyW5YYzenhRCm` | male | old | latin american | Spanish narration |
| Ellen | `BIvP0GN1cAtSRTxNHnWS` | female | young | german | conversational (German) |
| Empress J | `MHPwHxLx0nmGIb5Jnbly` | female | old | american | narration, powerful |
| Hope | `tnSpp4vdxKPjI9w0GnoV` | female | young | american | social media, upbeat |
| Ivanna | `tQ4MEZFJOzsahSEEZtHK` | female | young | american | sensual, intimate |
| Jeanette | `RILOU7YmBhvwJGDGjNmP` | female | old | british | audiobooks, narration |
| Jerry B. | `NxGA8X3YhTrnf3TRQf6Q` | male | middle_aged | british | horror, thriller, villain |
| Juniper | `aMSt68OGf4xUZAnLpTU8` | female | middle_aged | american | conversational |
| Linda | `0mLOQqwA3kovxF1ID7z6` | female | old | canadian | gentle, storytime |
| Lindsey | `JAATlCsz6GCH2vUjFcLg` | female | middle_aged | american | professional, warm |
| Lulu Lollipop | `ocZQ262SsZb9RIxcQBOj` | female | young | american | kids content, bubbly |
| Natasha | `Atp5cNFg1Wj5gyKD7HWV` | female | middle_aged | american | meditation |
| Oxley | `2gPFXx8pN3Avh27Dw5Ma` | male | middle_aged | american | evil character |
| Sameno | `hMK7c1GPJmptCzI4bQIu` | female | young | standard | anime, soft voice |
| Serafina | `4tRn1lSkEn13EVTuqb0g` | female | young | american | flirty, characters |
| Torsten | `iCEMyUhOwgAy0egMANye` | male | young | - | narration, raspy |

---

## Classic Voice Aliases

These short names work as convenience aliases and are backward-compatible with all existing code:

| Alias | Resolves to | voice_id |
|-------|-------------|----------|
| `rachel` | Rachel | `21m00Tcm4TlvDq8ikWAM` |
| `adam` | Adam - Dominant, Firm | `pNInz6obpgDQGcFmaJgB` |
| `sam` | *(legacy)* | `yoZ06aMxZJJ28mfd3POQ` |
| `josh` | *(legacy)* | `TxGEqnHWrfWFTfGW9XjX` |
| `sarah` | Sarah | `EXAVITQu4vr4xnSDxMaL` |
| `bella` | Sarah (alias) | `EXAVITQu4vr4xnSDxMaL` |
| `domi` | *(legacy)* | `AZnzlk1XvdvUeBnXmlld` |
| `antoni` | *(legacy)* | `ErXwobaYiN019PkySvjV` |
| `elli` | *(legacy)* | `MF3mGyEYCl7XYWbV9V6O` |
| `arnold` | *(legacy)* | `VR6AewLTigWG4xSOukaG` |

> **Note:** `bella` is an alias for Sarah's voice. Legacy voices (`sam`, `josh`, `domi`, `antoni`, `elli`, `arnold`) are ElevenLabs default voices — they work for speech but may not appear in the voice catalog search.

---

## Using voice_id Directly

Any valid ElevenLabs voice_id works — not just the ones in the catalog above. ElevenLabs has **thousands** of public community voices.

```tsx
// Use a community voice by its ID
const audio = Speech({
  model: varg.speechModel("eleven_v3"),
  voice: "JBFqnCBsd6RMkjVDRZzb",  // George
  children: "Any public ElevenLabs voice_id works."
})
```

To find voice_ids beyond the catalog:
1. Browse [elevenlabs.io/voice-library](https://elevenlabs.io/voice-library) and copy the voice_id from the URL
2. Use the `GET /v1/voices` API with search (see below)

---

## Voice Selection Guide

Quick recommendations by use case:

| Use Case | Recommended Voices |
|----------|-------------------|
| **Narration / storytelling** | `adam`, George (`JBFqnCBsd6RMkjVDRZzb`), Declan Sage, Jeanette |
| **Social media / TikTok** | Brian, Laura, Liam, Hope, Brittney (Social) |
| **Educational / explainer** | Alice, Daniel, Matilda, Bella |
| **Conversational / casual** | Charlie, Chris, Eric, Roger, Will |
| **Characters / animation** | Harry, Callum, Aja, Jerry B., Oxley |
| **Meditation / ASMR** | David (ASMR), Brittney (Meditation), Natasha |
| **Professional / ads** | Bill, Lindsey, Adeline |
| **Kids content** | Lulu Lollipop, Jessica |
| **Non-English** | El Abuelo Charlie (Spanish), Ellen (German) |

---

## Browse & Search Voices (API)

### `GET /v1/voices`

Search, filter, and paginate the voice catalog.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by name, description, or use case |
| `gender` | string | Filter: `male`, `female`, `neutral` |
| `age` | string | Filter: `young`, `middle_aged`, `old` |
| `accent` | string | Filter: `american`, `british`, `australian`, etc. |
| `category` | string | Filter: `premade`, `professional`, `cloned`, `generated` |
| `is_curated` | boolean | `true` = synced from ElevenLabs catalog |
| `sort_by` | string | `usage_count` (default), `name`, `created_at` |
| `sort_order` | string | `desc` (default), `asc` |
| `page` | number | Page number (default: 1) |
| `page_size` | number | Results per page (default: 50, max: 100) |

**Examples:**

```bash
# Search for deep male voices
curl "https://api.varg.ai/v1/voices?search=deep&gender=male" \
  -H "Authorization: Bearer varg_xxx"

# British female voices, sorted by name
curl "https://api.varg.ai/v1/voices?gender=female&accent=british&sort_by=name&sort_order=asc" \
  -H "Authorization: Bearer varg_xxx"

# Most popular voices (sorted by usage)
curl "https://api.varg.ai/v1/voices?sort_by=usage_count&page_size=10" \
  -H "Authorization: Bearer varg_xxx"
```

**Response:**

```json
{
  "voices": [
    {
      "voice_id": "pNInz6obpgDQGcFmaJgB",
      "name": "Adam - Dominant, Firm",
      "category": "premade",
      "labels": {
        "gender": "male",
        "age": "middle_aged",
        "accent": "american",
        "description": null,
        "use_case": "social_media"
      },
      "preview_url": "https://storage.googleapis.com/eleven-public-prod/...",
      "is_curated": true,
      "usage_count": 42
    }
  ],
  "total": 51,
  "page": 1,
  "page_size": 50
}
```

### `POST /v1/voices/sync`

Refresh the voice catalog from ElevenLabs. Run after adding new voices to the ElevenLabs account.

```bash
curl -X POST "https://api.varg.ai/v1/voices/sync" \
  -H "Authorization: Bearer varg_xxx"
```

---

## VOICES Global (Cloud Render)

In cloud render mode, the `VOICES` global is available in your TSX. It maps lowercase names to voice_ids:

```tsx
// VOICES is auto-injected in cloud render
console.log(VOICES.adam)    // "pNInz6obpgDQGcFmaJgB"
console.log(VOICES.rachel)  // "21m00Tcm4TlvDq8ikWAM"

// Use it to build dynamic voice selection
const voiceId = VOICES[userPreferredVoice] || VOICES.adam
const audio = Speech({ model: elevenlabs.speechModel("eleven_v3"), voice: voiceId, children: text })
```

The `VOICES` map contains the classic aliases only. For the full catalog, use voice_ids directly or call the API.
