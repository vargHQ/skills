import { dirname, resolve, relative } from 'node:path'

const root = resolve(import.meta.dir, '..')
const skill = resolve(root, 'varg-ai')
const failures: string[] = []
let snippets = 0
let links = 0

function check(condition: unknown, message: string) {
  if (!condition) failures.push(message)
}

async function json(path: string) {
  return JSON.parse(await Bun.file(resolve(root, path)).text())
}

const markdown = ['README.md', 'CONTRIBUTING.md']
for await (const path of new Bun.Glob('**/*.md').scan({ cwd: skill, onlyFiles: true })) {
  markdown.push(`varg-ai/${path}`)
}

for (const path of markdown) {
  const text = await Bun.file(resolve(root, path)).text()
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const href = match[1].split('#')[0]
    if (!href || /^(https?:|mailto:)/.test(href)) continue
    const target = resolve(dirname(resolve(root, path)), href)
    links++
    check(await Bun.file(target).exists(), `${path}: broken link to ${href}`)
  }

  for (const match of text.matchAll(/```(js|tsx|json)\n([\s\S]*?)```/g)) {
    snippets++
    try {
      if (match[1] === 'json') JSON.parse(match[2])
      else new Bun.Transpiler({ loader: match[1] === 'tsx' ? 'tsx' : 'js' }).transformSync(match[2])
    } catch {
      failures.push(`${path}: invalid ${match[1]} example`)
    }
  }

  if (path.startsWith('varg-ai/')) {
    check(
      !/VARG_API_KEY|FAL_KEY|ELEVENLABS_API_KEY|~\/\.varg\/credentials|\b(?:curl|bunx|npx)\b|\.cache\/ai\//.test(text),
      `${path}: legacy credential/runtime instructions remain`,
    )
    check(!/https:\/\/api\.varg\.ai\/v[12]\//.test(text), `${path}: direct execution endpoint remains`)
  }
}

const main = await Bun.file(resolve(skill, 'SKILL.md')).text()
const match = main.match(/^---\n([\s\S]*?)\n---\n/)
check(match, 'SKILL.md: missing frontmatter')
if (match) {
  const frontmatter = Bun.YAML.parse(match[1]) as Record<string, any>
  check(frontmatter.name === 'varg-ai', 'SKILL.md: original skill name must be retained')
  check(typeof frontmatter.description === 'string' && frontmatter.description.length > 40, 'SKILL.md: missing description')
  check(/^\d+\.\d+\.\d+$/.test(frontmatter.metadata?.version ?? '') && Number(frontmatter.metadata.version.split('.')[0]) >= 3, 'SKILL.md: MCP migration needs a version of 3.0.0 or later')
  check(!frontmatter['allowed-tools'], 'SKILL.md: legacy shell permissions remain')
  check(!frontmatter.metadata?.openclaw?.requires, 'SKILL.md: legacy runtime/credential requirements remain')
  check(/OAuth/.test(frontmatter.compatibility), 'SKILL.md: OAuth compatibility is not declared')
}
check(main.split('\n').length < 500, 'SKILL.md: exceeds 500 lines')

const endpoint = 'https://mcp.varg.ai/mcp'
const mcp = await json('.mcp.json')
check(Object.keys(mcp.mcpServers).length === 1, '.mcp.json: expected only the hosted varg server')
check(mcp.mcpServers.varg.type === 'http' && mcp.mcpServers.varg.url === endpoint, '.mcp.json: wrong hosted transport or URL')
check(!mcp.mcpServers.varg.headers && !mcp.mcpServers.varg.env && !mcp.mcpServers.varg.command, '.mcp.json: expected client-managed OAuth')

for (const path of ['.claude-plugin/plugin.json', '.cursor-plugin/plugin.json']) {
  const plugin = await json(path)
  check(plugin.name === 'varg' && plugin.license === 'MIT', `${path}: plugin identity/license mismatch`)
  check(plugin.skills?.length === 1 && plugin.skills[0] === './varg-ai', `${path}: skill path mismatch`)
  check(/MCP/.test(plugin.description) && /OAuth/.test(plugin.description), `${path}: description must explain MCP/OAuth`)
  for (const declared of plugin.skills ?? []) {
    check(await Bun.file(resolve(root, declared, 'SKILL.md')).exists(), `${path}: missing ${declared}/SKILL.md`)
  }
  if (path.startsWith('.cursor-plugin')) {
    check(plugin.mcpServers === './.mcp.json', `${path}: must explicitly reference the shared MCP configuration`)
  }
}

const catalog = await json('.claude-plugin/marketplace.json')
check(catalog.plugins?.length === 1 && catalog.plugins[0].name === 'varg', 'marketplace.json: plugin identity mismatch')
check(catalog.plugins[0].source === './', 'marketplace.json: expected root plugin source')

for (const path of [
  'varg-ai/scripts/setup.sh', 'varg-ai/scripts/setup.ts',
  'varg-ai/references/byok.md', 'varg-ai/references/local-render.md',
  'varg-ai/references/gateway-api.md',
]) {
  check(!(await Bun.file(resolve(root, path)).exists()), `${path}: retired execution surface remains`)
}

let scenarios = 0
for await (const path of new Bun.Glob('*/case.yaml').scan({ cwd: resolve(skill, 'evals'), onlyFiles: true })) {
  scenarios++
  const caseDir = resolve(skill, 'evals', dirname(path))
  const scenario = Bun.YAML.parse(await Bun.file(resolve(caseDir, 'case.yaml')).text()) as Record<string, any>
  check(scenario.schema_version === '1.1' && scenario.name === dirname(path), `${path}: invalid case metadata`)
  check(scenario.expected_outcome, `${path}: missing expected outcome`)
  check(await Bun.file(resolve(caseDir, 'prompt.md')).exists(), `${path}: missing prompt`)
  check(await Bun.file(resolve(caseDir, 'files/context.json')).exists(), `${path}: missing simulation fixture`)
  check(await Bun.file(resolve(caseDir, 'graders/01-expected-output.md')).exists(), `${path}: missing grader`)
  JSON.parse(await Bun.file(resolve(caseDir, 'files/context.json')).text())
}
check(scenarios >= 3, 'Expected realistic MCP behavioral review cases')

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`)
  process.exit(1)
}
console.log(`PASS: ${markdown.length} Markdown files, ${links} local links, ${snippets} code examples, plugin manifests, OAuth configuration, and ${scenarios} review scenarios.`)
console.log(`Checked package: ${relative(root, skill)}; no network requests or generations performed.`)
