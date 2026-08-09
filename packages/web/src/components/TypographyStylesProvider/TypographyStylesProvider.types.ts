import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

/**
 * Applies the theme typography to HTML that Nebula does not control: rendered markdown,
 * `RichTextEditor` output, a CMS. It is the only place in the catalogue that styles by tag selector.
 */
export interface TypographyStylesProviderOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
}

export type TypographyStylesProviderProps<C extends ElementType = "div"> =
  TypographyStylesProviderOwnProps & {
    component?: C | undefined;
  } & Omit<ComponentPropsWithoutRef<C>, keyof TypographyStylesProviderOwnProps | "component">;
