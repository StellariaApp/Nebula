import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { ColorExtended, ShadowLevel, Variant } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export type PaperVariant = Extract<
  Variant,
  "filled" | "outline" | "light" | "glass" | "glow" | "gradient"
>;

export interface PaperOwnProps extends Omit<BoxOwnProps, "component" | "shadow" | "color"> {
  /**
   * The element it paints. `article` or `section` when the sheet is a region of its own, so the
   * elevation does not cost you the semantics. @default "div"
   */
  component?: ElementType | undefined;
  /**
   * Elevation. It reads as height, so keep it consistent with what sits around: a sheet raised
   * above its neighbours for no reason reads as an overlay. @default "none"
   */
  shadow?: ShadowLevel | "none" | undefined;
  /**
   * Draws the edge. A `variant` that already brings its own border turns it on regardless, so this
   * is only needed on the flat sheet. @default false
   */
  withBorder?: boolean | undefined;
  /**
   * The colour recipe, resolved against the theme's `variantMap` — so what `filled` or `glass`
   * looks like is the theme's call, not the component's. Without it the sheet is the plain raised
   * surface, which is the right default for a page.
   */
  variant?: PaperVariant | undefined;
  /** Which scale the `variant` paints with. Does nothing without a `variant`. */
  color?: ColorExtended | undefined;
}

export type PaperProps<C extends ElementType = "div"> = PaperOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof PaperOwnProps | "component">;
