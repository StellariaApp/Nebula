import type { ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type OverlayBlur = "none" | "sm" | "md" | "lg";

export interface OverlayProps extends Omit<StyleProps, "opacity"> {
  /**
   * The tint. Naming one of the theme's scales takes its 600 step; a role path or a hex is used as
   * written. Black is the neutral that does not push the content behind it towards a hue.
   * @default "black"
   */
  color?: ColorExtended | undefined;
  /**
   * How much of the tint lands. It is the whole difference between a scrim that dismisses a modal
   * and a veil that dims a card, so it moves with the job: past roughly 0.8 nothing behind is
   * readable any more.
   * @default 0.6
   */
  opacity?: number | undefined;
  /**
   * Blurs what is behind, on top of the tint. This component tints first and blurs as an extra;
   * `BlurOverlay` is the other way round, and is the one to reach for when the blur is the point.
   * @default "none"
   */
  blur?: OverlayBlur | undefined;
  /**
   * Covers the viewport instead of the nearest positioned ancestor. Without it the overlay only
   * covers a region that is already positioned — over a static parent it will spill.
   * @default false
   */
  fixed?: boolean | undefined;
  /**
   * Centres the content. Passing `children` turns it on anyway, so this only decides anything for
   * an overlay that carries none.
   * @default false
   */
  center?: boolean | undefined;
  zIndex?: number | undefined;
  /**
   * What rides on top of the veil — a loader, a message. Passing anything also takes the layer out
   * of `aria-hidden`: empty, the scrim is invisible to assistive tech, which is what a plain scrim
   * should be.
   */
  children?: ReactNode | undefined;
  className?: string | undefined;
}
