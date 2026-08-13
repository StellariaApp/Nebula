import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { brotliCompressSync, constants } from "node:zlib";

export interface RouteMeasure {
  route: string;
  htmlBr: number;
  jsRaw: number;
  jsBr: number;
  jsFiles: number;
  cssRaw: number;
  cssBr: number;
  cssFiles: number;
}

/**
 * Calidad 5 y no 11: es la que usan los CDN para comprimir al vuelo, y el gate compara contra sí
 * mismo. Subirla daría números más bonitos y más lentos sin cambiar una sola decisión.
 */
const QUALITY = 5;

/**
 * El `[\s"']` de delante importa: sin él casa tambien `data-href`, y con `inlineCss` el `<style>`
 * lleva un `data-href` con las rutas de todas las hojas que sustituye, separadas por espacios. El
 * gate intentaba abrir esa cadena entera como un fichero.
 */
const ASSET = /[\s"'](?:href|src)="(\/_next\/static\/[^"]+)"/g;

function Brotli(buffer: Buffer): number {
  return brotliCompressSync(buffer, { params: { [constants.BROTLI_PARAM_QUALITY]: QUALITY } })
    .length;
}

function Walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) Walk(full, out);
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

/** `.next/server/app/guides/components/button.html` → `/guides/components/button`. */
function RouteOf(file: string, root: string): string {
  const rel = relative(root, file)
    .split(sep)
    .join("/")
    .replace(/\.html$/, "");
  return rel === "index" ? "/" : `/${rel}`;
}

export function MeasureRoutes(next: string): RouteMeasure[] {
  const app = join(next, "server", "app");
  const cache = new Map<string, { raw: number; br: number }>();

  const Weigh = (asset: string): { raw: number; br: number } => {
    const known = cache.get(asset);
    if (known !== undefined) return known;
    const buffer = readFileSync(join(next, asset.replace("/_next/", "")));
    const size = { raw: buffer.length, br: Brotli(buffer) };
    cache.set(asset, size);
    return size;
  };

  return Walk(app)
    .filter((file) => !file.includes("_not-found") && !file.includes("_global-error"))
    .map((file) => {
      const html = readFileSync(file);
      const assets = new Set([...html.toString("utf8").matchAll(ASSET)].map((m) => m[1] as string));

      const measure: RouteMeasure = {
        route: RouteOf(file, app),
        htmlBr: Brotli(html),
        jsRaw: 0,
        jsBr: 0,
        jsFiles: 0,
        cssRaw: 0,
        cssBr: 0,
        cssFiles: 0,
      };

      for (const asset of assets) {
        const { raw, br } = Weigh(asset);
        if (asset.split("?")[0]?.endsWith(".css") === true) {
          measure.cssRaw += raw;
          measure.cssBr += br;
          measure.cssFiles += 1;
        } else {
          measure.jsRaw += raw;
          measure.jsBr += br;
          measure.jsFiles += 1;
        }
      }

      return measure;
    })
    .sort((a, b) => a.route.localeCompare(b.route));
}
