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
  /** La atribucion. Solo se pinta con `cite`, y va en un `cite`. */
  citeProps?: TextSlotProps | undefined;
  /** El glifo. Solo se pinta con `icon`, va `aria-hidden` y su presencia cambia la maqueta a dos columnas. */
  iconProps?: BoxSlotProps | undefined;
  /** La caja que envuelve a `children` y a la atribucion. Se pinta siempre. */
  contentProps?: BoxSlotProps | undefined;
}

export type BlockquoteProps<C extends ElementType = "blockquote"> = BlockquoteOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof BlockquoteOwnProps | "component">;
