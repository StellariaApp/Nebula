import { style } from "@vanilla-extract/css";

import { baseLayer } from "../../theme/layers.css.js";

import { fallbackFg, gradientImage } from "./GradientText.vars.css.js";

const SOLID = {
  backgroundImage: "none",
  color: fallbackFg,
  WebkitTextFillColor: fallbackFg,
} as const;

const INK_BLEED = "0.06em";

export const gradientText = style({
  "@layer": {
    [baseLayer]: {
      backgroundImage: gradientImage,
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
      textDecorationColor: fallbackFg,
      paddingInlineEnd: INK_BLEED,
      marginInlineEnd: `calc(-1 * ${INK_BLEED})`,
      "@supports": {
        "not ((background-clip: text) or (-webkit-background-clip: text))": SOLID,
      },
      "@media": {
        "(forced-colors: active)": {
          backgroundImage: "none",
          color: "CanvasText",
          WebkitTextFillColor: "currentColor",
        },
      },
    },
  },
});

export const inheritStyles = style({
  "@layer": {
    [baseLayer]: {
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      lineHeight: "inherit",
      letterSpacing: "inherit",
    },
  },
});
