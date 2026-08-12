"use client";

import { Box, Loader, Text, TextInput } from "@stellaria/nebula-web";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactElement } from "react";

interface Hit {
  id: string;
  url: string;
  title: string;
  excerpt: string;
}

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
const DEBOUNCE_MS = 200;

/** Ruta servida, no modulo del bundler: se arma en runtime para que no la resuelva el empaquetador. */
const BUNDLE = ["", "pagefind", "pagefind.js"].join("/");

/**
 * El indice guarda `/guides/x/` porque Pagefind deriva la URL de un `index.html`, y el sitio sirve
 * esa ruta sin barra: sin recortarla cada resultado paga un 308 antes de pintar.
 */
function Href(url: string): string {
  return url.length > 1 && url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * El indice se carga en el primer tecleo y no antes: son ~10 kB de runtime mas los fragmentos que
 * la consulta pida, y nadie debe pagarlos por visitar una pagina (ADR-109 §4).
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

export function Search({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}): ReactElement {
  const [term, set_term] = useState("");
  const [hits, set_hits] = useState<Hit[] | null>(null);
  const [busy, set_busy] = useState(false);
  const list_id = useId();
  const run = useRef(0);
  const pathname = usePathname();

  /**
   * Se vacía al llegar a destino, no al pulsar: vaciarlo en el `onClick` desmonta el enlace en
   * mitad del clic y cancela la navegación. El cromado es un layout y no se remonta al navegar,
   * así que sin esto la consulta se quedaría escrita en la página nueva.
   */
  useEffect(() => {
    set_term("");
  }, [pathname]);

  useEffect(() => {
    const query = term.trim();
    if (query.length < 2) {
      set_hits(null);
      set_busy(false);
      return;
    }

    const ticket = ++run.current;
    set_busy(true);

    void (async () => {
      try {
        const api = await Engine();
        const found = await api.debouncedSearch(query, undefined, DEBOUNCE_MS);
        if (found === null || ticket !== run.current) return;

        const data = await Promise.all(found.results.slice(0, LIMIT).map((r) => r.data()));
        if (ticket !== run.current) return;

        set_hits(
          data.map((entry, index) => ({
            id: found.results[index]?.id ?? entry.url,
            url: Href(entry.url),
            title: entry.meta?.title ?? entry.url,
            excerpt: entry.excerpt,
          })),
        );
      } catch {
        if (ticket === run.current) set_hits([]);
      } finally {
        if (ticket === run.current) set_busy(false);
      }
    })();
  }, [term]);

  return (
    <Box position="relative">
      <TextInput
        type="search"
        size="sm"
        w={200}
        aria-label={label}
        placeholder={placeholder}
        value={term}
        role="combobox"
        aria-expanded={hits !== null}
        aria-controls={list_id}
        aria-autocomplete="list"
        onChange={(value) => {
          set_term(value);
        }}
        rightSection={busy ? <Loader size="xs" /> : undefined}
      />

      {hits === null ? null : (
        <Box
          id={list_id}
          role="listbox"
          aria-label={label}
          position="absolute"
          top="calc(100% + 8px)"
          right={0}
          z={40}
          w={380}
          maw="calc(100vw - 32px)"
          mah={420}
          overflow="auto"
          bg="surface.overlay"
          c="text.primary"
          r="md"
          p="xs"
          bd="1px solid"
          bdc="border.subtle"
          shadow="lg"
        >
          {hits.length === 0 ? (
            <Text fz="body3" c="text.muted" p="sm">
              {placeholder}
            </Text>
          ) : (
            hits.map((hit) => (
              <Box
                key={hit.id}
                component={Link}
                href={hit.url}
                role="option"
                aria-selected={false}
                display="flex"
                direction="column"
                gap="xxs"
                p="sm"
                r="sm"
                td="none"
                c="text.primary"
              >
                <Text fz="body3" fw="semibold" c="text.primary">
                  {hit.title}
                </Text>
                <Text fz="caption" c="text.muted" lines={2}>
                  {hit.excerpt.replace(/<[^>]*>/g, "")}
                </Text>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
}
