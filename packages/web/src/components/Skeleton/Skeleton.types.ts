import type { ReactNode } from "react";

import type { Unit } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export type SkeletonAnimation = "shimmer" | "pulse" | "none";

export interface SkeletonProps extends StyleProps {
  /**
   * Every line of the block. It spreads over ALL of them, and it is the route to the shape of the
   * line itself —`lineProps={{ r: "lg" }}`—: with more than one line the style props land on the
   * stack that holds them, not on the lines. With a single line there is no stack, so the style
   * props already reach it and this slot is redundant.
   */
  lineProps?: BoxSlotProps | undefined;
  loading?: boolean | undefined;
  children?: ReactNode | undefined;
  width?: Unit | undefined;
  height?: Unit | undefined;
  /** Turns the block into a circle, which is what an avatar placeholder needs. */
  circle?: boolean | undefined;
  animation?: SkeletonAnimation | undefined;
  /** How many lines the block is drawn as. Above one the last is shortened, as running text does. */
  lines?: number | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
