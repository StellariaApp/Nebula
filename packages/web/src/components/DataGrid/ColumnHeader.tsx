"use client";

import { useMemo, type PointerEvent, type ReactElement, type ReactNode } from "react";

import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Menu } from "../Menu/index.js";

import type { MenuItemData } from "../Menu/Menu.types.js";

import * as styles from "./DataGrid.css.js";
import type { DataGridLabels } from "./DataGrid.types.js";
import { DotsVertical } from "../../glyphs/index.js";

const SORT_ICON = { asc: "▲", desc: "▼", none: "↕" } as const;

const DOTS = <DotsVertical />;

export interface ColumnHeaderProps {
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
    <div className={styles.head_cell}>
      {sortable && onToggleSort !== undefined ? (
        <button type="button" className={styles.sort_button} onClick={onToggleSort}>
          {label}
          <span className={styles.sort_icon} aria-hidden="true">
            {direction === false ? SORT_ICON.none : SORT_ICON[direction]}
          </span>
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
            <ActionIcon variant="ghost" size="xs" aria-label={labels.columnMenu(textLabel)}>
              {DOTS}
            </ActionIcon>
          }
        />
      ) : null}

      {resizable ? (
        <button
          type="button"
          className={styles.resizer}
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
        />
      ) : null}
    </div>
  );
}

ColumnHeader.displayName = "DataGridColumnHeader";
