import { createContext } from "react";

import type { ColorScheme, NebulaTheme } from "@stellaria/nebula-tokens";

export interface ThemeContextValue {
  theme: NebulaTheme;
  themeName: string;
  /**
   * Switches the active theme (ADR-121). A name resolves against the official themes and throws when
   * it is not one of them; a whole `NebulaTheme` is applied as inline vars over the contract.
   *
   * A custom theme is not persisted — it cannot be rebuilt from a stored name — but its
   * `meta.scheme` is, so reloading lands on the official theme of the same scheme.
   */
  setTheme: (next: string | NebulaTheme) => void;
  scheme: ColorScheme;
  systemScheme: ColorScheme | undefined;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
ThemeContext.displayName = "NebulaThemeContext";
