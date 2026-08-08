"use client";

import type { ComponentPropsWithoutRef, ReactElement, Ref } from "react";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities/useSyntheticListeners";

import { cx } from "../../utils/style-props.js";

import * as styles from "./DragDrop.css.js";
import { DotsGrid } from "../../glyphs/index.js";

const GRIP = <DotsGrid />;

export interface DragHandleProps {
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  activatorRef: Ref<HTMLButtonElement>;
  disabled: boolean;
  dragging: boolean;
  label: string;
  slotProps?: ComponentPropsWithoutRef<"button"> | undefined;
}

export function DragHandle(props: DragHandleProps): ReactElement {
  const { listeners, attributes, activatorRef, disabled, dragging, label, slotProps } = props;

  return (
    <button
      ref={activatorRef}
      type="button"
      disabled={disabled}
      data-dragging={dragging ? "true" : "false"}
      {...attributes}
      {...listeners}
      aria-label={label}
      {...slotProps}
      className={cx(styles.handle, slotProps?.className)}
    >
      {GRIP}
    </button>
  );
}

DragHandle.displayName = "DragHandle";
