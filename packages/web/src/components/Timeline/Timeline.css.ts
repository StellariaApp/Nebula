import { style, styleVariants } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { bulletBg, bulletBorder, bulletFg, bulletSize, lineWidth } from "./Timeline.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
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
    [base_layer]: {
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
    [base_layer]: {
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
      ...motion.reduced_motion,
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
    [base_layer]: {
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
    [base_layer]: {
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
    [base_layer]: {
      fontSize: vars.font.size.body3,
      fontWeight: vars.font.weight.medium,
      color: vars.color.text.primary,
    },
  },
});

export const meta = style({
  "@layer": {
    [base_layer]: { fontSize: vars.font.size.caption, color: vars.color.text.muted },
  },
});

export const description = style({
  "@layer": {
    [base_layer]: { fontSize: vars.font.size.body3, color: vars.color.text.secondary },
  },
});
