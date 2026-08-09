import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GradientRole } from "@stellaria/nebula-tokens";

import type { GradientProp } from "../../theme/resolve-variant.js";
import type { BoxOwnProps, BoxSlotProps } from "../Box/Box.types.js";

export type AnimatedGradientSpeed = "slow" | "base" | "fast";

/**
 * Gradiente ambiental en deriva lenta. La capa pintada se mueve con `transform`; el gradiente en sí
 * **no** se anima (`background-position` no es compositable — docs/03 §2).
 *
 * GUARDRAIL: un solo efecto dominante por región (docs/06 §6) y nunca detrás de lectura larga. Se
 * detiene con `prefers-reduced-motion` y con `motion.tier: "minimal"`.
 */
export interface AnimatedGradientOwnProps extends Omit<BoxOwnProps, "component"> {
  /**
   * El velo que atenúa el gradiente. Solo se pinta con `scrim` mayor que 0, y de ahí sale su
   * opacidad; la ranura es lo que permite teñirlo de otro color sin forkear. La capa en deriva no
   * tiene ranura: es el mecanismo de la animación.
   */
  scrimProps?: BoxSlotProps | undefined;
  component?: ElementType | undefined;
  gradient?: GradientRole | GradientProp | undefined;
  speed?: AnimatedGradientSpeed | undefined;
  scrim?: number | undefined;
}

export type AnimatedGradientProps<C extends ElementType = "div"> = AnimatedGradientOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof AnimatedGradientOwnProps | "component">;
