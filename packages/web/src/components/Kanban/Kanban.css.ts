import { style } from "@vanilla-extract/css";

import { interaction, reduced_media, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Kanban.vars.css.js";

export const board = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "flex-start",
      gap: vars.space.md,
      overflowX: "auto",
      padding: 0,
      margin: 0,
      listStyle: "none",
    },
  },
});

export const column = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      flex: "0 0 auto",
      width: variables.columnWidth,
      minHeight: 120,
      boxSizing: "border-box",
      borderRadius: vars.radius.lg,
      background: vars.color.surface.sunken,
      border: `1px solid ${vars.color.border.subtle}`,
      ...interaction,
      selectors: {
        "&[data-over='true']": {
          background: vars.color.surface.hover,
          borderColor: vars.color.border.strong,
        },
      },
      "@media": { [reduced_media]: still },
    },
  },
});

export const column_header = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.xs,
      padding: `${vars.space.sm} ${vars.space.md}`,
      borderBottom: `1px solid ${vars.color.border.subtle}`,
    },
  },
});

export const column_title = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.secondary,
    },
  },
});

export const column_count = style({
  "@layer": {
    [base_layer]: {
      fontSize: vars.font.size.caption,
      fontVariantNumeric: "tabular-nums",
      color: vars.color.text.muted,
      selectors: {
        "&[data-over-limit='true']": { color: vars.color.semantic.warning["700"] },
      },
    },
  },
});

export const column_body = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      padding: vars.space.sm,
      margin: 0,
      listStyle: "none",
      flex: 1,
    },
  },
});

export const column_empty = style({
  "@layer": {
    [base_layer]: {
      padding: vars.space.md,
      textAlign: "center",
      fontSize: vars.font.size.body3,
      color: vars.color.text.muted,
    },
  },
});

export const card = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      padding: vars.space.sm,
      boxSizing: "border-box",
      borderRadius: vars.radius.md,
      background: vars.color.surface.sunken,
      border: `1px solid ${vars.color.border.subtle}`,
      boxShadow: vars.shadow.xxs,
    },
  },
});

export const card_head = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: vars.space.xs,
    },
  },
});

export const card_title = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.medium,
      color: vars.color.text.primary,
    },
  },
});

export const card_description = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.relaxed,
      color: vars.color.text.secondary,
    },
  },
});

export const card_meta = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
    },
  },
});
