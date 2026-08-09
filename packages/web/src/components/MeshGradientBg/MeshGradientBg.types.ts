import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GradientRole } from "@stellaria/nebula-tokens";

import type { BoxOwnProps, BoxSlotProps } from "../Box/Box.types.js";

/**
 * A mesh of radial gradients derived from the stops of `effects.gradients[gradient]`. With `grain`
 * it adds the theme noise texture: that combination is what `00-inventory` §1.15 calls
 * `GrainyGradient`.
 *
 * GUARDRAIL (docs/06 §6): background for a hero, onboarding, empty state or entry screen. It is not
 * a working background — not tables, not forms, not long-form reading.
 */
export interface MeshGradientBgOwnProps extends Omit<BoxOwnProps, "component"> {
  /**
   * The veil that dims the mesh. Only rendered with `scrim` greater than 0, which is where its
   * opacity comes from; the slot is what lets you tint it another colour without forking. The grain
   * layer has no slot: it is the texture of the effect and the theme fixes its opacity.
   */
  scrimProps?: BoxSlotProps | undefined;
  component?: ElementType | undefined;
  gradient?: GradientRole | undefined;
  grain?: boolean | undefined;
  scrim?: number | undefined;
}

export type MeshGradientBgProps<C extends ElementType = "div"> = MeshGradientBgOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof MeshGradientBgOwnProps | "component">;
