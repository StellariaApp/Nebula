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
  /**
   * Everything that can drag or receive a drop. Draggables and droppables only find each other
   * inside one of these, so a drag cannot cross from one context into another.
   */
  children: ReactNode;
  /** Fires when a drag begins, with the item that picked up. */
  onDragStart?: ((move: DragMove) => void) | undefined;
  /**
   * Fires continuously as the item passes over targets. For previewing a reorder — commit in
   * `onDragEnd`, since `overId` here changes many times per drag.
   */
  onDragOver?: ((move: DragMove) => void) | undefined;
  /**
   * Fires on release, and is where the move is committed. `overId` is null when the item was
   * dropped on nothing, which is a cancellation in everything but name.
   */
  onDragEnd?: ((move: DragMove) => void) | undefined;
  /** Fires when the drag is abandoned — Escape, or a lost pointer. Nothing has moved. */
  onDragCancel?: ((move: DragMove) => void) | undefined;
  /**
   * Locks dragging to one axis. Constraining it is what stops a vertical list wandering sideways
   * under an imprecise pointer.
   * @default "both"
   */
  axis?: DragAxis | undefined;
  /**
   * Keeps the dragged item inside its container. It bounds the drag visually; it does not stop a
   * drop landing on a target elsewhere in the same context.
   * @default false
   */
  restrictToParent?: boolean | undefined;
  /**
   * Renders what follows the pointer during a drag. Without it the item moves in place, which is
   * what makes a drag out of a scrolling or clipping container look broken.
   */
  overlay?: ((activeId: string) => ReactNode) | undefined;
  /**
   * Overrides the announcements a screen reader hears through the drag, key by key — what is unset
   * keeps its default. Drag and drop is invisible to assistive tech without them, so these are the
   * whole of the accessible experience. English by default (ADR-120).
   */
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
  /**
   * Identifies this target. It is what arrives as `overId` in the context's handlers, so it has to
   * be unique within the context and stable across renders.
   */
  id: string;
  /** What the zone contains. The zone itself is only a target; it does not lay its contents out. */
  children: ReactNode;
  /**
   * Stops the zone accepting drops. It still renders and still takes up space — it simply stops
   * lighting up, and stops appearing as `overId`.
   * @default false
   */
  disabled?: boolean | undefined;
  /**
   * Names the zone for assistive tech. A drop target has no text of its own, so without this the
   * announcements can only refer to it by its raw `id`.
   */
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
