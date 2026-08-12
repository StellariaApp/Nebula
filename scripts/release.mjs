#!/usr/bin/env node
import { execFileSync, execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { join } from "node:path";
import process from "node:process";

/**
 * Un solo comando de release. Pregunta el tamano del salto, redacta el resumen con Claude a partir
 * de los commits, escribe el changeset, versiona, commitea y empuja. **No publica**: eso lo hace el
 * workflow al ver que una version subio, porque `npm publish --provenance` solo funciona desde CI y
 * es lo que permite verificar que el tarball salio de este commit (ADR-134).
 *
 * `pnpm release --dry` ensena todo lo que haria sin escribir nada.
 */

const PACKAGES = ["tokens", "hooks", "themes", "icons", "web"];
const MODEL = "claude-haiku-4-5-20251001";
const ARGS = process.argv.slice(2);
const DRY = ARGS.some((a) => ["--dry", "--dry-run"].includes(a));

/** `--bump=minor` salta la pregunta: lo usa el ensayo y cualquier cosa sin terminal interactiva. */
const FIXED = ARGS.find((a) => a.startsWith("--bump="))?.slice("--bump=".length);

const Git = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const Run = (line) => execSync(line, { stdio: "inherit" });

function Fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

/** El arbol tiene que estar limpio y en main: se va a etiquetar lo que haya aqui. */
function Guard() {
  if (Git(["rev-parse", "--abbrev-ref", "HEAD"]) !== "main") {
    Fail("release sale de `main`, y estas en otra rama.");
  }
  if (Git(["status", "--porcelain"]) !== "") {
    Fail("hay cambios sin commitear. El release versiona lo que ya esta en el historial.");
  }
  Git(["fetch", "--tags", "--quiet"]);
  const behind = Git(["rev-list", "--count", "HEAD..origin/main"]);
  if (behind !== "0") Fail(`main va ${behind} commits por detras del remoto. Haz pull primero.`);
}

/** El rango del release: desde el ultimo tag de cualquier paquete, o desde el principio. */
function Range() {
  const tags = Git(["tag", "--list", "@stellaria/*", "--sort=-creatordate"]).split("\n");
  const last = tags.find((t) => t.length > 0);
  return last === undefined ? null : `${last}..HEAD`;
}

/** Solo se versiona lo que cambio: es lo que el versionado independiente de ADR-134 quiere decir. */
function Changed(range) {
  const scope = range ?? "HEAD";
  return PACKAGES.filter((name) => {
    const files = Git(["log", "--name-only", "--pretty=format:", scope, "--", `packages/${name}`]);
    return files.trim().length > 0;
  });
}

function Commits(range) {
  const log = Git(["log", "--pretty=format:%s", range ?? "HEAD"]);
  return log.length === 0 ? [] : log.split("\n").filter((line) => !line.startsWith("Merge "));
}

function Prompt(subjects, packages) {
  return [
    "Escribe las notas de release de una libreria de componentes de UI, en espanol.",
    "",
    `Paquetes que suben: ${packages.map((p) => `@stellaria/nebula-${p}`).join(", ")}.`,
    "",
    "Reglas:",
    "- Entre dos y cinco vinetas, una linea cada una. Sin encabezados y sin preambulo.",
    "- Cada vinetas dice QUE cambia para quien consume la libreria, no que archivo se toco.",
    "- Si un cambio rompe algo, empieza esa vinetas con `BREAKING:`.",
    "- Nada de relleno: si solo hubo un cambio real, una vinetas.",
    "",
    "Commits:",
    ...subjects.map((s) => `- ${s}`),
  ].join("\n");
}

function HasCli() {
  try {
    execFileSync(process.platform === "win32" ? "where" : "which", ["claude"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/** Determinista, para cuando no hay ni key ni CLI: los asuntos convencionales ya dicen bastante. */
function Fallback(subjects) {
  const seen = new Set();
  const lines = [];
  for (const subject of subjects) {
    const match = /^(\w+)(?:\([^)]*\))?!?:\s*(.+)$/.exec(subject);
    if (match === null) continue;
    const [, kind, text] = match;
    if (!["feat", "fix", "perf"].includes(kind ?? "")) continue;
    if (seen.has(text)) continue;
    seen.add(text);
    lines.push(`- ${subject.includes("!:") ? "BREAKING: " : ""}${text}`);
    if (lines.length === 5) break;
  }
  return lines.length === 0 ? "- Mantenimiento interno." : lines.join("\n");
}

async function Summary(subjects, packages) {
  if (subjects.length === 0) return "- Primera version publicada.";
  const prompt = Prompt(subjects, packages);

  if (process.env["ANTHROPIC_API_KEY"] !== undefined) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": process.env["ANTHROPIC_API_KEY"],
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 700,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (response.ok) {
        const body = await response.json();
        const text = body.content?.[0]?.text;
        if (typeof text === "string" && text.trim().length > 0) return text.trim();
      }
      console.warn(`  la API respondio ${String(response.status)}; sigo con el fallback.`);
    } catch {
      console.warn("  no pude hablar con la API; sigo con el fallback.");
    }
  }

  if (HasCli()) {
    try {
      const out = execSync("claude -p", { input: prompt, encoding: "utf8" });
      if (out.trim().length > 0) return out.trim();
    } catch {
      console.warn("  el CLI de claude fallo; sigo con el fallback.");
    }
  }

  return Fallback(subjects);
}

async function Ask(question, options) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question(question)).trim().toLowerCase();
  rl.close();
  return options.includes(answer) ? answer : null;
}

async function Main() {
  if (!DRY) Guard();

  const range = Range();
  const packages = Changed(range);
  if (packages.length === 0) Fail("ningun paquete publicable ha cambiado desde el ultimo release.");

  const subjects = Commits(range);

  console.log(`\n  rango:    ${range ?? "todo el historial"}`);
  console.log(`  commits:  ${String(subjects.length)}`);
  console.log(`  paquetes: ${packages.map((p) => `nebula-${p}`).join(", ")}\n`);

  const bump =
    FIXED ?? (await Ask("  salto (patch / minor / major): ", ["patch", "minor", "major"]));
  if (bump === null || !["patch", "minor", "major"].includes(bump)) Fail("salto no reconocido.");

  console.log("\n  redactando el resumen…");
  const summary = await Summary(subjects, packages);
  console.log(`\n${summary}\n`);

  const body = [
    "---",
    ...packages.map((name) => `"@stellaria/nebula-${name}": ${bump}`),
    "---",
    "",
    summary,
    "",
  ].join("\n");

  if (DRY) {
    console.log("  --dry: no escribo nada. El changeset seria:\n");
    console.log(body);
    return;
  }

  if (FIXED === undefined) {
    const confirmed = await Ask("  ¿lo lanzo? (si / no): ", ["si", "no", "s", "n"]);
    if (confirmed === null || confirmed.startsWith("n")) Fail("cancelado.");
  }

  mkdirSync(".changeset", { recursive: true });
  const file = join(".changeset", `release-${String(Date.now())}.md`);
  writeFileSync(file, body, "utf8");

  Run("pnpm exec changeset version");

  const versions = PACKAGES.map((name) => {
    const json = JSON.parse(readFileSync(`packages/${name}/package.json`, "utf8"));
    return `nebula-${name}@${json.version}`;
  }).join(" · ");

  Git(["add", "--", ".changeset", ...PACKAGES.map((n) => `packages/${n}`)]);
  Git(["commit", "-m", `chore(release): ${versions}`]);
  Run("git push");

  console.log(`\n  ${versions}`);
  console.log("  empujado. El workflow construye y publica con procedencia.\n");
}

if (!existsSync("pnpm-workspace.yaml")) Fail("corre esto desde la raiz del monorepo.");
await Main();
