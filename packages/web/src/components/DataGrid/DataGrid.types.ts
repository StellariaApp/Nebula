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
   * Con selección activa exporta solo lo seleccionado, esté en la página visible o no. Sin ella, y
   * por defecto, exporta todas las filas. Las dos ramas salen del modelo core, así que la
   * paginación no recorta el fichero y el orden es el de origen, no el de la vista.
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
  /** El panel de filtros. Solo se pinta si hay `filterPanel`. */
  panelProps?: BoxSlotProps | undefined;
  /** El area que desplaza. Su altura la fija `maxHeight`; la ranura se compone con ella. */
  scrollerProps?: BoxSlotProps | undefined;
  /** La tabla. Lleva `aria-busy` mientras carga y el manejador de teclado de la reticula. */
  tableProps?: ComponentPropsWithoutRef<"table"> | undefined;
  /**
   * El rotulo de la tabla cuando `captionVisible` es falso: cae sobre el `span` de dentro del
   * `caption`. Con `captionVisible` el rotulo se pinta directo y no hay nodo que ajustar.
   */
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

/**
 * Las ranuras de la barra de herramientas. La barra entera solo existe si algo la justifica
 * —`withToolbar`, busqueda, filtros activos, acciones en lote, exportacion, `toolbarSection` o
 * `withColumnMenu` con alguna columna oculta, que es como se llega al boton de reponerlas—; sin eso
 * no hay nodo que ajustar.
 */
export interface DataGridToolbarSlotProps {
  /** La barra entera. */
  toolbarProps?: BoxSlotProps | undefined;
  /** El hueco del buscador. Solo con `onSearchChange`. */
  toolbarSearchProps?: BoxSlotProps | undefined;
  /**
   * La fila donde caen `toolbarSection` y los botones de exportar y reponer columnas. Comparte clase
   * con la fila de paginacion del pie, pero la ranura solo cae en la de la barra.
   */
  toolbarActionsProps?: BoxSlotProps | undefined;
  /** La fila de filtros activos. Solo si hay alguno. */
  chipsProps?: BoxSlotProps | undefined;
  /** La barra de acciones en lote. Solo con seleccion y con `bulkActions`. */
  bulkBarProps?: BoxSlotProps | undefined;
  /** El recuento de seleccionadas de esa barra. Lleva `aria-live`, asi que se anuncia al cambiar. */
  bulkCountProps?: TextSlotProps | undefined;
}

/** Las ranuras de cada celda de cabecera. Se esparcen sobre TODAS las columnas. */
export interface DataGridColumnSlotProps {
  /** La fila de dentro del `th`, con el rotulo, el menu y el asa de ancho. */
  headCellProps?: BoxSlotProps | undefined;
  /** El boton que ordena. Solo en columnas ordenables. */
  sortButtonProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** La flecha de orden de ese boton, que dice ascendente, descendente o sin ordenar. */
  sortIconProps?: BoxSlotProps | undefined;
  /** El disparador del menu de columna. Solo con `withColumnMenu` y si el menu tiene entradas. */
  columnMenuProps?: ActionIconProps | undefined;
  /** El asa que cambia el ancho. Solo en columnas redimensionables; lleva `data-resizing`. */
  resizerProps?: ComponentPropsWithoutRef<"button"> | undefined;
}
