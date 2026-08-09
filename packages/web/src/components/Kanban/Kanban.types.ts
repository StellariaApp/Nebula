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
  /** The column header. */
  headerProps?: BoxSlotProps | undefined;
  /** The title, which is the `h3` the column `aria-labelledby` points at. */
  titleProps?: TextSlotProps | undefined;
  /** The count. It carries `data-over-limit`, which is where its warning comes from once the cap is exceeded. */
  countProps?: TextSlotProps | undefined;
  /** The empty-column notice. Only rendered with no children. */
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
  /** The card header. Not rendered without a title or a badge. */
  headProps?: BoxSlotProps | undefined;
  /** The card title. */
  titleProps?: TextSlotProps | undefined;
  /** The description, when it has one. */
  descriptionProps?: TextSlotProps | undefined;
  /** The metadata row, when it has one. */
  metaProps?: BoxSlotProps | undefined;
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  meta?: ReactNode | undefined;
  badge?: ReactNode | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}
