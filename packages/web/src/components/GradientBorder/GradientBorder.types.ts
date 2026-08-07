import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GradientRole, RadiusName } from "@stellaria/nebula-tokens";

import type { GradientProp } from "../../theme/resolve-variant.js";
import type { BoxOwnProps } from "../Box/Box.types.js";

export type GradientBorderSurface = "none" | "base" | "raised" | "overlay" | "sunken";

export type GradientBorderEdge = 1 | 2 | 3 | 4;

export type GradientBorderSequence = "continuous" | "spaced";

/**
 * Anillo de gradiente alrededor del contenido, sin teñir su interior.
 *
 * GUARDRAIL: es acento de marca (docs/06 §6). Un anillo por región, no uno por fila de una lista.
 */
export interface GradientBorderOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  gradient?: GradientRole | GradientProp | undefined;
  width?: number | undefined;
  radius?: RadiusName | number | undefined;
  surface?: GradientBorderSurface | undefined;
  beam?: boolean | undefined;
  edges?: readonly GradientBorderEdge[] | undefined;
  sequence?: GradientBorderSequence | undefined;
}

export type GradientBorderProps<C extends ElementType = "div"> = GradientBorderOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GradientBorderOwnProps | "component">;
