import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { BoxSlotProps } from "../Box/Box.types.js";

export interface SegmentItemData {
  value: string;
  label: ReactNode;
  disabled?: boolean | undefined;
}

export type SegmentSize = "sm" | "md" | "lg" | "xl";

export type SegmentVariant = Extract<Variant, "filled" | "light">;

export interface SegmentProps extends StyleProps {
  children: ReactNode;
  value?: string | undefined;
  padded?: boolean | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  size?: SegmentSize | undefined;
  variant?: SegmentVariant | undefined;
  color?: ColorExtended | undefined;
  disabled?: boolean | undefined;
  fullWidth?: boolean | undefined;
  draggable?: boolean | undefined;
  className?: string | undefined;
}

export type SegmentControlData = ReadonlyArray<string | SegmentItemData>;

export interface SegmentControlProps extends StyleProps {
  /** Every tab. It spreads over ALL of them. The indicator is NOT exposed: motion moves it. */
  tabProps?: ComponentPropsWithoutRef<"button"> | undefined;
  data?: SegmentControlData | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface SegmentControlItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean | undefined;
}

export interface SegmentContentProps extends StyleProps {
  /** Every panel. It spreads over ALL of them, and composes above the item own `className`. */
  panelProps?: BoxSlotProps | undefined;
  children: ReactNode;
  swipeable?: boolean | undefined;
  /** Stretches the viewport and every panel to the height of the box. Takes precedence over `auto`. */
  fill?: boolean | undefined;
  /** Sizes the box to the active panel and springs to the next one. Ignored when `fill` is set. */
  auto?: boolean | undefined;
  /**
   * Same on the horizontal axis: every panel takes its own width and the box springs to the active
   * one, capped at the room it has. Panels without a width of their own collapse, so it does not
   * suit text that is meant to wrap.
   */
  autoWidth?: boolean | undefined;
  /** Wraps the swipe around, so the first panel follows the last one. Needs two panels or more. */
  loop?: boolean | undefined;
  className?: string | undefined;
}

export interface SegmentContentItemProps {
  value: string;
  children: ReactNode;
  className?: string | undefined;
}

export interface SegmentSectionProps extends StyleProps {
  children: ReactNode;
  className?: string | undefined;
}
