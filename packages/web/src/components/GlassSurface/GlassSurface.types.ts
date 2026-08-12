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
  /** The element it paints. @default "div" */
  component?: ElementType | undefined;
  /**
   * Which step of the theme's `effects.glass` to take: background, border tint and backdrop filter
   * come as a set, so this is one dial and not three. It is read only while the theme keeps glass
   * enabled — with it off, `fallbackSurface` decides everything instead.
   * @default "default"
   */
  level?: GlassLevel | undefined;
  /**
   * Whether the hairline is drawn. Glass leans on its edge to read as a pane at all: without one it
   * blurs into whatever it sits on, which is why this starts on and rarely wants turning off.
   * @default true
   */
  withBorder?: boolean | undefined;
  /**
   * Adds the grain layer over the pane. It also needs the theme's glass enabled — with glass off it
   * paints nothing at all, rather than falling back to grain over the solid surface.
   * @default false
   */
  noise?: boolean | undefined;
  /** Depth of the drop shadow under the pane. @default "none" */
  shadow?: ShadowLevel | "none" | undefined;
  /**
   * The solid surface painted when the theme has `effects.glass.enabled` off. Not a nicety: on those
   * themes it is the component's entire appearance, so pick the one that belongs where the pane sits
   * rather than leaving the default to decide.
   * @default "overlay"
   */
  fallbackSurface?: GlassFallbackSurface | undefined;
}

export type GlassSurfaceProps<C extends ElementType = "div"> = GlassSurfaceOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GlassSurfaceOwnProps | "component">;
