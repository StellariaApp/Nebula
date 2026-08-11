import type { ElementType, ReactNode } from "react";

import type { ColorExtended, PermissionProps, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type NavLinkVariant = Extract<Variant, "filled" | "light" | "ghost">;

export interface NavLinkProps extends StyleProps, PermissionProps {
  label: ReactNode;
  description?: ReactNode | undefined;
  href?: string | undefined;
  /**
   * Router adapter: the component depends on neither Next nor any other router. Without it the link
   * is an `<a>`, which reloads the document — in an SPA that throws away the rail's own scroll.
   */
  component?: ElementType | undefined;
  onPress?: (() => void) | undefined;
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  variant?: NavLinkVariant | undefined;
  color?: ColorExtended | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  children?: ReactNode | undefined;
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  className?: string | undefined;
  /** Envoltorio de leftSection. */
  leftSectionProps?: BoxSlotProps | undefined;
  /** Envoltorio de rightSection. */
  rightSectionProps?: BoxSlotProps | undefined;
  /** Label and description column. */
  bodyProps?: BoxSlotProps | undefined;
  /** Rotulo del enlace. */
  labelProps?: TextSlotProps | undefined;
  /** The description below the label, when there is one. */
  descriptionProps?: TextSlotProps | undefined;
  /** The child-link panel. It lives inside a `Collapse`. */
  childrenProps?: BoxSlotProps | undefined;
}
