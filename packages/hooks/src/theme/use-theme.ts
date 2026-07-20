import { useContext } from "react";

import { ThemeContext, type ThemeContextValue } from "./theme-context.js";

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error("useTheme debe usarse dentro de <NebulaProvider>.");
  }
  return ctx;
}
