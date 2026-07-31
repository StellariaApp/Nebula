import type { ReactNode } from "react";

import type { ColumnDef, SortingState } from "@tanstack/react-table";

import type { StyleProps } from "../../utils/style-props.js";

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
}

export interface DataGridProps<T> extends Omit<StyleProps, "color"> {
  data: readonly T[];
  columns: readonly ColumnDef<T>[];
  getRowId?: ((row: T, index: number) => string) | undefined;
  sorting?: SortingState | undefined;
  defaultSorting?: SortingState | undefined;
  onSortingChange?: ((sorting: SortingState) => void) | undefined;
  selectable?: boolean | undefined;
  selected?: readonly string[] | undefined;
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
  labels?: Partial<DataGridLabels> | undefined;
  className?: string | undefined;
}
