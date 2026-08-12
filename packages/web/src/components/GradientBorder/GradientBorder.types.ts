import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GradientRole } from "@stellaria/nebula-tokens";

import type { GradientProp } from "../../theme/resolve-variant.js";
import type { BoxOwnProps } from "../Box/Box.types.js";

export type GradientBorderSurface = "none" | "base" | "raised" | "overlay" | "sunken";

export type GradientBorderEdge = 1 | 2 | 3 | 4;

export type GradientBorderSequence = "continuous" | "spaced";

/**
 * A gradient ring around the content, without tinting its inside.
 *
 * GUARDRAIL: it is a brand accent (docs/06 §6). One ring per region, not one per row of a list.
 */
export interface GradientBorderOwnProps extends Omit<BoxOwnProps, "component"> {
  /** The element it paints. @default "div" */
  component?: ElementType | undefined;
  /**
   * A theme gradient role, or a literal `{ from, to }` pair. With `beam` running it stops painting
   * the ring — the ring drops to the plain border colour and the gradient moves into the travelling
   * arc, which is the only way the arc is visible against it.
   * @default "brand"
   */
  gradient?: GradientRole | GradientProp | undefined;
  /** Thickness of the ring, as a raw length. @default 1 */
  width?: number | undefined;
  /**
   * What fills the inside of the ring. `"none"` leaves it transparent, which is what keeps this a
   * ring drawn around existing content rather than a card with a gradient edge.
   * @default "none"
   */
  surface?: GradientBorderSurface | undefined;
  /**
   * Sends an arc travelling around the ring. It needs the theme's `motion.tier` above `minimal` and
   * at least one edge left in `edges`; failing either, the static gradient ring is what you get.
   * @default false
   */
  beam?: boolean | undefined;
  /**
   * Which sides the beam lights, clockwise from the top. Read only while `beam` runs — on a static
   * ring the gradient always goes all the way round.
   * @default [1, 2, 3, 4]
   */
  edges?: readonly GradientBorderEdge[] | undefined;
  /**
   * How the arcs are spaced in time. `"continuous"` chains them back to back over the edges that are
   * lit, so the beam never breaks; `"spaced"` keeps every edge in its own quarter of the cycle, so
   * dropping one leaves a gap rather than closing it up.
   * @default "continuous"
   */
  sequence?: GradientBorderSequence | undefined;
}

export type GradientBorderProps<C extends ElementType = "div"> = GradientBorderOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GradientBorderOwnProps | "component">;
