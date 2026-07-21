import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { SpacingValue } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface GridOwnProps extends Omit<BoxOwnProps, "component" | "gap" | "wrap"> {
  component?: ElementType | undefined;
  columns?: number | undefined;
  gutter?: SpacingValue | undefined;
  grow?: boolean | undefined;
  wrap?: boolean | undefined;
}

export type GridProps<C extends ElementType = "div"> = GridOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof GridOwnProps | "component">;

export type ColSpan = number | "auto" | "content";

export interface GridColOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  span?: ColSpan | undefined;
  offset?: number | undefined;
}

export type GridColProps<C extends ElementType = "div"> = GridColOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof GridColOwnProps | "component">;
