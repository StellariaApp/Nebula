import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface CenterOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  inline?: boolean | undefined;
}

export type CenterProps<C extends ElementType = "div"> = CenterOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof CenterOwnProps | "component">;
