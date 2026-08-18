import { style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reduced_media, still } from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { composite_layer } from "../../theme/layers.css.js";

import * as variables from "./TransferList.vars.css.js";

export const root = style({
  "@layer": {
    [composite_layer]: {
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "stretch",
      gap: vars.space.sm,
      "@media": {
        "(max-width: 640px)": { gridTemplateColumns: "1fr", gridTemplateRows: "auto auto auto" },
      },
    },
  },
});

export const pane = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      borderRadius: vars.radius.md,
      border: `1px solid ${vars.color.border.default}`,
      background: vars.color.surface.base,
      overflow: "hidden",
    },
  },
});

export const pane_head = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.xs,
      padding: `${vars.space.xs} ${vars.space.sm}`,
      borderBottom: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.sunken,
    },
  },
});

export const pane_title = style({
  "@layer": {
    [composite_layer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.secondary,
    },
  },
});

export const pane_count = style({
  "@layer": {
    [composite_layer]: {
      fontSize: vars.font.size.caption,
      fontVariantNumeric: "tabular-nums",
      color: vars.color.text.muted,
    },
  },
});

export const search = style({
  "@layer": {
    [composite_layer]: {
      padding: vars.space.xs,
      borderBottom: `1px solid ${vars.color.border.subtle}`,
    },
  },
});

export const list = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      padding: vars.space.xxs,
      height: variables.paneHeight,
      overflowY: "auto",
    },
  },
});

export const item = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      width: "100%",
      padding: `${vars.space.xxs} ${vars.space.xs}`,
      border: "none",
      borderRadius: vars.radius.sm,
      background: "transparent",
      color: vars.color.text.primary,
      fontSize: vars.font.size.body3,
      textAlign: "start",
      cursor: "pointer",
      ...interaction,
      selectors: {
        "&:hover:not(:disabled)": { background: vars.color.surface.hover },
        "&[aria-selected='true']": { background: vars.color.surface.active },
        "&[aria-selected='true']:hover:not(:disabled)": {
          background: vars.color.surface.hoverActive,
        },
        "&:disabled": { cursor: "not-allowed", color: vars.color.text.disabled },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reduced_media]: still },
    },
  },
});

export const empty = style({
  "@layer": {
    [composite_layer]: {
      padding: vars.space.md,
      textAlign: "center",
      fontSize: vars.font.size.body3,
      color: vars.color.text.muted,
    },
  },
});

export const controls = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: vars.space.xxs,
      "@media": {
        "(max-width: 640px)": { flexDirection: "row" },
      },
    },
  },
});
