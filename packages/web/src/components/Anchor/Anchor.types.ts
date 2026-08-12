import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { TextOwnProps } from "../Text/Text.types.js";

export type AnchorUnderline = "always" | "hover" | "never";

export interface AnchorOwnProps extends Omit<TextOwnProps, "component"> {
  /**
   * The element it paints, and the seam where a router plugs in: pass your framework's link
   * component (`component={NextLink}`) and its own props travel through untouched. It is why the
   * core carries no router dependency.
   * @default "a"
   */
  component?: ElementType | undefined;
  /**
   * When the underline shows. It is on always because the link has to be tellable from body text
   * without relying on colour; `"hover"` and `"never"` move that job onto something else, and the
   * surrounding design has to provide it.
   * @default "always"
   */
  underline?: AnchorUnderline | undefined;
  /**
   * Opens in a new tab and adds `rel="noopener noreferrer"` in the same move — the two go together
   * so an external target can never reach `window.opener`. Both are spread before the rest, so an
   * explicit `target` or `rel` of your own still wins.
   * @default false
   */
  external?: boolean | undefined;
}

export type AnchorProps<C extends ElementType = "a"> = AnchorOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof AnchorOwnProps | "component">;

/**
 * Props of a slot the component renders with an `Anchor`: the system style props plus `underline`
 * and `external`. `component` accepts any tag, which is what lets a link render as a `button`
 * without forking the component that wraps it.
 */
export type AnchorSlotProps = AnchorOwnProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof AnchorOwnProps>;
