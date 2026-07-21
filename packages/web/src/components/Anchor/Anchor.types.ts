import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { TextOwnProps } from "../Text/Text.types.js";

export type AnchorUnderline = "always" | "hover" | "never";

export interface AnchorOwnProps extends Omit<TextOwnProps, "component"> {
  component?: ElementType | undefined;
  underline?: AnchorUnderline | undefined;
  external?: boolean | undefined;
}

export type AnchorProps<C extends ElementType = "a"> = AnchorOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof AnchorOwnProps | "component">;
