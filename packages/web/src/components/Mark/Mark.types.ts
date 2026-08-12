import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface MarkOwnProps extends Omit<BoxOwnProps, "component" | "color"> {
  /**
   * The element it paints. A real `mark` is what tells assistive tech this run is called out, so
   * changing it turns the highlight into decoration the reader never hears about.
   * @default "mark"
   */
  component?: ElementType | undefined;
  /**
   * Which scale the highlight is drawn from — the 200 step fills the background and the 900 step
   * writes the text, which is what keeps the pair readable in any of them. Name the scale only
   * (`"success"`), never a step: `"success.500"` pins BOTH ends to that one step and the text
   * disappears into its own background.
   * @default "warning"
   */
  color?: ColorExtended | undefined;
}

export type MarkProps<C extends ElementType = "mark"> = MarkOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof MarkOwnProps | "component">;
