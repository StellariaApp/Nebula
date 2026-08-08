import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { SpacingValue } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";
import type { BoxSlotProps } from "../Box/Box.types.js";

export type ListType = "ordered" | "unordered";

export interface ListOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  type?: ListType | undefined;
  spacing?: SpacingValue | undefined;
  withPadding?: boolean | undefined;
  icon?: ReactNode | undefined;
}

export type ListProps<C extends ElementType = "ul"> = ListOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof ListOwnProps | "component">;

export interface ListItemOwnProps extends Omit<BoxOwnProps, "component"> {
  /** El envoltorio del icono. Solo se pinta si el item trae `icon`. */
  iconProps?: BoxSlotProps | undefined;
  component?: ElementType | undefined;
  icon?: ReactNode | undefined;
}

export type ListItemProps<C extends ElementType = "li"> = ListItemOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof ListItemOwnProps | "component">;
