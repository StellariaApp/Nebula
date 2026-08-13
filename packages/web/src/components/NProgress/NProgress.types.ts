import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface NProgressProps extends StyleProps {
  /**
   * Whether the bar is running. Without a `value` this is the whole control: turning it on starts
   * the bar creeping and turning it off unmounts it.
   * @default false
   */
  loading?: boolean | undefined;
  /**
   * The percentage, controlled. Passing it takes over from the automatic creep entirely — and it
   * also keeps the bar mounted once `loading` goes false, so a controlled bar has to be unmounted
   * by its parent when the work ends.
   */
  value?: number | undefined;
  /** The scale the bar is drawn from, at the 500 step. @default "primary" */
  color?: ColorExtended | undefined;
  /** How thick the bar is, in pixels. @default 3 */
  height?: number | undefined;
  /**
   * Where it sits in the stack. It starts above the affix range so a page-level bar stays visible
   * over floating content.
   * @default 400
   */
  zIndex?: number | undefined;
  /**
   * What is announced while the bar runs. The bar itself is a thin line with no text, so this is the
   * whole of what a screen reader gets. English by default (ADR-120).
   * @default "Loading the page"
   */
  label?: string | undefined;
  /**
   * Renders through a portal, which is what keeps the bar pinned to the top of the viewport rather
   * than to whatever region happens to contain it.
   * @default true
   */
  withinPortal?: boolean | undefined;
  className?: string | undefined;
}
