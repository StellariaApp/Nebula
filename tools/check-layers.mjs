import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const WEB = join(REPO, "packages/web");
const SHEET = join(WEB, "styles.css");
const SOURCE = join(WEB, "src/theme/layers.css.ts");

const EMITS_RULES = /\b(style|styleVariants|recipe|globalStyle|defineProperties)\s*\(/;
const DECLARED = /globalLayer\(\s*\{\s*parent:[^}]*\}\s*,\s*"([a-z]+)"\s*\)/g;

function Sheets(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (entry !== "theme" && entry !== "__tests__") Sheets(path, out);
    } else if (path.endsWith(".css.ts") && !path.endsWith(".vars.css.ts")) {
      out.push(path);
    }
  }
  return out;
}

function CheckDeclaration() {
  const defined = [...readFileSync(SOURCE, "utf8").matchAll(DECLARED)].map((m) => m[1]);
  const listed = (/@layer\s+([^;]+);/.exec(readFileSync(SHEET, "utf8"))?.[1] ?? "")
    .split(",")
    .map((s) => s.trim().replace(/^nebula\./, ""))
    .filter(Boolean);

  if (defined.join(",") === listed.join(",")) return [];
  return [
    `layers.css.ts define [${defined.join(", ")}] y styles.css declara [${listed.join(", ")}]`,
    "  el orden de las capas sale de styles.css; si no coinciden, la que falte queda sin ordenar",
  ];
}

function CheckSheets() {
  const problems = [];
  for (const path of Sheets(join(WEB, "src"))) {
    const source = readFileSync(path, "utf8");
    if (!EMITS_RULES.test(source)) continue;
    if (/\b\w+_layer\b/.test(source)) continue;
    problems.push(relative(REPO, path).replace(/\\/g, "/"));
  }
  return problems;
}

function CheckConsumers() {
  const apps = join(REPO, "apps");
  const problems = [];

  for (const name of readdirSync(apps)) {
    const manifest = join(apps, name, "package.json");
    if (!existsSync(manifest)) continue;

    const pkg = JSON.parse(readFileSync(manifest, "utf8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (!("@stellaria/nebula-web" in deps)) continue;

    const roots = [join(apps, name, "src"), join(apps, name, ".storybook")].filter(existsSync);
    const found = roots.some(function Scan(dir) {
      return readdirSync(dir).some((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return Scan(path);
        return (
          /\.(tsx?|mjs|js)$/.test(path) &&
          readFileSync(path, "utf8").includes("@stellaria/nebula-web/styles.css")
        );
      });
    });

    if (!found) problems.push(name);
  }
  return problems;
}

const DIST = join(WEB, "dist");
const DEBT = join(REPO, "tools/check-layers.debt.json");
const LAYER_FREE = /^@(layer|keyframes|property|font-face)\b/;

function Emitted(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) Emitted(path, out);
    else if (path.endsWith(".css")) out.push(path);
  }
  return out;
}

function TopLevel(css) {
  const blocks = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < css.length; index += 1) {
    const char = css[index];
    if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        blocks.push(css.slice(start, index + 1).trim());
        start = index + 1;
      }
    } else if (char === ";" && depth === 0) start = index + 1;
  }
  return blocks;
}

function Unlayered() {
  const counts = {};
  for (const path of Emitted(DIST)) {
    const loose = TopLevel(readFileSync(path, "utf8")).filter((block) => !LAYER_FREE.test(block));
    if (loose.length > 0) counts[relative(DIST, path).replace(/\\/g, "/")] = loose.length;
  }
  return counts;
}

function CheckEmitted() {
  if (!existsSync(DIST)) return { missing: true, grown: [], shrunk: [], total: 0 };

  const counts = Unlayered();
  if (process.argv.includes("--write-debt")) {
    const sorted = Object.fromEntries(
      Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)),
    );
    writeFileSync(DEBT, `${JSON.stringify(sorted, null, 2)}\n`);
  }

  const debt = existsSync(DEBT) ? JSON.parse(readFileSync(DEBT, "utf8")) : {};
  const grown = Object.entries(counts)
    .filter(([path, count]) => count > (debt[path] ?? 0))
    .map(
      ([path, count]) => `${path}: ${String(count)} (deuda aceptada: ${String(debt[path] ?? 0)})`,
    );
  const shrunk = Object.entries(debt)
    .filter(([path, count]) => (counts[path] ?? 0) < count)
    .map(([path, count]) => `${path}: ${String(counts[path] ?? 0)} (anotadas: ${String(count)})`);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return { missing: false, grown, shrunk, total };
}

const declaration = CheckDeclaration();
const emitted = CheckEmitted();
const sheets = CheckSheets();
const consumers = CheckConsumers();

if (declaration.length > 0) {
  console.error("la declaración de capas no coincide con las capas definidas:");
  for (const line of declaration) console.error(`  ${line}`);
}

if (sheets.length > 0) {
  console.error(`hojas que emiten reglas fuera de capa (${String(sheets.length)}):`);
  for (const path of sheets) console.error(`  ${path}`);
  console.error("  una regla sin capa gana al CSS del consumidor — ver src/theme/layers.md");
}

if (consumers.length > 0) {
  console.error(`consumidores que no importan styles.css (${String(consumers.length)}):`);
  for (const name of consumers) console.error(`  apps/${name}`);
  console.error("  sin esa hoja el orden de las capas lo decide el bundler, y falla en silencio");
}

if (emitted.missing) {
  console.error("no existe packages/web/dist: el CSS emitido no se puede comprobar");
  console.error("  construye primero (pnpm build); leer solo la fuente no ve las reglas sin capa");
}

if (emitted.grown.length > 0) {
  console.error(
    `reglas emitidas fuera de capa por encima de la deuda (${String(emitted.grown.length)}):`,
  );
  for (const line of emitted.grown) console.error(`  ${line}`);
  console.error("  una regla sin capa gana a las style props y al resto del catálogo — layers.md");
}

if (emitted.shrunk.length > 0) {
  console.error(
    `la deuda de capas bajó y check-layers.debt.json no lo refleja (${String(emitted.shrunk.length)}):`,
  );
  for (const line of emitted.shrunk) console.error(`  ${line}`);
  console.error("  bájala con: node tools/check-layers.mjs --write-debt");
}

const failures =
  declaration.length +
  sheets.length +
  consumers.length +
  emitted.grown.length +
  emitted.shrunk.length +
  (emitted.missing ? 1 : 0);

if (failures === 0) {
  console.log(
    emitted.total === 0
      ? "capas ok — declaración alineada, ninguna regla fuera de capa, consumidores cableados"
      : `capas ok — declaración alineada, consumidores cableados; ${String(emitted.total)} reglas emitidas fuera de capa, todas en la deuda anotada`,
  );
  process.exit(0);
}

process.exit(1);
