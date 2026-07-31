import type { ReactNode } from "react";

import type { DragDropLabels } from "../DragDrop/DragDrop.types.js";
import type { StyleProps } from "../../utils/style-props.js";

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

export interface KanbanBoardProps<T> extends Omit<StyleProps, "color"> {
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

export interface KanbanColumnProps extends Omit<StyleProps, "color"> {
  id: string;
  title: ReactNode;
  children?: ReactNode | undefined;
  badge?: ReactNode | undefined;
  count?: number | undefined;
  limit?: number | undefined;
  empty?: ReactNode | undefined;
  width?: number | undefined;
  className?: string | undefined;
}

export interface KanbanCardProps extends Omit<StyleProps, "color"> {
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  meta?: ReactNode | undefined;
  badge?: ReactNode | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}
