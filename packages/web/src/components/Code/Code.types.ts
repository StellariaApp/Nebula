import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface CodeOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  block?: boolean | undefined;
}

export type CodeProps<C extends ElementType = "code"> = CodeOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof CodeOwnProps | "component">;
