"use client";

import { useMemo, useRef, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Button } from "../Button/Button.js";
import { Checkbox } from "../Checkbox/Checkbox.js";
import { Loader } from "../Loader/Loader.js";

import * as styles from "./DataGrid.css.js";
import type { DataGridLabels, DataGridProps } from "./DataGrid.types.js";

const DEFAULT_LABELS: DataGridLabels = {
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
};

const SORT_ICON = { asc: "▲", desc: "▼", none: "↕" } as const;

export function DataGrid<T>(props: DataGridProps<T>): ReactElement {
  const {
    data,
    columns,
    getRowId,
    sorting,
    defaultSorting = [],
    onSortingChange,
    selectable = false,
    selected,
    defaultSelected = [],
    onSelectedChange,
    pageSize = 25,
    withPagination = true,
    virtualizeFrom = 50,
    rowHeight = 44,
    maxHeight = 520,
    loading = false,
    empty,
    caption,
    captionVisible = false,
    onRowClick,
    labels,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const text = { ...DEFAULT_LABELS, ...labels };

  const [sort_state, set_sort_state] = useUncontrolled(sorting, defaultSorting, onSortingChange);
  const [selected_keys, set_selected_keys] = useUncontrolled(
    selected,
    defaultSelected,
    onSelectedChange as ((value: readonly string[]) => void) | undefined,
  );

  const selection = useMemo<RowSelectionState>(() => {
    const map: RowSelectionState = {};
    for (const key of selected_keys) map[key] = true;
    return map;
  }, [selected_keys]);

  const all_columns = useMemo<ColumnDef<T>[]>(() => {
    if (!selectable) return [...columns];
    const picker: ColumnDef<T> = {
      id: "__select",
      size: 40,
      header: ({ table }) => (
        <Checkbox
          aria-label={text.selectAll}
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={(checked) => {
            table.toggleAllRowsSelected(checked);
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={text.selectRow}
          checked={row.getIsSelected()}
          onChange={(checked) => {
            row.toggleSelected(checked);
          }}
        />
      ),
    };
    return [picker, ...columns];
  }, [columns, selectable, text.selectAll, text.selectRow]);

  const table = useReactTable<T>({
    data: data as T[],
    columns: all_columns,
    state: { sorting: sort_state, rowSelection: selection },
    ...(getRowId === undefined ? {} : { getRowId }),
    enableRowSelection: selectable,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sort_state) : updater;
      set_sort_state(next);
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(selection) : updater;
      set_selected_keys(Object.keys(next).filter((key) => next[key] === true));
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(withPagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    initialState: withPagination ? { pagination: { pageIndex: 0, pageSize } } : {},
  });

  const rows = table.getRowModel().rows;
  const scroller_ref = useRef<HTMLDivElement>(null);
  const is_virtual = rows.length >= virtualizeFrom;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scroller_ref.current,
    estimateSize: () => rowHeight,
    overscan: 8,
    enabled: is_virtual,
  });

  const virtual_rows = is_virtual ? virtualizer.getVirtualItems() : [];
  const pad_top = is_virtual ? (virtual_rows[0]?.start ?? 0) : 0;
  const pad_bottom = is_virtual
    ? virtualizer.getTotalSize() - (virtual_rows.at(-1)?.end ?? 0)
    : 0;
  const visible = is_virtual ? virtual_rows.map((entry) => rows[entry.index]) : rows;
  const column_count = all_columns.length;

  return (
    <div
      className={cx(styles.root, sprinkle_class, className)}
      style={sprinkle_style}
      data-virtual={is_virtual ? "true" : undefined}
    >
      <div
        ref={scroller_ref}
        className={styles.scroller}
        style={{ maxHeight }}
        data-testid="datagrid-scroller"
      >
        <table className={styles.table} aria-busy={loading ? "true" : undefined}>
          {caption === undefined ? null : (
            <caption className={captionVisible ? styles.caption : undefined}>
              {captionVisible ? caption : <span className={styles.caption}>{caption}</span>}
            </caption>
          )}
          <thead className={styles.head}>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const sortable = header.column.getCanSort();
                  const direction = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className={styles.th}
                      {...(direction === false
                        ? {}
                        : { "aria-sort": direction === "asc" ? "ascending" : "descending" })}
                    >
                      {header.isPlaceholder ? null : sortable ? (
                        <button
                          type="button"
                          className={styles.sortButton}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className={styles.sortIcon} aria-hidden="true">
                            {direction === false ? SORT_ICON.none : SORT_ICON[direction]}
                          </span>
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {pad_top > 0 ? (
              <tr aria-hidden="true">
                <td className={styles.spacer} colSpan={column_count} style={{ height: pad_top }} />
              </tr>
            ) : null}

            {rows.length === 0 ? (
              <tr>
                <td className={styles.empty} colSpan={column_count}>
                  {loading ? <Loader size="sm" label={text.loading} /> : (empty ?? text.empty)}
                </td>
              </tr>
            ) : (
              visible.map((row) =>
                row === undefined ? null : (
                  <tr
                    key={row.id}
                    className={styles.row}
                    data-selected={row.getIsSelected() ? "true" : undefined}
                    data-clickable={onRowClick === undefined ? undefined : "true"}
                    {...(onRowClick === undefined
                      ? {}
                      : {
                          tabIndex: 0,
                          onClick: () => {
                            onRowClick(row.original);
                          },
                          onKeyDown: (event) => {
                            if (event.key !== "Enter" && event.key !== " ") return;
                            event.preventDefault();
                            onRowClick(row.original);
                          },
                        })}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={styles.td} style={{ height: rowHeight }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ),
              )
            )}

            {pad_bottom > 0 ? (
              <tr aria-hidden="true">
                <td
                  className={styles.spacer}
                  colSpan={column_count}
                  style={{ height: pad_bottom }}
                />
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {withPagination && table.getPageCount() > 1 ? (
        <div className={styles.foot}>
          <p className={styles.status} aria-live="polite">
            {text.page(table.getState().pagination.pageIndex + 1, table.getPageCount())}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              size="sm"
              variant="outline"
              disabled={!table.getCanPreviousPage()}
              onPress={() => {
                table.previousPage();
              }}
            >
              {text.previous}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!table.getCanNextPage()}
              onPress={() => {
                table.nextPage();
              }}
            >
              {text.next}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

DataGrid.displayName = "DataGrid";
