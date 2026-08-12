import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface TextOwnProps extends Omit<BoxOwnProps, "component"> {
  /**
   * The element it paints. A paragraph by default, so use `component="span"` for text that lives
   * inside a sentence — a `<p>` nested in a `<p>` is invalid markup the browser silently splits.
   * @default "p"
   */
  component?: ElementType | undefined;
  /**
   * Cuts the text to a single line with an ellipsis. Ignored when `lines` is set, which does the
   * same thing over several lines. The full text stays in the DOM, so it is still read aloud.
   */
  truncate?: boolean | undefined;
  /**
   * Clamps the text to this many lines with an ellipsis. Beats `truncate`, and only applies above
   * zero. Needs a width to work against: inside a flex child, that usually means `miw={0}`.
   */
  lines?: number | undefined;
  /**
   * Takes family, size, weight and line height from the parent instead of the `Text` defaults. For
   * text that must sit inside a heading or a button without breaking its type.
   */
  inherit?: boolean | undefined;
}

export type TextProps<C extends ElementType = "p"> = TextOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof TextOwnProps | "component">;

/**
 * Props of a text slot the component renders with a `Text`: the system style props plus `truncate`,
 * `lines` and `inherit`. `component` accepts any tag, so a label can become another element without
 * forking the component that wraps it.
 */
export type TextSlotProps = TextOwnProps & Omit<ComponentPropsWithoutRef<"p">, keyof TextOwnProps>;
