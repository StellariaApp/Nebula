import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

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
