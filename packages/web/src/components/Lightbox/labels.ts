import type { LightboxLabels } from "./Lightbox.types.js";

export const LIGHTBOX_LABELS: LightboxLabels = {
  region: "Visor de imágenes",
  close: "Cerrar el visor",
  previous: "Imagen anterior",
  next: "Imagen siguiente",
  zoomIn: "Acercar",
  zoomOut: "Alejar",
  resetZoom: "Restablecer el zoom",
  play: "Iniciar el pase de diapositivas",
  pause: "Pausar el pase de diapositivas",
  counter: (index, total) => `${String(index)} de ${String(total)}`,
  zoomLevel: (percent) => `Zoom al ${String(percent)} %`,
};
