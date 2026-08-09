import type { CarouselLabels } from "./Carousel.types.js";

export const CAROUSEL_LABELS: CarouselLabels = {
  region: "Carousel",
  previous: "Previous",
  next: "Next",
  slide: (index, total) => `${String(index)} de ${String(total)}`,
  goTo: (index) => `Go to slide ${String(index)}`,
};
