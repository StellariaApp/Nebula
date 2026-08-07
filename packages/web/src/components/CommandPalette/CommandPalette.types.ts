import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { PermissionProps } from "@stellaria/nebula-tokens";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { KbdProps } from "../Kbd/Kbd.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface CommandItem extends PermissionProps {
  key: string;
  label: string;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  shortcut?: string | undefined;
  group?: string | undefined;
  keywords?: readonly string[] | undefined;
  disabled?: boolean | undefined;
  onAction?: (() => void) | undefined;
}

export interface CommandPaletteLabels {
  placeholder: string;
  search: string;
  empty: string;
  list: string;
}

/**
 * Las ranuras de cada fila. Se esparcen sobre TODAS: las filas salen de `items` filtrados por la
 * busqueda, no de composicion, asi que no hay forma de ajustar una sola desde fuera.
 *
 * Los nombres son los de `Menu`, que tiene la misma anatomia de fila; el contrato comun manda sobre
 * el nombre de la clase.
 */
export interface CommandPaletteSlotProps {
  /** Cada fila. Lleva `data-focused` y `data-disabled`, y ya las props de opcion de aria. */
  optionProps?: ComponentPropsWithoutRef<"li"> | undefined;
  /** Envoltorio del icono, si el comando lo trae. */
  iconProps?: BoxSlotProps | undefined;
  /** Columna de rotulo y descripcion. */
  bodyProps?: BoxSlotProps | undefined;
  /** El rotulo del comando. */
  labelProps?: TextSlotProps | undefined;
  /** La descripcion, si el comando la trae. */
  descriptionProps?: TextSlotProps | undefined;
  /** El atajo, que se pinta con `Kbd`. Solo si el comando trae `shortcut`. */
  shortcutProps?: Omit<KbdProps, "children"> | undefined;
}

export interface CommandPaletteProps extends CommandPaletteSlotProps {
  /** La fila del buscador: la lupa y el campo. */
  inputRowProps?: BoxSlotProps | undefined;
  /** El glifo de la lupa de esa fila, que no es el icono de las filas de comando. */
  searchIconProps?: BoxSlotProps | undefined;
  /** El campo de busqueda. Se esparce DESPUES de las props de combobox de aria. */
  inputProps?: ComponentPropsWithoutRef<"input"> | undefined;
  /** El aviso de sin resultados. Sustituye a la lista, no se suma a ella. */
  emptyProps?: TextSlotProps | undefined;
  /** La lista de comandos. Se esparce DESPUES de las props de listbox de aria. */
  listProps?: ComponentPropsWithoutRef<"ul"> | undefined;
  items: readonly CommandItem[];
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  onAction?: ((key: string) => void) | undefined;
  hotkey?: string | false | undefined;
  maxResults?: number | undefined;
  labels?: Partial<CommandPaletteLabels> | undefined;
  className?: string | undefined;
}
