import type { ReactNode } from "react";

import type { ColorExtended, PermissionProps, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type NavLinkVariant = Extract<Variant, "filled" | "light" | "ghost">;

export interface NavLinkProps extends StyleProps, PermissionProps {
  label: ReactNode;
  description?: ReactNode | undefined;
  href?: string | undefined;
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
  /** Columna de rotulo y descripcion. */
  bodyProps?: BoxSlotProps | undefined;
  /** Rotulo del enlace. */
  labelProps?: TextSlotProps | undefined;
  /** Descripcion bajo el rotulo, si la hay. */
  descriptionProps?: TextSlotProps | undefined;
  /** Panel de enlaces hijos. Vive dentro de un Collapse. */
  childrenProps?: BoxSlotProps | undefined;
}
