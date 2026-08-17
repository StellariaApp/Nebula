import { createContext } from "react";

import type { ColorScheme, NebulaTheme, ThemeChoice } from "@stellaria/nebula-tokens";

export interface ThemeContextValue {
  theme: NebulaTheme;
  themeName: string;
  /**
   * Switches the active theme along either axis (ADR-166).
   *
   * - `"dark"` / `"light"` swap the scheme and **keep the identity**, which is what a product's
   *   light/dark toggle wants: staying in `rosette` without knowing what its themes are called.
   * - A `ThemeChoice` names both axes and throws when the identity is not registered.
   * - A whole `NebulaTheme` is applied as inline vars over the contract (ADR-121).
   *
   * A theme applied as inline vars is not persisted — it cannot be rebuilt from a stored name — but
   * its `meta.scheme` is, so reloading lands on the official theme of the same scheme. A registered
   * one persists both axes and comes back whole.
   */
  setTheme: (next: ColorScheme | ThemeChoice | NebulaTheme) => void;
  scheme: ColorScheme;
  systemScheme: ColorScheme | undefined;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
ThemeContext.displayName = "NebulaThemeContext";
