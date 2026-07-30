import { style, styleVariants } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { bulletBg, bulletBorder, bulletFg, bulletSize, lineWidth } from "./Timeline.vars.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      listStyle: "none",
      margin: 0,
      padding: 0,
      fontFamily: vars.font.family.sans,
    },
  },
});

export const align = styleVariants({
  start: {},
  end: { textAlign: "end" },
});

export const item = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: `${bulletSize} 1fr`,
      columnGap: vars.space.sm,
      paddingBlockEnd: vars.space.lg,
      selectors: {
        "&:last-child": { paddingBlockEnd: 0 },
      },
    },
  },
});

export const bullet = style({
  "@layer": {
    [baseLayer]: {
      gridColumn: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: bulletSize,
      height: bulletSize,
      boxSizing: "border-box",
      borderRadius: vars.radius.full,
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: vars.color.border.default,
      background: vars.color.surface.raised,
      color: vars.color.text.muted,
      fontSize: vars.font.size.caption,
      lineHeight: 0,
      zIndex: 1,
      ...motion.interaction,
      ...motion.reducedMotion,
      selectors: {
        "&[data-reached='true']": {
          background: bulletBg,
          borderColor: bulletBorder,
          color: bulletFg,
        },
      },
    },
  },
});

export const line = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      insetInlineStart: `calc((${bulletSize} - ${lineWidth}) / 2)`,
      top: bulletSize,
      bottom: 0,
      width: lineWidth,
      background: vars.color.border.subtle,
      selectors: {
        "&[data-reached='true']": { background: bulletBg },
        "li:last-child &": { display: "none" },
      },
    },
  },
});

export const body = style({
  "@layer": {
    [baseLayer]: {
      gridColumn: 2,
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      minWidth: 0,
    },
  },
});

export const title = style({
  "@layer": {
    [baseLayer]: {
      fontSize: vars.font.size.body3,
      fontWeight: vars.font.weight.medium,
      color: vars.color.text.primary,
    },
  },
});

export const meta = style({
  "@layer": {
    [baseLayer]: { fontSize: vars.font.size.caption, color: vars.color.text.muted },
  },
});

export const description = style({
  "@layer": {
    [baseLayer]: { fontSize: vars.font.size.body3, color: vars.color.text.secondary },
  },
});
