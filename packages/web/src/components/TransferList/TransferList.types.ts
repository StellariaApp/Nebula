import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { SelectOption } from "../../collections/options.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface TransferListLabels {
  add: string;
  addAll: string;
  remove: string;
  removeAll: string;
  search: string;
  empty: string;
  count: (selected: number, total: number) => string;
}

export interface TransferListPane {
  title?: ReactNode | undefined;
  empty?: ReactNode | undefined;
}

/**
 * Las ranuras de un panel. Se esparcen sobre LOS DOS —origen y destino—: el componente los pinta
 * con el mismo codigo, asi que no hay forma de ajustar solo uno desde fuera.
 */
export interface TransferPaneSlotProps {
  /** El panel. */
  paneProps?: BoxSlotProps | undefined;
  /** Su cabecera. Solo se pinta si el panel trae `title`. */
  paneHeadProps?: BoxSlotProps | undefined;
  /** El titulo del panel. */
  paneTitleProps?: TextSlotProps | undefined;
  /** El recuento. Va en la cabecera si hay titulo, y al pie si no. */
  paneCountProps?: TextSlotProps | undefined;
  /** El envoltorio del buscador. Solo con `searchable`. */
  searchProps?: BoxSlotProps | undefined;
  /** La lista de opciones, que es el `listbox`. */
  listProps?: BoxSlotProps | undefined;
  /** Cada opcion. Se esparce sobre todas. */
  itemProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** El aviso de panel vacio. */
  emptyProps?: TextSlotProps | undefined;
}

export interface TransferListProps extends StyleProps, TransferPaneSlotProps {
  data: readonly SelectOption[];
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  source?: TransferListPane | undefined;
  target?: TransferListPane | undefined;
  searchable?: boolean | undefined;
  height?: number | undefined;
  disabled?: boolean | undefined;
  labels?: Partial<TransferListLabels> | undefined;
  className?: string | undefined;
  /** La fila de botones entre los dos paneles. */
  controlsProps?: BoxSlotProps | undefined;
}
