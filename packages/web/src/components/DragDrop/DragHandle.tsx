"use client";

import type { ReactElement, Ref } from "react";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities/useSyntheticListeners";

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
}

export function DragHandle(props: DragHandleProps): ReactElement {
  const { listeners, attributes, activatorRef, disabled, dragging, label } = props;

  return (
    <button
      ref={activatorRef}
      type="button"
      className={styles.handle}
      disabled={disabled}
      data-dragging={dragging ? "true" : "false"}
      {...attributes}
      {...listeners}
      aria-label={label}
    >
      {GRIP}
    </button>
  );
}

DragHandle.displayName = "DragHandle";
