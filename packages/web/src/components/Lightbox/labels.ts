import type { LightboxLabels } from "./Lightbox.types.js";

export const LIGHTBOX_LABELS: LightboxLabels = {
  region: "Image viewer",
  close: "Close the viewer",
  previous: "Previous image",
  next: "Next image",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  resetZoom: "Reset the zoom",
  play: "Start the slideshow",
  pause: "Pause the slideshow",
  counter: (index, total) => `${String(index)} de ${String(total)}`,
  zoomLevel: (percent) => `Zoom at ${String(percent)}%`,
};
