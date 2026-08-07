import type { ElementType, ReactNode } from "react";

import type { SpacingValue, Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { MarkProps } from "../Mark/Mark.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface FooterProps extends StyleProps {
  /** La reticula de columnas. No se pinta si no hay ninguna. */
  columnsProps?: BoxSlotProps | undefined;
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  contentWidth?: Unit | undefined;
  spacing?: SpacingValue | undefined;
  sticky?: boolean | undefined;
  glass?: boolean | undefined;
  withBorder?: boolean | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface FooterBrandProps extends StyleProps {
  /** El enlace de marca, que envuelve el logo. Solo se pinta si hay `logo`. */
  linkProps?: MarkProps | undefined;
  /** La descripcion bajo la marca, si la hay. */
  descriptionProps?: TextSlotProps | undefined;
  children?: ReactNode | undefined;
  logo?: ReactNode | undefined;
  description?: ReactNode | undefined;
  href?: string | undefined;
  component?: ElementType | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface FooterGroupProps extends StyleProps {
  /** El titulo del grupo, si lo hay. */
  titleProps?: TextSlotProps | undefined;
  /** La lista de enlaces. Solo existe si los hijos son enlaces; si no, van sueltos. */
  listProps?: BoxSlotProps | undefined;
  children?: ReactNode | undefined;
  title?: ReactNode | undefined;
  className?: string | undefined;
}

export interface FooterLinkProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  href?: string | undefined;
  onPress?: (() => void) | undefined;
  className?: string | undefined;
}

export interface FooterLegalProps extends StyleProps {
  children?: ReactNode | undefined;
  className?: string | undefined;
}
