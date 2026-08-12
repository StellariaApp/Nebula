import type { ReactNode } from "react";

import type { ColorExtended, PermissionProps } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { SegmentOverflowMode, SegmentSize, SegmentVariant } from "../Segment/Segment.types.js";

export interface TabItem extends PermissionProps {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean | undefined;
}

export interface TabsProps extends StyleProps {
  data: readonly TabItem[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  size?: SegmentSize | undefined;
  variant?: SegmentVariant | undefined;
  color?: ColorExtended | undefined;
  disabled?: boolean | undefined;
  fullWidth?: boolean | undefined;
  swipeable?: boolean | undefined;
  draggable?: boolean | undefined;
  /** Stretches the panels to the height of the box. Takes precedence over `auto`. */
  fill?: boolean | undefined;
  /** Sizes the box to the active panel and springs to the next one. Ignored when `fill` is set. */
  auto?: boolean | undefined;
  /** Same on the horizontal axis: every panel takes its own width and the box springs to it. */
  autoWidth?: boolean | undefined;
  /** Wraps the swipe around, so the first panel follows the last one. Needs two panels or more. */
  loop?: boolean | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
  padded?: boolean | undefined;
  /** What the tab bar does when its tabs do not fit: `scroll` slides it, `wrap` breaks it into rows. */
  overflowMode?: SegmentOverflowMode | undefined;
}
