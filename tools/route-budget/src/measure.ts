import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

export interface RouteMeasure {
  route: string;
  htmlBr: number;
  htmlGz: number;
  jsRaw: number;
  jsBr: number;
  jsGz: number;
  jsFiles: number;
  cssRaw: number;
  cssBr: number;
  cssGz: number;
  cssFiles: number;
  /** Lo que se descartó por ir con `noModule`: se cuenta aparte para que la exclusión se vea. */
  skipRaw: number;
  skipFiles: number;
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

/**
 * Next emite los polyfills de core-js con `noModule`, y un navegador con módulos ni siquiera los
 * pide — verificado en la traza de red del sitio desplegado. Medirlos inflaba el presupuesto de la
 * portada en 110 kB sin comprimir que nadie descarga, y peor: un cambio en ese chunk movía el gate
 * sin mover un solo byte del usuario. La cabecera del `<script>` es la única señal, porque el
 * fichero es un chunk normal en todo lo demás.
 */
const NOMODULE = /<script\b[^>]*\bnomodule\b[^>]*>/gi;

const SRC = /\bsrc="([^"]+)"/i;

function Brotli(buffer: Buffer): number {
  return brotliCompressSync(buffer, { params: { [constants.BROTLI_PARAM_QUALITY]: QUALITY } })
    .length;
}

/** Por defecto, que es lo que sirven los CDN: casa con lo transferido medido en producción al 0,5 %. */
function Gzip(buffer: Buffer): number {
  return gzipSync(buffer).length;
}

function SkippedAssets(html: string): Set<string> {
  const out = new Set<string>();
  for (const [tag] of html.matchAll(NOMODULE)) {
    const src = SRC.exec(tag)?.[1];
    if (src !== undefined) out.add(src);
  }
  return out;
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
  const cache = new Map<string, { raw: number; br: number; gz: number }>();

  const Weigh = (asset: string): { raw: number; br: number; gz: number } => {
    const known = cache.get(asset);
    if (known !== undefined) return known;
    const buffer = readFileSync(join(next, asset.replace("/_next/", "")));
    const size = { raw: buffer.length, br: Brotli(buffer), gz: Gzip(buffer) };
    cache.set(asset, size);
    return size;
  };

  return Walk(app)
    .filter((file) => !file.includes("_not-found") && !file.includes("_global-error"))
    .map((file) => {
      const html = readFileSync(file);
      const text = html.toString("utf8");
      const skipped = SkippedAssets(text);
      const assets = new Set([...text.matchAll(ASSET)].map((m) => m[1] as string));

      const measure: RouteMeasure = {
        route: RouteOf(file, app),
        htmlBr: Brotli(html),
        htmlGz: Gzip(html),
        jsRaw: 0,
        jsBr: 0,
        jsGz: 0,
        jsFiles: 0,
        cssRaw: 0,
        cssBr: 0,
        cssGz: 0,
        cssFiles: 0,
        skipRaw: 0,
        skipFiles: 0,
      };

      for (const asset of assets) {
        const { raw, br, gz } = Weigh(asset);
        if (skipped.has(asset)) {
          measure.skipRaw += raw;
          measure.skipFiles += 1;
        } else if (asset.split("?")[0]?.endsWith(".css") === true) {
          measure.cssRaw += raw;
          measure.cssBr += br;
          measure.cssGz += gz;
          measure.cssFiles += 1;
        } else {
          measure.jsRaw += raw;
          measure.jsBr += br;
          measure.jsGz += gz;
          measure.jsFiles += 1;
        }
      }

      return measure;
    })
    .sort((a, b) => a.route.localeCompare(b.route));
}
