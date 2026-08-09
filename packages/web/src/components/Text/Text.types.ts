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
 * Props of a text slot the component renders with a `Text`: the system style props plus `truncate`,
 * `lines` and `inherit`. `component` accepts any tag, so a label can become another element without
 * forking the component that wraps it.
 */
export type TextSlotProps = TextOwnProps & Omit<ComponentPropsWithoutRef<"p">, keyof TextOwnProps>;
