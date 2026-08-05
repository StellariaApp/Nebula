import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

export const header = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      minWidth: 0,
      width: "100%",
      fontFamily: vars.font.family.sans,
    },
  },
});

export const row = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      minWidth: 0,
      minHeight: vars.size.control.lg,
    },
  },
});

export const lead = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      flexShrink: 0,
    },
  },
});

export const heading = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      minWidth: 0,
      flex: 1,
    },
  },
});

export const title = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      fontSize: vars.font.size.h4,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
      color: vars.color.text.primary,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const subtitle = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      maxWidth: "62ch",
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.relaxed,
      color: vars.color.text.secondary,
    },
  },
});

export const trail = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      flexShrink: 0,
      marginInlineStart: "auto",
    },
  },
});

export const body = style({
  "@layer": {
    [base_layer]: { minWidth: 0 },
  },
});
