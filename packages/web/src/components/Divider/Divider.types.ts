import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { BorderRole, Orientation } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export type DividerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type DividerStyle = "solid" | "dashed" | "dotted";
export type DividerLabelPosition = "left" | "center" | "right";

export interface DividerOwnProps extends Omit<BoxOwnProps, "component" | "color"> {
  component?: ElementType | undefined;
  orientation?: Orientation | undefined;
  size?: DividerSize | number | undefined;
  lineStyle?: DividerStyle | undefined;
  color?: BorderRole | undefined;
  label?: ReactNode | undefined;
  labelPosition?: DividerLabelPosition | undefined;
}

export type DividerProps<C extends ElementType = "div"> = DividerOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof DividerOwnProps | "component">;
