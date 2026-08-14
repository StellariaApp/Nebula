import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
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

const declaration = CheckDeclaration();
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

if (declaration.length + sheets.length + consumers.length === 0) {
  console.log(
    "capas ok — declaración alineada, ninguna regla fuera de capa, consumidores cableados",
  );
  process.exit(0);
}

process.exit(1);
