import type { DataGridLabels } from "./DataGrid.types.js";

export const DATA_GRID_LABELS: DataGridLabels = {
  empty: "No data",
  loading: "Loading data",
  selectAll: "Select all rows",
  selectRow: "Select row",
  sortAscending: "Sort ascending",
  sortDescending: "Sort descending",
  clearSort: "Clear sorting",
  page: (current, total) => `Page ${String(current)} of ${String(total)}`,
  previous: "Previous",
  next: "Next",
  search: "Search the table",
  columnMenu: (column) => `${column} column options`,
  hideColumn: "Hide the column",
  resetColumns: "Show all columns",
  resize: (column) => `Resize ${column}`,
  filters: "Filters",
  clearFilter: "Remove the filter",
  clearFilters: "Clear all filters",
  selectedCount: (count) =>
    count === 1 ? "1 fila seleccionada" : `${String(count)} filas seleccionadas`,
  clearSelection: "Clear the selection",
  exportCsv: "Export to CSV",
};
