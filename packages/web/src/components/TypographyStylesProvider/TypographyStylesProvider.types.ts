import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

/**
 * Aplica la tipografía del tema al HTML que no controla Nebula: markdown renderizado, salida del
 * `RichTextEditor`, CMS. Es el único sitio del catálogo que estiliza por selector de etiqueta.
 */
export interface TypographyStylesProviderOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
}

export type TypographyStylesProviderProps<C extends ElementType = "div"> =
  TypographyStylesProviderOwnProps & {
    component?: C;
  } & Omit<ComponentPropsWithoutRef<C>, keyof TypographyStylesProviderOwnProps | "component">;
