"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { ThemeContext, type ThemeContextValue } from "@stellaria/nebula-hooks";
import { officialThemes } from "@stellaria/nebula-themes";
import type { NebulaTheme } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { domMax, LazyMotion } from "motion/react";
import { UNSAFE_PortalProvider } from "react-aria";

import { vars } from "../theme/contract.css.js";
import { ThemeToVars } from "../theme/theme-vars.js";
import { themeClass, type OfficialThemeName } from "../theme/themes.css.js";

export interface ThemeStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export interface NebulaProviderProps {
  children: ReactNode;
  defaultTheme?: OfficialThemeName | NebulaTheme;
  storage?: ThemeStorage | null;
  storageKey?: string;
  /**
   * Where the theme is declared (ADR-117).
   *
   * - `"wrapper"` (default) declares it on the provider's own element, so the server-rendered HTML
   *   already carries it. This is what a nested provider needs — a demo with its own theme, a theme
   *   matrix — and the only mode that works without `ColorSchemeScript`.
   * - `"root"` declares it on `<html>`. **It requires `ColorSchemeScript` in `<head>`**: that script
   *   is what paints the theme before the first frame, and without it the page stays unstyled until
   *   hydration. In exchange there is no flash when the stored theme differs from `defaultTheme`.
   */
  applyTheme?: "wrapper" | "root";
}

interface ActiveTheme {
  name: string;
  theme: NebulaTheme;
  className: string | undefined;
  style: CSSProperties | undefined;
}

function IsOfficialName(value: string): value is OfficialThemeName {
  return value in themeClass;
}

function Resolve(input: OfficialThemeName | NebulaTheme): ActiveTheme {
  if (typeof input === "string") {
    return {
      name: input,
      theme: officialThemes[input],
      className: themeClass[input],
      style: undefined,
    };
  }
  return {
    name: input.meta.name,
    theme: input,
    className: undefined,
    style: assignInlineVars(vars, ThemeToVars(input)),
  };
}

function DefaultStorage(): ThemeStorage | null {
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
    return null;
  }
}

export function NebulaProvider({
  children,
  defaultTheme = "dark",
  storage,
  storageKey = "nebula-theme",
  applyTheme = "wrapper",
}: NebulaProviderProps): ReactNode {
  const [active, set_active] = useState<ActiveTheme>(() => Resolve(defaultTheme));
  const [system_scheme, set_system_scheme] = useState<"light" | "dark" | undefined>(undefined);
  const [portal_node, set_portal_node] = useState<HTMLDivElement | null>(null);
  const applied_vars = useRef<string[]>([]);
  const on_root = applyTheme === "root";

  const store = useMemo<ThemeStorage | null>(
    () => (storage === undefined ? DefaultStorage() : storage),
    [storage],
  );

  const set_theme = useCallback(
    (next: string | NebulaTheme): void => {
      if (typeof next !== "string") {
        set_active(Resolve(next));
        store?.setItem(storageKey, next.meta.scheme);
        return;
      }
      if (!IsOfficialName(next)) {
        throw new Error(
          `Tema desconocido: "${next}". Temas oficiales: ${Object.keys(themeClass).join(", ")}.`,
        );
      }
      set_active(Resolve(next));
      store?.setItem(storageKey, next);
    },
    [store, storageKey],
  );

  useEffect(() => {
    if (!store) return;
    const saved = store.getItem(storageKey);
    if (saved !== null && IsOfficialName(saved)) {
      set_active(Resolve(saved));
    }
  }, [store, storageKey]);

  useEffect(() => {
    if (!on_root || typeof document === "undefined") return;
    const root = document.documentElement;
    for (const name of Object.values(themeClass)) root.classList.remove(name);
    if (active.className !== undefined) root.classList.add(active.className);
    for (const name of applied_vars.current) root.style.removeProperty(name);
    applied_vars.current = Object.keys(active.style ?? {});
    for (const [name, value] of Object.entries(active.style ?? {})) {
      root.style.setProperty(name, String(value));
    }
    root.setAttribute("data-nebula-theme", active.name);
    root.setAttribute("data-scheme", active.theme.meta.scheme);
    root.style.colorScheme = active.theme.meta.scheme;
  }, [on_root, active]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const Update = (): void => {
      set_system_scheme(mq.matches ? "dark" : "light");
    };
    Update();
    mq.addEventListener("change", Update);
    return () => {
      mq.removeEventListener("change", Update);
    };
  }, []);

  const GetPortalContainer = useCallback(() => portal_node, [portal_node]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: active.theme,
      themeName: active.name,
      setTheme: set_theme,
      scheme: active.theme.meta.scheme,
      systemScheme: system_scheme,
    }),
    [active, set_theme, system_scheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={on_root ? undefined : active.className}
        style={on_root ? undefined : active.style}
        data-nebula-theme={on_root ? undefined : active.name}
        data-scheme={on_root ? undefined : active.theme.meta.scheme}
      >
        <UNSAFE_PortalProvider getContainer={GetPortalContainer}>
          <LazyMotion features={domMax} strict>
            {children}
            <div ref={set_portal_node} data-nebula-portal="" />
          </LazyMotion>
        </UNSAFE_PortalProvider>
      </div>
    </ThemeContext.Provider>
  );
}
