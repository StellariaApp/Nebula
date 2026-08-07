"use client";

import type { ReactElement, ReactNode } from "react";

import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { Button } from "../Button/Button.js";
import { Tag } from "../Tag/Tag.js";
import { Text } from "../Text/Text.js";
import { SearchInput } from "../SearchInput/SearchInput.js";

import * as styles from "./DataGrid.css.js";
import type {
  DataGridBulkAction,
  DataGridFilterChip,
  DataGridLabels,
  DataGridToolbarSlotProps,
} from "./DataGrid.types.js";

export interface DataGridToolbarProps extends DataGridToolbarSlotProps {
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
    toolbarProps,
    toolbarSearchProps,
    toolbarActionsProps,
    chipsProps,
    bulkBarProps,
    bulkCountProps,
  } = props;

  const has_selection = selectedKeys.length > 0 && bulkActions.length > 0;

  return (
    <Box {...toolbarProps} className={cx(styles.toolbar, toolbarProps?.className)}>
      {onSearchChange === undefined ? null : (
        <Box
          {...toolbarSearchProps}
          className={cx(styles.toolbar_search, toolbarSearchProps?.className)}
        >
          <SearchInput
            value={search ?? ""}
            onChange={onSearchChange}
            aria-label={labels.search}
            size="sm"
            {...(searchPlaceholder === undefined ? {} : { placeholder: searchPlaceholder })}
          />
        </Box>
      )}

      <Box
        {...toolbarActionsProps}
        className={cx(styles.toolbar_gap, toolbarActionsProps?.className)}
      >
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
      </Box>

      {activeFilters.length > 0 ? (
        <Box
          role="group"
          aria-label={labels.filters}
          {...chipsProps}
          className={cx(styles.chips, chipsProps?.className)}
        >
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
        </Box>
      ) : null}

      {has_selection ? (
        <Box
          role="group"
          aria-label={labels.selectedCount(selectedKeys.length)}
          {...bulkBarProps}
          className={cx(styles.bulk_bar, bulkBarProps?.className)}
        >
          <Text
            aria-live="polite"
            {...bulkCountProps}
            className={cx(styles.bulk_count, bulkCountProps?.className)}
          >
            {labels.selectedCount(selectedKeys.length)}
          </Text>
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
        </Box>
      ) : null}
    </Box>
  );
}

DataGridToolbar.displayName = "DataGridToolbar";
