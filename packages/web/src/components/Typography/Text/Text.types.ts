import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../../Layout/Box/Box.types.js";

export interface TextOwnProps extends Omit<BoxOwnProps, "component"> {
  /** Elemento a renderizar. Default `"p"`. */
  component?: ElementType | undefined;
  /** Una línea con elipsis. Ignorado si se pasa `lines`. */
  truncate?: boolean | undefined;
  /** Recorta a N líneas con elipsis (line-clamp). */
  lines?: number | undefined;
  /** Hereda tipografía y color del contenedor en vez de imponer los suyos. */
  inherit?: boolean | undefined;
}

export type TextProps<C extends ElementType = "p"> = TextOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof TextOwnProps | "component">;
