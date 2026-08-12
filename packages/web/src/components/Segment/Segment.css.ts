import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Segment.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.md,
      fontFamily: vars.font.family.sans,
      minWidth: 0,
      selectors: {
        "&[data-padded='true']": { gap: 0 },
      },
    },
  },
});

export const control = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        position: "relative",
        display: "inline-flex",
        boxSizing: "border-box",
        padding: vars.space.u2_5,
        gap: vars.space.xxs,
        background: vars.color.surface.overlay,
        border: `1px solid ${vars.color.border.default}`,
        borderRadius: vars.radius.full,
        fontFamily: vars.font.family.sans,
        alignSelf: "flex-start",
        selectors: {
          "&[data-disabled='true']": { cursor: "not-allowed" },
          "[data-padded='true'] &": { margin: vars.space.md },
        },
      },
    },
  },
  variants: {
    size: {
      sm: { minHeight: vars.size.control.md, fontSize: vars.font.size.body3 },
      md: { minHeight: vars.size.control.lg, fontSize: vars.font.size.body2 },
      lg: { minHeight: vars.size.control.xl, fontSize: vars.font.size.button },
      xl: { minHeight: vars.size.control.xxl, fontSize: vars.font.size.body1 },
    },
    fullWidth: {
      true: { display: "flex", width: "100%", alignSelf: "stretch" },
      false: {},
    },
    overflowMode: {
      visible: {},
      scroll: {
        maxWidth: "100%",
        overflowX: "auto",
        overscrollBehaviorInline: "contain",
        scrollbarWidth: "none",
        selectors: {
          "&::-webkit-scrollbar": { display: "none" },
        },
      },
      wrap: { flexWrap: "wrap" },
    },
  },
  defaultVariants: { size: "md", fullWidth: false, overflowMode: "visible" },
});

export type SegmentControlVariants = NonNullable<RecipeVariants<typeof control>>;

export const indicator = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        position: "absolute",
        top: `calc(${vars.space.u2_5} - 1px)`,
        bottom: vars.space.xs,
        height: `calc(${vars.size.control.lg} - ${vars.space.u2_5} * 2)`,
        insetInlineStart: 0,
        background: variables.indicatorColor,
        borderRadius: vars.radius.full,
        boxShadow: vars.shadow.xxs,
        touchAction: "none",
        zIndex: 0,
      },
    },
  },
  variants: {
    size: {
      sm: { height: `calc(${vars.size.control.md} - ${vars.space.u2_5} * 1.6)` },
      md: { height: `calc(${vars.size.control.lg} - ${vars.space.u2_5} * 2)` },
      lg: { height: `calc(${vars.size.control.xl} - ${vars.space.u2_5} * 2.4)` },
      xl: { height: `calc(${vars.size.control.xxl} - ${vars.space.u2_5} * 2.8)` },
    },
    flow: {
      row: {},
      wrap: { top: 0, bottom: "auto" },
    },
  },
  defaultVariants: { flow: "row" },
});

export const tab = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        position: "relative",
        zIndex: 1,
        flex: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        paddingInline: vars.space.md,
        border: "none",
        background: "transparent",
        font: "inherit",
        fontWeight: vars.font.weight.semibold,
        lineHeight: 1,
        fontSize: "inherit",
        cursor: "pointer",
        color: vars.color.text.secondary,
        whiteSpace: "nowrap",
        userSelect: "none",
        borderRadius: vars.radius.full,
        ...motion.interaction,
        outline: "none",
        selectors: {
          "&[data-active='true']": {
            color: fallbackVar(variables.indicatorFg, vars.color.text.primary),
          },
          "&[data-disabled='true']": { cursor: "not-allowed", color: vars.color.text.muted },
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
  variants: {
    fullWidth: {
      true: { minWidth: 0, overflow: "hidden" },
      false: {},
    },
    overflowMode: {
      visible: {},
      scroll: { flex: "0 0 auto" },
      wrap: {},
    },
  },
  defaultVariants: { fullWidth: false, overflowMode: "visible" },
});

export const content = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      overflow: "hidden",
      contain: "inline-size",
      width: "100%",
      maxWidth: "100%",
      minWidth: 0,
    },
  },
});

export const viewport = recipe({
  base: {
    display: "flex",
    flexDirection: "row",
    touchAction: "pan-y",
  },
  variants: {
    mode: {
      max: {},
      auto: { alignItems: "flex-start" },
      fill: { height: "100%" },
    },
  },
  defaultVariants: { mode: "max" },
});

export const panel = recipe({
  base: {
    flexShrink: 0,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    selectors: {
      "[data-padded='true'] &": { paddingInline: vars.space.md, gap: vars.space.md },
    },
  },
  variants: {
    mode: {
      max: {},
      auto: {},
      fill: { height: "100%" },
    },
    fit: {
      true: { width: "max-content" },
      false: { width: "100%", minWidth: 0 },
    },
  },
  defaultVariants: { mode: "max", fit: false },
});

export const section = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      minWidth: 0,
    },
  },
});

globalStyle(`${panel.classNames.base}[aria-hidden='true']`, { pointerEvents: "none" });

globalStyle(`${content}[data-ready='false'] ${panel.classNames.base}[aria-hidden='true']`, {
  visibility: "hidden",
});

globalStyle(`${content}[data-fit='true'][data-ready='false']`, {
  contain: "none",
  width: "fit-content",
});

globalStyle(
  `${content}[data-fit='true'][data-ready='false'] ${panel.classNames.base}[aria-hidden='true']`,
  { position: "absolute", top: 0, insetInlineStart: 0 },
);
