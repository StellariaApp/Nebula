import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { Orientation } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface ButtonGroupOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  orientation?: Orientation | undefined;
}

export type ButtonGroupProps<C extends ElementType = "div"> = ButtonGroupOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ButtonGroupOwnProps | "component">;
