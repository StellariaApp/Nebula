import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export type CarouselAlign = "start" | "center" | "end";

export interface CarouselLabels {
  region: string;
  previous: string;
  next: string;
  slide: (index: number, total: number) => string;
  goTo: (index: number) => string;
}

export interface CarouselProps<T> extends Omit<StyleProps, "align"> {
  items: readonly T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  slideSize?: number | string | undefined;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | undefined;
  align?: CarouselAlign | undefined;
  loop?: boolean | undefined;
  dragFree?: boolean | undefined;
  axis?: "x" | "y" | undefined;
  withControls?: boolean | undefined;
  withIndicators?: boolean | undefined;
  slidesToScroll?: number | undefined;
  index?: number | undefined;
  defaultIndex?: number | undefined;
  onIndexChange?: ((index: number) => void) | undefined;
  empty?: ReactNode | undefined;
  label?: string | undefined;
  labels?: Partial<CarouselLabels> | undefined;
  className?: string | undefined;
}
