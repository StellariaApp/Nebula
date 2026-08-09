import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GlassLevel, ShadowLevel } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export type GlassFallbackSurface = "base" | "raised" | "overlay" | "sunken";

/**
 * Frosted surface built on the theme `effects.glass`.
 *
 * GUARDRAIL (docs/06 §6 and the Stellaria style research §4.5): **forbidden in dense tables, data
 * grid cells, long critical forms and precision financial views**. Its place is top bars, feature
 * cards, summary panels, empty states, onboarding, command palettes and premium drawers. It does not
 * nest: two chained `backdrop-filter` layers cost a repaint per scroll and stop reading as material.
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
