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
 * Props de una ranura que el componente pinta con un `Box`: acepta las style props del sistema
 * —`p`, `bg`, `r`, responsive incluido— y los atributos DOM del elemento. Se esparce **después** de
 * lo que calcula el componente, asi que gana el consumidor; `className` es la excepcion y se compone.
 */
export type BoxSlotProps = BoxOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof BoxOwnProps>;
