import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColumnDef, SortingState } from "@tanstack/react-table";

import type { StyleProps } from "../../utils/style-props.js";

import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";
import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface DataGridLabels {
  empty: string;
  loading: string;
  selectAll: string;
  selectRow: string;
  sortAscending: string;
  sortDescending: string;
  clearSort: string;
  page: (current: number, total: number) => string;
  previous: string;
  next: string;
  search: string;
  columnMenu: (column: string) => string;
  hideColumn: string;
  resetColumns: string;
  resize: (column: string) => string;
  filters: string;
  clearFilter: string;
  clearFilters: string;
  selectedCount: (count: number) => string;
  clearSelection: string;
  exportCsv: string;
}

export interface DataGridFilterChip {
  id: string;
  label: string;
  onClear?: (() => void) | undefined;
}

export interface DataGridBulkAction {
  id: string;
  label: string;
  icon?: ReactNode | undefined;
  destructive?: boolean | undefined;
  onAction: (keys: readonly string[]) => void;
}

export interface DataGridExport {
  filename?: string | undefined;
  delimiter?: string | undefined;
  /**
   * With selection on, it exports only what is selected, whether or not it sits on the visible page.
   * Without it, and by default, it exports every row. Both branches read the core model, so
   * pagination does not trim the file and the order is the source order, not the view order.
   */
  selectionOnly?: boolean | undefined;
}

export interface DataGridProps<T>
  extends StyleProps, DataGridToolbarSlotProps, DataGridColumnSlotProps {
  data: readonly T[];
  columns: readonly ColumnDef<T>[];
  getRowId?: ((row: T, index: number) => string) | undefined;
  sorting?: SortingState | undefined;
  /** @default [] */
  defaultSorting?: SortingState | undefined;
  onSortingChange?: ((sorting: SortingState) => void) | undefined;
  selectable?: boolean | undefined;
  selected?: readonly string[] | undefined;
  /** @default [] */
  defaultSelected?: readonly string[] | undefined;
  onSelectedChange?: ((keys: string[]) => void) | undefined;
  pageSize?: number | undefined;
  withPagination?: boolean | undefined;
  virtualizeFrom?: number | undefined;
  rowHeight?: number | undefined;
  maxHeight?: number | undefined;
  loading?: boolean | undefined;
  empty?: ReactNode | undefined;
  caption?: string | undefined;
  captionVisible?: boolean | undefined;
  onRowClick?: ((row: T) => void) | undefined;

  withToolbar?: boolean | undefined;
  search?: string | undefined;
  onSearchChange?: ((query: string) => void) | undefined;
  searchPlaceholder?: string | undefined;
  /** @default [] */
  activeFilters?: readonly DataGridFilterChip[] | undefined;
  onClearFilters?: (() => void) | undefined;
  filterPanel?: ReactNode | undefined;
  /** @default [] */
  bulkActions?: readonly DataGridBulkAction[] | undefined;
  toolbarSection?: ReactNode | undefined;

  withColumnMenu?: boolean | undefined;
  hiddenColumns?: readonly string[] | undefined;
  /** @default [] */
  defaultHiddenColumns?: readonly string[] | undefined;
  onHiddenColumnsChange?: ((ids: string[]) => void) | undefined;
  resizable?: boolean | undefined;

  exportCsv?: boolean | DataGridExport | undefined;

  labels?: Partial<DataGridLabels> | undefined;
  className?: string | undefined;
  /** The filter panel. Only rendered with `filterPanel`. */
  panelProps?: BoxSlotProps | undefined;
  /** The scrolling area. Its height comes from `maxHeight`; the slot composes with it. */
  scrollerProps?: BoxSlotProps | undefined;
  /** The table. It carries `aria-busy` while loading, plus the grid keyboard handler. */
  tableProps?: ComponentPropsWithoutRef<"table"> | undefined;
  /**
   * The table label when `captionVisible` is false: it lands on the `span` inside the `caption`.
   * With `captionVisible` the label renders directly and there is no node to adjust.
   */
  captionProps?: BoxSlotProps | undefined;
  /** The table header. */
  headProps?: BoxSlotProps | undefined;
  /** Every header cell. It spreads over ALL of them. */
  thProps?: ComponentPropsWithoutRef<"th"> | undefined;
  /** The empty table cell. It covers both the loading state and the no-data one. */
  emptyProps?: BoxSlotProps | undefined;
  /** Every data row. It spreads over all of them; the selected one carries `data-selected`. */
  rowProps?: ComponentPropsWithoutRef<"tr"> | undefined;
  /** Every data cell. Its height comes from `rowHeight`. */
  tdProps?: ComponentPropsWithoutRef<"td"> | undefined;
  /** The footer with the pagination. */
  footProps?: BoxSlotProps | undefined;
}

/**
 * The toolbar slots. The toolbar only exists at all if something justifies it — `withToolbar`,
 * search, active filters, bulk actions, export, `toolbarSection`, or `withColumnMenu` with a hidden
 * column, which is how you reach the button that brings them back. Without any of that there is no
 * node to adjust.
 */
export interface DataGridToolbarSlotProps {
  /** The whole toolbar. */
  toolbarProps?: BoxSlotProps | undefined;
  /** The search slot. Only with `onSearchChange`. */
  toolbarSearchProps?: BoxSlotProps | undefined;
  /**
   * The row where `toolbarSection` and the export and restore-columns buttons land. It shares a class
   * with the pagination row in the footer, but the slot only lands on the toolbar one.
   */
  toolbarActionsProps?: BoxSlotProps | undefined;
  /** The active-filters row. Only when there are any. */
  chipsProps?: BoxSlotProps | undefined;
  /** The bulk-actions bar. Only with a selection and with `bulkActions`. */
  bulkBarProps?: BoxSlotProps | undefined;
  /** The selected count in that bar. It carries `aria-live`, so it is announced when it changes. */
  bulkCountProps?: TextSlotProps | undefined;
}

/** The slots of every header cell. They spread over ALL columns. */
export interface DataGridColumnSlotProps {
  /** The row inside the `th`, with the label, the menu and the resize handle. */
  headCellProps?: BoxSlotProps | undefined;
  /** The sort button. Only on sortable columns. */
  sortButtonProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** The sort arrow of that button, which says ascending, descending or unsorted. */
  sortIconProps?: BoxSlotProps | undefined;
  /** The column menu trigger. Only with `withColumnMenu` and when the menu has entries. */
  columnMenuProps?: ActionIconProps | undefined;
  /** The handle that changes the width. Only on resizable columns; it carries `data-resizing`. */
  resizerProps?: ComponentPropsWithoutRef<"button"> | undefined;
}
