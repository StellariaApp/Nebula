import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GradientRole } from "@stellaria/nebula-tokens";

import { type GradientProp } from "@stellaria/nebula-themes/web";
import type { BoxOwnProps, BoxSlotProps } from "../Box/Box.types.js";

export type AnimatedGradientSpeed = "slow" | "base" | "fast";

/**
 * Ambient gradient in slow drift. The painted layer moves with `transform`; the gradient itself is
 * **not** animated (`background-position` is not compositable — docs/03 §2).
 *
 * GUARDRAIL: one dominant effect per region (docs/06 §6), and never behind long-form reading. It
 * stops with `prefers-reduced-motion` and with `motion.tier: "minimal"`.
 */
export interface AnimatedGradientOwnProps extends Omit<BoxOwnProps, "component"> {
  /**
   * The veil that dims the gradient. Only rendered with `scrim` greater than 0, which is where its
   * opacity comes from; the slot is what lets you tint it another colour without forking. The
   * drifting layer has no slot: it is the mechanism of the animation.
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
