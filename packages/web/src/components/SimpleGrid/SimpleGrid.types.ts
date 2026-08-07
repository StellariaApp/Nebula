import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BreakpointName, SpacingValue } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export type SimpleGridCols = number | ({ base?: number } & Partial<Record<BreakpointName, number>>);

export interface SimpleGridOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  cols?: SimpleGridCols | undefined;
  spacing?: SpacingValue | undefined;
  verticalSpacing?: SpacingValue | undefined;
  justifyItems?: "start" | "center" | "end" | "stretch" | undefined;
}

export type SimpleGridProps<C extends ElementType = "div"> = SimpleGridOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof SimpleGridOwnProps | "component">;
