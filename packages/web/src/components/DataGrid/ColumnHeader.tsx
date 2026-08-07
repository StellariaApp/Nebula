"use client";

import { useMemo, type PointerEvent, type ReactElement, type ReactNode } from "react";

import { cx } from "../../utils/style-props.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Box } from "../Box/Box.js";
import { Menu } from "../Menu/index.js";

import type { MenuItemData } from "../Menu/Menu.types.js";

import * as styles from "./DataGrid.css.js";
import type { DataGridColumnSlotProps, DataGridLabels } from "./DataGrid.types.js";
import { DotsVertical } from "../../glyphs/index.js";

const SORT_ICON = { asc: "▲", desc: "▼", none: "↕" } as const;

const DOTS = <DotsVertical />;

export interface ColumnHeaderProps extends DataGridColumnSlotProps {
  label: ReactNode;
  textLabel: string;
  sortable: boolean;
  direction: "asc" | "desc" | false;
  onToggleSort: ((event: unknown) => void) | undefined;
  onSort: (direction: "asc" | "desc" | false) => void;
  withMenu: boolean;
  canHide: boolean;
  onHide: () => void;
  resizable: boolean;
  resizing: boolean;
  onResizeStart: ((event: PointerEvent<HTMLButtonElement>) => void) | undefined;
  onResizeKey: ((delta: number) => void) | undefined;
  labels: DataGridLabels;
}

const RESIZE_STEP = 16;

export function ColumnHeader(props: ColumnHeaderProps): ReactElement {
  const {
    label,
    textLabel,
    sortable,
    direction,
    onToggleSort,
    onSort,
    withMenu,
    canHide,
    onHide,
    resizable,
    resizing,
    onResizeStart,
    onResizeKey,
    labels,
    headCellProps,
    sortButtonProps,
    sortIconProps,
    columnMenuProps,
    resizerProps,
  } = props;

  const items = useMemo<MenuItemData[]>(() => {
    const list: MenuItemData[] = [];
    if (sortable) {
      list.push(
        { key: "asc", label: labels.sortAscending },
        { key: "desc", label: labels.sortDescending },
        { key: "none", label: labels.clearSort, disabled: direction === false },
      );
    }
    if (canHide) list.push({ key: "hide", label: labels.hideColumn });
    return list;
  }, [sortable, canHide, direction, labels]);

  return (
    <Box {...headCellProps} className={cx(styles.head_cell, headCellProps?.className)}>
      {sortable && onToggleSort !== undefined ? (
        <button
          type="button"
          onClick={onToggleSort}
          {...sortButtonProps}
          className={cx(styles.sort_button, sortButtonProps?.className)}
        >
          {label}
          <Box
            component="span"
            aria-hidden="true"
            {...sortIconProps}
            className={cx(styles.sort_icon, sortIconProps?.className)}
          >
            {direction === false ? SORT_ICON.none : SORT_ICON[direction]}
          </Box>
        </button>
      ) : (
        label
      )}

      {withMenu && items.length > 0 ? (
        <Menu
          items={items}
          aria-label={labels.columnMenu(textLabel)}
          placement="bottom end"
          onAction={(key) => {
            if (key === "hide") {
              onHide();
              return;
            }
            onSort(key === "none" ? false : (key as "asc" | "desc"));
          }}
          trigger={
            <ActionIcon
              variant="ghost"
              size="xs"
              aria-label={labels.columnMenu(textLabel)}
              {...columnMenuProps}
            >
              {DOTS}
            </ActionIcon>
          }
        />
      ) : null}

      {resizable ? (
        <button
          type="button"
          aria-label={labels.resize(textLabel)}
          data-resizing={resizing ? "true" : undefined}
          {...(onResizeStart === undefined ? {} : { onPointerDown: onResizeStart })}
          onKeyDown={(event) => {
            if (onResizeKey === undefined) return;
            if (event.key === "ArrowRight") {
              event.preventDefault();
              onResizeKey(RESIZE_STEP);
              return;
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              onResizeKey(-RESIZE_STEP);
            }
          }}
          {...resizerProps}
          className={cx(styles.resizer, resizerProps?.className)}
        />
      ) : null}
    </Box>
  );
}

ColumnHeader.displayName = "DataGridColumnHeader";
