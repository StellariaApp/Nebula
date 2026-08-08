import type { ReactNode } from "react";

import type { DragDropLabels } from "../DragDrop/DragDrop.types.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface KanbanColumnDef {
  id: string;
  title: ReactNode;
  badge?: ReactNode | undefined;
  limit?: number | undefined;
  empty?: ReactNode | undefined;
}

export interface KanbanMove {
  key: string;
  from: string;
  to: string;
  index: number;
  columns: Record<string, string[]>;
}

export interface KanbanBoardProps<T> extends StyleProps {
  columns: readonly KanbanColumnDef[];
  items: readonly T[];
  getKey: (item: T, index: number) => string;
  getColumn: (item: T) => string;
  renderCard: (item: T, columnId: string) => ReactNode;
  onMove: (move: KanbanMove) => void;
  label?: string | undefined;
  disabled?: boolean | undefined;
  withHandle?: boolean | undefined;
  columnWidth?: number | undefined;
  labels?: Partial<DragDropLabels> | undefined;
  className?: string | undefined;
}

export interface KanbanColumnProps extends StyleProps {
  /** La cabecera de la columna. */
  headerProps?: BoxSlotProps | undefined;
  /** El titulo, que es el `h3` al que apunta el `aria-labelledby` de la columna. */
  titleProps?: TextSlotProps | undefined;
  /** El recuento. Lleva `data-over-limit`, de donde sale su aviso al pasarse del tope. */
  countProps?: TextSlotProps | undefined;
  /** El aviso de columna vacia. Solo se pinta si no hay hijos. */
  emptyProps?: TextSlotProps | undefined;
  id: string;
  title: ReactNode;
  children?: ReactNode | undefined;
  badge?: ReactNode | undefined;
  count?: number | undefined;
  limit?: number | undefined;
  empty?: ReactNode | undefined;
  /** @default 280 */
  width?: number | undefined;
  className?: string | undefined;
}

export interface KanbanCardProps extends StyleProps {
  /** La cabecera de la tarjeta. No se pinta si no hay titulo ni chapa. */
  headProps?: BoxSlotProps | undefined;
  /** El titulo de la tarjeta. */
  titleProps?: TextSlotProps | undefined;
  /** La descripcion, si la trae. */
  descriptionProps?: TextSlotProps | undefined;
  /** La fila de metadatos, si la trae. */
  metaProps?: BoxSlotProps | undefined;
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  meta?: ReactNode | undefined;
  badge?: ReactNode | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}
