"use client";

import { GlobalSearch, type GlobalSearchResult } from "@stellaria/nebula-web";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState, type ReactElement } from "react";

interface PagefindResult {
  id: string;
  data: () => Promise<{
    url: string;
    meta?: { title?: string; summary?: string };
    excerpt: string;
  }>;
}

interface PagefindApi {
  init?: () => Promise<void>;
  debouncedSearch: (
    term: string,
    options?: unknown,
    delay?: number,
  ) => Promise<{ results: PagefindResult[] } | null>;
}

const LIMIT = 8;
const MIN_QUERY = 2;

/** Ruta servida, no modulo del bundler: se arma en runtime para que no la resuelva el empaquetador. */
const BUNDLE = ["", "pagefind", "pagefind.js"].join("/");

/**
 * El indice se carga en la primera consulta y no antes: son ~10 kB de runtime mas los fragmentos que
 * la busqueda pida, y nadie debe pagarlos por visitar una pagina (ADR-109 §4).
 */
let engine: Promise<PagefindApi> | null = null;

function Engine(): Promise<PagefindApi> {
  engine ??= (import(/* webpackIgnore: true */ BUNDLE) as Promise<PagefindApi>)
    .then(async (api) => {
      await api.init?.();
      return api;
    })
    .catch((error: unknown) => {
      engine = null;
      throw error;
    });
  return engine;
}

/**
 * El indice guarda `/guides/x/` porque Pagefind deriva la URL de un `index.html`, y el sitio sirve
 * esa ruta sin barra: sin recortarla cada resultado paga un 308 antes de pintar.
 */
function Href(url: string): string {
  return url.length > 1 && url.endsWith("/") ? url.slice(0, -1) : url;
}

/** La seccion a la que pertenece el resultado, que es lo que agrupa la lista. */
function Group(url: string): string {
  const parts = url.split("/").filter((part) => part.length > 0);
  return parts[1] ?? "";
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

const MAX_SUMMARY = 120;

/**
 * El extracto de Pagefind viene como HTML —con `<mark>` en la coincidencia y las entidades sin
 * decodificar—, asi que sin esto un resultado de `Rating` se leia literalmente `&lt;Star /&gt;`.
 * Se prefiere el resumen de la pagina, que es una frase escrita a proposito, y el extracto solo
 * queda de red por si la pagina no declara ninguno.
 */
function Summary(meta: { summary?: string } | undefined, excerpt: string, title: string): string {
  const source = meta?.summary ?? excerpt;
  const clean = source
    .replace(/<[^>]*>/g, "")
    .replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (found) => ENTITIES[found] ?? found)
    .replace(/\s+/g, " ")
    .trim();

  /** El `h1` abre el cuerpo, asi que el extracto empieza repitiendo el titulo del propio resultado. */
  const text = clean.startsWith(`${title}.`) ? clean.slice(title.length + 1).trim() : clean;

  if (text.length <= MAX_SUMMARY) return text;
  const cut = text.slice(0, MAX_SUMMARY);
  const space = cut.lastIndexOf(" ");
  return `${space > 60 ? cut.slice(0, space) : cut}…`;
}

/**
 * Lo que la lista ofrece con el campo vacio. Es una seleccion a mano de por donde se entra al
 * catalogo, no una medida de uso: nadie ha instrumentado el sitio todavia.
 */
const FREQUENT: readonly { name: string; slug: string; summary: string }[] = [
  { name: "Button", slug: "button", summary: "The action of a form, a dialog or a page." },
  {
    name: "TextInput",
    slug: "text-input",
    summary: "The text field, with its label and its error.",
  },
  { name: "Select", slug: "select", summary: "Pick one option from a closed list." },
  { name: "Modal", slug: "modal", summary: "The dialog that takes over the page." },
  { name: "Card", slug: "card", summary: "The sheet that groups a piece of content." },
  { name: "Table", slug: "table", summary: "Rows and columns, before reaching for DataGrid." },
];

export interface SearchLabels {
  trigger: string;
  input: string;
  placeholder: string;
  empty: string;
  loading: string;
  frequent: string;
}

export function Search({ labels }: { labels: SearchLabels }): ReactElement {
  const [results, set_results] = useState<GlobalSearchResult[]>([]);
  const [loading, set_loading] = useState(false);
  const router = useRouter();
  const run = useRef(0);

  const frequent = useMemo<GlobalSearchResult[]>(
    () =>
      FREQUENT.map((entry) => ({
        id: entry.slug,
        title: entry.name,
        description: entry.summary,
        group: labels.frequent,
        href: `/guides/components/${entry.slug}`,
      })),
    [labels.frequent],
  );

  const OnQueryChange = useCallback((query: string) => {
    const term = query.trim();
    const ticket = ++run.current;

    if (term.length < MIN_QUERY) {
      set_results([]);
      set_loading(false);
      return;
    }
    set_loading(true);

    void (async () => {
      try {
        const api = await Engine();
        const found = await api.debouncedSearch(term);
        if (found === null || ticket !== run.current) return;

        const data = await Promise.all(found.results.slice(0, LIMIT).map((r) => r.data()));
        if (ticket !== run.current) return;

        set_results(
          data.map((entry, index) => {
            const title = entry.meta?.title ?? entry.url;
            return {
              id: found.results[index]?.id ?? entry.url,
              title,
              description: Summary(entry.meta, entry.excerpt, title),
              group: Group(entry.url),
              href: Href(entry.url),
            };
          }),
        );
      } catch {
        if (ticket === run.current) set_results([]);
      } finally {
        if (ticket === run.current) set_loading(false);
      }
    })();
  }, []);

  return (
    <GlobalSearch
      h="40px"
      miw="200px"
      withTrigger
      withShortcut
      results={results}
      recent={frequent}
      loading={loading}
      onQueryChange={OnQueryChange}
      onSelect={(result) => {
        if (result.href !== undefined) router.push(result.href);
      }}
      labels={labels}
    />
  );
}
