import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { TextOwnProps } from "../Text/Text.types.js";

export type AnchorUnderline = "always" | "hover" | "never";

export interface AnchorOwnProps extends Omit<TextOwnProps, "component"> {
  component?: ElementType | undefined;
  underline?: AnchorUnderline | undefined;
  external?: boolean | undefined;
}

export type AnchorProps<C extends ElementType = "a"> = AnchorOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof AnchorOwnProps | "component">;

/**
 * Props de una ranura que el componente pinta con un `Anchor`: las style props del sistema mas
 * `underline` y `external`. `component` acepta cualquier etiqueta, que es lo que permite que un
 * enlace se pinte como `button` sin forkear al componente que lo envuelve.
 */
export type AnchorSlotProps = AnchorOwnProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof AnchorOwnProps>;
