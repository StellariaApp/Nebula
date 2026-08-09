import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GlassLevel, ShadowLevel } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export type GlassFallbackSurface = "base" | "raised" | "overlay" | "sunken";

/**
 * Superficie esmerilada sobre `effects.glass` del tema.
 *
 * GUARDRAIL (docs/06 §6 y la investigación de estilo de Stellaria §4.5): **prohibido en tablas
 * densas, celdas de data grid, formularios críticos largos y vistas financieras de precisión**.
 * Su sitio son top bars, cards destacadas, paneles resumen, empty states, onboarding, command
 * palette y drawers premium. No se anida: dos capas de `backdrop-filter` encadenadas cuestan un
 * repintado por scroll y dejan de leerse como material.
 */
export interface GlassSurfaceOwnProps extends Omit<BoxOwnProps, "component" | "shadow"> {
  component?: ElementType | undefined;
  level?: GlassLevel | undefined;
  withBorder?: boolean | undefined;
  noise?: boolean | undefined;
  shadow?: ShadowLevel | "none" | undefined;
  fallbackSurface?: GlassFallbackSurface | undefined;
}

export type GlassSurfaceProps<C extends ElementType = "div"> = GlassSurfaceOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GlassSurfaceOwnProps | "component">;
