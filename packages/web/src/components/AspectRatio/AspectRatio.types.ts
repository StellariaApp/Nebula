import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface AspectRatioOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  ratio?: number | undefined;
}

export type AspectRatioProps<C extends ElementType = "div"> = AspectRatioOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof AspectRatioOwnProps | "component">;
