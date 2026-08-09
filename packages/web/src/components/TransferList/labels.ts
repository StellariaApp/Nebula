import type { TransferListLabels } from "./TransferList.types.js";

export const TRANSFER_LIST_LABELS: TransferListLabels = {
  add: "Add selected",
  addAll: "Add all",
  remove: "Remove selected",
  removeAll: "Remove all",
  search: "Search the list",
  empty: "No items",
  count: (selected, total) =>
    selected === 0 ? String(total) : `${String(selected)}/${String(total)}`,
};
