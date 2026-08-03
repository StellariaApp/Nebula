import { style } from "@vanilla-extract/css";

import * as focus from "../styles/focus.css.js";
import * as motion from "../styles/motion.css.js";
import { vars } from "../theme/contract.css.js";
import { baseLayer } from "../theme/layers.css.js";

export const group = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      flex: 1,
      minWidth: 0,
      whiteSpace: "nowrap",
    },
  },
});

export const segment = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      paddingInline: "0.12em",
      borderRadius: vars.radius.xs,
      textAlign: "end",
      fontVariantNumeric: "tabular-nums",
      outline: "none",
      color: "inherit",
      ...motion.interaction,
      ...motion.reducedMotion,
      selectors: {
        "&[data-placeholder='true']": { color: vars.color.text.muted },
        "&[data-focus-visible='true']": {
          ...focus.ring,
          outlineOffset: 0,
          background: vars.color.primary["500"],
          color: vars.color.text.onPrimary,
        },
        "&[data-disabled='true']": { color: vars.color.text.disabled },
        "&[data-literal='true']": { paddingInline: 0, color: vars.color.text.muted },
      },
    },
  },
});
