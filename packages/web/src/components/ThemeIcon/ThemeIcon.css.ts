import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { bg, borderColor, borderWidth, fg } from "./ThemeIcon.vars.css.js";

export const icon = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxSizing: "border-box",
      lineHeight: 0,
      background: bg,
      color: fg,
      borderStyle: "solid",
      borderWidth: borderWidth,
      borderColor: borderColor,
    },
  },
});

export const size = styleVariants({
  xs: { width: 20, height: 20, fontSize: 12 },
  sm: { width: 26, height: 26, fontSize: 14 },
  md: { width: 32, height: 32, fontSize: 17 },
  lg: { width: 40, height: 40, fontSize: 21 },
  xl: { width: 52, height: 52, fontSize: 27 },
});

export const radius = styleVariants({
  sm: { borderRadius: vars.radius.sm },
  md: { borderRadius: vars.radius.md },
  full: { borderRadius: vars.radius.full },
});
