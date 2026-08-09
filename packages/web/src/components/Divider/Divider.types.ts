import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { BorderRole, Orientation } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

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
  /** BOTH lines, the one before and the one after the label: it is the same element repeated. */
  lineProps?: BoxSlotProps | undefined;
  /** The label. Only rendered when `label` is set; without it the divider is a single line. */
  labelProps?: TextSlotProps | undefined;
  labelPosition?: DividerLabelPosition | undefined;
}

export type DividerProps<C extends ElementType = "div"> = DividerOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof DividerOwnProps | "component">;
