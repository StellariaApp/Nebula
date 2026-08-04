import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as focus from "../../styles/focus.css.js";
import { interaction, reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";
import { SmallerThan } from "../../theme/media.js";

import {
  contentMax,
  floatingGap,
  floatingMax,
  indicatorBg,
  indicatorBorder,
  indicatorFg,
  linkFont,
  linkHeight,
  logoHeight,
  surfaceBackdrop,
  surfaceBg,
  surfaceBorder,
} from "./Nav.vars.css.js";

export const root = recipe({
  base: {
    vars: {
      [linkHeight]: vars.size.control.sm,
      [linkFont]: vars.font.size.body3,
    },
    "@layer": {
      [baseLayer]: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        paddingBlock: vars.space.u3,
        fontFamily: vars.font.family.sans,
      },
    },
  },
  variants: {
    size: {
      sm: {
        vars: { [linkHeight]: vars.size.control.xs, [linkFont]: vars.font.size.body3 },
        "@layer": { [baseLayer]: { minHeight: vars.size.control.md } },
      },
      md: {
        vars: { [linkHeight]: vars.size.control.sm, [linkFont]: vars.font.size.body2 },
        "@layer": { [baseLayer]: { minHeight: vars.size.control.lg } },
      },
      lg: {
        vars: { [linkHeight]: vars.size.control.md, [linkFont]: vars.font.size.body2 },
        "@layer": { [baseLayer]: { minHeight: vars.size.control.xl } },
      },
    },
    withBorder: {
      true: {
        "@layer": {
          [baseLayer]: { borderBlockEnd: `1px solid ${vars.color.border.subtle}` },
        },
      },
      false: {},
    },
  },
  defaultVariants: { size: "md", withBorder: false },
});

export type NavRootVariants = NonNullable<RecipeVariants<typeof root>>;

export const inner = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.md,
      flex: 1,
      minWidth: 0,
      boxSizing: "border-box",
      maxWidth: fallbackVar(contentMax, "none"),
      marginInline: "auto",
    },
  },
});

export const sticky = style({
  "@layer": {
    [baseLayer]: {
      position: "sticky",
      insetBlockStart: 0,
      flexShrink: 0,
      zIndex: vars.zIndex.sticky,
      transitionProperty: "border-color, background-color, box-shadow, backdrop-filter",
      transitionDuration: vars.motion.duration.slow,
      transitionTimingFunction: vars.motion.easing.standard,

      selectors: {
        "&[data-scrolled='true']": {
          backgroundColor: surfaceBg,
          borderBlockEnd: surfaceBorder,
          backdropFilter: surfaceBackdrop,
        },
        "&[data-animated='false']": still,
      },

      "@media": {
        [reducedMedia]: still,
        "(forced-colors: active)": {
          selectors: {
            "&[data-scrolled='true']": {
              backgroundColor: "Canvas",
              backdropFilter: "none",
            },
          },
        },
      },
    },
  },
});

export const PROGRESS = "--nebula-nav-progress";

const P = `var(${PROGRESS}, 0)`;
const EDGE = `max(${floatingGap}, (100% - ${floatingMax}) / 2)`;
const MATERIAL_TRANSITION = "border-color, background-color, box-shadow, backdrop-filter";

export const floating = style({
  "@layer": {
    [baseLayer]: {
      position: "fixed",
      insetBlockStart: `calc(${P} * ${floatingGap})`,
      insetInlineStart: `calc(${P} * ${EDGE})`,
      insetInlineEnd: `calc(${P} * ${EDGE})`,
      borderRadius: `calc(${P} * ${vars.radius.lg})`,
      width: "auto",
      zIndex: vars.zIndex.sticky,
      paddingInline: vars.space.u5,
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "transparent",
      backgroundColor: "transparent",
      transitionProperty: MATERIAL_TRANSITION,
      transitionDuration: vars.motion.duration.slow,
      transitionTimingFunction: vars.motion.easing.standard,

      selectors: {
        "&[data-scrolled='true']": {
          boxShadow: vars.shadow.lg,
          backgroundColor: surfaceBg,
          border: surfaceBorder,
          backdropFilter: surfaceBackdrop,
        },
        "&[data-animated='false']": still,
      },

      "@media": {
        [reducedMedia]: still,
        "(forced-colors: active)": {
          selectors: {
            "&[data-scrolled='true']": {
              backgroundColor: "Canvas",
              backdropFilter: "none",
            },
          },
        },
      },
    },
  },
});

export const logo = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xs,
      flexShrink: 0,
      minWidth: 0,
      color: vars.color.text.primary,
      textDecoration: "none",
      fontWeight: vars.font.weight.semibold,
      borderRadius: vars.radius.sm,
      outline: "none",
      selectors: {
        "&:focus-visible": { ...focus.ring },
      },
    },
  },
});

globalStyle(`${logo} :is(img, svg)`, {
  display: "block",
  width: "auto",
  height: fallbackVar(logoHeight, vars.size.compact.md),
});

const HIDDEN = { display: "none" } as const;

export const links = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: vars.space.xxs,
        padding: vars.space.xs,
        minWidth: 0,
        isolation: "isolate",
      },
    },
  },
  variants: {
    align: {
      start: { "@layer": { [baseLayer]: { marginInlineEnd: "auto" } } },
      center: { "@layer": { [baseLayer]: { marginInline: "auto" } } },
      end: { "@layer": { [baseLayer]: { marginInlineStart: "auto" } } },
    },
    collapse: {
      none: {},
      phone: { "@layer": { [baseLayer]: { "@media": { [SmallerThan("phone")]: HIDDEN } } } },
      tablet: { "@layer": { [baseLayer]: { "@media": { [SmallerThan("tablet")]: HIDDEN } } } },
      laptop: { "@layer": { [baseLayer]: { "@media": { [SmallerThan("laptop")]: HIDDEN } } } },
    },
  },
  defaultVariants: { align: "center", collapse: "tablet" },
});

export type NavLinksVariants = NonNullable<RecipeVariants<typeof links>>;

export const indicator = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      insetBlockStart: 0,
      insetInlineStart: 0,
      boxSizing: "border-box",
      borderRadius: vars.radius.full,
      background: indicatorBg,
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: fallbackVar(indicatorBorder, "transparent"),
      pointerEvents: "none",
      zIndex: 0,
    },
  },
});

export const link = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      zIndex: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: vars.space.xxs,
      flexShrink: 0,
      boxSizing: "border-box",
      minHeight: fallbackVar(linkHeight, vars.size.control.sm),
      paddingInline: vars.space.md,
      border: "none",
      background: "transparent",
      borderRadius: vars.radius.full,
      fontFamily: "inherit",
      fontSize: fallbackVar(linkFont, vars.font.size.body3),
      fontWeight: vars.font.weight.medium,
      lineHeight: vars.font.lineHeight.normal,
      letterSpacing: vars.font.letterSpacing.normal,
      color: vars.color.text.secondary,
      textDecoration: "none",
      whiteSpace: "nowrap",
      cursor: "pointer",
      outline: "none",
      ...interaction,

      selectors: {
        "&:hover:not([data-disabled='true'])": {
          color: vars.color.text.primary,
          background: vars.color.surface.hover,
        },
        "&[data-active='true']": {
          color: fallbackVar(indicatorFg, vars.color.text.primary),
          fontWeight: vars.font.weight.semibold,
        },
        "&[data-active='true']:hover": { background: "transparent" },
        "&[data-disabled='true']": {
          color: vars.color.text.disabled,
          cursor: "not-allowed",
        },
        "&:focus-visible": { ...focus.ring },
      },

      "@media": {
        [reducedMedia]: still,
        "(forced-colors: active)": {
          selectors: {
            "&[data-active='true']": { forcedColorAdjust: "none", textDecoration: "underline" },
          },
        },
      },
    },
  },
});

export const section = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.md,
      flexShrink: 0,
      minWidth: 0,
    },
  },
});

export const divider = style({
  "@layer": {
    [baseLayer]: {
      flexShrink: 0,
      alignSelf: "center",
      inlineSize: "1px",
      blockSize: vars.size.compact.xs,
      marginInline: vars.space.xxs,
      background: vars.color.border.subtle,
    },
  },
});
