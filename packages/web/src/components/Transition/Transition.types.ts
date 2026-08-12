import type { CSSProperties, ReactNode } from "react";

import type { SpringName } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type TransitionPreset =
  "fade" | "scale" | "pop" | "slide-up" | "slide-down" | "slide-left" | "slide-right";

export interface TransitionProps extends StyleProps {
  /**
   * Drives presence. On the way to false the children stay in the DOM until the exit animation
   * ends, so unmounting the `Transition` itself cuts that animation short. A first render with it
   * already true does NOT animate in — only later changes do.
   */
  mounted: boolean;
  /**
   * Which way it enters and leaves; the exit is the entrance played backwards. Every preset moves
   * only `transform` and `opacity`, which is what keeps it off the main thread.
   * @default "fade"
   */
  transition?: TransitionPreset | undefined;
  /**
   * Drives the entrance with a theme spring instead of a tween, which leaves `duration` applying to
   * the exit only. The exit is always a tween: a spring has no fixed end to unmount on.
   */
  spring?: SpringName | undefined;
  /**
   * Length of the animation in milliseconds, replacing the theme's `base`. The exit takes two
   * thirds of it, so it always reads as faster than the entrance. Ignored on the entrance when
   * `spring` is set.
   */
  duration?: number | undefined;
  /**
   * Fires once the exit has finished and the children have left the DOM — the moment to release
   * what the content held. It never fires on the entrance.
   */
  onExitComplete?: (() => void) | undefined;
  /** Lands on the animated element, after the classes the style props generate. */
  className?: string | undefined;
  /**
   * Inline styles on the animated element; they beat the style props. Do not set `opacity`,
   * `transform`, `scale`, `x` or `y` here — the animation drives those and will overwrite them.
   */
  style?: CSSProperties | undefined;
  /**
   * What animates. They always land inside a `div` this component adds, so a `Transition` between a
   * flex or grid container and its item inserts a level that breaks the layout.
   */
  children?: ReactNode | undefined;
}
