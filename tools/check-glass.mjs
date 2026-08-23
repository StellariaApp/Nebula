import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(REPO, "packages/web/src");
const COMPONENTS = join(SRC, "components");

const GLASS_API = /"glass"|glass\?:|GlassLevel/;

function Files(dir, suffix, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) Files(path, suffix, out);
    else if (path.endsWith(suffix)) out.push(path);
  }
  return out;
}

function TextOf(dir, suffix) {
  return Files(dir, suffix)
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
}

/**
 * De `backdropFilter` y `WebkitBackdropFilter` en la misma regla sobrevive UNA, la última, y el alias
 * no lo entienden Chrome ni Firefox: la superficie se queda con su fondo translúcido y sin
 * desenfoque. Pasó en `Nav` (ADR-070 §19) y otra vez en `GlassSurface` y `BlurOverlay`, a los que ese
 * mismo ADR daba por a salvo. El alias lo añade el build; no se escribe a mano.
 */
function CheckAlias() {
  return Files(SRC, ".css.ts")
    .filter((sheet) => readFileSync(sheet, "utf8").includes("WebkitBackdropFilter"))
    .map((sheet) => relative(REPO, sheet));
}

/**
 * El fondo de cristal y su desenfoque son un juego: quien ofrece cristal y solo pinta el fondo deja
 * un panel translúcido y NÍTIDO, que es peor que no ofrecerlo. Le pasaba a `Alert`.
 */
function CheckCoverage() {
  const out = [];
  for (const entry of readdirSync(COMPONENTS)) {
    const dir = join(COMPONENTS, entry);
    if (!statSync(dir).isDirectory()) continue;

    const types = join(dir, `${entry}.types.ts`);
    if (!existsSync(types) || !GLASS_API.test(readFileSync(types, "utf8"))) continue;

    const delegates = TextOf(dir, ".tsx").includes("GlassSurface");
    if (delegates || TextOf(dir, ".css.ts").includes("backdropFilter")) continue;
    out.push(entry);
  }
  return out;
}

const alias = CheckAlias();
const coverage = CheckCoverage();

if (alias.length > 0) {
  console.error(`hojas que escriben el alias -webkit-backdrop-filter (${String(alias.length)}):`);
  for (const path of alias) console.error(`  ${path}`);
  console.error("  escribirlo borra la propiedad estándar — ver GlassSurface.md");
}

if (coverage.length > 0) {
  console.error(`componentes con cristal en su API y sin desenfoque (${String(coverage.length)}):`);
  for (const name of coverage) console.error(`  ${name}`);
  console.error("  un cristal sin backdrop-filter es un panel translúcido y nítido");
}

if (alias.length + coverage.length === 0) {
  console.log("cristal ok — nadie escribe el alias y todo el que ofrece cristal lo desenfoca");
  process.exit(0);
}

process.exit(1);
