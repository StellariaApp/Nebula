import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Card.vars.css.js";

export const card = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        background: fallbackVar(variables.bg, vars.color.surface.overlay),
        color: fallbackVar(variables.fg, vars.color.text.primary),
        fontFamily: vars.font.family.sans,
        borderStyle: "solid",
        borderWidth: 0,
        borderColor: fallbackVar(variables.borderColor, vars.color.border.default),
        backdropFilter: fallbackVar(variables.backdropFilter, "none"),
        overflow: "hidden",
        textAlign: "start",
        textDecoration: "none",
      },
    },
  },
  variants: {
    glowing: {
      true: { "@layer": { [base_layer]: { boxShadow: variables.glow } } },
      false: {},
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
      none: { vars: { [variables.pad]: "0px" }, padding: variables.pad, gap: 0 },
      md: { vars: { [variables.pad]: vars.space.md }, padding: variables.pad, gap: vars.space.sm },
      lg: { vars: { [variables.pad]: vars.space.lg }, padding: variables.pad, gap: vars.space.md },
      xl: { vars: { [variables.pad]: vars.space.xl }, padding: variables.pad, gap: vars.space.lg },
    },
    withBorder: {
      true: { "@layer": { [base_layer]: { borderWidth: 1 } } },
      false: {},
    },
    interactive: {
      true: {
        "@layer": {
          [base_layer]: {
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
    shadow: "none",
    padding: "lg",
    withBorder: true,
    interactive: false,
    glowing: false,
  },
});

export const section_inset = style({
  marginInline: `calc(${variables.pad} * -1)`,
  selectors: {
    "&:first-child": { marginBlockStart: `calc(${variables.pad} * -1)` },
    "&:last-child": { marginBlockEnd: `calc(${variables.pad} * -1)` },
  },
});

export const section_border = style({
  "@layer": {
    [base_layer]: {
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: vars.color.border.subtle,
      selectors: { "&:last-child": { borderBottomWidth: 0 } },
    },
  },
});

export const meta = style({
  "@layer": {
    [base_layer]: {
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

globalStyle(`${section_inset} > img`, { display: "block", width: "100%" });
