import type { SpringName } from "@stellaria/nebula-tokens";
import type { ComponentPropsWithoutRef, CSSProperties, ElementType, Ref } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export type ScrollAxis = "x" | "y" | "xy";

export interface ScrollOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  axis?: ScrollAxis | undefined;
  gutter?: boolean | undefined;
  scrollbarSize?: number | string | undefined;
  shadows?: boolean | undefined;
  smooth?: boolean | undefined;
  momentum?: boolean | undefined;
  spring?: SpringName | undefined;
  multiplier?: number | undefined;
}

export type ScrollProps<C extends ElementType = "div"> = ScrollOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ScrollOwnProps | "component">;

export interface MomentumProps extends BoxOwnProps {
  axis: ScrollAxis;
  spring: SpringName;
  multiplier: number;
  style?: CSSProperties | undefined;
  forwardedRef?: Ref<Element> | undefined;
}
