"use client";

import { GlobalSearch, type GlobalSearchResult } from "@stellaria/nebula-web";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, type ReactElement } from "react";

interface PagefindResult {
  id: string;
  data: () => Promise<{ url: string; meta?: { title?: string }; excerpt: string }>;
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

export interface SearchLabels {
  trigger: string;
  input: string;
  placeholder: string;
  empty: string;
  loading: string;
}

export function Search({ labels }: { labels: SearchLabels }): ReactElement {
  const [results, set_results] = useState<GlobalSearchResult[]>([]);
  const [loading, set_loading] = useState(false);
  const router = useRouter();
  const run = useRef(0);

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
          data.map((entry, index) => ({
            id: found.results[index]?.id ?? entry.url,
            title: entry.meta?.title ?? entry.url,
            description: entry.excerpt.replace(/<[^>]*>/g, ""),
            group: Group(entry.url),
            href: Href(entry.url),
          })),
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
      withTrigger
      withShortcut
      results={results}
      loading={loading}
      onQueryChange={OnQueryChange}
      onSelect={(result) => {
        if (result.href !== undefined) router.push(result.href);
      }}
      labels={labels}
    />
  );
}
