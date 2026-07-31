import { style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const trigger = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xs,
      height: vars.size.control.md,
      paddingInline: vars.space.sm,
      borderRadius: vars.radius.md,
      border: `1px solid ${vars.color.border.default}`,
      background: vars.color.surface.base,
      color: vars.color.text.muted,
      fontSize: vars.font.size.body3,
      cursor: "pointer",
      ...interaction,
      selectors: {
        "&:hover": { borderColor: vars.color.border.strong, color: vars.color.text.secondary },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reducedMedia]: still },
    },
  },
});

export const shortcut = style({
  "@layer": {
    [baseLayer]: {
      marginInlineStart: "auto",
      paddingInline: vars.space.xxs,
      borderRadius: vars.radius.xs,
      border: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.sunken,
      fontFamily: vars.font.family.mono,
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
    },
  },
});

export const searchRow = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      padding: vars.space.sm,
      borderBottom: `1px solid ${vars.color.border.subtle}`,
    },
  },
});

export const input = style({
  "@layer": {
    [baseLayer]: {
      flex: 1,
      minWidth: 0,
      border: "none",
      outline: "none",
      background: "transparent",
      color: vars.color.text.primary,
      fontSize: vars.font.size.body1,
      fontFamily: "inherit",
      selectors: {
        "&::placeholder": { color: vars.color.text.placeholder },
      },
    },
  },
});

export const list = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      padding: vars.space.xxs,
      listStyle: "none",
      maxHeight: "min(60vh, 24rem)",
      overflowY: "auto",
    },
  },
});

export const groupLabel = style({
  "@layer": {
    [baseLayer]: {
      padding: `${vars.space.xs} ${vars.space.sm} ${vars.space.xxs}`,
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
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      padding: `${vars.space.xs} ${vars.space.sm}`,
      borderRadius: vars.radius.sm,
      color: vars.color.text.primary,
      cursor: "pointer",
      ...interaction,
      selectors: {
        "&[data-active='true']": { background: vars.color.surface.hover },
      },
      "@media": { [reducedMedia]: still },
    },
  },
});

export const optionIcon = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      color: vars.color.text.muted,
      flex: "0 0 auto",
    },
  },
});

export const optionBody = style({
  "@layer": {
    [baseLayer]: { display: "flex", flexDirection: "column", minWidth: 0, gap: 2 },
  },
});

export const optionTitle = style({
  "@layer": {
    [baseLayer]: {
      fontSize: vars.font.size.body2,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const optionDescription = style({
  "@layer": {
    [baseLayer]: {
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const status = style({
  "@layer": {
    [baseLayer]: {
      padding: vars.space.lg,
      textAlign: "center",
      fontSize: vars.font.size.body2,
      color: vars.color.text.muted,
    },
  },
});
