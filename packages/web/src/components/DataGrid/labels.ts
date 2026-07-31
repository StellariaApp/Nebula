import type { DataGridLabels } from "./DataGrid.types.js";

export const DATA_GRID_LABELS: DataGridLabels = {
  empty: "Sin datos",
  loading: "Cargando datos",
  selectAll: "Seleccionar todas las filas",
  selectRow: "Seleccionar fila",
  sortAscending: "Ordenar ascendente",
  sortDescending: "Ordenar descendente",
  clearSort: "Quitar orden",
  page: (current, total) => `Página ${String(current)} de ${String(total)}`,
  previous: "Anterior",
  next: "Siguiente",
  search: "Buscar en la tabla",
  columnMenu: (column) => `Opciones de la columna ${column}`,
  hideColumn: "Ocultar la columna",
  resetColumns: "Mostrar todas las columnas",
  resize: (column) => `Ajustar el ancho de ${column}`,
  filters: "Filtros",
  clearFilter: "Quitar el filtro",
  clearFilters: "Quitar todos los filtros",
  selectedCount: (count) =>
    count === 1 ? "1 fila seleccionada" : `${String(count)} filas seleccionadas`,
  clearSelection: "Quitar la selección",
  exportCsv: "Exportar a CSV",
};
