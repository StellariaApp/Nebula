"use client";

import type { ReactElement } from "react";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./DragDrop.css.js";
import { useDragDropLabels } from "./DragDropContext.js";
import { DragHandle } from "./DragHandle.js";
import type { DraggableProps } from "./DragDrop.types.js";

export function Draggable(props: DraggableProps): ReactElement {
  const {
    id,
    children,
    disabled = false,
    withHandle = false,
    label,
    className,
    ...style_rest
  } = props;
  const {
    className: sprinkle_class,
    style: sprinkle_style,
    rest,
  } = ExtractStyleProps(style_rest);

  const labels = useDragDropLabels();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, isDragging } =
    useDraggable({ id, disabled });

  const css_vars = assignInlineVars({
    [styles.transform]: CSS.Translate.toString(transform) ?? "none",
    [styles.transition]: "none",
  });

  const dragging = isDragging ? "true" : "false";
  const activator = withHandle
    ? { attributes, listeners }
    : { attributes: {} as typeof attributes, listeners: undefined };

  return (
    <div
      ref={setNodeRef}
      className={cx(styles.draggable, !withHandle && styles.grabbable, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-dragging={dragging}
      data-disabled={disabled ? "true" : "false"}
      {...(withHandle ? {} : attributes)}
      {...(withHandle ? {} : listeners)}
      {...(withHandle ? {} : { "aria-roledescription": labels.item })}
      {...(label === undefined ? {} : { "aria-label": label })}
      {...rest}
    >
      {withHandle ? (
        <div className={styles.row}>
          <DragHandle
            attributes={activator.attributes}
            listeners={activator.listeners}
            activatorRef={setActivatorNodeRef}
            disabled={disabled}
            dragging={isDragging}
            label={label === undefined ? labels.handle : `${labels.handle}: ${label}`}
          />
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

Draggable.displayName = "Draggable";
