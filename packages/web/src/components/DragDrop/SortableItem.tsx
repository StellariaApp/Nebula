"use client";

import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../utils/style-props.js";

import * as styles from "./DragDrop.css.js";
import * as drag_drop_vars from "./DragDrop.vars.css.js";
import { useDragDropLabels } from "./DragDropContext.js";
import { DragHandle } from "./DragHandle.js";

export interface SortableItemProps {
  id: string;
  children: ReactNode;
  disabled: boolean;
  withHandle: boolean;
  component: "li" | "div";
  handleProps?: ComponentPropsWithoutRef<"button"> | undefined;
}

export function SortableItem(props: SortableItemProps): ReactElement {
  const { id, children, disabled, withHandle, component, handleProps } = props;

  const labels = useDragDropLabels();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const css_vars = assignInlineVars({
    [drag_drop_vars.transform]: CSS.Transform.toString(transform) ?? "none",
    [drag_drop_vars.transition]: transition ?? "none",
  });

  const Element = component;

  return (
    <Element
      ref={setNodeRef}
      className={styles.draggable}
      style={css_vars}
      data-dragging={isDragging ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
    >
      {withHandle ? (
        <div className={styles.row}>
          <DragHandle
            attributes={attributes}
            listeners={listeners}
            activatorRef={setActivatorNodeRef}
            disabled={disabled}
            dragging={isDragging}
            label={labels.handle}
            slotProps={handleProps}
          />
          {children}
        </div>
      ) : (
        <div
          ref={setActivatorNodeRef}
          className={cx(styles.row, styles.grabbable)}
          data-dragging={isDragging ? "true" : "false"}
          data-disabled={disabled ? "true" : "false"}
          {...attributes}
          {...listeners}
          aria-roledescription={labels.item}
        >
          {children}
        </div>
      )}
    </Element>
  );
}

SortableItem.displayName = "SortableItem";
