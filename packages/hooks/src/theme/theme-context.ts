import { createContext } from "react";

import type { ColorScheme, NebulaTheme } from "@stellaria/nebula-tokens";

export interface ThemeContextValue {
  theme: NebulaTheme;
  themeName: string;
  setTheme: (name: string) => void;
  scheme: ColorScheme;
  systemScheme: ColorScheme | undefined;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
ThemeContext.displayName = "NebulaThemeContext";
