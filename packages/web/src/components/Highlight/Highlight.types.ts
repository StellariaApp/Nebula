import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { SemanticScaleName } from "@stellaria/nebula-tokens";

import type { TextOwnProps } from "../Text/Text.types.js";

export interface HighlightOwnProps extends Omit<TextOwnProps, "component" | "children" | "color"> {
  component?: ElementType | undefined;
  highlight: string | string[];
  color?: SemanticScaleName | undefined;
  children?: string | undefined;
}

export type HighlightProps<C extends ElementType = "p"> = HighlightOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof HighlightOwnProps | "component">;
