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
  /**
   * Whether the placeholder is showing. It starts ON, which is what lets the component wrap the real
   * content and swap itself out — `loading={isPending}` and no ternary at the call site.
   * @default true
   */
  loading?: boolean | undefined;
  /**
   * The real content, rendered bare once `loading` is false. It never shows underneath the
   * placeholder: the two are branches, not layers.
   */
  children?: ReactNode | undefined;
  /**
   * How wide the block is. It fills its container by default, so the width usually wants setting on
   * whatever holds it rather than here.
   * @default "100%"
   */
  width?: Unit | undefined;
  /**
   * How tall the block is. In `em` on purpose, so a placeholder standing in for text keeps the
   * height of the line it replaces and the page does not jump when the content lands.
   * @default "1em"
   */
  height?: Unit | undefined;
  /** Turns the block into a circle, which is what an avatar placeholder needs. */
  circle?: boolean | undefined;
  /**
   * How the block moves while it waits. `"none"` is not just a preference — it is what a long list
   * of skeletons wants, since a screenful of shimmer reads as noise rather than as progress.
   * @default "shimmer"
   */
  animation?: SkeletonAnimation | undefined;
  /** How many lines the block is drawn as. Above one the last is shortened, as running text does. */
  lines?: number | undefined;
  /**
   * The accessible name of the `status` region. With more than one line the lines are `aria-hidden`
   * and only the stack carries it, so the wait is announced once and not once per line. It is
   * English by default (ADR-120); translate it at the call site.
   * @default "Loading content"
   */
  label?: string | undefined;
  className?: string | undefined;
}
