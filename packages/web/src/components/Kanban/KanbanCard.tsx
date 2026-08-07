"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Kanban.css.js";
import type { KanbanCardProps } from "./Kanban.types.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

export function KanbanCard(props: KanbanCardProps): ReactElement {
  const {
    title,
    description,
    meta,
    badge,
    children,
    className,
    headProps,
    titleProps,
    descriptionProps,
    metaProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const has_head = title !== undefined || badge !== undefined;

  return (
    <div className={cx(styles.card, sprinkle_class, className)} style={sprinkle_style} {...rest}>
      {has_head ? (
        <Box {...headProps} className={cx(styles.card_head, headProps?.className)}>
          {title === undefined ? null : (
            <Text {...titleProps} className={cx(styles.card_title, titleProps?.className)}>
              {title}
            </Text>
          )}
          {badge}
        </Box>
      ) : null}
      {description === undefined ? null : (
        <Text
          {...descriptionProps}
          className={cx(styles.card_description, descriptionProps?.className)}
        >
          {description}
        </Text>
      )}
      {children}
      {meta === undefined ? null : (
        <Box {...metaProps} className={cx(styles.card_meta, metaProps?.className)}>
          {meta}
        </Box>
      )}
    </div>
  );
}

KanbanCard.displayName = "KanbanCard";
