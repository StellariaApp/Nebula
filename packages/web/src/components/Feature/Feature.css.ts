import { style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";
import { composite_layer } from "../../theme/layers.css.js";

export const feature = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      minWidth: 0,
      fontFamily: vars.font.family.sans,
      selectors: {
        "&[data-align='center']": { alignItems: "center", textAlign: "center" },
      },
    },
  },
});

export const title = style({
  "@layer": {
    [composite_layer]: {
      margin: 0,
      fontSize: vars.font.size.body1,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
      color: vars.color.text.primary,
    },
  },
});

export const description = style({
  "@layer": {
    [composite_layer]: {
      margin: 0,
      maxWidth: "52ch",
      fontSize: vars.font.size.body2,
      lineHeight: vars.font.lineHeight.relaxed,
      color: vars.color.text.secondary,
    },
  },
});
