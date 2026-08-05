"use client";

import type { ReactElement, ReactNode } from "react";

import { Button } from "../Button/Button.js";
import { Tag } from "../Tag/Tag.js";
import { SearchInput } from "../SearchInput/SearchInput.js";

import * as styles from "./DataGrid.css.js";
import type { DataGridBulkAction, DataGridFilterChip, DataGridLabels } from "./DataGrid.types.js";

export interface DataGridToolbarProps {
  labels: DataGridLabels;
  search: string | undefined;
  onSearchChange: ((query: string) => void) | undefined;
  searchPlaceholder: string | undefined;
  activeFilters: readonly DataGridFilterChip[];
  onClearFilters: (() => void) | undefined;
  bulkActions: readonly DataGridBulkAction[];
  selectedKeys: readonly string[];
  onClearSelection: () => void;
  onExport: (() => void) | undefined;
  section: ReactNode;
  hiddenCount: number;
  onResetColumns: (() => void) | undefined;
}

export function DataGridToolbar(props: DataGridToolbarProps): ReactElement {
  const {
    labels,
    search,
    onSearchChange,
    searchPlaceholder,
    activeFilters,
    onClearFilters,
    bulkActions,
    selectedKeys,
    onClearSelection,
    onExport,
    section,
    hiddenCount,
    onResetColumns,
  } = props;

  const has_selection = selectedKeys.length > 0 && bulkActions.length > 0;

  return (
    <div className={styles.toolbar}>
      {onSearchChange === undefined ? null : (
        <div className={styles.toolbar_search}>
          <SearchInput
            value={search ?? ""}
            onChange={onSearchChange}
            aria-label={labels.search}
            size="sm"
            {...(searchPlaceholder === undefined ? {} : { placeholder: searchPlaceholder })}
          />
        </div>
      )}

      <div className={styles.toolbar_gap}>
        {section}
        {hiddenCount > 0 && onResetColumns !== undefined ? (
          <Button size="sm" variant="ghost" onPress={onResetColumns}>
            {labels.resetColumns}
          </Button>
        ) : null}
        {onExport === undefined ? null : (
          <Button size="sm" variant="outline" onPress={onExport}>
            {labels.exportCsv}
          </Button>
        )}
      </div>

      {activeFilters.length > 0 ? (
        <div className={styles.chips} role="group" aria-label={labels.filters}>
          {activeFilters.map((filter) => (
            <Tag
              key={filter.id}
              size="sm"
              variant="light"
              {...(filter.onClear === undefined
                ? {}
                : { onRemove: filter.onClear, removeLabel: labels.clearFilter })}
            >
              {filter.label}
            </Tag>
          ))}
          {onClearFilters === undefined ? null : (
            <Button size="sm" variant="ghost" onPress={onClearFilters}>
              {labels.clearFilters}
            </Button>
          )}
        </div>
      ) : null}

      {has_selection ? (
        <div
          className={styles.bulk_bar}
          role="group"
          aria-label={labels.selectedCount(selectedKeys.length)}
        >
          <p className={styles.bulk_count} aria-live="polite">
            {labels.selectedCount(selectedKeys.length)}
          </p>
          {bulkActions.map((action) => (
            <Button
              key={action.id}
              size="sm"
              variant={action.destructive === true ? "outline" : "light"}
              {...(action.destructive === true ? { color: "error" } : {})}
              {...(action.icon === undefined ? {} : { leftSection: action.icon })}
              onPress={() => {
                action.onAction(selectedKeys);
              }}
            >
              {action.label}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onPress={onClearSelection}>
            {labels.clearSelection}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

DataGridToolbar.displayName = "DataGridToolbar";
