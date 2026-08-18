import { style } from "@vanilla-extract/css";

import * as focus from "../styles/focus.css.js";
import * as motion from "../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { component_layer } from "../theme/layers.css.js";

export const group = style({
  "@layer": {
    [component_layer]: {
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
    [component_layer]: {
      boxSizing: "border-box",
      paddingInline: "0.12em",
      borderRadius: vars.radius.xs,
      textAlign: "end",
      fontVariantNumeric: "tabular-nums",
      outline: "none",
      color: "inherit",
      ...motion.interaction,
      ...motion.reduced_motion,
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
