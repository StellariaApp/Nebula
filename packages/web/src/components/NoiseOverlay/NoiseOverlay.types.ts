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
  /**
   * How strong the grain is. Left out it takes the theme's `effects.glass.noiseOpacity`; with the
   * theme's glass off it is forced to zero whatever you pass here, so this cannot bring the texture
   * back on a theme that has turned effects down.
   */
  opacity?: number | undefined;
  /**
   * Pins the grain to the viewport instead of the region around it, which is what a page-wide film
   * needs — one fixed layer rather than one per section.
   * @default false
   */
  fixed?: boolean | undefined;
  /**
   * Where the layer sits in the stack. Left out it takes its turn among its siblings, which puts it
   * over everything declared before it and under everything after.
   */
  zIndex?: number | undefined;
  className?: string | undefined;
}
