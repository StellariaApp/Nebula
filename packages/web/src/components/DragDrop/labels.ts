import type { DragDropLabels } from "./DragDrop.types.js";

export const DRAG_DROP_LABELS: DragDropLabels = {
  instructions:
    "Pulsa espacio o intro para levantar el elemento. Muévelo con las flechas, suelta con espacio o intro y cancela con escape.",
  start: (id) => `Has levantado el elemento ${id}.`,
  over: (id, overId) => `El elemento ${id} está sobre la posición de ${overId}.`,
  drop: (id, overId) =>
    overId === null
      ? `El elemento ${id} se ha soltado en su posición original.`
      : `El elemento ${id} se ha soltado sobre ${overId}.`,
  cancel: (id) => `Se ha cancelado el movimiento de ${id}, que vuelve a su posición original.`,
  handle: "Reordenar",
  item: "elemento arrastrable",
};

export function ResolveLabels(labels: Partial<DragDropLabels> | undefined): DragDropLabels {
  return labels === undefined ? DRAG_DROP_LABELS : { ...DRAG_DROP_LABELS, ...labels };
}
