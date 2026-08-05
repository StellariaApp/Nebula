"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Kanban.css.js";
import type { KanbanCardProps } from "./Kanban.types.js";

export function KanbanCard(props: KanbanCardProps): ReactElement {
  const { title, description, meta, badge, children, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const has_head = title !== undefined || badge !== undefined;

  return (
    <div className={cx(styles.card, sprinkle_class, className)} style={sprinkle_style} {...rest}>
      {has_head ? (
        <div className={styles.card_head}>
          {title === undefined ? null : <p className={styles.card_title}>{title}</p>}
          {badge}
        </div>
      ) : null}
      {description === undefined ? null : <p className={styles.card_description}>{description}</p>}
      {children}
      {meta === undefined ? null : <div className={styles.card_meta}>{meta}</div>}
    </div>
  );
}

KanbanCard.displayName = "KanbanCard";
