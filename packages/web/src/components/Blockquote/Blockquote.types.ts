import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface BlockquoteOwnProps extends Omit<BoxOwnProps, "component" | "color"> {
  component?: ElementType | undefined;
  color?: ColorExtended | undefined;
  cite?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  citeProps?: ComponentPropsWithoutRef<"cite"> | undefined;
  iconProps?: ComponentPropsWithoutRef<"span"> | undefined;
  contentProps?: ComponentPropsWithoutRef<"div"> | undefined;
}

export type BlockquoteProps<C extends ElementType = "blockquote"> = BlockquoteOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof BlockquoteOwnProps | "component">;
