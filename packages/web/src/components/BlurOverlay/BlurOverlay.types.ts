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
  blur?: BlurLevel | undefined;
  color?: ColorExtended | undefined;
  opacity?: number | undefined;
  fixed?: boolean | undefined;
  center?: boolean | undefined;
  zIndex?: number | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}
