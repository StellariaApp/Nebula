import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css.js";
import { baseLayer } from "../../../theme/layers.css.js";

/**
 * Base tipográfica en la capa `nebula.base`: hereda familia y color de rol, pero
 * cede ante cualquier style prop del consumidor (`c`, `ff`, `fz`…), que sprinkles
 * emite fuera de capas.
 */
export const text = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontFamily: vars.font.family.sans,
      color: vars.color.text.primary,
    },
  },
});

/** Una línea con elipsis. */
export const truncate = style({
  "@layer": {
    [baseLayer]: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

/** N líneas con elipsis (`lines`); el número va por estilo inline. */
export const clamp = style({
  "@layer": {
    [baseLayer]: {
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
  },
});

/** `inherit`: no impone familia, tamaño ni color propios. */
export const inheritStyles = style({
  "@layer": {
    [baseLayer]: {
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      lineHeight: "inherit",
      color: "inherit",
    },
  },
});
