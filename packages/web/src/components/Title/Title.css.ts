import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const heading = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontFamily: vars.font.family.sans,
      color: vars.color.text.primary,
    },
  },
});

export const orders = {
  1: style({
    "@layer": {
      [baseLayer]: {
        fontSize: vars.font.size.h1,
        lineHeight: vars.font.leading.h1,
        fontWeight: vars.font.weight.bold,
        letterSpacing: vars.font.letterSpacing.tight,
      },
    },
  }),
  2: style({
    "@layer": {
      [baseLayer]: {
        fontSize: vars.font.size.h2,
        lineHeight: vars.font.leading.h2,
        fontWeight: vars.font.weight.bold,
        letterSpacing: vars.font.letterSpacing.tight,
      },
    },
  }),
  3: style({
    "@layer": {
      [baseLayer]: {
        fontSize: vars.font.size.h3,
        lineHeight: vars.font.leading.h3,
        fontWeight: vars.font.weight.semibold,
        letterSpacing: vars.font.letterSpacing.tight,
      },
    },
  }),
  4: style({
    "@layer": {
      [baseLayer]: {
        fontSize: vars.font.size.h4,
        lineHeight: vars.font.leading.h4,
        fontWeight: vars.font.weight.semibold,
        letterSpacing: vars.font.letterSpacing.normal,
      },
    },
  }),
  5: style({
    "@layer": {
      [baseLayer]: {
        fontSize: vars.font.size.h5,
        lineHeight: vars.font.leading.h5,
        fontWeight: vars.font.weight.semibold,
        letterSpacing: vars.font.letterSpacing.normal,
      },
    },
  }),
  6: style({
    "@layer": {
      [baseLayer]: {
        fontSize: vars.font.size.h6,
        lineHeight: vars.font.leading.h6,
        fontWeight: vars.font.weight.semibold,
        letterSpacing: vars.font.letterSpacing.normal,
      },
    },
  }),
} as const;
