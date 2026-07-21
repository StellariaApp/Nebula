import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export type ScrollAxis = "x" | "y" | "xy";

export interface ScrollOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  axis?: ScrollAxis | undefined;
  gutter?: boolean | undefined;
  scrollbarSize?: number | string | undefined;
}

export type ScrollProps<C extends ElementType = "div"> = ScrollOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ScrollOwnProps | "component">;
