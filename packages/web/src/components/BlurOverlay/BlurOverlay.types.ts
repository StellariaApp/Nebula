import type { ReactNode } from "react";

import type { BlurLevel, ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

/**
 * A layer that **blurs what is behind it** instead of tinting it. `Overlay` is the opposite: tint
 * first, blur optional.
 *
 * GUARDRAIL: `md` is the maximum operational `blur` (Stellaria style research §4.5); `lg` and above
 * only in occasional full-screen overlays. Do not stack two BlurOverlays, and do not mount one over
 * a `GlassSurface`: chained `backdrop-filter` is paid for every frame.
 */
export interface BlurOverlayProps extends Omit<StyleProps, "opacity"> {
  /**
   * The box that centres `children`. It does not exist without children, and without them the whole
   * layer becomes `aria-hidden`. The veil has no slot: it is the effect, and `blur`, `color` and
   * `opacity` govern it.
   */
  contentProps?: BoxSlotProps | undefined;
  /**
   * How far what is behind is blurred. `md` is the operational ceiling; anything above belongs to
   * the occasional full-screen overlay and nowhere else. `"none"` drops the effect and leaves the
   * tint alone.
   * @default "md"
   */
  blur?: BlurLevel | undefined;
  /**
   * The tint laid over the blur. It defaults to the base surface so the layer reads as the page
   * fading out rather than as a colour arriving.
   * @default "surface.base"
   */
  color?: ColorExtended | undefined;
  /**
   * How much of the tint lands. It is deliberately low, because here the blur is what hides the
   * content. When the blur cannot run — `blur="none"`, or a theme with glass off — the veil is
   * forced up to 0.94 instead, so the layer never stops concealing what is behind it.
   * @default 0.35
   */
  opacity?: number | undefined;
  /**
   * Covers the viewport instead of the nearest positioned ancestor. Without it the layer only covers
   * a region that is already positioned — over a static parent it will spill.
   * @default false
   */
  fixed?: boolean | undefined;
  /**
   * Centres the content. Passing `children` turns it on anyway, so this only decides anything for a
   * layer that carries none.
   * @default false
   */
  center?: boolean | undefined;
  zIndex?: number | undefined;
  /**
   * What rides on top of the blur. Passing anything also takes the layer out of `aria-hidden`:
   * empty, it is invisible to assistive tech, which is what a bare blur should be.
   */
  children?: ReactNode | undefined;
  className?: string | undefined;
}
