import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { swatch, swatchSize } from "./ColorSwatch.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxSizing: "border-box",
      width: swatchSize,
      height: swatchSize,
      padding: 0,
      background: swatch,
      color: vars.color.text.inverted,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: vars.color.border.subtle,
      lineHeight: 0,
      selectors: {
        "&:focus-visible": focus.ring,
      },
    },
  },
});

export const shadow = style({
  "@layer": {
    [base_layer]: { boxShadow: vars.shadow.xs },
  },
});

export const radius = styleVariants({
  sm: { borderRadius: vars.radius.xs },
  md: { borderRadius: vars.radius.sm },
  full: { borderRadius: vars.radius.full },
});
