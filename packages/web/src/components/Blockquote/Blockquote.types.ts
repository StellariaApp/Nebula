import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface BlockquoteOwnProps extends Omit<BoxOwnProps, "component" | "color"> {
  component?: ElementType | undefined;
  color?: ColorExtended | undefined;
  cite?: ReactNode | undefined;
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
