import type { CSSProperties, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface CollapseProps extends StyleProps {
  /**
   * Whether the block is open. Closed is not unmounted: the children stay in the DOM, marked
   * `aria-hidden` and `inert`, so they are out of the accessibility tree and out of the tab order
   * while keeping their state.
   * @default false
   */
  in?: boolean | undefined;
  /**
   * Swaps the default spring for a tween of this many milliseconds. The spring is the better fit
   * for content of unknown height; reach for a fixed duration when the opening has to line up with
   * another animation.
   */
  duration?: number | undefined;
  /** Lands on the animated element, after the classes the style props generate. */
  className?: string | undefined;
  /**
   * Inline styles on the animated element; they beat the style props. Setting `overflow` here
   * overrides the `hidden` the component applies, and the content spills out mid-animation instead
   * of being clipped.
   */
  style?: CSSProperties | undefined;
  /**
   * What collapses. Their natural height is what the animation measures, so a child of its own
   * animated height fights it; the wrapper element this component adds is always present.
   */
  children?: ReactNode | undefined;
}
