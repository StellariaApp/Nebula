import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface BoxOwnProps extends StyleProps {
  component?: ElementType | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}

export type BoxProps<C extends ElementType = "div"> = BoxOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof BoxOwnProps | "component">;

/**
 * Props of a slot the component renders with a `Box`: it accepts the system style props — `p`, `bg`,
 * `r`, responsive included — and the DOM attributes of the element. It spreads **after** whatever the
 * component computes, so the consumer wins; `className` is the exception and composes.
 */
export type BoxSlotProps = BoxOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof BoxOwnProps>;
