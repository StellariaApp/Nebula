import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const heading = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontFamily: vars.font.family.sans,
      lineHeight: vars.font.lineHeight.tight,
      color: vars.color.text.primary,
    },
  },
});

export const orders = {
  1: style({
    "@layer": {
      [baseLayer]: {
        fontSize: vars.font.size.h1,
        fontWeight: vars.font.weight.bold,
        letterSpacing: vars.font.letterSpacing.tight,
      },
    },
  }),
  2: style({
    "@layer": {
      [baseLayer]: {
        fontSize: vars.font.size.h2,
        fontWeight: vars.font.weight.bold,
        letterSpacing: vars.font.letterSpacing.tight,
      },
    },
  }),
  3: style({
    "@layer": {
      [baseLayer]: {
        fontSize: vars.font.size.h3,
        fontWeight: vars.font.weight.semibold,
        letterSpacing: vars.font.letterSpacing.tight,
      },
    },
  }),
  4: style({
    "@layer": {
      [baseLayer]: {
        fontSize: vars.font.size.h4,
        fontWeight: vars.font.weight.semibold,
        letterSpacing: vars.font.letterSpacing.normal,
      },
    },
  }),
  5: style({
    "@layer": {
      [baseLayer]: {
        fontSize: vars.font.size.h5,
        fontWeight: vars.font.weight.semibold,
        letterSpacing: vars.font.letterSpacing.normal,
      },
    },
  }),
  6: style({
    "@layer": {
      [baseLayer]: {
        fontSize: vars.font.size.h6,
        fontWeight: vars.font.weight.semibold,
        letterSpacing: vars.font.letterSpacing.normal,
      },
    },
  }),
} as const;
