"use client";

import { useMemo, type ReactElement } from "react";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import * as dragStyles from "../DragDrop/DragDrop.css.js";
import { DragDropContext } from "../DragDrop/DragDropContext.js";
import { SortableItem } from "../DragDrop/SortableItem.js";

import * as styles from "./Kanban.css.js";
import { KanbanColumn } from "./KanbanColumn.js";
import type { KanbanBoardProps } from "./Kanban.types.js";
import { ColumnOf, MoveKey, useKanbanColumns } from "./useKanbanBoard.js";

export function KanbanBoard<T>(props: KanbanBoardProps<T>): ReactElement {
  const {
    columns,
    items,
    getKey,
    getColumn,
    renderCard,
    onMove,
    label,
    disabled = false,
    withHandle = false,
    columnWidth,
    labels,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const column_ids = useMemo(() => columns.map((column) => column.id), [columns]);

  const entries = useMemo(
    () => items.map((item, index) => ({ key: getKey(item, index), column: getColumn(item) })),
    [items, getKey, getColumn],
  );

  const by_key = useMemo(() => {
    const map = new Map<string, T>();
    items.forEach((item, index) => map.set(getKey(item, index), item));
    return map;
  }, [items, getKey]);

  const [groups, set_groups] = useKanbanColumns(column_ids, entries);

  const Resolve = (over_id: string): { column: string; index: number } | null => {
    const as_column = groups[over_id];
    if (as_column !== undefined) return { column: over_id, index: as_column.length };
    const column = ColumnOf(groups, over_id);
    if (column === null) return null;
    return { column, index: (groups[column] ?? []).indexOf(over_id) };
  };

  return (
    <DragDropContext
      {...(labels === undefined ? {} : { labels })}
      onDragOver={({ activeId, overId }) => {
        if (overId === null) return;
        const from = ColumnOf(groups, activeId);
        const target = Resolve(overId);
        if (from === null || target === null || from === target.column) return;
        set_groups(MoveKey(groups, activeId, target.column, target.index));
      }}
      onDragEnd={({ activeId, overId }) => {
        if (overId === null) return;
        const from = ColumnOf(groups, activeId);
        const target = Resolve(overId);
        if (from === null || target === null) return;
        if (from === target.column && (groups[from] ?? []).indexOf(activeId) === target.index) {
          return;
        }
        const next = MoveKey(groups, activeId, target.column, target.index);
        set_groups(next);
        onMove({
          key: activeId,
          from,
          to: target.column,
          index: (next[target.column] ?? []).indexOf(activeId),
          columns: next,
        });
      }}
    >
      <div
        className={cx(styles.board, sprinkle_class, className)}
        style={sprinkle_style}
        {...(label === undefined ? {} : { "aria-label": label })}
        {...rest}
      >
        {columns.map((column) => {
          const keys = groups[column.id] ?? [];
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={keys.length}
              {...(column.badge === undefined ? {} : { badge: column.badge })}
              {...(column.limit === undefined ? {} : { limit: column.limit })}
              {...(columnWidth === undefined ? {} : { width: columnWidth })}
            >
              <SortableContext items={keys} strategy={verticalListSortingStrategy}>
                <ul className={styles.column_body}>
                  {keys.length === 0 && column.empty !== undefined ? (
                    <li className={dragStyles.empty_slot}>{column.empty}</li>
                  ) : null}
                  {keys.map((key) => {
                    const item = by_key.get(key);
                    if (item === undefined) return null;
                    return (
                      <SortableItem
                        key={key}
                        id={key}
                        component="li"
                        disabled={disabled}
                        withHandle={withHandle}
                      >
                        {renderCard(item, column.id)}
                      </SortableItem>
                    );
                  })}
                </ul>
              </SortableContext>
            </KanbanColumn>
          );
        })}
      </div>
    </DragDropContext>
  );
}

KanbanBoard.displayName = "KanbanBoard";
