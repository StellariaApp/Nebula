import { style } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const anchor = style({
  "@layer": {
    [baseLayer]: {
      color: "inherit",
      cursor: "pointer",
      borderRadius: vars.radius.xs,
      ...motion.interaction,
      ...motion.reducedMotion,
      selectors: {
        "&:focus-visible": {
          outline: `2px solid ${vars.color.border.focus}`,
          outlineOffset: "2px",
        },
      },
    },
  },
});

export const underlineAlways = style({
  "@layer": { [baseLayer]: { textDecorationLine: "underline" } },
});

export const underlineHover = style({
  "@layer": {
    [baseLayer]: {
      textDecorationLine: "none",
      selectors: { "&:hover": { textDecorationLine: "underline" } },
    },
  },
});

export const underlineNever = style({
  "@layer": { [baseLayer]: { textDecorationLine: "none" } },
});
