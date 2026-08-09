import type { DragDropLabels } from "./DragDrop.types.js";

export const DRAG_DROP_LABELS: DragDropLabels = {
  instructions:
    "Press space or enter to pick the item up. Move it with the arrow keys, drop it with space or enter, and cancel with escape.",
  start: (id) => `You have picked up item ${id}.`,
  over: (id, overId) => `Item ${id} is over the position of ${overId}.`,
  drop: (id, overId) =>
    overId === null
      ? `Item ${id} was dropped back in its original position.`
      : `Item ${id} was dropped over ${overId}.`,
  cancel: (id) => `The move of ${id} was cancelled, and it returns to its original position.`,
  handle: "Reorder",
  item: "elemento arrastrable",
};

export function ResolveLabels(labels: Partial<DragDropLabels> | undefined): DragDropLabels {
  return labels === undefined ? DRAG_DROP_LABELS : { ...DRAG_DROP_LABELS, ...labels };
}
