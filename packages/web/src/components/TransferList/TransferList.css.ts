import { createVar, style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const paneHeight = createVar();

export const root = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
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

export const paneHead = style({
  "@layer": {
    [baseLayer]: {
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

export const paneTitle = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.secondary,
    },
  },
});

export const paneCount = style({
  "@layer": {
    [baseLayer]: {
      fontSize: vars.font.size.caption,
      fontVariantNumeric: "tabular-nums",
      color: vars.color.text.muted,
    },
  },
});

export const search = style({
  "@layer": {
    [baseLayer]: {
      padding: vars.space.xs,
      borderBottom: `1px solid ${vars.color.border.subtle}`,
    },
  },
});

export const list = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      padding: vars.space.xxs,
      height: paneHeight,
      overflowY: "auto",
    },
  },
});

export const item = style({
  "@layer": {
    [baseLayer]: {
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
        "&:disabled": { cursor: "not-allowed", color: vars.color.text.disabled },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reducedMedia]: still },
    },
  },
});

export const empty = style({
  "@layer": {
    [baseLayer]: {
      padding: vars.space.md,
      textAlign: "center",
      fontSize: vars.font.size.body3,
      color: vars.color.text.muted,
    },
  },
});

export const controls = style({
  "@layer": {
    [baseLayer]: {
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
