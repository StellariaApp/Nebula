import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { SpacingValue } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface SpaceOwnProps extends Omit<BoxOwnProps, "component" | "w" | "h"> {
  /** The element it paints. @default "div" */
  component?: ElementType | undefined;
  /** Horizontal gap. Only useful between inline or flex siblings; a block box already fills its row. */
  w?: SpacingValue | undefined;
  /**
   * Vertical gap. Reach for it when the gap belongs to one spot and not to the layout — a container
   * with `gap` says the rhythm once and does not leave empty nodes in the DOM.
   */
  h?: SpacingValue | undefined;
}

export type SpaceProps<C extends ElementType = "div"> = SpaceOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof SpaceOwnProps | "component">;
