import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { SemanticScaleName } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface BlockquoteOwnProps extends Omit<BoxOwnProps, "component" | "color"> {
  component?: ElementType | undefined;
  color?: SemanticScaleName | undefined;
  cite?: ReactNode | undefined;
  icon?: ReactNode | undefined;
}

export type BlockquoteProps<C extends ElementType = "blockquote"> = BlockquoteOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof BlockquoteOwnProps | "component">;
