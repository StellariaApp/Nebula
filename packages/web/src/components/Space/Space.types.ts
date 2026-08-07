import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { SpacingValue } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface SpaceOwnProps extends Omit<BoxOwnProps, "component" | "w" | "h"> {
  component?: ElementType | undefined;
  w?: SpacingValue | undefined;
  h?: SpacingValue | undefined;
}

export type SpaceProps<C extends ElementType = "div"> = SpaceOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof SpaceOwnProps | "component">;
