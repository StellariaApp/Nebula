"use client";

import { useId, type ReactElement } from "react";

import { useDroppable } from "@dnd-kit/core";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";

import * as styles from "./Kanban.css.js";
import * as kanban_vars from "./Kanban.vars.css.js";
import type { KanbanColumnProps } from "./Kanban.types.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

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
    headerProps,
    titleProps,
    countProps,
    emptyProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const heading_id = useId();
  const { setNodeRef, isOver } = useDroppable({ id });

  const css_vars = assignInlineVars({ [kanban_vars.columnWidth]: LengthToCss(width) });
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
      <Box
        component="header"
        {...headerProps}
        className={cx(styles.column_header, headerProps?.className)}
      >
        <Text
          component="h3"

          {...titleProps}
          id={heading_id}
          className={cx(styles.column_title, titleProps?.className)}
        >
          {title}
        </Text>
        {badge ??
          (count === undefined ? null : (
            <Text
              component="span"
              data-over-limit={over_limit ? "true" : "false"}
              {...countProps}
              className={cx(styles.column_count, countProps?.className)}
            >
              {limit === undefined ? count : `${String(count)}/${String(limit)}`}
            </Text>
          ))}
      </Box>
      {children === undefined ? (
        <Text {...emptyProps} className={cx(styles.column_empty, emptyProps?.className)}>
          {empty}
        </Text>
      ) : (
        children
      )}
    </section>
  );
}

KanbanColumn.displayName = "KanbanColumn";
