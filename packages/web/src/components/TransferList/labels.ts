import type { TransferListLabels } from "./TransferList.types.js";

export const TRANSFER_LIST_LABELS: TransferListLabels = {
  add: "Añadir lo seleccionado",
  addAll: "Añadir todo",
  remove: "Quitar lo seleccionado",
  removeAll: "Quitar todo",
  search: "Buscar en la lista",
  empty: "Sin elementos",
  count: (selected, total) =>
    selected === 0 ? String(total) : `${String(selected)}/${String(total)}`,
};
