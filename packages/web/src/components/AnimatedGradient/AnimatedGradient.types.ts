import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GradientRole, RadiusName } from "@stellaria/nebula-tokens";

import type { GradientProp } from "../../theme/resolve-variant.js";
import type { BoxOwnProps } from "../Box/Box.types.js";

export type AnimatedGradientSpeed = "slow" | "base" | "fast";

/**
 * Gradiente ambiental en deriva lenta. La capa pintada se mueve con `transform`; el gradiente en sí
 * **no** se anima (`background-position` no es compositable — docs/03 §2).
 *
 * GUARDRAIL: un solo efecto dominante por región (docs/06 §6) y nunca detrás de lectura larga. Se
 * detiene con `prefers-reduced-motion` y con `motion.tier: "minimal"`.
 */
export interface AnimatedGradientOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  gradient?: GradientRole | GradientProp | undefined;
  radius?: RadiusName | number | undefined;
  speed?: AnimatedGradientSpeed | undefined;
  scrim?: number | undefined;
}

export type AnimatedGradientProps<C extends ElementType = "div"> = AnimatedGradientOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof AnimatedGradientOwnProps | "component">;
