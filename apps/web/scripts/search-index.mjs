import { execSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const BUILT = join(ROOT, ".next", "server", "app");
const STAGE = join(ROOT, ".next", "pagefind-stage");
const OUT = join(ROOT, "public", "pagefind");

const SKIP = new Set(["_global-error.html", "_not-found.html"]);

function Pages(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...Pages(path));
    else if (entry.endsWith(".html") && !SKIP.has(entry)) out.push(path);
  }
  return out;
}

/**
 * Pagefind deriva la URL de la ruta del archivo y solo recorta `index.html`, asi que un
 * `guides/x.html` quedaria indexado como `/guides/x.html` y cada resultado seria un 404. Se copia
 * a `guides/x/index.html` antes de indexar, que es la forma que da la URL que el sitio sirve.
 */
function Stage() {
  rmSync(STAGE, { recursive: true, force: true });
  const pages = Pages(BUILT);

  for (const page of pages) {
    const slug = relative(BUILT, page).replace(/\.html$/, "").split(/[\\/]/);
    const target = join(STAGE, ...slug, "index.html");
    mkdirSync(dirname(target), { recursive: true });
    cpSync(page, target);
  }
  return pages.length;
}

Stage();

/**
 * La salida se borra antes de generarla: los fragmentos llevan hash en el nombre, asi que Pagefind
 * no pisa los de la pasada anterior y el directorio acumula un fragmento por cada version que haya
 * tenido cada pagina. Se sirven todos, y quien lea el indice a mano lee el que encuentre primero.
 */
rmSync(OUT, { recursive: true, force: true });

execSync(`pagefind --site "${STAGE}" --output-path "${OUT}"`, { stdio: "inherit", cwd: ROOT });

rmSync(STAGE, { recursive: true, force: true });
