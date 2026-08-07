import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface FlexOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  inline?: boolean | undefined;
}

export type FlexProps<C extends ElementType = "div"> = FlexOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof FlexOwnProps | "component">;
