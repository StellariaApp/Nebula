import type { ColorScheme, NebulaTheme } from "@stellaria/nebula-tokens";

import { themeClass } from "./themes.css.js";

/**
 * The identity the two official themes share (ADR-166). Their key in `officialThemes` and in
 * `themeClass` is the scheme, not the name — `nebula` is what both of them are.
 */
export const DEFAULT_THEME = "nebula";

/**
 * A theme whose CSS already exists as a class (ADR-163), because the consumer built it with
 * `createTheme(vars, ThemeToVars(theme))` at their own build, or with `CompileTheme` at runtime.
 *
 * The provider injects nothing for these: the class already carries the 627 custom properties. It
 * only carries `theme` for the components that read it through `useTheme`.
 */
export interface MaterializedTheme {
  theme: NebulaTheme;
  className: string;
}

/** One identity, with a materialized theme per scheme. */
export type ThemeVariants = Record<ColorScheme, MaterializedTheme>;

/** What the boot script needs: the class for each scheme of each identity, and nothing else. */
export type ThemeClassMap = Record<string, Record<ColorScheme, string>>;

export const DEFAULT_CLASSES: ThemeClassMap = {
  [DEFAULT_THEME]: { dark: themeClass.dark, light: themeClass.light },
};

/**
 * Derives the boot script's map from the provider's registry, so the two cannot drift apart. The
 * official pair is always in it: a product adds identities, it does not replace Nebula's.
 */
export function ThemeScriptMap(themes: Record<string, ThemeVariants>): ThemeClassMap {
  const out: ThemeClassMap = { ...DEFAULT_CLASSES };
  for (const [name, variants] of Object.entries(themes)) {
    out[name] = { dark: variants.dark.className, light: variants.light.className };
  }
  return out;
}

/** Una clave por eje (ADR-167). `ThemeScript` y `NebulaProvider` tienen que recibir las mismas. */
export interface ThemeStorageKeys {
  theme?: string;
  scheme?: string;
}

export const DEFAULT_STORAGE_KEYS = {
  theme: "data-theme",
  scheme: "data-scheme",
} as const;
