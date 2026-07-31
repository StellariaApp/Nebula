"use client";

import { createContext, useContext, useMemo, useState, type ReactElement } from "react";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type Modifier,
  type ScreenReaderInstructions,
} from "@dnd-kit/core";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import * as styles from "./DragDrop.css.js";
import type { DragDropContextProps, DragDropLabels, DragMove } from "./DragDrop.types.js";
import { ResolveLabels } from "./labels.js";

const ACTIVATION_DISTANCE = 6;

interface DragDropValue {
  labels: DragDropLabels;
}

const DragDropCtx = createContext<DragDropValue | null>(null);

export function useDragDropLabels(): DragDropLabels {
  return useContext(DragDropCtx)?.labels ?? ResolveLabels(undefined);
}

function ToMove(event: DragStartEvent | DragOverEvent | DragEndEvent): DragMove {
  const over = "over" in event ? event.over : null;
  return { activeId: String(event.active.id), overId: over == null ? null : String(over.id) };
}

export function DragDropContext(props: DragDropContextProps): ReactElement {
  const {
    children,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
    axis = "both",
    restrictToParent = false,
    overlay,
    labels,
  } = props;

  const resolved = useMemo(() => ResolveLabels(labels), [labels]);
  const [active_id, set_active_id] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: ACTIVATION_DISTANCE } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const modifiers = useMemo(() => {
    const list: Modifier[] = [];
    if (axis === "x") list.push(restrictToHorizontalAxis);
    if (axis === "y") list.push(restrictToVerticalAxis);
    if (restrictToParent) list.push(restrictToParentElement);
    return list;
  }, [axis, restrictToParent]);

  const instructions = useMemo<ScreenReaderInstructions>(
    () => ({ draggable: resolved.instructions }),
    [resolved],
  );

  const announcements = useMemo<Announcements>(
    () => ({
      onDragStart: ({ active }) => resolved.start(String(active.id)),
      onDragOver: ({ active, over }) =>
        over == null ? undefined : resolved.over(String(active.id), String(over.id)),
      onDragEnd: ({ active, over }) =>
        resolved.drop(String(active.id), over == null ? null : String(over.id)),
      onDragCancel: ({ active }) => resolved.cancel(String(active.id)),
    }),
    [resolved],
  );

  const value = useMemo<DragDropValue>(() => ({ labels: resolved }), [resolved]);

  return (
    <DragDropCtx.Provider value={value}>
      <DndContext
        sensors={sensors}
        modifiers={modifiers}
        accessibility={{ announcements, screenReaderInstructions: instructions }}
        onDragStart={(event) => {
          set_active_id(String(event.active.id));
          onDragStart?.(ToMove(event));
        }}
        onDragOver={(event) => {
          onDragOver?.(ToMove(event));
        }}
        onDragEnd={(event) => {
          set_active_id(null);
          onDragEnd?.(ToMove(event));
        }}
        onDragCancel={(event) => {
          set_active_id(null);
          onDragCancel?.(ToMove(event));
        }}
      >
        {children}
        {overlay === undefined ? null : (
          <DragOverlay className={styles.overlay}>
            {active_id === null ? null : overlay(active_id)}
          </DragOverlay>
        )}
      </DndContext>
    </DragDropCtx.Provider>
  );
}

DragDropContext.displayName = "DragDropContext";
