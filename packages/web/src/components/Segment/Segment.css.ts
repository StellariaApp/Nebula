import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Segment.vars.css.js";

export const root = style({
  "@layer": {
    [primitive_layer]: {
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
      [primitive_layer]: {
        position: "relative",
        display: "inline-flex",
        boxSizing: "border-box",
        padding: vars.space.u2_5,
        gap: vars.space.xxs,
        background: vars.color.surface.overlay,
        border: `1px solid ${vars.color.border.default}`,
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
      xs: {
        padding: vars.space.u1_5,
        borderRadius: `calc(${vars.size.control.xs} + ${vars.space.u1_5} * 2)`,
      },
      sm: {
        borderRadius: `calc(${vars.size.control.xs} + ${vars.space.u2_5} * 2)`,
      },
      md: {
        borderRadius: `calc(${vars.size.control.sm} + ${vars.space.u2_5} * 2)`,
      },
      lg: {
        borderRadius: `calc(${vars.size.control.md} + ${vars.space.u2_5} * 2)`,
      },
      xl: {
        borderRadius: `calc(${vars.size.control.lg} + ${vars.space.u2_5} * 2)`,
      },
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
      [primitive_layer]: {
        position: "absolute",
        bottom: vars.space.xs,
        top: vars.space.u2_5,
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
      xs: {
        height: vars.size.control.xs,
        top: vars.space.u1_5,
      },
      sm: {
        height: vars.size.control.xs,
      },
      md: {
        height: vars.size.control.sm,
      },
      lg: {
        height: vars.size.control.md,
      },
      xl: {
        height: vars.size.control.lg,
      },
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
      [primitive_layer]: {
        position: "relative",
        zIndex: 1,
        flex: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        background: "transparent",
        font: "inherit",
        fontWeight: vars.font.weight.semibold,
        lineHeight: 1.3,
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
    size: {
      xs: {
        minHeight: vars.size.control.xs,
        fontSize: vars.font.size.caption,
        paddingInline: vars.space.sm,
      },
      sm: {
        minHeight: vars.size.control.xs,
        fontSize: vars.font.size.body3,
        paddingInline: vars.space.sm,
      },
      md: {
        minHeight: vars.size.control.sm,
        fontSize: vars.font.size.body2,
        paddingInline: vars.space.md,
      },
      lg: {
        minHeight: vars.size.control.md,
        fontSize: vars.font.size.button,
        paddingInline: vars.space.lg,
      },
      xl: {
        minHeight: vars.size.control.lg,
        fontSize: vars.font.size.body1,
        paddingInline: vars.space.xl,
      },
    },
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
  defaultVariants: { size: "md", fullWidth: false, overflowMode: "visible" },
});

export const tab_active = style({
  "@layer": {
    [primitive_layer]: {
      "::before": {
        content: '""',
        width: "100%",
        height: `100%`,
        position: "absolute",
        top: 0,
        bottom: vars.space.xs,
        insetInlineStart: 0,
        background: variables.indicatorColor,
        borderRadius: vars.radius.full,
        boxShadow: vars.shadow.xxs,
        touchAction: "none",
        zIndex: 0,
      },
    },
  },
});

export const content = style({
  "@layer": {
    [primitive_layer]: {
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
    touchAction: "pan-y",
  },
  variants: {
    mode: {
      max: {},
      auto: { alignItems: "flex-start" },
      fill: { height: "100%" },
    },
    flow: {
      rail: { display: "flex", flexDirection: "row" },
      stack: { display: "grid", gridTemplateAreas: '"stack"' },
    },
  },
  defaultVariants: { mode: "max", flow: "rail" },
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
    flow: {
      rail: {},
      stack: { gridArea: "stack" },
    },
  },
  defaultVariants: { mode: "max", fit: false, flow: "rail" },
});

export const section = style({
  "@layer": {
    [primitive_layer]: {
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
