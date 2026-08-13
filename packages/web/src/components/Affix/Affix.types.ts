import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface AffixPosition {
  top?: number | string | undefined;
  right?: number | string | undefined;
  bottom?: number | string | undefined;
  left?: number | string | undefined;
}

export interface AffixProps extends Omit<
  StyleProps,
  "color" | "top" | "right" | "bottom" | "left" | "position" | "zIndex"
> {
  /** What is pinned to the viewport — a scroll-to-top, a floating action, a cookie bar. */
  children: ReactNode;
  /**
   * Which corner it sits in, as viewport insets. Setting `top` and `bottom` together stretches it
   * rather than centring it, so pick one of each axis. Numbers are pixels; strings pass through.
   * @default { bottom: 24, right: 24 }
   */
  position?: AffixPosition | undefined;
  /**
   * Where it sits in the stack. It starts high enough to clear page content but below the overlay
   * range, so a modal covers it — which is the behaviour a floating action wants.
   * @default 200
   */
  zIndex?: number | undefined;
  /**
   * Renders through a portal, out of the containing layout, which is what keeps an ancestor's
   * `transform` or `overflow` from capturing a fixed position. Turn it off only when the affix must
   * stay inside a region that manages its own stacking.
   * @default true
   */
  withinPortal?: boolean | undefined;
  /**
   * Whether it renders at all. False unmounts it outright — there is no transition here, so wrap it
   * in a `Transition` if it should fade rather than vanish.
   * @default true
   */
  visible?: boolean | undefined;
  className?: string | undefined;
}
