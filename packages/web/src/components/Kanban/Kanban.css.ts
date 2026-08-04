import { createVar, style } from "@vanilla-extract/css";

import { interaction, reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const columnWidth = createVar();

export const board = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      flex: "0 0 auto",
      width: columnWidth,
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
      "@media": { [reducedMedia]: still },
    },
  },
});

export const columnHeader = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.xs,
      padding: `${vars.space.sm} ${vars.space.md}`,
      borderBottom: `1px solid ${vars.color.border.subtle}`,
    },
  },
});

export const columnTitle = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.secondary,
    },
  },
});

export const columnCount = style({
  "@layer": {
    [baseLayer]: {
      fontSize: vars.font.size.caption,
      fontVariantNumeric: "tabular-nums",
      color: vars.color.text.muted,
      selectors: {
        "&[data-over-limit='true']": { color: vars.color.semantic.warning["700"] },
      },
    },
  },
});

export const columnBody = style({
  "@layer": {
    [baseLayer]: {
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

export const columnEmpty = style({
  "@layer": {
    [baseLayer]: {
      padding: vars.space.md,
      textAlign: "center",
      fontSize: vars.font.size.body3,
      color: vars.color.text.muted,
    },
  },
});

export const card = style({
  "@layer": {
    [baseLayer]: {
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

export const cardHead = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: vars.space.xs,
    },
  },
});

export const cardTitle = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.medium,
      color: vars.color.text.primary,
    },
  },
});

export const cardDescription = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.relaxed,
      color: vars.color.text.secondary,
    },
  },
});

export const cardMeta = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
    },
  },
});
