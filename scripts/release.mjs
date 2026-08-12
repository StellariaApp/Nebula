#!/usr/bin/env node
import { cancel, confirm, intro, isCancel, note, outro, select, spinner } from "@clack/prompts";
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

/**
 * Un solo comando de release. Pregunta el tamano del salto, redacta el resumen con Claude a partir
 * de los commits, escribe el changeset, versiona, commitea y empuja. **No publica**: eso lo hace el
 * workflow al ver que una version subio, porque `npm publish --provenance` solo funciona desde CI y
 * es lo que permite verificar que el tarball salio de este commit (ADR-134).
 *
 * `pnpm release:dry` ensena todo lo que haria sin escribir nada.
 */

/** Los publicables, en `packages/<dir>`. El paraguas no sigue el patron `nebula-<dir>`. */
const PACKAGES = [
  { dir: "tokens", name: "@stellaria/nebula-tokens" },
  { dir: "hooks", name: "@stellaria/nebula-hooks" },
  { dir: "themes", name: "@stellaria/nebula-themes" },
  { dir: "icons", name: "@stellaria/nebula-icons" },
  { dir: "web", name: "@stellaria/nebula-web" },
  { dir: "nebula", name: "@stellaria/nebula" },
];

const MODEL = "claude-haiku-4-5-20251001";
const ARGS = process.argv.slice(2);
const DRY = ARGS.some((a) => ["--dry", "--dry-run"].includes(a));

/** `--bump=minor` salta las preguntas: lo usa el ensayo y cualquier cosa sin terminal interactiva. */
const FIXED = ARGS.find((a) => a.startsWith("--bump="))?.slice("--bump=".length);

const Git = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const Run = (line) => execSync(line, { stdio: "pipe" });

function Stop(message) {
  cancel(message);
  process.exit(1);
}

/** Cancelar con Ctrl+C en cualquier pregunta sale limpio, sin dejar nada a medias. */
function Bail(value) {
  if (isCancel(value)) Stop("Cancelado. No se ha escrito nada.");
  return value;
}

/** El arbol tiene que estar limpio y al dia: se va a versionar lo que haya aqui. */
function Guard() {
  if (Git(["rev-parse", "--abbrev-ref", "HEAD"]) !== "main") {
    Stop("El release sale de `main`, y estas en otra rama.");
  }
  if (Git(["status", "--porcelain"]) !== "") {
    Stop("Hay cambios sin commitear. El release versiona lo que ya esta en el historial.");
  }
  Git(["fetch", "--tags", "--quiet"]);
  const behind = Git(["rev-list", "--count", "HEAD..origin/main"]);
  if (behind !== "0") Stop(`main va ${behind} commits por detras del remoto. Haz pull primero.`);
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
  return PACKAGES.filter((pkg) => {
    const files = Git([
      "log",
      "--name-only",
      "--pretty=format:",
      scope,
      "--",
      `packages/${pkg.dir}`,
    ]);
    return files.trim().length > 0;
  });
}

function Commits(range) {
  const log = Git(["log", "--pretty=format:%s", range ?? "HEAD"]);
  return log.length === 0 ? [] : log.split("\n").filter((line) => !line.startsWith("Merge "));
}

function Version(dir) {
  return JSON.parse(readFileSync(`packages/${dir}/package.json`, "utf8")).version;
}

/** Que version saldria de cada salto, para poder elegir viendo el numero y no adivinandolo. */
function Next(current, bump) {
  const [major = 0, minor = 0, patch = 0] = current.split(".").map(Number);
  if (bump === "major") return `${String(major + 1)}.0.0`;
  if (bump === "minor") return `${String(major)}.${String(minor + 1)}.0`;
  return `${String(major)}.${String(minor)}.${String(patch + 1)}`;
}

function Prompt(subjects, packages) {
  return [
    "Escribe las notas de release de una libreria de componentes de UI, en espanol.",
    "",
    `Paquetes que suben: ${packages.map((p) => p.name).join(", ")}.`,
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
  if (subjects.length === 0) return { text: "- Primera version publicada.", source: "sin commits" };
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
        if (typeof text === "string" && text.trim().length > 0) {
          return { text: text.trim(), source: "API de Anthropic" };
        }
      }
    } catch {
      /* la cadena sigue: el release nunca depende de que haya red. */
    }
  }

  if (HasCli()) {
    try {
      const out = execSync("claude -p", { input: prompt, encoding: "utf8" });
      if (out.trim().length > 0) return { text: out.trim(), source: "CLI de Claude" };
    } catch {
      /* idem. */
    }
  }

  return { text: Fallback(subjects), source: "fallback determinista" };
}

async function Main() {
  intro(DRY ? "  Nebula · release (ensayo)  " : "  Nebula · release  ");

  if (!DRY) Guard();

  const range = Range();
  const packages = Changed(range);
  if (packages.length === 0) Stop("Ningun paquete publicable ha cambiado desde el ultimo release.");

  const subjects = Commits(range);

  note(
    [
      `rango     ${range ?? "todo el historial"}`,
      `commits   ${String(subjects.length)}`,
      "",
      ...packages.map((pkg) => `${pkg.name.padEnd(28)} ${Version(pkg.dir)}`),
    ].join("\n"),
    `${String(packages.length)} paquetes cambiaron`,
  );

  const first = packages[0];
  const current = first === undefined ? "0.0.0" : Version(first.dir);

  const bump =
    FIXED ??
    Bail(
      await select({
        message: "Tamano del salto",
        options: [
          { value: "patch", label: `patch  → ${Next(current, "patch")}`, hint: "correcciones" },
          { value: "minor", label: `minor  → ${Next(current, "minor")}`, hint: "novedades" },
          { value: "major", label: `major  → ${Next(current, "major")}`, hint: "rompe algo" },
        ],
      }),
    );
  if (!["patch", "minor", "major"].includes(bump)) Stop("Salto no reconocido.");

  const drafting = spinner();
  drafting.start("Redactando las notas");
  const summary = await Summary(subjects, packages);
  drafting.stop(`Notas redactadas · ${summary.source}`);

  note(summary.text, "Notas del release");

  const body = [
    "---",
    ...packages.map((pkg) => `"${pkg.name}": ${bump}`),
    "---",
    "",
    summary.text,
    "",
  ].join("\n");

  if (DRY) {
    note(body, "El changeset que se escribiria");
    outro("Ensayo: no se ha escrito nada.");
    return;
  }

  const go =
    FIXED !== undefined ||
    Bail(
      await confirm({
        message: `Versionar ${String(packages.length)} paquetes a ${Next(current, bump)} y empujar?`,
        initialValue: false,
      }),
    );
  if (go !== true) Stop("Cancelado. No se ha escrito nada.");

  const working = spinner();
  working.start("Versionando");

  mkdirSync(".changeset", { recursive: true });
  writeFileSync(join(".changeset", `release-${String(Date.now())}.md`), body, "utf8");
  Run("pnpm exec changeset version");

  const versions = PACKAGES.map((pkg) => `${pkg.name}@${Version(pkg.dir)}`);
  Git(["add", "--", ".changeset", ...PACKAGES.map((pkg) => `packages/${pkg.dir}`)]);
  Git(["commit", "-m", `chore(release): ${versions.join(" · ")}`]);

  working.message("Empujando");
  Run("git push");
  working.stop("Empujado");

  note(versions.join("\n"), "Publicando");
  outro("El workflow construye desde un checkout limpio y publica con procedencia.");
}

if (!existsSync("pnpm-workspace.yaml")) {
  cancel("Corre esto desde la raiz del monorepo.");
  process.exit(1);
}
await Main();
