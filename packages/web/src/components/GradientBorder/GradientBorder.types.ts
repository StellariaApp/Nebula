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
  component?: ElementType | undefined;
  gradient?: GradientRole | GradientProp | undefined;
  width?: number | undefined;
  surface?: GradientBorderSurface | undefined;
  beam?: boolean | undefined;
  /** @default [1, 2, 3, 4] */
  edges?: readonly GradientBorderEdge[] | undefined;
  sequence?: GradientBorderSequence | undefined;
}

export type GradientBorderProps<C extends ElementType = "div"> = GradientBorderOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GradientBorderOwnProps | "component">;
