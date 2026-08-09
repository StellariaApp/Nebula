import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6;

export interface TitleOwnProps extends Omit<BoxOwnProps, "component" | "order"> {
  component?: ElementType | undefined;
  /**
   * Heading level, 1 to 6. It deliberately shadows the flex `order` style prop: on a title the order
   * that matters is the hierarchical one, and exposing both under the same name would serve nobody.
   */
  order?: TitleOrder | undefined;
}

export type TitleProps<C extends ElementType = "h1"> = TitleOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof TitleOwnProps | "component">;

/**
 * Props of a slot the component renders with a `Title`: the system style props plus `order`, which
 * here is the heading LEVEL and not the flex order.
 */
export type TitleSlotProps = TitleOwnProps &
  Omit<ComponentPropsWithoutRef<"h1">, keyof TitleOwnProps>;
