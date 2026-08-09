import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export type DragAxis = "both" | "x" | "y";

export interface DragMove {
  activeId: string;
  overId: string | null;
}

export interface DragDropLabels {
  instructions: string;
  start: (id: string) => string;
  over: (id: string, overId: string) => string;
  drop: (id: string, overId: string | null) => string;
  cancel: (id: string) => string;
  handle: string;
  item: string;
}

export interface DragDropContextProps {
  children: ReactNode;
  onDragStart?: ((move: DragMove) => void) | undefined;
  onDragOver?: ((move: DragMove) => void) | undefined;
  onDragEnd?: ((move: DragMove) => void) | undefined;
  onDragCancel?: ((move: DragMove) => void) | undefined;
  axis?: DragAxis | undefined;
  restrictToParent?: boolean | undefined;
  overlay?: ((activeId: string) => ReactNode) | undefined;
  labels?: Partial<DragDropLabels> | undefined;
}

export interface DraggableProps extends StyleProps {
  /** The row that splits handle and content. It only exists with `withHandle`. */
  rowProps?: BoxSlotProps | undefined;
  /**
   * The drag handle. It only exists with `withHandle`, and it carries `data-dragging`. The node
   * being dragged has no slot: dnd-kit moves it with a computed `transform`.
   */
  handleProps?: ComponentPropsWithoutRef<"button"> | undefined;
  id: string;
  children: ReactNode;
  disabled?: boolean | undefined;
  withHandle?: boolean | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

export interface DroppableProps extends StyleProps {
  id: string;
  children: ReactNode;
  disabled?: boolean | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

export interface SortableListProps<T> extends StyleProps {
  /** The empty-list notice. Only rendered with no `items` and with `empty`. */
  emptyProps?: BoxSlotProps | undefined;
  /**
   * The handle of each row. It spreads over ALL of them and only exists with `withHandle`. The rows
   * themselves have no slot: they carry the ref and the `transform` dnd-kit writes while sorting.
   */
  handleProps?: ComponentPropsWithoutRef<"button"> | undefined;
  items: readonly T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  onReorder: (items: T[], from: number, to: number) => void;
  axis?: Exclude<DragAxis, "both"> | undefined;
  gap?: "xs" | "sm" | "md" | "lg" | undefined;
  disabled?: boolean | undefined;
  withHandle?: boolean | undefined;
  label?: string | undefined;
  empty?: ReactNode | undefined;
  labels?: Partial<DragDropLabels> | undefined;
  className?: string | undefined;
}
