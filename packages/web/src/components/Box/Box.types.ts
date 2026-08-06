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

export type BoxSlotProps = BoxOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof BoxOwnProps>;
