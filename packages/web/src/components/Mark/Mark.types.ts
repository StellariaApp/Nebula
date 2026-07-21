import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { SemanticScaleName } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface MarkOwnProps extends Omit<BoxOwnProps, "component" | "color"> {
  component?: ElementType | undefined;
  color?: SemanticScaleName | undefined;
}

export type MarkProps<C extends ElementType = "mark"> = MarkOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof MarkOwnProps | "component">;
