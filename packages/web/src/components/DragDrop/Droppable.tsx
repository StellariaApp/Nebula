"use client";

import type { ReactElement } from "react";

import { useDroppable } from "@dnd-kit/core";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./DragDrop.css.js";
import type { DroppableProps } from "./DragDrop.types.js";

export function Droppable(props: DroppableProps): ReactElement {
  const { id, children, disabled = false, label, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const { setNodeRef, isOver } = useDroppable({ id, disabled });

  return (
    <div
      ref={setNodeRef}
      className={cx(styles.droppable, sprinkle_class, className)}
      style={sprinkle_style}
      data-over={isOver && !disabled ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
      {...(label === undefined ? {} : { "aria-label": label })}
      {...rest}
    >
      {children}
    </div>
  );
}

Droppable.displayName = "Droppable";
