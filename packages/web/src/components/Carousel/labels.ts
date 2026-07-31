import type { CarouselLabels } from "./Carousel.types.js";

export const CAROUSEL_LABELS: CarouselLabels = {
  region: "Carrusel",
  previous: "Anterior",
  next: "Siguiente",
  slide: (index, total) => `${String(index)} de ${String(total)}`,
  goTo: (index) => `Ir a la diapositiva ${String(index)}`,
};
