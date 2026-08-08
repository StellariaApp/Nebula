import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { SpacingValue, Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
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
  /**
   * El enlace de marca, que envuelve el logo. Solo se pinta si hay `logo`. Su elemento sale de
   * `component`, o de `href`: con `href` es un `a` y sin el un `span`, y en ninguno de los dos casos
   * pasa por `Box`, asi que no acepta style props.
   */
  linkProps?: ComponentPropsWithoutRef<"a"> | undefined;
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
  /**
   * La lista de enlaces. Existe en cuanto uno de los hijos es un `Footer.Group.Link`, y entonces
   * envuelve a todos; sin ninguno, van sueltos.
   */
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
