import type { ReactNode } from "react";

import type { PermissionProps } from "@stellaria/nebula-tokens";

import type { OverlayTriggerElement, PopoverPlacement } from "../Popover/Popover.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface MenuItemData extends PermissionProps {
  key: string;
  label: ReactNode;
  textValue?: string | undefined;
  description?: ReactNode | undefined;
  shortcut?: string | undefined;
  icon?: ReactNode | undefined;
  disabled?: boolean | undefined;
  danger?: boolean | undefined;
}

/**
 * Las ranuras de cada fila. Se esparcen sobre TODAS: las filas llegan por `items`, no por
 * composicion, asi que no hay forma de ajustar una sola desde fuera.
 *
 * La fila en si NO tiene ranura: la anima motion con entrada escalonada, y una prop ahi deja que
 * el consumidor pise el escalonado.
 */
export interface MenuSlotProps {
  /** Envoltorio del icono, si la fila lo trae. */
  iconProps?: BoxSlotProps | undefined;
  /** Columna de rotulo y descripcion. */
  bodyProps?: BoxSlotProps | undefined;
  /** El rotulo. Se esparce DESPUES de las props de aria, asi que el consumidor gana. */
  labelProps?: TextSlotProps | undefined;
  /** La descripcion, si la fila la trae. */
  descriptionProps?: TextSlotProps | undefined;
  /** El atajo de teclado, que se pinta en un `kbd`. */
  shortcutProps?: BoxSlotProps | undefined;
}

export interface MenuListOwnProps extends MenuSlotProps {
  /** La lista. Lleva ya las props de menu de aria. */
  listProps?: BoxSlotProps | undefined;
  items: MenuItemData[];
  onAction?: ((key: string) => void) | undefined;
  autoFocus?: boolean | "first" | "last" | undefined;
  "aria-label"?: string | undefined;
  className?: string | undefined;
}

export interface MenuProps extends MenuListOwnProps {
  trigger: OverlayTriggerElement;
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  placement?: PopoverPlacement | undefined;
  offset?: number | undefined;
  crossOffset?: number | undefined;
  width?: number | string | undefined;
}

export interface ContextMenuProps extends MenuListOwnProps {
  children: ReactNode;
  disabled?: boolean | undefined;
  width?: number | string | undefined;
}
