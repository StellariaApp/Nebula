import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { BoxSlotProps } from "../Box/Box.types.js";

export interface SegmentItemData {
  value: string;
  label: ReactNode;
  disabled?: boolean | undefined;
}

export type SegmentSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SegmentVariant = Extract<Variant, "filled" | "light">;

export type SegmentOverflowMode = "visible" | "scroll" | "wrap";

export interface SegmentProps extends StyleProps, SegmentLayoutProps {
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
  /**
   * What the control does when its tabs do not fit. `scroll` slides the bar and keeps one row,
   * `wrap` breaks it into rows and moves the indicator on both axes. Both turn the drag gesture off.
   * Not named `overflow`: that one is a style prop and lands on the same element.
   */
  overflowMode?: SegmentOverflowMode | undefined;
  className?: string | undefined;
}

/**
 * How the panels lay out. Declarable on `<Segment>` and inherited by every `Segment.Content` under
 * it; what a content passes for itself wins (ADR-154).
 */
export interface SegmentLayoutProps {
  /**
   * The swipe across the panels. With it off the transition is a fade, not a slide: the sideways
   * travel only exists to follow the finger, and there is no finger.
   */
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
  /**
   * Mounts ONLY the active panel and unmounts the one it leaves. Turns a segment whose panels are
   * whole screens from six live trees into one. It forces `swipeable` off — swiping needs the
   * neighbour mounted, which is the cost this removes — so the transition is a fade.
   *
   * Returning to a panel mounts it again: the chunk is cached, so it costs render, not network.
   * State that has to survive the trip lives above the panel.
   */
  lazy?: boolean | undefined;
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
  /** Ties this tab to the content item carrying the same value. They have to match exactly. */
  value: string;
  /** The tab label. */
  children: ReactNode;
  /**
   * Blocks selection of this tab. It stays visible and stays in the tab order, so the user can reach
   * it and learn it exists — which is why its panel still has to be a sensible thing to be denied.
   */
  disabled?: boolean | undefined;
}

export interface SegmentContentProps extends StyleProps, SegmentLayoutProps {
  /** Every panel. It spreads over ALL of them, and composes above the item own `className`. */
  panelProps?: BoxSlotProps | undefined;
  children: ReactNode;
  className?: string | undefined;
}

export interface SegmentContentItemProps {
  /** Ties this panel to the tab carrying the same value. They have to match exactly. */
  value: string;
  /** The panel's content. */
  children: ReactNode;
  /** Lands on this panel only, above whatever `panelProps` spreads over all of them. */
  className?: string | undefined;
}

export interface SegmentSectionProps extends StyleProps {
  children: ReactNode;
  className?: string | undefined;
}
