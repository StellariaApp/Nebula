import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { pad } from "./Card.vars.css.js";

export const card = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        background: vars.color.surface.raised,
        color: vars.color.text.primary,
        fontFamily: vars.font.family.sans,
        borderStyle: "solid",
        borderWidth: 0,
        borderColor: vars.color.border.default,
        overflow: "hidden",
        textAlign: "start",
        textDecoration: "none",
      },
    },
  },
  variants: {
    radius: {
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
      none: { vars: { [pad]: "0px" }, padding: pad },
      md: { vars: { [pad]: vars.space.md }, padding: pad },
      lg: { vars: { [pad]: vars.space.lg }, padding: pad },
      xl: { vars: { [pad]: vars.space.xl }, padding: pad },
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
                outline: `2px solid ${vars.color.border.focus}`,
                outlineOffset: "2px",
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
