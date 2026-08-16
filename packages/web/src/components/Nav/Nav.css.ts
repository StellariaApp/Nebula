import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as focus from "../../styles/focus.css.js";
import { interaction, reduced_media, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { composite_layer } from "../../theme/layers.css.js";
import { SmallerThan } from "../../theme/media.js";

import * as variables from "./Nav.vars.css.js";

export const root = recipe({
  base: {
    vars: {
      [variables.linkHeight]: vars.size.control.sm,
      [variables.linkFont]: vars.font.size.body3,
    },
    "@layer": {
      [composite_layer]: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        minWidth: 0,
        minHeight: vars.size.control.lg,
        boxSizing: "border-box",
        paddingBlock: vars.space.u3,
        paddingInline: vars.space.u5,
        fontFamily: vars.font.family.sans,
      },
    },
  },
  variants: {
    size: {
      sm: {
        vars: {
          [variables.linkHeight]: vars.size.control.xs,
          [variables.linkFont]: vars.font.size.body3,
        },
        "@layer": { [composite_layer]: { minHeight: vars.size.control.md } },
      },
      md: {
        vars: {
          [variables.linkHeight]: vars.size.control.sm,
          [variables.linkFont]: vars.font.size.body2,
        },
        "@layer": { [composite_layer]: { minHeight: vars.size.control.lg } },
      },
      lg: {
        vars: {
          [variables.linkHeight]: vars.size.control.md,
          [variables.linkFont]: vars.font.size.body2,
        },
        "@layer": { [composite_layer]: { minHeight: vars.size.control.xl } },
      },
    },
    withBorder: {
      true: {
        "@layer": {
          [composite_layer]: { borderBlockEnd: `1px solid ${vars.color.border.subtle}` },
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
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.md,
      flex: 1,
      minWidth: 0,
      boxSizing: "border-box",
      maxWidth: fallbackVar(variables.contentMax, "none"),
      marginInline: "auto",
    },
  },
});

export const solid = style({
  "@layer": {
    [composite_layer]: {
      position: "relative",
      zIndex: vars.zIndex.sticky,
      backgroundColor: variables.surfaceBg,
      borderBlockEnd: variables.surfaceBorder,
      backdropFilter: variables.surfaceBackdrop,
    },
  },
});

export const sticky = style({
  "@layer": {
    [composite_layer]: {
      position: "sticky",
      insetBlockStart: 0,
      flexShrink: 0,
      zIndex: vars.zIndex.sticky,
      transitionProperty: "border-color, background-color, box-shadow, backdrop-filter",
      transitionDuration: vars.motion.duration.slow,
      transitionTimingFunction: vars.motion.easing.standard,

      selectors: {
        "&[data-scrolled='true']": {
          backgroundColor: variables.surfaceBg,
          borderBlockEnd: variables.surfaceBorder,
          backdropFilter: variables.surfaceBackdrop,
        },
        "&[data-animated='false']": still,
      },

      "@media": {
        [reduced_media]: still,
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
const EDGE = `max(${variables.floatingGap}, (100% - ${variables.floatingMax}) / 2)`;
const MATERIAL_TRANSITION = "border-color, background-color, box-shadow, backdrop-filter";

export const floating = style({
  "@layer": {
    [composite_layer]: {
      position: "fixed",
      insetBlockStart: `calc(${P} * ${variables.floatingGap})`,
      insetInlineStart: `calc(${P} * ${EDGE})`,
      insetInlineEnd: `calc(${P} * ${EDGE})`,
      borderRadius: `calc(${P} * ${vars.radius.lg})`,
      width: "auto",
      zIndex: vars.zIndex.sticky,
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
          backgroundColor: variables.surfaceBg,
          border: variables.surfaceBorder,
          backdropFilter: variables.surfaceBackdrop,
        },
        "&[data-animated='false']": still,
      },

      "@media": {
        [reduced_media]: still,
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
    [composite_layer]: {
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
  height: fallbackVar(variables.logoHeight, vars.size.compact.md),
});

const HIDDEN = { display: "none" } as const;

export const actions = recipe({
  base: {
    "@layer": {
      [composite_layer]: {
        display: "flex",
        alignItems: "center",
        gap: vars.space.sm,
        flexShrink: 0,
      },
    },
  },
  variants: {
    collapse: {
      none: {},
      phone: { "@layer": { [composite_layer]: { "@media": { [SmallerThan("phone")]: HIDDEN } } } },
      tablet: {
        "@layer": { [composite_layer]: { "@media": { [SmallerThan("tablet")]: HIDDEN } } },
      },
      laptop: {
        "@layer": { [composite_layer]: { "@media": { [SmallerThan("laptop")]: HIDDEN } } },
      },
    },
  },
  defaultVariants: { collapse: "tablet" },
});

export const links = recipe({
  base: {
    "@layer": {
      [composite_layer]: {
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
      start: { "@layer": { [composite_layer]: { marginInlineEnd: "auto" } } },
      center: { "@layer": { [composite_layer]: { marginInline: "auto" } } },
      end: { "@layer": { [composite_layer]: { marginInlineStart: "auto" } } },
    },
    overflowMenu: {
      true: {
        "@layer": {
          [composite_layer]: { flex: "1 1 auto", minWidth: 0, flexWrap: "nowrap" },
        },
      },
      false: {},
    },
    collapse: {
      none: {},
      phone: { "@layer": { [composite_layer]: { "@media": { [SmallerThan("phone")]: HIDDEN } } } },
      tablet: {
        "@layer": { [composite_layer]: { "@media": { [SmallerThan("tablet")]: HIDDEN } } },
      },
      laptop: {
        "@layer": { [composite_layer]: { "@media": { [SmallerThan("laptop")]: HIDDEN } } },
      },
    },
  },
  defaultVariants: { align: "center", collapse: "tablet", overflowMenu: false },
});

export type NavLinksVariants = NonNullable<RecipeVariants<typeof links>>;

export const indicator = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      insetBlockStart: 0,
      insetInlineStart: 0,
      boxSizing: "border-box",
      borderRadius: vars.radius.full,
      background: variables.indicatorBg,
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: fallbackVar(variables.indicatorBorder, "transparent"),
      pointerEvents: "none",
      zIndex: 0,
    },
  },
});

export const link = style({
  "@layer": {
    [composite_layer]: {
      position: "relative",
      zIndex: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: vars.space.xxs,
      flexShrink: 0,
      boxSizing: "border-box",
      minHeight: fallbackVar(variables.linkHeight, vars.size.control.sm),
      paddingInline: vars.space.md,
      border: "none",
      background: "transparent",
      borderRadius: vars.radius.full,
      fontFamily: "inherit",
      fontSize: fallbackVar(variables.linkFont, vars.font.size.body3),
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
          color: fallbackVar(variables.indicatorFg, vars.color.text.primary),
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
        [reduced_media]: still,
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
    [composite_layer]: {
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
    [composite_layer]: {
      flexShrink: 0,
      alignSelf: "center",
      inlineSize: "1px",
      blockSize: vars.size.compact.xs,
      marginInline: vars.space.xxs,
      background: vars.color.border.subtle,
    },
  },
});

/** El cajón de la landing: cristal, borde de inicio y pie en columna. */
export const sidebar_scrim = style({
  "@layer": {
    [composite_layer]: {
      position: "fixed",
      inset: 0,
      border: 0,
      padding: 0,
      zIndex: vars.zIndex.overlay,
      background: vars.glass.strong.background,
      backdropFilter: vars.glass.subtle.backdropFilter,
    },
  },
});

export const sidebar = style({
  "@layer": {
    [composite_layer]: {
      position: "fixed",
      insetBlock: 0,
      insetInlineEnd: 0,
      zIndex: vars.zIndex.modal,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      inlineSize: "min(320px, 100vw)",
      background: vars.glass.strong.background,
      backdropFilter: vars.glass.strong.backdropFilter,
      borderInlineStart: `1px solid ${vars.glass.strong.borderColor}`,
      color: vars.color.text.primary,
      fontFamily: vars.font.family.sans,
    },
  },
});

export const sidebar_head = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      justifyContent: "flex-end",
      padding: vars.space.sm,
      flexShrink: 0,
    },
  },
});

export const sidebar_body = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      padding: vars.space.md,
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
    },
  },
});

globalStyle(`${sidebar_body} ${link}`, {
  justifyContent: "flex-start",
  textAlign: "start",
});

export const sidebar_footer = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: vars.space.sm,
      padding: vars.space.md,
      marginBlockStart: "auto",
      flexShrink: 0,
      borderBlockStart: `1px solid ${vars.glass.strong.borderColor}`,
    },
  },
});

export const overflow = style({
  "@layer": {
    [composite_layer]: { position: "relative", flexShrink: 0 },
  },
});

export const overflow_trigger = style({
  "@layer": {
    [composite_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      blockSize: vars.size.control.sm,
      inlineSize: vars.size.control.sm,
      fontSize: vars.font.size.h6,
      borderRadius: vars.radius.full,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "transparent",
      color: vars.color.text.secondary,
      cursor: "pointer",
      listStyle: "none",
      outline: "none",
      ...interaction,
      selectors: {
        "&::-webkit-details-marker": { display: "none" },
        "&:hover": {
          color: vars.color.text.primary,
          background: vars.color.surface.hover,
          borderColor: vars.color.border.subtle,
        },
        "[open] > &": {
          color: vars.color.text.primary,
          background: vars.color.surface.active,
          borderColor: vars.color.border.subtle,
        },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reduced_media]: still },
    },
  },
});

export const overflow_panel = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      insetBlockStart: "calc(100% + 4px)",
      insetInlineEnd: 0,
      zIndex: vars.zIndex.dropdown,
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      minInlineSize: "180px",
      padding: vars.space.xs,
      borderRadius: vars.radius.md,
      background: vars.glass.strong.background,
      backdropFilter: vars.glass.strong.backdropFilter,
      border: `1px solid ${vars.glass.strong.borderColor}`,
      boxShadow: vars.shadow.lg,
    },
  },
});
