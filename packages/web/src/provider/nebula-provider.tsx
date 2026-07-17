"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { ThemeContext, type ThemeContextValue } from "@stellaria/nebula-hooks";
import { officialThemes } from "@stellaria/nebula-themes";
import type { NebulaTheme } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../theme/contract.css.js";
import { themeToVars } from "../theme/theme-vars.js";
import { themeClass, type OfficialThemeName } from "../theme/themes.css.js";

/** Persistencia inyectable del tema elegido (localStorage por defecto). */
export interface ThemeStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export interface NebulaProviderProps {
  children: ReactNode;
  /** Tema inicial: nombre oficial o un `NebulaTheme` dinámico. Default `nebula-light`. */
  defaultTheme?: OfficialThemeName | NebulaTheme;
  /** Storage para persistir el tema. `undefined` → localStorage si existe; `null` lo desactiva. */
  storage?: ThemeStorage | null;
  /** Clave de storage. Default `nebula-theme`. */
  storageKey?: string;
}

interface ActiveTheme {
  name: string;
  theme: NebulaTheme;
  /** Clase VE del tema oficial, o `undefined` si el tema es dinámico. */
  className: string | undefined;
  /** Vars inline del tema dinámico, o `undefined` si es oficial. */
  style: CSSProperties | undefined;
}

function isOfficialName(value: string): value is OfficialThemeName {
  return value in themeClass;
}

function resolve(input: OfficialThemeName | NebulaTheme): ActiveTheme {
  if (typeof input === "string") {
    return { name: input, theme: officialThemes[input], className: themeClass[input], style: undefined };
  }
  return {
    name: input.meta.name,
    theme: input,
    className: undefined,
    // assignInlineVars produce un objeto {--var: valor} que React 19 acepta como style.
    style: assignInlineVars(vars, themeToVars(input)),
  };
}

function defaultStorage(): ThemeStorage | null {
  if (typeof window === "undefined") return null;
  try {
    const ls = window.localStorage;
    return {
      getItem: (key) => ls.getItem(key),
      setItem: (key, value) => {
        ls.setItem(key, value);
      },
    };
  } catch {
    return null; // localStorage puede lanzar (modo privado, sandbox).
  }
}

/**
 * Provider de theming web (docs/02 §4). Aplica la clase del tema (o vars inline
 * para temas dinámicos) a un contenedor y expone el `ThemeContext` de
 * `@stellaria/nebula-hooks`. SSR-safe: no toca `window` durante el render (solo en
 * efectos); el render inicial usa `defaultTheme`, así que servidor y cliente
 * coinciden. Para eliminar el flash de `color-scheme` a nivel documento, montar
 * `<ColorSchemeScript>` en el `<head>`.
 */
export function NebulaProvider({
  children,
  defaultTheme = "nebula-light",
  storage,
  storageKey = "nebula-theme",
}: NebulaProviderProps): ReactNode {
  const [active, setActive] = useState<ActiveTheme>(() => resolve(defaultTheme));
  const [systemScheme, setSystemScheme] = useState<"light" | "dark" | undefined>(undefined);

  const store = useMemo<ThemeStorage | null>(
    () => (storage === undefined ? defaultStorage() : storage),
    [storage],
  );

  const setTheme = useCallback(
    (name: string): void => {
      if (!isOfficialName(name)) {
        throw new Error(
          `Tema desconocido: "${name}". Temas oficiales: ${Object.keys(themeClass).join(", ")}.`,
        );
      }
      setActive(resolve(name));
      store?.setItem(storageKey, name);
    },
    [store, storageKey],
  );

  // Rehidrata el tema persistido tras montar (evita mismatch de hidratación).
  useEffect(() => {
    if (!store) return;
    const saved = store.getItem(storageKey);
    if (saved !== null && isOfficialName(saved)) {
      setActive(resolve(saved));
    }
  }, [store, storageKey]);

  // Esquema del sistema (prefers-color-scheme).
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = (): void => {
      setSystemScheme(mq.matches ? "dark" : "light");
    };
    update();
    mq.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
    };
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: active.theme,
      themeName: active.name,
      setTheme,
      scheme: active.theme.meta.scheme,
      systemScheme,
    }),
    [active, setTheme, systemScheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={active.className}
        style={active.style}
        data-nebula-theme={active.name}
        data-scheme={active.theme.meta.scheme}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
