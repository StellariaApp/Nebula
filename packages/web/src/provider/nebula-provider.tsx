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
import { Themes } from "@stellaria/nebula-themes";
import type { ColorScheme, NebulaTheme, ThemeChoice } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { domMax, LazyMotion } from "motion/react";
import { UNSAFE_PortalProvider } from "react-aria";

import { DEFAULT_STORAGE_KEYS, DEFAULT_THEME, ThemeToVars, THEME_CLASSES, vars, type MaterializedTheme, type ThemeStorageKeys, type ThemeVariants } from "@stellaria/nebula-themes/web";

export interface ThemeStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

/**
 * What can be asked for (ADR-166):
 *
 * - a scheme — `"dark"` / `"light"` — which keeps the identity and swaps only the scheme;
 * - a `ThemeChoice`, which names both axes;
 * - a whole `NebulaTheme`, applied as inline vars (ADR-121);
 * - a `MaterializedTheme`, whose CSS already exists as a class (ADR-163).
 */
export type ThemeInput = ColorScheme | ThemeChoice | NebulaTheme | MaterializedTheme;

export interface NebulaProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeInput;
  /**
   * The consumer's own themes, keyed by identity (ADR-163, ADR-166).
   *
   * Registering is what makes `setTheme({ theme, scheme })` reach them and what makes the choice
   * survive a reload. Derive `ThemeScript`'s map from this same object with `ThemeScriptMap`
   * so the two cannot drift apart.
   */
  themes?: Record<string, ThemeVariants>;
  storage?: ThemeStorage | null;
  /** Un nombre por eje (ADR-167). `ThemeScript` tiene que recibir los mismos. */
  storageKeys?: ThemeStorageKeys;
  /**
   * Where the theme is declared (ADR-117).
   *
   * - `"wrapper"` (default) declares it on the provider's own element, so the server-rendered HTML
   *   already carries it. This is what a nested provider needs — a demo with its own theme, a theme
   *   matrix — and the only mode that works without `ThemeScript`.
   * - `"root"` declares it on `<html>`. **It requires `ThemeScript` in `<head>`**: that script
   *   is what paints the theme before the first frame, and without it the page stays unstyled until
   *   hydration. In exchange there is no flash when the stored theme differs from `defaultTheme`.
   */
  applyTheme?: "wrapper" | "root";
}

interface ActiveTheme {
  name: string;
  scheme: ColorScheme;
  theme: NebulaTheme;
  className: string | undefined;
  style: CSSProperties | undefined;
}

const NO_THEMES: Record<string, ThemeVariants> = {};

function IsScheme(value: unknown): value is ColorScheme {
  return value === "dark" || value === "light";
}

function IsChoice(input: ThemeChoice | NebulaTheme | MaterializedTheme): input is ThemeChoice {
  return typeof (input as ThemeChoice).theme === "string";
}

function IsMaterialized(input: NebulaTheme | MaterializedTheme): input is MaterializedTheme {
  return "className" in input;
}

function FromOfficial(scheme: ColorScheme): ActiveTheme {
  return {
    name: DEFAULT_THEME,
    scheme,
    theme: Themes.nebula[scheme],
    className: THEME_CLASSES[scheme],
    style: undefined,
  };
}

function Resolve(
  input: ThemeInput,
  registry: Record<string, ThemeVariants>,
  current: ActiveTheme | undefined,
): ActiveTheme {
  if (IsScheme(input)) {
    const identity = current?.name ?? DEFAULT_THEME;
    const registered = registry[identity]?.[input];
    if (registered === undefined) return FromOfficial(input);
    return {
      name: identity,
      scheme: input,
      theme: registered.theme,
      className: registered.className,
      style: undefined,
    };
  }
  if (IsChoice(input)) {
    if (input.theme === DEFAULT_THEME) return FromOfficial(input.scheme);
    const registered = registry[input.theme]?.[input.scheme];
    if (registered === undefined) {
      throw new Error(
        `Tema desconocido: "${input.theme}" en esquema "${input.scheme}". Registrados: ${Object.keys(registry).join(", ") || "ninguno"}. La identidad oficial es "${DEFAULT_THEME}".`,
      );
    }
    return {
      name: input.theme,
      scheme: input.scheme,
      theme: registered.theme,
      className: registered.className,
      style: undefined,
    };
  }
  if (IsMaterialized(input)) {
    return {
      name: input.theme.meta.name,
      scheme: input.theme.meta.scheme,
      theme: input.theme,
      className: input.className,
      style: undefined,
    };
  }
  return {
    name: input.meta.name,
    scheme: input.meta.scheme,
    theme: input,
    className: undefined,
    style: assignInlineVars(vars, ThemeToVars(input)),
  };
}

/**
 * One key per axis (`nebula-theme`, `nebula-scheme`), not one key with a separator. Each axis is
 * read and written on its own, so adding one later does not reopen a format.
 */
/**
 * Writes both axes, always — including the identity of a theme applied as inline vars.
 *
 * The library cannot REBUILD that one from its name (ADR-121), which is a different thing from not
 * knowing it: `meta.name` says `lagrange` perfectly well. Blanking it destroyed the one piece the
 * consumer needed to rebuild it themselves, which is exactly what a theme panel does. Restoring
 * guards the name instead, so an identity nobody recognises falls back without taking the scheme.
 */
function Persist(store: ThemeStorage, keys: Required<ThemeStorageKeys>, active: ActiveTheme): void {
  store.setItem(keys.scheme, active.scheme);
  store.setItem(keys.theme, active.name);
}

/**
 * Reads the axes back, guarding each one on its own: an unknown identity falls back to the official
 * pair instead of losing the scheme too, and an unreadable scheme is simply not restored.
 */
function Restore(
  store: ThemeStorage,
  keys: Required<ThemeStorageKeys>,
  registry: Record<string, ThemeVariants>,
): ThemeChoice | undefined {
  const scheme = store.getItem(keys.scheme);
  if (scheme === null || !IsScheme(scheme)) return undefined;
  const theme = store.getItem(keys.theme);
  if (theme === null || theme === "" || theme === DEFAULT_THEME) {
    return { theme: DEFAULT_THEME, scheme };
  }
  if (registry[theme]?.[scheme] === undefined) return { theme: DEFAULT_THEME, scheme };
  return { theme, scheme };
}

/**
 * Lo que el script de arranque ya dejo en `<html>` (ADR-155, ADR-166).
 *
 * Adoptarlo en el estado INICIAL es lo que quita el fotograma del tema por defecto: sin esto el
 * provider nace en `defaultTheme` y solo se corrige en el efecto de restauracion, o sea despues de
 * pintar. El visitante veia nebula y un instante despues su tema.
 *
 * En el servidor no hay `document` y se cae a `defaultTheme`, que es correcto: con
 * `applyTheme="root"` el provider no marca su propio elemento, asi que no hay nada que hidratar mal.
 */
function FromDocument(registry: Record<string, ThemeVariants>): ThemeChoice | undefined {
  if (typeof document === "undefined") return undefined;
  const root = document.documentElement;
  const theme = root.getAttribute("data-theme");
  const scheme = root.getAttribute("data-scheme");
  if (theme === null || theme === "" || !IsScheme(scheme)) return undefined;
  if (theme !== DEFAULT_THEME && registry[theme]?.[scheme] === undefined) return undefined;
  return { theme, scheme };
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
  themes = NO_THEMES,
  storage,
  storageKeys,
  applyTheme = "wrapper",
}: NebulaProviderProps): ReactNode {
  const [active, set_active] = useState<ActiveTheme>(() => {
    const painted = applyTheme === "root" ? FromDocument(themes) : undefined;
    return Resolve(painted ?? defaultTheme, themes, undefined);
  });
  const [system_scheme, set_system_scheme] = useState<"light" | "dark" | undefined>(undefined);
  const [portal_node, set_portal_node] = useState<HTMLDivElement | null>(null);
  const applied_vars = useRef<string[]>([]);
  const restored = useRef(false);
  const active_ref = useRef(active);
  const on_root = applyTheme === "root";

  useEffect(() => {
    active_ref.current = active;
  }, [active]);

  const keys = useMemo(() => ({ ...DEFAULT_STORAGE_KEYS, ...storageKeys }), [storageKeys]);

  const store = useMemo<ThemeStorage | null>(
    () => (storage === undefined ? DefaultStorage() : storage),
    [storage],
  );

  const set_theme = useCallback(
    (next: ColorScheme | ThemeChoice | NebulaTheme): void => {
      const resolved = Resolve(next, themes, active_ref.current);
      set_active(resolved);
      if (store) Persist(store, keys, resolved);
    },
    [store, keys, themes],
  );

  useEffect(() => {
    if (restored.current || !store) return;
    restored.current = true;
    const choice = Restore(store, keys, themes);
    if (choice !== undefined) set_active((current) => Resolve(choice, themes, current));
  }, [store, keys, themes]);

  useEffect(() => {
    if (!on_root || typeof document === "undefined") return;
    const root = document.documentElement;
    for (const name of Object.values(THEME_CLASSES)) root.classList.remove(name);
    for (const variants of Object.values(themes)) {
      for (const entry of Object.values(variants)) root.classList.remove(entry.className);
    }
    if (active.className !== undefined) root.classList.add(active.className);
    for (const name of applied_vars.current) root.style.removeProperty(name);
    applied_vars.current = Object.keys(active.style ?? {});
    for (const [name, value] of Object.entries(active.style ?? {})) {
      root.style.setProperty(name, String(value));
    }
    root.setAttribute("data-theme", active.name);
    root.setAttribute("data-scheme", active.scheme);
    root.style.colorScheme = active.scheme;
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
      scheme: active.scheme,
      systemScheme: system_scheme,
    }),
    [active, set_theme, system_scheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={on_root ? undefined : active.className}
        style={on_root ? undefined : active.style}
        data-theme={on_root ? undefined : active.name}
        data-scheme={on_root ? undefined : active.scheme}
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
