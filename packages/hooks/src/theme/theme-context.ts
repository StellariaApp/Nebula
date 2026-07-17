import { createContext } from "react";

import type { ColorScheme, NebulaTheme } from "@stellaria/nebula-tokens";

/**
 * Contrato del contexto de theming — idéntico en web y native (docs/02 §4).
 * El objeto lo alimenta el `NebulaProvider` de cada plataforma; el hook
 * `useTheme` (aquí) lo consume sin conocer detalles de VE ni de Unistyles, de
 * modo que `@stellaria/nebula-hooks` depende solo de React + los tipos de tokens.
 */
export interface ThemeContextValue {
  /** Tema activo resuelto (objeto NebulaTheme completo, incl. data no-CSS). */
  theme: NebulaTheme;
  /** Nombre del tema activo (`theme.meta.name`). */
  themeName: string;
  /** Cambia el tema activo por nombre registrado. */
  setTheme: (name: string) => void;
  /** Esquema del tema activo. */
  scheme: ColorScheme;
  /**
   * Esquema preferido del sistema (`prefers-color-scheme`); `undefined` cuando
   * aún no se conoce (SSR / primer render antes de hidratar).
   */
  systemScheme: ColorScheme | undefined;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
ThemeContext.displayName = "NebulaThemeContext";
