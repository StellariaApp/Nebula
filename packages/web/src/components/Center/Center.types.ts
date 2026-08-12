import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface CenterOwnProps extends Omit<BoxOwnProps, "component"> {
  /** The element it paints. `Center` only centres; the semantics are yours. @default "div" */
  component?: ElementType | undefined;
  /**
   * Centres as `inline-flex`, so the box flows inside a line instead of taking the full width.
   * Unlike `Flex`, `display` does not override it: centring is what this component is.
   * @default false
   */
  inline?: boolean | undefined;
}

export type CenterProps<C extends ElementType = "div"> = CenterOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof CenterOwnProps | "component">;
