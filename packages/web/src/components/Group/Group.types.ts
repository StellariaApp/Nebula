import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { SpacingValue } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface GroupOwnProps extends Omit<BoxOwnProps, "component" | "gap" | "wrap"> {
  /** The element it paints. @default "div" */
  component?: ElementType | undefined;
  /** Gap between children, horizontal and vertical once they wrap. @default "md" */
  gap?: SpacingValue | undefined;
  /** Wraps children that do not fit onto the next line instead of shrinking them. @default true */
  wrap?: boolean | undefined;
  /** Makes every child take the same share of the width, whatever its content. @default false */
  grow?: boolean | undefined;
  /**
   * With `grow`, caps each child so a long one cannot push the row past its container. Turn it off
   * only when you want the row to overflow on purpose. Does nothing without `grow`. @default true
   */
  preventGrowOverflow?: boolean | undefined;
}

export type GroupProps<C extends ElementType = "div"> = GroupOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GroupOwnProps | "component">;
