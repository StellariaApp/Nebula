import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { Size, Unit } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface ContainerOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  size?: Size | Unit | undefined;
  fluid?: boolean | undefined;
}

export type ContainerProps<C extends ElementType = "div"> = ContainerOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ContainerOwnProps | "component">;
