#!/usr/bin/env node
import { cancel, confirm, intro, isCancel, note, outro, select, spinner } from "@clack/prompts";
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

/**
 * `--force` publica saltandose los gates: CI corre `typecheck` y `lint` y va directo al registro.
 *
 * No es un atajo de comodidad, es una salida de emergencia —una correccion que no puede esperar
 * treinta minutos de axe y regresion visual—. Se nota en TODAS partes a proposito: el tag se llama
 * `force/v<version>` y no `v<version>`, asi que en el listado de tags se ve cual se publico por la
 * via corta sin abrir nada. Los gates no se saltan por configuracion escondida: se saltan porque
 * el ref no casa con `refs/tags/v*`, que es la condicion que ya tenian.
 */
const FORCE = ARGS.includes("--force");

/** `--bump=minor` salta las preguntas: lo usa el ensayo y cualquier cosa sin terminal interactiva. */
const FIXED = ARGS.find((a) => a.startsWith("--bump="))?.slice("--bump=".length);

const Git = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();

/**
 * Como `Git` pero SIN recortar, que en el porcelain no es un detalle: la columna 1 es un espacio
 * cuando el cambio no esta indexado —que es como deja `changeset version` todo lo que toca— y
 * recortar la salida entera se lo come a la primera linea. Entonces `slice(3)` se lleva un
 * caracter de mas y el primer fichero llega mutilado: `changeset/x.md` por `.changeset/x.md`.
 */
const GitRaw = (args) => execFileSync("git", args, { encoding: "utf8" });

/**
 * La salida se captura para no romper el spinner, pero si falla se ensena: con `stdio: "pipe"` a
 * secas el error llegaba como un volcado de Buffer en vez de como el mensaje que changesets
 * escribio.
 */
function Run(line) {
  try {
    execSync(line, { stdio: "pipe" });
  } catch (error) {
    const detail = String(error?.stderr ?? error?.stdout ?? error?.message ?? "").trim();
    throw new Error(detail.length > 0 ? detail : `Fallo: ${line}`);
  }
}

function Stop(message) {
  cancel(message);
  process.exit(1);
}

/** Cancelar con Ctrl+C en cualquier pregunta sale limpio, sin dejar nada a medias. */
function Bail(value) {
  if (isCancel(value)) Stop("Cancelado. No se ha escrito nada.");
  return value;
}

/**
 * La config de changesets se valida ANTES de escribir nada. `changeset status` la lee entera, asi
 * que un `ignore` con un nombre que no existe sale aqui y no a mitad del release: el primer intento
 * real fallo justo por eso, con un changeset ya escrito en disco.
 */
function CheckConfig() {
  try {
    execSync("pnpm exec changeset status", { stdio: "pipe" });
  } catch (error) {
    const detail = String(error?.stderr ?? "").trim();
    Stop(`La configuracion de changesets no valida:

${detail}`);
  }
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

/**
 * Los paquetes van con su descripcion, no solo con su nombre. Sin eso el modelo deduce lo que hacen
 * y publica cosas falsas: en el primer ensayo dijo que el paraguas «reexporta el core», que es justo
 * lo contrario de lo que es.
 */
function Prompt(subjects, packages) {
  const described = packages.map((pkg) => {
    const json = JSON.parse(readFileSync(`packages/${pkg.dir}/package.json`, "utf8"));
    return `- ${pkg.name}: ${json.description ?? "sin descripcion"}`;
  });

  return [
    "Escribe las notas de release de una libreria de componentes de UI, en espanol.",
    "",
    "Paquetes que suben, con lo que ES cada uno. No supongas nada mas sobre ellos:",
    ...described,
    "",
    "Responde UNICAMENTE con vinetas que empiecen por `- `. Ni una frase antes ni despues:",
    "nada de razonar en voz alta, nada de explicar tus criterios, nada de encabezados. Lo que",
    "escribas se publica tal cual en el CHANGELOG y en la ficha de npm.",
    "",
    "Reglas:",
    "- Entre dos y cinco vinetas, una linea cada una.",
    "- Cada vinetas dice QUE cambia para quien consume la libreria, no que archivo se toco.",
    "- Si un cambio rompe algo, empieza esa vinetas con `BREAKING:`.",
    "- Nada de relleno: si solo hubo un cambio real, una vinetas.",
    "",
    "Commits:",
    ...subjects.map((s) => `- ${s}`),
  ].join("\n");
}

/**
 * El modelo antepone a veces un parrafo razonando —por que algo no es BREAKING, en que estado esta
 * el repo— y eso acabaria publicado en npm palabra por palabra. Se queda solo con las vinetas, que
 * es lo unico que el prompt pide: la instruccion la hace cumplir el codigo, no la buena fe.
 */
function OnlyBullets(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "));
  return lines.length === 0 ? null : lines.join("\n");
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
        const bullets = typeof text === "string" ? OnlyBullets(text) : null;
        if (bullets !== null) return { text: bullets, source: "API de Anthropic" };
      }
    } catch {
      /* la cadena sigue: el release nunca depende de que haya red. */
    }
  }

  if (HasCli()) {
    try {
      const bullets = OnlyBullets(execSync("claude -p", { input: prompt, encoding: "utf8" }));
      if (bullets !== null) return { text: bullets, source: "CLI de Claude" };
    } catch {
      /* idem. */
    }
  }

  return { text: Fallback(subjects), source: "fallback determinista" };
}

async function Main() {
  intro(
    DRY
      ? "  Nebula · release (ensayo)  "
      : FORCE
        ? "  Nebula · release (FORCE · sin gates)  "
        : "  Nebula · release  ",
  );

  if (!DRY) Guard();
  CheckConfig();

  if (FORCE) {
    note(
      [
        "CI correra typecheck y lint, y publicara.",
        "",
        "NO correran: build, test, size, slots, contrast, docs, budget,",
        "              axe sobre las stories, regresion visual.",
        "",
        "El tag se llamara force/v<version>, para que en el listado se vea",
        "cual salio por aqui sin tener que abrir Actions.",
      ].join("\n"),
      "Via rapida",
    );
  }

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
        message: FORCE
          ? `FORCE — publicar ${Next(current, bump)} sin gates, sin axe y sin regresion visual?`
          : `Versionar ${String(packages.length)} paquetes a ${Next(current, bump)} y empujar?`,
        initialValue: false,
      }),
    );
  if (go !== true) Stop("Cancelado. No se ha escrito nada.");

  const working = spinner();
  working.start("Versionando");

  mkdirSync(".changeset", { recursive: true });
  const file = join(".changeset", `release-${String(Date.now())}.md`);
  writeFileSync(file, body, "utf8");

  try {
    Run("pnpm exec changeset version");
  } catch (error) {
    rmSync(file, { force: true });
    working.stop("Fallo al versionar");
    Stop(`No se ha versionado nada y el changeset se ha retirado.

${String(error.message)}`);
  }

  /**
   * Los temas declaran su version en `meta.version`, y esa cadena vive en una constante que
   * `changeset version` no conoce. Se sincroniza aqui —no a mano— porque ya se quedo una vez en
   * `0.1.0` con el paquete publicado en `1.0.0`, y los dieciseis temas mintieron sobre su version.
   */
  /**
   * SE COMPRUEBA ANTES DE COMMITEAR, y ese orden es el arreglo.
   *
   * Estaba despues, asi que un release incoherente dejaba un `chore(release)` escrito en la rama
   * y luego se paraba — habia que deshacerlo a mano para volver a intentarlo. Aqui todavia no se
   * ha tocado git: lo unico sucio es el arbol, y `git checkout -- .` lo devuelve entero.
   *
   * Con `fixed` en la configuracion de changesets esto no deberia dispararse nunca; queda como
   * asercion, porque el tag nombra UNA version y publicar seis distintas bajo ese nombre miente.
   */
  const distinct = new Set(PACKAGES.map((pkg) => Version(pkg.dir)));
  if (distinct.size !== 1) {
    working.stop("Versiones incoherentes");
    Stop(`Los seis paquetes no comparten version: ${[...distinct].join(", ")}.

El tag que dispara la publicacion nombra una sola version, asi que con versiones
distintas mentiria. Revisa el grupo 'fixed' de .changeset/config.json: los seis
tienen que ir en el mismo.

No se ha commiteado nada: "git checkout -- ." deja el arbol como estaba.`);
  }
  const tag = `${FORCE ? "force/" : ""}v${[...distinct][0]}`;

  const themes_version = Version("themes");
  const version_file = join("packages", "themes", "src", "version.ts");
  writeFileSync(
    version_file,
    readFileSync(version_file, "utf8").replace(
      /export const THEME_VERSION = "[^"]*";/,
      `export const THEME_VERSION = "${themes_version}";`,
    ),
    "utf8",
  );

  const versions = PACKAGES.map((pkg) => `${pkg.name}@${Version(pkg.dir)}`);

  /**
   * Se commitea lo que `changeset version` toco, no una lista escrita a mano: el arbol estaba
   * limpio antes (lo exige `Guard`), asi que todo lo que este sucio ahora lo escribio el. Con una
   * lista fija se quedaron fuera los `tools/` que changesets subio por ser dependientes.
   */
  const touched = GitRaw(["status", "--porcelain"])
    .split("\n")
    .map((line) => line.slice(3).trim())
    .filter((line) => line.length > 0);

  if (touched.length === 0) Stop("`changeset version` no cambio nada. Revisa la configuracion.");

  Git(["add", "--", ...touched]);
  Git(["commit", "-m", `chore(release): ${versions.join(" · ")}`]);

  /**
   * Los tags salen de aqui, no de CI, y son el disparador de la publicacion (ADR-176).
   *
   * `changeset tag` pone uno por paquete —`@stellaria/nebula-web@1.0.0`—, que es lo que `Range()`
   * lee para saber desde donde redactar el siguiente changelog. La 1.0.0 salio sin ellos y el
   * release siguiente habria vuelto a recorrer el historial entero.
   *
   * Encima va uno anotado, `v<version>`, que es el que dispara el workflow. Anotado a proposito:
   * `git push --follow-tags` empuja SOLO los anotados, y los de changeset son ligeros. Por eso el
   * paso que CI tenia para empujarlos no empujaba nada y salia verde igual.
   */

  /*
   * EL TAG DISPARADOR VIAJA SOLO, Y ESTO NO ES ESTILO.
   *
   * GitHub lo dice con todas las letras: «An event will not be created when you create more than
   * three tags at once». `git push --tags` subia los seis de changeset MAS `v<version>` en una
   * sola operacion —siete—, asi que no se creaba evento, no nacia ningun run y la publicacion no
   * ocurria. Sin nada en rojo: el tag quedaba en el remoto, el workflow era correcto, y en Actions
   * no habia run que mirar. La 1.1.0 se quedo sin publicar exactamente asi.
   *
   * El orden importa. Los de changeset van primero —son los que `Range()` lee y no disparan nada—
   * y el anotado se crea DESPUES, para que `--tags` no se lo lleve por delante, y viaja en su
   * propio empuje: uno es uno, y uno si crea evento.
   */
  Run("pnpm exec changeset tag");

  working.message("Empujando");
  Run("git push");
  Run("git push --tags");

  Git(["tag", "-a", tag, "-m", `Nebula ${tag}`]);
  Git(["push", "origin", tag]);
  working.stop(`Empujado, con el tag ${tag} en su propio empuje`);

  note(versions.join("\n"), "Publicando");
  outro("El workflow construye desde un checkout limpio y publica con procedencia.");
}

if (!existsSync("pnpm-workspace.yaml")) {
  cancel("Corre esto desde la raiz del monorepo.");
  process.exit(1);
}
await Main();
