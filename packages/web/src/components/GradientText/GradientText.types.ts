import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { ColorExtended, GradientRole } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";
import type { GradientProp } from "../../theme/resolve-variant.js";

export interface GradientTextOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  gradient?: GradientRole | GradientProp | undefined;
  fallbackColor?: ColorExtended | undefined;
  inherit?: boolean | undefined;
}

export type GradientTextProps<C extends ElementType = "span"> = GradientTextOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GradientTextOwnProps | "component">;
