import type { ViewerLabels } from "./Viewer.types.js";

export const VIEWER_LABELS: ViewerLabels = {
  region: "Image viewer",
  close: "Close",
  previous: "Previous",
  next: "Next",
  download: "Download",
  counter: (position, total) => `${String(position)} / ${String(total)}`,
};
