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
  /** The columns, in order. Their ids are what `getColumn` has to return. */
  columns: readonly KanbanColumnDef[];
  /**
   * Every card on the board, flat and in one list. The board groups them itself, so passing them
   * pre-grouped per column is not the shape it wants.
   */
  items: readonly T[];
  /**
   * Identity of each card. It has to be stable across renders and unique board-wide — a key that
   * changes as the card moves makes the drag lose the item mid-flight.
   */
  getKey: (item: T, index: number) => string;
  /** Which column a card belongs in, as one of the `columns` ids. This is what does the grouping. */
  getColumn: (item: T) => string;
  /** Renders a card. It is given the column so a card can read differently depending on where it sits. */
  renderCard: (item: T, columnId: string) => ReactNode;
  /**
   * Commits a move. The board reorders optimistically as the card is dropped, so this has to
   * persist the change — if it does not, the next render from your data snaps the card back.
   */
  onMove: (move: KanbanMove) => void;
  /**
   * Names the board as a whole. Without it the columns are announced with nothing tying them
   * together.
   */
  label?: string | undefined;
  /** Freezes the board: cards still render, nothing drags. @default false */
  disabled?: boolean | undefined;
  /**
   * Confines dragging to an explicit grip instead of the whole card. Turn it on whenever cards
   * contain their own controls, since otherwise a press meant for a button starts a drag.
   */
  withHandle?: boolean | undefined;
  /** Fixed width of every column, in pixels. The board scrolls sideways past the viewport. */
  columnWidth?: number | undefined;
  /**
   * Overrides the drag announcements a screen reader hears, key by key — what is unset keeps its
   * default. English by default (ADR-120).
   */
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
