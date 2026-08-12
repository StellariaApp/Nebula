import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { TextOwnProps } from "../Text/Text.types.js";

export interface HighlightOwnProps extends Omit<TextOwnProps, "component" | "children" | "color"> {
  /**
   * The element wrapping the whole run of text; the matches themselves are always `mark`.
   * @default "p"
   */
  component?: ElementType | undefined;
  /**
   * What to mark. Matching is case-insensitive and lands anywhere, including inside a word, so a
   * short term marks more than you expect. Regex characters are escaped, which makes a raw search
   * box safe to pipe in here; empty strings are dropped, and an empty array marks nothing.
   */
  highlight: string | string[];
  /**
   * Passed on to the `mark` around every match. It tints the matches only — the rest of the text
   * keeps the colour it inherits.
   * @default "warning"
   */
  color?: ColorExtended | undefined;
  /**
   * Plain text, not nodes: the component splits this string to wrap the matches, so anything with
   * markup in it would be torn apart. That is why the type narrows here and why formatting inside
   * the highlighted text is not possible.
   */
  children?: string | undefined;
}

export type HighlightProps<C extends ElementType = "p"> = HighlightOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof HighlightOwnProps | "component">;
