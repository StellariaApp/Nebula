import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";
import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type CarouselAlign = "start" | "center" | "end";

export interface CarouselLabels {
  region: string;
  previous: string;
  next: string;
  slide: (index: number, total: number) => string;
  goTo: (index: number) => string;
}

export interface CarouselProps<T> extends Omit<StyleProps, "align"> {
  /**
   * Cada diapositiva. Se esparce sobre TODAS: llegan por `items`, no por composicion. Su ancho sale
   * de `slideSize`, asi que fijarlo aqui desajusta el arrastre de embla.
   */
  slideProps?: BoxSlotProps | undefined;
  /** El aviso de carrusel vacio. Solo se pinta sin `items` y con `empty`. */
  emptyProps?: TextSlotProps | undefined;
  /** La barra de controles. No se pinta sin `withControls` ni `withIndicators`. */
  controlsProps?: BoxSlotProps | undefined;
  /** La lista de indicadores. Solo con `withIndicators`. */
  indicatorsProps?: ComponentPropsWithoutRef<"ul"> | undefined;
  /** Cada indicador. Se esparce sobre TODOS; el activo lleva `aria-current`. */
  indicatorProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** El boton de anterior. Solo con `withControls`; su `disabled` sale de si queda algo detras. */
  previousProps?: ActionIconProps | undefined;
  /** El boton de siguiente. Solo con `withControls`; su `disabled` sale de si queda algo delante. */
  nextProps?: ActionIconProps | undefined;
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
