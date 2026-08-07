import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColumnDef, SortingState } from "@tanstack/react-table";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

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
  /** Con selección activa exporta solo lo seleccionado; por defecto exporta todas las filas. */
  selectionOnly?: boolean | undefined;
}

export interface DataGridProps<T> extends StyleProps {
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

  withToolbar?: boolean | undefined;
  search?: string | undefined;
  onSearchChange?: ((query: string) => void) | undefined;
  searchPlaceholder?: string | undefined;
  activeFilters?: readonly DataGridFilterChip[] | undefined;
  onClearFilters?: (() => void) | undefined;
  filterPanel?: ReactNode | undefined;
  bulkActions?: readonly DataGridBulkAction[] | undefined;
  toolbarSection?: ReactNode | undefined;

  withColumnMenu?: boolean | undefined;
  hiddenColumns?: readonly string[] | undefined;
  defaultHiddenColumns?: readonly string[] | undefined;
  onHiddenColumnsChange?: ((ids: string[]) => void) | undefined;
  resizable?: boolean | undefined;

  exportCsv?: boolean | DataGridExport | undefined;

  labels?: Partial<DataGridLabels> | undefined;
  className?: string | undefined;
  /** El panel de filtros. Solo se pinta si hay `filterPanel`. */
  panelProps?: BoxSlotProps | undefined;
  /** El area que desplaza. Su altura la fija `maxHeight`; la ranura se compone con ella. */
  scrollerProps?: BoxSlotProps | undefined;
  /** La tabla. Lleva `aria-busy` mientras carga y el manejador de teclado de la reticula. */
  tableProps?: ComponentPropsWithoutRef<"table"> | undefined;
  /** El rotulo de la tabla cuando esta oculto. Con `captionVisible` no hay nodo que ajustar. */
  captionProps?: BoxSlotProps | undefined;
  /** La cabecera de la tabla. */
  headProps?: BoxSlotProps | undefined;
  /** Cada celda de cabecera. Se esparce sobre TODAS. */
  thProps?: ComponentPropsWithoutRef<"th"> | undefined;
  /** La celda de tabla vacia. Cubre tanto el estado de carga como el de sin datos. */
  emptyProps?: BoxSlotProps | undefined;
  /** Cada fila de datos. Se esparce sobre todas; la seleccionada lleva `data-selected`. */
  rowProps?: ComponentPropsWithoutRef<"tr"> | undefined;
  /** Cada celda de datos. Su alto lo fija `rowHeight`. */
  tdProps?: ComponentPropsWithoutRef<"td"> | undefined;
  /** El pie con la paginacion. */
  footProps?: BoxSlotProps | undefined;
}
