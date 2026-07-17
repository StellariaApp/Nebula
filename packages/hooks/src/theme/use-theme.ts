import { useContext } from "react";

import { ThemeContext, type ThemeContextValue } from "./theme-context.js";

/**
 * Acceso al tema activo y a las acciones de theming (docs/02 §4).
 * Lanza si se usa fuera de un `<NebulaProvider>`.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error("useTheme debe usarse dentro de <NebulaProvider>.");
  }
  return ctx;
}
