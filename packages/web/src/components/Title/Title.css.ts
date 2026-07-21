import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const heading = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontFamily: vars.font.family.sans,
      fontWeight: vars.font.weight.bold,
      lineHeight: vars.font.lineHeight.tight,
      letterSpacing: vars.font.letterSpacing.tight,
      color: vars.color.text.primary,
    },
  },
});

export const orders = {
  1: style({ "@layer": { [baseLayer]: { fontSize: vars.font.size.h1 } } }),
  2: style({ "@layer": { [baseLayer]: { fontSize: vars.font.size.h2 } } }),
  3: style({ "@layer": { [baseLayer]: { fontSize: vars.font.size.h3 } } }),
  4: style({ "@layer": { [baseLayer]: { fontSize: vars.font.size.h4 } } }),
  5: style({ "@layer": { [baseLayer]: { fontSize: vars.font.size.h5 } } }),
  6: style({ "@layer": { [baseLayer]: { fontSize: vars.font.size.h6 } } }),
} as const;
