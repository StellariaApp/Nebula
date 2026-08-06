import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface TextOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  truncate?: boolean | undefined;
  lines?: number | undefined;
  inherit?: boolean | undefined;
}

export type TextProps<C extends ElementType = "p"> = TextOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof TextOwnProps | "component">;

export type TextSlotProps = TextOwnProps &
  Omit<ComponentPropsWithoutRef<"p">, keyof TextOwnProps>;
