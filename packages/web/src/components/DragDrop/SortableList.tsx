"use client";

import { useMemo, type ReactElement } from "react";

import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./DragDrop.css.js";
import { DragDropContext } from "./DragDropContext.js";
import { SortableItem } from "./SortableItem.js";
import type { SortableListProps } from "./DragDrop.types.js";

function Move<T>(items: readonly T[], from: number, to: number): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return next;
  next.splice(to, 0, moved);
  return next;
}

export function SortableList<T>(props: SortableListProps<T>): ReactElement {
  const {
    items,
    getKey,
    renderItem,
    onReorder,
    axis = "y",
    gap = "sm",
    disabled = false,
    withHandle = true,
    label,
    empty,
    labels,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const keys = useMemo(() => items.map((item, index) => getKey(item, index)), [items, getKey]);

  return (
    <DragDropContext
      axis={axis}
      {...(labels === undefined ? {} : { labels })}
      onDragEnd={({ activeId, overId }) => {
        if (overId === null || activeId === overId) return;
        const from = keys.indexOf(activeId);
        const to = keys.indexOf(overId);
        if (from < 0 || to < 0) return;
        onReorder(Move(items, from, to), from, to);
      }}
    >
      <SortableContext
        items={keys}
        strategy={axis === "x" ? horizontalListSortingStrategy : verticalListSortingStrategy}
      >
        <ul
          className={cx(styles.list, styles.axis[axis], styles.gap[gap], sprinkle_class, className)}
          style={sprinkle_style}
          {...(label === undefined ? {} : { "aria-label": label })}
          {...rest}
        >
          {items.length === 0 && empty !== undefined ? (
            <li className={styles.empty_slot}>{empty}</li>
          ) : null}
          {items.map((item, index) => {
            const key = keys[index] as string;
            return (
              <SortableItem
                key={key}
                id={key}
                component="li"
                disabled={disabled}
                withHandle={withHandle}
              >
                {renderItem(item, index)}
              </SortableItem>
            );
          })}
        </ul>
      </SortableContext>
    </DragDropContext>
  );
}

SortableList.displayName = "SortableList";
