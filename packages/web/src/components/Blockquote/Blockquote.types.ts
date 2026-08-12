import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface BlockquoteOwnProps extends Omit<BoxOwnProps, "component" | "color"> {
  /**
   * The element it paints. It is a real `blockquote` by default, which is what marks the passage as
   * quoted rather than merely indented.
   * @default "blockquote"
   */
  component?: ElementType | undefined;
  /**
   * The accent, drawn from the 500 step of this scale. It tints the rule down the leading edge and
   * the `icon` with it — the quote's own text keeps reading as body copy either way.
   * @default "primary"
   */
  color?: ColorExtended | undefined;
  /**
   * The attribution, set apart under the quote in a `cite`. Nothing renders there without it, so
   * styling the slot through `citeProps` alone will not bring the line back.
   */
  cite?: ReactNode | undefined;
  /**
   * An opening glyph. Its presence is what switches the layout to two columns, and it is rendered
   * `aria-hidden`, so it can only ever decorate the quote — never carry part of it.
   */
  icon?: ReactNode | undefined;
  /** The attribution. Only rendered with `cite`, and it goes in a `cite`. */
  citeProps?: TextSlotProps | undefined;
  /** The glyph. Only rendered with `icon`; it is `aria-hidden`, and its presence switches the layout to two columns. */
  iconProps?: BoxSlotProps | undefined;
  /** The box wrapping `children` and the attribution. Always rendered. */
  contentProps?: BoxSlotProps | undefined;
}

export type BlockquoteProps<C extends ElementType = "blockquote"> = BlockquoteOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof BlockquoteOwnProps | "component">;
