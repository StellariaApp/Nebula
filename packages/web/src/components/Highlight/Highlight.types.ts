import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { TextOwnProps } from "../Text/Text.types.js";

export interface HighlightOwnProps extends Omit<TextOwnProps, "component" | "children" | "color"> {
  component?: ElementType | undefined;
  highlight: string | string[];
  color?: ColorExtended | undefined;
  children?: string | undefined;
}

export type HighlightProps<C extends ElementType = "p"> = HighlightOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof HighlightOwnProps | "component">;
