"use client";

import { useCallback, useMemo, useRef, useState, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Cell,
  type ColumnDef,
  type ColumnSizingState,
  type Row,
  type RowSelectionState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Button } from "../Button/Button.js";
import { Checkbox } from "../Checkbox/Checkbox.js";
import { Loader } from "../Loader/Loader.js";

import { ColumnHeader } from "./ColumnHeader.js";
import { DownloadCsv, ToCsv } from "./csv.js";
import * as styles from "./DataGrid.css.js";
import { DATA_GRID_LABELS } from "./labels.js";
import { DataGridToolbar } from "./Toolbar.js";

import { useGridKeyboard } from "./useGridKeyboard.js";
import type { DataGridExport, DataGridProps } from "./DataGrid.types.js";
import { Box } from "../Box/Box.js";

const SELECT_COLUMN = "__select";
const PAGE_STEP = 10;
const MIN_WIDTH = 60;
const DEFAULT_WIDTH = 150;

function HeaderText(column: ColumnDef<unknown>, id: string): string {
  return typeof column.header === "string" ? column.header : id;
}

/** El valor de una celda es `unknown`: solo los primitivos tienen una representación textual útil. */
function CellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  if (value instanceof Date) return value.toISOString();
  return "";
}

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

    withToolbar = false,
    search,
    onSearchChange,
    searchPlaceholder,
    activeFilters = [],
    onClearFilters,
    filterPanel,
    bulkActions = [],
    toolbarSection,

    withColumnMenu = false,
    hiddenColumns,
    defaultHiddenColumns = [],
    onHiddenColumnsChange,
    resizable = false,

    exportCsv = false,

    labels,
    className,
    panelProps,
    scrollerProps,
    tableProps,
    captionProps,
    headProps,
    thProps,
    emptyProps,
    rowProps,
    tdProps,
    footProps,
    toolbarProps,
    toolbarSearchProps,
    toolbarActionsProps,
    chipsProps,
    bulkBarProps,
    bulkCountProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? DATA_GRID_LABELS : { ...DATA_GRID_LABELS, ...labels }),
    [labels],
  );

  const [sort_state, set_sort_state] = useUncontrolled(sorting, defaultSorting, onSortingChange);
  const [selected_keys, set_selected_keys] = useUncontrolled(
    selected,
    defaultSelected,
    onSelectedChange as ((value: readonly string[]) => void) | undefined,
  );
  const [hidden, set_hidden] = useUncontrolled<readonly string[]>(
    hiddenColumns,
    defaultHiddenColumns,
    onHiddenColumnsChange === undefined
      ? undefined
      : (next) => {
          onHiddenColumnsChange([...next]);
        },
  );
  const [sizing, set_sizing] = useState<ColumnSizingState>({});
  const [resizing_id, set_resizing_id] = useState<string | null>(null);

  const selection = useMemo<RowSelectionState>(() => {
    const map: RowSelectionState = {};
    for (const key of selected_keys) map[key] = true;
    return map;
  }, [selected_keys]);

  const visibility = useMemo<VisibilityState>(() => {
    const map: VisibilityState = {};
    for (const id of hidden) map[id] = false;
    return map;
  }, [hidden]);

  const all_columns = useMemo<ColumnDef<T>[]>(() => {
    if (!selectable) return [...columns];
    const picker: ColumnDef<T> = {
      id: SELECT_COLUMN,
      size: 40,
      enableHiding: false,
      enableSorting: false,
      enableResizing: false,
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
    state: {
      sorting: sort_state,
      rowSelection: selection,
      columnVisibility: visibility,
      columnSizing: sizing,
    },
    ...(getRowId === undefined ? {} : { getRowId }),
    enableRowSelection: selectable,
    enableColumnResizing: resizable,
    columnResizeMode: "onChange",
    onColumnSizingChange: set_sizing,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sort_state) : updater;
      set_sort_state(next);
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(selection) : updater;
      set_selected_keys(Object.keys(next).filter((key) => next[key] === true));
    },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === "function" ? updater(visibility) : updater;
      set_hidden(Object.keys(next).filter((key) => next[key] === false));
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
  const pad_bottom = is_virtual ? virtualizer.getTotalSize() - (virtual_rows.at(-1)?.end ?? 0) : 0;
  const visible = is_virtual ? virtual_rows.map((entry) => rows[entry.index]) : rows;
  const leaf_columns = table.getVisibleLeafColumns();
  const column_count = leaf_columns.length;

  const keyboard = useGridKeyboard(true, PAGE_STEP);

  const ResizeByKey = useCallback(
    (id: string, delta: number): void => {
      set_sizing((current) => {
        const base = current[id] ?? table.getColumn(id)?.getSize() ?? DEFAULT_WIDTH;
        return { ...current, [id]: Math.max(MIN_WIDTH, base + delta) };
      });
    },
    [table],
  );

  const Export = useMemo(() => {
    if (exportCsv === false) return undefined;
    const options: DataGridExport = exportCsv === true ? {} : exportCsv;
    return (): void => {
      const data_columns = leaf_columns.filter((column) => column.id !== SELECT_COLUMN);
      const headers = data_columns.map((column) =>
        HeaderText(column.columnDef as ColumnDef<unknown>, column.id),
      );
      const source: Row<T>[] =
        options.selectionOnly === true && selected_keys.length > 0
          ? table.getRowModel().rows.filter((row) => row.getIsSelected())
          : table.getCoreRowModel().rows;
      const body = source.map((row) =>
        row
          .getAllCells()
          .filter(
            (cell: Cell<T, unknown>) =>
              cell.column.id !== SELECT_COLUMN && cell.column.getIsVisible(),
          )
          .map((cell: Cell<T, unknown>) => CellText(cell.getValue())),
      );
      DownloadCsv(ToCsv(headers, body, options.delimiter), options.filename ?? "datos");
    };
  }, [exportCsv, leaf_columns, selected_keys, table]);

  const show_toolbar =
    withToolbar ||
    onSearchChange !== undefined ||
    activeFilters.length > 0 ||
    bulkActions.length > 0 ||
    Export !== undefined ||
    toolbarSection !== undefined ||
    (withColumnMenu && hidden.length > 0);

  return (
    <div
      className={cx(styles.root, sprinkle_class, className)}
      style={sprinkle_style}
      data-virtual={is_virtual ? "true" : undefined}
    >
      {show_toolbar ? (
        <DataGridToolbar
          toolbarProps={toolbarProps}
          toolbarSearchProps={toolbarSearchProps}
          toolbarActionsProps={toolbarActionsProps}
          chipsProps={chipsProps}
          bulkBarProps={bulkBarProps}
          bulkCountProps={bulkCountProps}
          labels={text}
          search={search}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          activeFilters={activeFilters}
          onClearFilters={onClearFilters}
          bulkActions={bulkActions}
          selectedKeys={selected_keys}
          onClearSelection={() => {
            set_selected_keys([]);
          }}
          onExport={Export}
          section={toolbarSection}
          hiddenCount={hidden.length}
          onResetColumns={
            withColumnMenu
              ? () => {
                  set_hidden([]);
                }
              : undefined
          }
        />
      ) : null}

      {filterPanel === undefined ? null : (
        <Box
          role="group"
          aria-label={text.filters}
          {...panelProps}
          className={cx(styles.panel, panelProps?.className)}
        >
          {filterPanel}
        </Box>
      )}

      <div
        ref={scroller_ref}
        {...scrollerProps}
        className={cx(styles.scroller, scrollerProps?.className)}
        style={{ maxHeight, ...scrollerProps?.style }}
        data-testid="datagrid-scroller"
      >
        <table
          ref={keyboard.gridRef}
          {...tableProps}
          className={cx(styles.table, tableProps?.className)}
          aria-busy={loading ? "true" : undefined}
          onKeyDown={keyboard.OnKeyDown}
        >
          {caption === undefined ? null : (
            <caption className={captionVisible ? styles.caption : undefined}>
              {captionVisible ? (
                caption
              ) : (
                <Box
                  component="span"
                  {...captionProps}
                  className={cx(styles.caption, captionProps?.className)}
                >
                  {caption}
                </Box>
              )}
            </caption>
          )}
          <Box component="thead" {...headProps} className={cx(styles.head, headProps?.className)}>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header, index) => {
                  const column = header.column;
                  const direction = column.getIsSorted();
                  const label_text = HeaderText(column.columnDef as ColumnDef<unknown>, column.id);
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      {...thProps}
                      className={cx(styles.th, styles.cell_focus, thProps?.className)}
                      style={resizable ? { width: header.getSize() } : undefined}
                      {...(direction === false
                        ? {}
                        : { "aria-sort": direction === "asc" ? "ascending" : "descending" })}
                      {...keyboard.CellProps(0, index)}
                    >
                      {header.isPlaceholder ? null : (
                        <ColumnHeader
                          label={flexRender(column.columnDef.header, header.getContext())}
                          textLabel={label_text}
                          sortable={column.getCanSort()}
                          direction={direction}
                          onToggleSort={column.getToggleSortingHandler()}
                          onSort={(next) => {
                            if (next === false) {
                              column.clearSorting();
                              return;
                            }
                            column.toggleSorting(next === "desc", false);
                          }}
                          withMenu={withColumnMenu && column.id !== SELECT_COLUMN}
                          canHide={column.getCanHide()}
                          onHide={() => {
                            column.toggleVisibility(false);
                          }}
                          resizable={resizable && column.getCanResize()}
                          resizing={resizing_id === column.id}
                          onResizeStart={(event) => {
                            set_resizing_id(column.id);
                            header.getResizeHandler()(event.nativeEvent);
                            const Stop = (): void => {
                              set_resizing_id(null);
                              window.removeEventListener("pointerup", Stop);
                            };
                            window.addEventListener("pointerup", Stop);
                          }}
                          onResizeKey={(delta) => {
                            ResizeByKey(column.id, delta);
                          }}
                          labels={text}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </Box>
          <tbody>
            {pad_top > 0 ? (
              <tr aria-hidden="true">
                <td className={styles.spacer} colSpan={column_count} style={{ height: pad_top }} />
              </tr>
            ) : null}

            {rows.length === 0 ? (
              <tr>
                <Box
                  component="td"
                  colSpan={column_count}
                  {...emptyProps}
                  className={cx(styles.empty, emptyProps?.className)}
                >
                  {loading ? <Loader size="sm" label={text.loading} /> : (empty ?? text.empty)}
                </Box>
              </tr>
            ) : (
              visible.map((row, position) =>
                row === undefined ? null : (
                  <tr
                    key={row.id}
                    {...rowProps}
                    className={cx(styles.row, rowProps?.className)}
                    data-selected={row.getIsSelected() ? "true" : undefined}
                    data-clickable={onRowClick === undefined ? undefined : "true"}
                    {...(onRowClick === undefined
                      ? {}
                      : {
                          onClick: () => {
                            onRowClick(row.original);
                          },
                          onKeyDown: (event) => {
                            if (event.key !== "Enter") return;
                            event.preventDefault();
                            onRowClick(row.original);
                          },
                        })}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <td
                        key={cell.id}
                        {...tdProps}
                        className={cx(styles.td, styles.cell_focus, tdProps?.className)}
                        style={{ height: rowHeight }}
                        {...keyboard.CellProps(position + 1, index)}
                      >
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
        <Box {...footProps} className={cx(styles.foot, footProps?.className)}>
          <p className={styles.status} aria-live="polite">
            {text.page(table.getState().pagination.pageIndex + 1, table.getPageCount())}
          </p>
          <div className={styles.toolbar_gap}>
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
        </Box>
      ) : null}
    </div>
  );
}

DataGrid.displayName = "DataGrid";
