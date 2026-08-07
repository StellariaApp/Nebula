import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { RadiusName, ColorExtended, ShadowLevel, Variant } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export type PaperVariant = Extract<
  Variant,
  "filled" | "outline" | "light" | "glass" | "glow" | "gradient"
>;

export interface PaperOwnProps extends Omit<BoxOwnProps, "component" | "shadow" | "color"> {
  component?: ElementType | undefined;
  shadow?: ShadowLevel | "none" | undefined;
  radius?: RadiusName | number | undefined;
  withBorder?: boolean | undefined;
  variant?: PaperVariant | undefined;
  color?: ColorExtended | undefined;
}

export type PaperProps<C extends ElementType = "div"> = PaperOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof PaperOwnProps | "component">;
