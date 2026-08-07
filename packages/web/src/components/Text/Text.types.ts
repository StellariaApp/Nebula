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

/**
 * Props de una ranura de texto que el componente pinta con un `Text`: las style props del sistema
 * mas `truncate`, `lines` e `inherit`. `component` acepta cualquier etiqueta, asi que un rotulo se
 * puede convertir en otro elemento sin forkear el componente que lo envuelve.
 */
export type TextSlotProps = TextOwnProps & Omit<ComponentPropsWithoutRef<"p">, keyof TextOwnProps>;
