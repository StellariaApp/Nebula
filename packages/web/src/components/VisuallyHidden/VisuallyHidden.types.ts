import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface VisuallyHiddenOwnProps extends Omit<BoxOwnProps, "component"> {
  /**
   * The element it paints. An inline `span` by default, so the text can sit inside a sentence
   * without splitting it; switch to `"div"` when the hidden content is block-level, since the
   * browser silently breaks a block element nested in a paragraph.
   * @default "span"
   */
  component?: ElementType | undefined;
}

export type VisuallyHiddenProps<C extends ElementType = "span"> = VisuallyHiddenOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof VisuallyHiddenOwnProps | "component">;
