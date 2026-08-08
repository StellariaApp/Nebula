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
  /** La fila que reparte asa y contenido. Solo existe con `withHandle`. */
  rowProps?: BoxSlotProps | undefined;
  /**
   * El asa de arrastre. Solo existe con `withHandle`, y lleva `data-dragging`. El nodo que se
   * arrastra no tiene ranura: lo mueve dnd-kit con un `transform` calculado.
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
  /** El aviso de lista vacia. Solo se pinta sin `items` y con `empty`. */
  emptyProps?: BoxSlotProps | undefined;
  /**
   * El asa de cada fila. Se esparce sobre TODAS y solo existe con `withHandle`. Las filas en si no
   * tienen ranura: llevan el ref y el `transform` que dnd-kit les escribe al ordenar.
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
