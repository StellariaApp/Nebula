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
  defaultTheme = "nebula-dark",
  storage,
  storageKey = "nebula-theme",
}: NebulaProviderProps): ReactNode {
  const [active, set_active] = useState<ActiveTheme>(() => Resolve(defaultTheme));
  const [system_scheme, set_system_scheme] = useState<"light" | "dark" | undefined>(undefined);

  const store = useMemo<ThemeStorage | null>(
    () => (storage === undefined ? DefaultStorage() : storage),
    [storage],
  );

  const set_theme = useCallback(
    (name: string): void => {
      if (!IsOfficialName(name)) {
        throw new Error(
          `Tema desconocido: "${name}". Temas oficiales: ${Object.keys(themeClass).join(", ")}.`,
        );
      }
      set_active(Resolve(name));
      store?.setItem(storageKey, name);
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
