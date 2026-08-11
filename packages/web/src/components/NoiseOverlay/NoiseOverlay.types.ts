import type { StyleProps } from "../../utils/style-props.js";

/**
 * Fine grain over the region that contains it. It is the texture of `effects.glass.noiseOpacity`,
 * not a free effect: without an explicit `opacity` it takes the theme one, and with
 * `effects.glass.enabled=false` it paints nothing.
 *
 * GUARDRAIL: it is decorative and always goes over an already-resolved surface. Never over long-form
 * text or over data cells.
 */
export interface NoiseOverlayProps extends Omit<StyleProps, "opacity"> {
  opacity?: number | undefined;
  fixed?: boolean | undefined;
  zIndex?: number | undefined;
  className?: string | undefined;
}
