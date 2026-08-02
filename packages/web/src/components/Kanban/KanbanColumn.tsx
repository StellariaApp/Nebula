"use client";

import { useId, type ReactElement } from "react";

import { useDroppable } from "@dnd-kit/core";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";

import * as styles from "./Kanban.css.js";
import type { KanbanColumnProps } from "./Kanban.types.js";

const DEFAULT_WIDTH = 280;

export function KanbanColumn(props: KanbanColumnProps): ReactElement {
  const {
    id,
    title,
    children,
    badge,
    count,
    limit,
    empty,
    width = DEFAULT_WIDTH,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const heading_id = useId();
  const { setNodeRef, isOver } = useDroppable({ id });

  const css_vars = assignInlineVars({ [styles.columnWidth]: LengthToCss(width) });
  const over_limit = limit !== undefined && count !== undefined && count > limit;

  return (
    <section
      ref={setNodeRef}
      className={cx(styles.column, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-over={isOver ? "true" : "false"}
      aria-labelledby={heading_id}
      {...rest}
    >
      <header className={styles.columnHeader}>
        <h3 className={styles.columnTitle} id={heading_id}>
          {title}
        </h3>
        {badge ??
          (count === undefined ? null : (
            <span className={styles.columnCount} data-over-limit={over_limit ? "true" : "false"}>
              {limit === undefined ? count : `${String(count)}/${String(limit)}`}
            </span>
          ))}
      </header>
      {children === undefined ? <p className={styles.columnEmpty}>{empty}</p> : children}
    </section>
  );
}

KanbanColumn.displayName = "KanbanColumn";
