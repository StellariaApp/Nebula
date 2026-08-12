import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface CodeOwnProps extends Omit<BoxOwnProps, "component"> {
  /**
   * The element it paints. Left alone it follows `block`, so setting it by hand is how you keep the
   * block styling on a different tag — and how you lose the whitespace preservation that only `pre`
   * gives you.
   * @default "code"
   */
  component?: ElementType | undefined;
  /**
   * Turns the run of code into a `pre` block: line breaks and indentation survive, and long lines
   * scroll sideways instead of wrapping. An explicit `component` overrides the tag but keeps the
   * block styling. Nothing here highlights syntax — that is `CodeHighlight`.
   * @default false
   */
  block?: boolean | undefined;
}

export type CodeProps<C extends ElementType = "code"> = CodeOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof CodeOwnProps | "component">;
