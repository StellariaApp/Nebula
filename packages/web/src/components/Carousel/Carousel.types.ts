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
   * Every slide. It spreads over ALL of them: they arrive through `items`, not through composition.
   * Their width comes from `slideSize`, so pinning it here throws off the embla drag.
   */
  slideProps?: BoxSlotProps | undefined;
  /** The empty-carousel notice. Only rendered with no `items` and with `empty`. */
  emptyProps?: TextSlotProps | undefined;
  /** The control bar. Not rendered without `withControls` or `withIndicators`. */
  controlsProps?: BoxSlotProps | undefined;
  /** The indicator list. Only with `withIndicators`. */
  indicatorsProps?: ComponentPropsWithoutRef<"ul"> | undefined;
  /** Every indicator. It spreads over ALL of them; the active one carries `aria-current`. */
  indicatorProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** The previous button. Only with `withControls`; its `disabled` comes from whether anything is left behind. */
  previousProps?: ActionIconProps | undefined;
  /** The next button. Only with `withControls`; its `disabled` comes from whether anything is left ahead. */
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
