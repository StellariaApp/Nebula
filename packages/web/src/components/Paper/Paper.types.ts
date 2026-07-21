import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { RadiusName, ShadowLevel } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface PaperOwnProps extends Omit<BoxOwnProps, "component" | "shadow"> {
  component?: ElementType | undefined;
  shadow?: ShadowLevel | "none" | undefined;
  radius?: RadiusName | number | undefined;
  withBorder?: boolean | undefined;
}

export type PaperProps<C extends ElementType = "div"> = PaperOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof PaperOwnProps | "component">;
