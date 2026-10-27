#!/usr/bin/env node
// Check preset files against the documented Paper Shaders params before rendering:
// known shader, every param documented and present, numbers in range, enum values,
// color count, roles and the pinned version. Exits 1 on any error.
//
//   node scripts/validate-presets.mjs                      # every file in assets/presets
//   node scripts/validate-presets.mjs path/to/my-preset.json
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const facts = JSON.parse(readFileSync(join(root, "assets", "paper-shaders.params.json"), "utf8"));
const ROLES = new Set(["base", "ink", "accent", "accent-light", "deep", "paper", "shadow", "highlight"]);
const COLOR = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$|^(?:rgb|rgba|hsl|hsla)\(/i;

const files = process.argv.slice(2);
if (files.length === 0) {
  const dir = join(root, "assets", "presets");
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) files.push(join(dir, f));
}

let errors = 0;
for (const file of files) {
  const problems = check(JSON.parse(readFileSync(file, "utf8")));
  errors += problems.length;
  console.log(`${problems.length ? "✗" : "✓"} ${file.replace(`${root}/`, "")}`);
  for (const p of problems) console.log(`    ${p}`);
}
console.log(errors ? `${errors} problem(s)` : "all presets valid");
process.exit(errors ? 1 : 0);

function check(preset) {
  const out = [];
  for (const key of ["id", "label", "shader", "page", "paperShaders", "use", "motion", "roles", "params"]) {
    if (preset[key] === undefined) out.push(`missing "${key}"`);
  }
  const shader = facts.shaders[preset.shader];
  if (!shader) return [...out, `unknown shader "${preset.shader}"`];
  if (preset.paperShaders !== facts.paperShaders) out.push(`paperShaders is ${preset.paperShaders}, params file is ${facts.paperShaders}`);
  if (preset.page !== shader.page) out.push(`page should be ${shader.page}`);
  if (typeof preset.motion?.timeScale !== "number" || typeof preset.motion?.frame !== "number") out.push("motion needs numeric timeScale and frame");

  const spec = { ...facts.sizing, ...shader.params };
  const params = preset.params ?? {};
  for (const name of Object.keys(spec)) {
    if (!(name in params)) out.push(`param "${name}" is missing (presets list every param)`);
  }
  for (const [name, value] of Object.entries(params)) {
    const s = spec[name];
    if (!s) {
      out.push(`param "${name}" is not documented for ${preset.shader}`);
      continue;
    }
    if (s.enum && !s.enum.includes(value)) out.push(`${name}: "${value}" is not one of ${s.enum.join(", ")}`);
    if (s.type === "number" && typeof value !== "number") out.push(`${name}: expected a number`);
    if (typeof value === "number") {
      if (s.min !== undefined && value < s.min) out.push(`${name}: ${value} is below ${s.min}`);
      if (s.max !== undefined && value > s.max) out.push(`${name}: ${value} is above ${s.max}`);
      if (s.step !== undefined && !Number.isInteger(value / s.step)) out.push(`${name}: ${value} is not a multiple of ${s.step}`);
    }
    if (s.type === "string[]") {
      if (!Array.isArray(value) || value.length === 0) out.push(`${name}: expected a non-empty array`);
      else {
        if (s.maxCount && value.length > s.maxCount) out.push(`${name}: ${value.length} colors, at most ${s.maxCount}`);
        for (const c of value) if (!COLOR.test(c)) out.push(`${name}: "${c}" is not a color`);
      }
    }
    if (/^color[A-Z]/.test(name) && !COLOR.test(value)) out.push(`${name}: "${value}" is not a color`);
  }

  for (const [name, role] of Object.entries(preset.roles ?? {})) {
    if (!(name in params)) out.push(`roles.${name} has no matching param`);
    const list = Array.isArray(role) ? role : [role];
    if (Array.isArray(role) && Array.isArray(params[name]) && role.length !== params[name].length) out.push(`roles.${name} has ${role.length} entries for ${params[name].length} colors`);
    for (const r of list) if (!ROLES.has(String(r).split("@")[0])) out.push(`roles.${name}: unknown role "${r}"`);
  }
  return out;
}
