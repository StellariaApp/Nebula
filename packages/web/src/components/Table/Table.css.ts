import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

export const table = style({
  "@layer": {
    [base_layer]: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.primary,
    },
  },
});

export const bordered = style({
  "@layer": {
    [base_layer]: {
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: vars.color.border.subtle,
      borderRadius: vars.radius.sm,
      overflow: "hidden",
    },
  },
});

export const caption = style({
  "@layer": {
    [base_layer]: {
      captionSide: "top",
      textAlign: "start",
      paddingBlockEnd: vars.space.sm,
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
    },
  },
});

export const head = style({
  "@layer": {
    [base_layer]: {
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: vars.color.border.default,
    },
  },
});

export const foot = style({
  "@layer": {
    [base_layer]: {
      borderTopWidth: 1,
      borderTopStyle: "solid",
      borderTopColor: vars.color.border.default,
      fontWeight: vars.font.weight.medium,
    },
  },
});

export const row = style({
  "@layer": {
    [base_layer]: {
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: vars.color.border.default,
      ...motion.interaction,
      ...motion.reduced_motion,
      selectors: {
        "tbody &:last-child": { borderBottomWidth: 0 },
        "[data-striped='true'] tbody &:nth-child(even)": { background: vars.color.surface.sunken },
        "&[data-selected='true']": { background: vars.color.surface.active },
        "[data-hoverable='true'] tbody &:hover": { background: vars.color.surface.hover },
        "[data-hoverable='true'] tbody &[data-selected='true']:hover": {
          background: vars.color.surface.hoverActive,
        },
      },
    },
  },
});

export const pressable = style({
  "@layer": {
    [base_layer]: {
      cursor: "pointer",
      selectors: { "&:focus-visible": focus.ring },
    },
  },
});

export const cell = style({
  "@layer": {
    [base_layer]: {
      textAlign: "start",
      verticalAlign: "middle",
      selectors: {
        "[data-density='compact'] &": { padding: `${vars.space.xs} ${vars.space.sm}` },
        "[data-density='normal'] &": { padding: `${vars.space.sm} ${vars.space.md}` },
        "[data-density='comfortable'] &": { padding: vars.space.md },
      },
    },
  },
});

export const title = style({
  "@layer": {
    [base_layer]: {
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.secondary,
      whiteSpace: "nowrap",
      selectors: {
        "[data-sticky='true'] thead &": {
          position: "sticky",
          top: 0,
          zIndex: 1,
          background: vars.color.surface.raised,
        },
      },
    },
  },
});

export const numeric = style({
  "@layer": {
    [base_layer]: { fontVariantNumeric: "tabular-nums" },
  },
});

export const align = styleVariants({
  start: { textAlign: "start" },
  center: { textAlign: "center" },
  end: { textAlign: "end" },
});

export const scroll = style({
  "@layer": {
    [base_layer]: {
      width: "100%",
      overflowX: "auto",
      selectors: { "&:focus-visible": focus.ring },
    },
  },
});

export const scroll_inner = style({
  "@layer": {
    [base_layer]: { minWidth: "100%" },
  },
});
