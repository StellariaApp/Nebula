import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GradientRole } from "@stellaria/nebula-tokens";

import type { GradientProp } from "../../theme/resolve-variant.js";
import type { BoxOwnProps, BoxSlotProps } from "../Box/Box.types.js";

/**
 * A region painted with a theme gradient.
 *
 * GUARDRAIL (docs/06 §6): brand accent on a CTA, badge, header or hero. It is **not** the dominant
 * background of tables, forms or long-form reading, and it never paints primary text — `GradientText`
 * with its fallback is for that. If it will carry text, raise `scrim` until the pair is AA again.
 */
export interface GradientBackgroundOwnProps extends Omit<BoxOwnProps, "component"> {
  /**
   * The veil that dims the gradient. Only rendered with `scrim` greater than 0, which is where its
   * opacity comes from; the slot is what lets you tint it another colour without forking. The grain
   * layer has no slot: it is the texture of the effect and the theme fixes its opacity.
   */
  scrimProps?: BoxSlotProps | undefined;
  component?: ElementType | undefined;
  gradient?: GradientRole | GradientProp | undefined;
  scrim?: number | undefined;
  grain?: boolean | undefined;
}

export type GradientBackgroundProps<C extends ElementType = "div"> = GradientBackgroundOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GradientBackgroundOwnProps | "component">;
