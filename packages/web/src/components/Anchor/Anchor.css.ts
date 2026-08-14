import { style } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { component_layer } from "../../theme/layers.css.js";

export const anchor = style({
  "@layer": {
    [component_layer]: {
      color: "inherit",
      cursor: "pointer",
      borderRadius: vars.radius.xs,
      ...motion.interaction,
      ...motion.reduced_motion,
      selectors: {
        "&:focus-visible": {
          ...focus.ring,
        },
      },
    },
  },
});

export const underline_always = style({
  "@layer": { [component_layer]: { textDecorationLine: "underline" } },
});

export const underline_hover = style({
  "@layer": {
    [component_layer]: {
      textDecorationLine: "none",
      selectors: { "&:hover": { textDecorationLine: "underline" } },
    },
  },
});

export const underline_never = style({
  "@layer": { [component_layer]: { textDecorationLine: "none" } },
});
