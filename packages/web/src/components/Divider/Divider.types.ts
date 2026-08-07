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
  /** Las DOS lineas, la de antes y la de despues del rotulo: es el mismo elemento repetido. */
  lineProps?: BoxSlotProps | undefined;
  /** El rotulo. Solo se pinta si hay label; sin el, el divisor es una sola linea. */
  labelProps?: TextSlotProps | undefined;
  labelPosition?: DividerLabelPosition | undefined;
}

export type DividerProps<C extends ElementType = "div"> = DividerOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof DividerOwnProps | "component">;
