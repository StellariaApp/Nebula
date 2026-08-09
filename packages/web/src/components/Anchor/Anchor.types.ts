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
 * Props of a slot the component renders with an `Anchor`: the system style props plus `underline`
 * and `external`. `component` accepts any tag, which is what lets a link render as a `button`
 * without forking the component that wraps it.
 */
export type AnchorSlotProps = AnchorOwnProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof AnchorOwnProps>;
