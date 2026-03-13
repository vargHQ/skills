#!/usr/bin/env bun

/**
 * varg-ai skill setup script
 *
 * Checks environment prerequisites and creates a starter example.
 *
 * Usage:
 *   bun scripts/setup.ts
 */

const GATEWAY_URL = "https://api.varg.ai"

// ── Colors ─────────────────────────────────────────────────────

const green = (s: string) => `\x1b[32m${s}\x1b[0m`
const red = (s: string) => `\x1b[31m${s}\x1b[0m`
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`

// ── Helpers ────────────────────────────────────────────────────

function checkEnvKey(name: string): string | undefined {
  // Check process.env (Bun auto-loads .env)
  return process.env[name] || undefined
}

async function checkGateway(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(`${GATEWAY_URL}/v1/balance`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) {
      const data = await res.json() as { balance_cents?: number }
      const credits = data.balance_cents ?? 0
      console.log(green(`  ✓ Gateway connected. Balance: ${credits} credits ($${(credits / 100).toFixed(2)})`))
      return true
    }
    if (res.status === 401) {
      console.log(red(`  ✗ Invalid API key (401 Unauthorized)`))
      return false
    }
    console.log(yellow(`  ? Gateway returned ${res.status}`))
    return false
  } catch (e) {
    console.log(red(`  ✗ Cannot reach gateway: ${(e as Error).message}`))
    return false
  }
}

// ── Main ───────────────────────────────────────────────────────

console.log(bold("\nvarg-ai Skill Setup\n"))

// 1. Check bun
console.log("Runtime:")
console.log(green(`  ✓ Bun ${Bun.version}`))

// 2. Check API keys
console.log("\nAPI Keys:")

const vargKey = checkEnvKey("VARG_API_KEY")
const falKey = checkEnvKey("FAL_KEY") || checkEnvKey("FAL_API_KEY")
const elevenKey = checkEnvKey("ELEVENLABS_API_KEY")
const replicateKey = checkEnvKey("REPLICATE_API_TOKEN")
const higgsfieldKey = checkEnvKey("HIGGSFIELD_API_KEY")

let hasGateway = false

if (vargKey) {
  console.log(green("  ✓ VARG_API_KEY found"))
  hasGateway = true
} else {
  console.log(yellow("  ○ VARG_API_KEY not set (recommended: single key for all providers)"))
}

if (falKey) {
  console.log(green(`  ✓ ${checkEnvKey("FAL_KEY") ? "FAL_KEY" : "FAL_API_KEY"} found`))
} else {
  console.log(vargKey ? dim("  ○ FAL_KEY not needed (using gateway)") : yellow("  ○ FAL_KEY not set"))
}

if (elevenKey) {
  console.log(green("  ✓ ELEVENLABS_API_KEY found (speech + music)"))
} else {
  console.log(dim("  ○ ELEVENLABS_API_KEY not set (speech/music via gateway if VARG_API_KEY is set)"))
}

if (replicateKey) {
  console.log(green("  ✓ REPLICATE_API_TOKEN found"))
} else {
  console.log(dim("  ○ REPLICATE_API_TOKEN not set (optional)"))
}

if (higgsfieldKey) {
  console.log(green("  ✓ HIGGSFIELD_API_KEY found (soul character generation)"))
} else {
  console.log(dim("  ○ HIGGSFIELD_API_KEY not set (optional)"))
}

if (!vargKey && !falKey) {
  console.log(red("\n  ✗ No API keys found. Set VARG_API_KEY or FAL_KEY in .env"))
  console.log(dim("    Get a key at https://varg.ai or https://fal.ai/dashboard/keys"))
  process.exit(1)
}

// 3. Test gateway connectivity
if (vargKey) {
  console.log("\nGateway Connectivity:")
  hasGateway = await checkGateway(vargKey)
}

// 4. Check for existing project files
console.log("\nProject Structure:")

const hasPackageJson = await Bun.file("package.json").exists()
const hasTsconfig = await Bun.file("tsconfig.json").exists()
const hasEnv = await Bun.file(".env").exists()

if (hasPackageJson) console.log(green("  ✓ package.json exists"))
else console.log(yellow("  ○ No package.json -- run: bunx vargai init"))

if (hasTsconfig) console.log(green("  ✓ tsconfig.json exists"))
else console.log(dim("  ○ No tsconfig.json (optional for simple templates)"))

if (hasEnv) console.log(green("  ✓ .env exists"))
else console.log(yellow("  ○ No .env file -- create one with your API keys"))

// 5. Create example file if none exists
const examplePath = "hello.tsx"
const hasExample = await Bun.file(examplePath).exists()

if (!hasExample) {
  console.log("\nCreating starter example...")

  const provider = vargKey ? "gateway" : "fal"
  const importLine = vargKey
    ? `import { createVarg } from "@vargai/gateway"\n\nconst varg = createVarg({ apiKey: process.env.VARG_API_KEY! })`
    : `import { fal } from "vargai/ai"`

  const modelPrefix = vargKey ? "varg" : "fal"

  const example = `/** @jsxImportSource vargai */
import { Render, Clip, Image, Video } from "vargai/react"
${importLine}

const img = Image({
  model: ${modelPrefix}.imageModel("nano-banana-pro"),
  prompt: "a cozy cabin in the mountains at sunset, warm golden light",
  aspectRatio: "16:9"
})

const vid = Video({
  model: ${modelPrefix}.videoModel("kling-v3"),
  prompt: { text: "gentle push-in, smoke rising from chimney", images: [img] },
  duration: 5
})

export default (
  <Render width={1920} height={1080}>
    <Clip duration={5}>{vid}</Clip>
  </Render>
)
`

  await Bun.write(examplePath, example)
  console.log(green(`  ✓ Created ${examplePath}`))
} else {
  console.log(dim(`\n  ○ ${examplePath} already exists (skipping)`))
}

// 6. Summary
console.log(bold("\n── Ready ──────────────────────────────────\n"))

const features: string[] = []
if (vargKey || falKey) features.push("images", "video")
if (vargKey || elevenKey) features.push("speech", "music")
if (vargKey || replicateKey) features.push("lipsync")

console.log(`Available: ${features.join(", ")}`)

if (!hasExample) {
  console.log(`\nRender your first video:`)
  console.log(dim(`  bunx vargai render ${examplePath} --preview   ${dim("(free preview)")}`))
  console.log(dim(`  bunx vargai render ${examplePath} --verbose   ${dim("(full render, costs credits)")}`))
} else {
  console.log(`\nRender:`)
  console.log(dim(`  bunx vargai render <file.tsx> --verbose`))
}

console.log()
