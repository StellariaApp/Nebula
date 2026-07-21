import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6;

export interface TitleOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  order?: TitleOrder | undefined;
}

export type TitleProps<C extends ElementType = "h1"> = TitleOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof TitleOwnProps | "component">;
