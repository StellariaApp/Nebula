import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6;

export interface TitleOwnProps extends Omit<BoxOwnProps, "component" | "order"> {
  component?: ElementType | undefined;
  /**
   * Nivel del encabezado, de 1 a 6. Tapa a proposito la style prop `order` de flex: en un titulo
   * el orden que importa es el jerarquico, y exponer las dos con el mismo nombre no serviria.
   */
  order?: TitleOrder | undefined;
}

export type TitleProps<C extends ElementType = "h1"> = TitleOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof TitleOwnProps | "component">;

/**
 * Props de una ranura que el componente pinta con un `Title`: las style props del sistema mas
 * `order`, que aqui es el NIVEL del encabezado y no el orden de flex.
 */
export type TitleSlotProps = TitleOwnProps &
  Omit<ComponentPropsWithoutRef<"h1">, keyof TitleOwnProps>;
