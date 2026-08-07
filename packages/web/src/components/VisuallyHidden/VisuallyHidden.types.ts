import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface VisuallyHiddenOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
}

export type VisuallyHiddenProps<C extends ElementType = "span"> = VisuallyHiddenOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof VisuallyHiddenOwnProps | "component">;
