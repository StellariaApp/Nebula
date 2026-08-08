import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { ColorExtended, Unit, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { ButtonCloseProps } from "../ButtonClose/ButtonClose.types.js";

export type NavSize = "sm" | "md" | "lg";

export type NavActiveMode = "auto" | "hash" | "pathname" | "manual";

export type NavResolvedMode = Exclude<NavActiveMode, "auto">;

export type NavLinksAlign = "start" | "center" | "end";
export type NavLinksCollapse = "none" | "phone" | "tablet" | "laptop";

export interface NavLabels {
  more: string;
  links: string;
}

export interface NavProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  size?: NavSize | undefined;
  withBorder?: boolean | undefined;
  /** @default 1180 */
  contentWidth?: Unit | undefined;
  floating?: boolean | undefined;
  sticky?: boolean | undefined;
  scrolled?: boolean | undefined;
  /** @default 24 */
  scrollThreshold?: number | undefined;
  /** @default 1180 */
  floatingWidth?: Unit | undefined;
  /** @default 12 */
  floatingGap?: Unit | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface NavLogoProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  href?: string | undefined;
  height?: Unit | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface NavSidebarProps {
  /** La cabecera del cajon, que solo lleva el boton de cerrar. */
  headProps?: BoxSlotProps | undefined;
  /** Ese boton de cerrar. El velo tambien cierra y no es una ranura: es el propio velo. */
  closeProps?: ButtonCloseProps | undefined;
  /** El cuerpo con desplazamiento, donde caen los hijos. */
  bodyProps?: BoxSlotProps | undefined;
  /** El pie del cajon. No se pinta sin `footer`. */
  footerProps?: BoxSlotProps | undefined;
  opened: boolean;
  onClose: () => void;
  children?: ReactNode | undefined;
  /** Va al pie, en columna: es donde caben el badge de estado y el CTA. */
  footer?: ReactNode | undefined;
  /** Por encima de este punto el cajón se cierra solo. */
  collapse?: NavLinksCollapse | undefined;
  closeLabel?: string | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

export interface NavLinksProps extends Omit<StyleProps, "align"> {
  /** El desplegable de los enlaces que no caben. Solo con `overflowMenu`, y solo si sobra alguno. */
  overflowProps?: ComponentPropsWithoutRef<"details"> | undefined;
  /** Su disparador, el de los tres puntos. */
  overflowTriggerProps?: ComponentPropsWithoutRef<"summary"> | undefined;
  /** El panel del desplegable, donde caen los enlaces ocultos. */
  overflowPanelProps?: BoxSlotProps | undefined;
  children?: ReactNode | undefined;
  active?: string | undefined;
  activeMode?: NavActiveMode | undefined;
  align?: NavLinksAlign | undefined;
  collapse?: NavLinksCollapse | undefined;
  /** Priority+: mide el ancho real y manda al menú los enlaces que no caben. */
  overflowMenu?: boolean | undefined;
  spyOffset?: number | undefined;
  variant?: Variant | undefined;
  color?: ColorExtended | undefined;
  withIndicator?: boolean | undefined;
  labels?: Partial<NavLabels> | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface NavLinkItemProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  href?: string | undefined;
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  onPress?: (() => void) | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface NavSlotProps extends StyleProps {
  children?: ReactNode | undefined;
  className?: string | undefined;
  /** Bajo este punto las acciones desaparecen: viven en el pie del cajón. */
  collapse?: NavLinksCollapse | undefined;
}

export interface NavDividerProps extends StyleProps {
  className?: string | undefined;
}
