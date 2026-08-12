import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { SpacingValue } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface GridOwnProps extends Omit<BoxOwnProps, "component" | "gap" | "wrap"> {
  /** The element it paints. @default "div" */
  component?: ElementType | undefined;
  /**
   * How many columns a full row spans. It is the unit `Grid.Col`'s `span` counts against, so
   * changing it rescales every child at once. @default 12
   */
  columns?: number | undefined;
  /** Gap between columns and rows. Replaces `gap`, which `Grid` does not accept. @default "md" */
  gutter?: SpacingValue | undefined;
  /**
   * Lets the columns of the last row stretch to fill it instead of leaving a gap on the end.
   * Only affects a row that did not fill up. @default false
   */
  grow?: boolean | undefined;
  /**
   * Wraps columns that do not fit onto the next row. Turn it off and they shrink instead, which is
   * what you want for a row that must stay one line. @default true
   */
  wrap?: boolean | undefined;
}

export type GridProps<C extends ElementType = "div"> = GridOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GridOwnProps | "component">;

export type ColSpan = number | "auto" | "content";

export interface GridColOwnProps extends Omit<BoxOwnProps, "component"> {
  /** The element it paints. @default "div" */
  component?: ElementType | undefined;
  /**
   * How many of the grid's `columns` it takes. `"auto"` shares the free space with its siblings and
   * `"content"` takes only what its content needs, so neither counts against `columns`.
   * @default "auto"
   */
  span?: ColSpan | undefined;
  /** Empty columns left before it, to push it right without an empty `Grid.Col`. @default 0 */
  offset?: number | undefined;
}

export type GridColProps<C extends ElementType = "div"> = GridColOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GridColOwnProps | "component">;
