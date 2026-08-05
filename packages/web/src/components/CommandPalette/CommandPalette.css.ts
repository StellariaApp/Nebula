import { style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
    },
  },
});

export const input_row = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      padding: vars.space.md,
      backgroundColor: vars.color.surface.base,
      borderBlockEnd: `1px solid ${vars.color.border.default}`,
    },
  },
});

export const icon = style({
  "@layer": {
    [base_layer]: {
      display: "inline-flex",
      flexShrink: 0,
      color: vars.color.text.muted,
      lineHeight: 0,
    },
  },
});

export const input = style({
  "@layer": {
    [base_layer]: {
      flex: 1,
      minWidth: 0,
      margin: 0,
      padding: 0,
      border: 0,
      outline: "none",
      background: "transparent",
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body1,
      color: vars.color.text.primary,
      "::placeholder": { color: vars.color.text.placeholder },
    },
  },
});

export const list = style({
  "@layer": {
    [base_layer]: {
      listStyle: "none",
      margin: 0,
      padding: vars.space.xs,
      maxHeight: 360,
      overflowY: "auto",
      outline: "none",
    },
  },
});

export const group = style({
  "@layer": {
    [base_layer]: { listStyle: "none", margin: 0, padding: 0 },
  },
});

export const group_label = style({
  "@layer": {
    [base_layer]: {
      padding: vars.space.sm,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      fontWeight: vars.font.weight.semibold,
      textTransform: "uppercase",
      letterSpacing: vars.font.letterSpacing.wide,
      color: vars.color.text.muted,
    },
  },
});

export const option = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      paddingInline: vars.space.sm,
      paddingBlock: vars.space.xs,
      minHeight: 42,
      borderRadius: vars.radius.sm,
      cursor: "pointer",
      color: vars.color.text.primary,
      selectors: {
        "&[data-focused='true']": { background: vars.color.surface.hover },
        "&[data-disabled='true']": {
          cursor: "not-allowed",
          color: vars.color.text.muted,
        },
        "&:focus-visible": { ...focus.ring },
      },
    },
  },
});

export const body = style({
  "@layer": {
    [base_layer]: { display: "flex", flexDirection: "column", minWidth: 0, flex: 1 },
  },
});

export const label = style({
  "@layer": {
    [base_layer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body2,
      lineHeight: vars.font.lineHeight.tight,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const description = style({
  "@layer": {
    [base_layer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
    },
  },
});

export const empty = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      padding: vars.space.xl,
      textAlign: "center",
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.muted,
    },
  },
});
