import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { backdropFilter, bg, borderColor, fg, glow, pad } from "./Card.vars.css.js";

export const card = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        background: fallbackVar(bg, vars.color.surface.raised),
        color: fallbackVar(fg, vars.color.text.primary),
        fontFamily: vars.font.family.sans,
        borderStyle: "solid",
        borderWidth: 0,
        borderColor: fallbackVar(borderColor, vars.color.border.default),
        backdropFilter: fallbackVar(backdropFilter, "none"),
        overflow: "hidden",
        textAlign: "start",
        textDecoration: "none",
      },
    },
  },
  variants: {
    glowing: {
      true: { "@layer": { [baseLayer]: { boxShadow: glow } } },
      false: {},
    },
    radius: {
      none: { borderRadius: vars.radius.none },
      xxs: { borderRadius: vars.radius.xxs },
      xs: { borderRadius: vars.radius.xs },
      sm: { borderRadius: vars.radius.sm },
      md: { borderRadius: vars.radius.md },
      lg: { borderRadius: vars.radius.lg },
      xl: { borderRadius: vars.radius.xl },
      xxl: { borderRadius: vars.radius.xxl },
      full: { borderRadius: vars.radius.full },
    },
    shadow: {
      none: {},
      xxs: { boxShadow: vars.shadow.xxs },
      xs: { boxShadow: vars.shadow.xs },
      sm: { boxShadow: vars.shadow.sm },
      md: { boxShadow: vars.shadow.md },
      lg: { boxShadow: vars.shadow.lg },
      xl: { boxShadow: vars.shadow.xl },
      xxl: { boxShadow: vars.shadow.xxl },
    },
    padding: {
      none: { vars: { [pad]: "0px" }, padding: pad, gap: 0 },
      md: { vars: { [pad]: vars.space.md }, padding: pad, gap: vars.space.sm },
      lg: { vars: { [pad]: vars.space.lg }, padding: pad, gap: vars.space.md },
      xl: { vars: { [pad]: vars.space.xl }, padding: pad, gap: vars.space.lg },
    },
    withBorder: {
      true: { "@layer": { [baseLayer]: { borderWidth: 1 } } },
      false: {},
    },
    interactive: {
      true: {
        "@layer": {
          [baseLayer]: {
            cursor: "pointer",
            ...motion.interaction,
            selectors: {
              "&:hover": { borderColor: vars.color.border.strong },
              "&:focus-visible": {
                ...focus.ring,
              },
            },
            "@media": {
              "(prefers-reduced-motion: reduce)": motion.still,
            },
          },
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    radius: "md",
    shadow: "none",
    padding: "lg",
    withBorder: true,
    interactive: false,
    glowing: false,
  },
});

export const sectionInset = style({
  marginInline: `calc(${pad} * -1)`,
  selectors: {
    "&:first-child": { marginBlockStart: `calc(${pad} * -1)` },
    "&:last-child": { marginBlockEnd: `calc(${pad} * -1)` },
  },
});

export const sectionBorder = style({
  "@layer": {
    [baseLayer]: {
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: vars.color.border.subtle,
      selectors: { "&:last-child": { borderBottomWidth: 0 } },
    },
  },
});

export const meta = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: vars.space.xs,
      fontSize: vars.font.size.caption,
      color: vars.color.text.secondary,
    },
  },
});

export const badges = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.space.xxs,
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.space.xs,
  marginBlockStart: "auto",
  paddingBlockStart: vars.space.xs,
});

globalStyle(`${sectionInset} > img`, { display: "block", width: "100%" });
