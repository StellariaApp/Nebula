import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface FlexOwnProps extends Omit<BoxOwnProps, "component"> {
  /** The element it paints. `Flex` only sets `display`, so the semantics are yours. @default "div" */
  component?: ElementType | undefined;
  /**
   * Lays out as `inline-flex`, so the box flows inside a line of text instead of breaking it. An
   * explicit `display` beats this. @default false
   */
  inline?: boolean | undefined;
}

export type FlexProps<C extends ElementType = "div"> = FlexOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof FlexOwnProps | "component">;
