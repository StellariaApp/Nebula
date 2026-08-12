import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BreakpointName, SpacingValue } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export type SimpleGridCols = number | ({ base?: number } & Partial<Record<BreakpointName, number>>);

export interface SimpleGridOwnProps extends Omit<BoxOwnProps, "component"> {
  /** The element it paints. `ul` when the grid IS a list, so the count is announced. @default "div" */
  component?: ElementType | undefined;
  /**
   * Columns of equal width. Unlike `Grid`, children declare no span: the count lives here. A number
   * applies at every width; an object sets it per breakpoint from `base` upwards. @default 1
   */
  cols?: SimpleGridCols | undefined;
  /** Gap between columns, and between rows unless `verticalSpacing` overrides it. @default "md" */
  spacing?: SpacingValue | undefined;
  /** Gap between rows when it should differ from `spacing`. Falls back to `spacing`. */
  verticalSpacing?: SpacingValue | undefined;
  /**
   * How each cell sits in its column. Cells stretch by default, so a row of cards ends up the same
   * height; anything else lets them keep their own.
   */
  justifyItems?: "start" | "center" | "end" | "stretch" | undefined;
}

export type SimpleGridProps<C extends ElementType = "div"> = SimpleGridOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof SimpleGridOwnProps | "component">;
