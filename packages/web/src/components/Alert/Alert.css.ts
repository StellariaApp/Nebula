import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { accent, bg, borderColor, fg } from "./Alert.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "flex-start",
      gap: vars.space.sm,
      boxSizing: "border-box",
      paddingInline: vars.space.md,
      paddingBlock: vars.space.sm,
      borderRadius: vars.radius.md,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: borderColor,
      background: bg,
      color: fg,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body2,
      lineHeight: vars.font.lineHeight.normal,
    },
  },
});

export const icon = style({
  "@layer": {
    [base_layer]: {
      display: "inline-flex",
      flexShrink: 0,
      color: accent,
      marginBlockStart: "1px",
    },
  },
});

export const body = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xxs,
  flex: 1,
  minWidth: 0,
});

export const title = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
      color: "inherit",
    },
  },
});

export const message = style({
  "@layer": { [base_layer]: { color: "inherit" } },
});

export const actions = style({
  display: "flex",
  gap: vars.space.xs,
  marginBlockStart: vars.space.xxs,
});
