import { globalStyle, style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { composite_layer } from "../../theme/layers.css.js";

import * as variables from "./RichTextEditor.vars.css.js";

export const shell = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      borderRadius: vars.radius.md,
      border: `1px solid ${vars.color.border.default}`,
      background: vars.color.surface.base,
      overflow: "hidden",
      selectors: {
        "&[data-invalid='true']": { borderColor: vars.color.semantic.error["600"] },
        "&[data-disabled='true']": {
          background: vars.color.surface.disabled,
          borderColor: vars.color.border.disabled,
        },
        "&:focus-within": { borderColor: vars.color.border.focus },
      },
    },
  },
});

export const toolbar = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: vars.space.xxs,
      padding: vars.space.xxs,
      borderBottom: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.sunken,
    },
  },
});

export const group = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      selectors: {
        "& + &": {
          paddingInlineStart: vars.space.xxs,
          borderInlineStart: `1px solid ${vars.color.border.subtle}`,
        },
      },
    },
  },
});

export const placeholder = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      insetInlineStart: vars.space.sm,
      insetBlockStart: vars.space.sm,
      pointerEvents: "none",
      color: vars.color.text.placeholder,
      fontSize: vars.font.size.body2,
      lineHeight: vars.font.lineHeight.relaxed,
    },
  },
});

export const content = style({
  "@layer": {
    [composite_layer]: {
      position: "relative",
      minHeight: variables.minHeight,
      maxHeight: variables.maxHeight,
      overflowY: "auto",
      padding: vars.space.sm,
      color: vars.color.text.primary,
      fontSize: vars.font.size.body2,
      lineHeight: vars.font.lineHeight.relaxed,
    },
  },
});

const HEADING = {
  margin: 0,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight,
} as const;

globalStyle(`${content} .ProseMirror`, {
  "@layer": { [composite_layer]: { outline: "none", minHeight: "inherit" } },
});

globalStyle(`${content} .ProseMirror:focus-visible`, {
  "@layer": { [composite_layer]: { ...focus.ring } },
});

globalStyle(`${content} .ProseMirror p`, {
  "@layer": { [composite_layer]: { margin: 0 } },
});

globalStyle(`${content} .ProseMirror p + p`, {
  "@layer": { [composite_layer]: { marginBlockStart: vars.space.sm } },
});

globalStyle(`${content} .ProseMirror h1`, {
  "@layer": {
    [composite_layer]: { ...HEADING, marginBlockStart: vars.space.md, fontSize: vars.font.size.h3 },
  },
});

globalStyle(`${content} .ProseMirror h2`, {
  "@layer": {
    [composite_layer]: { ...HEADING, marginBlockStart: vars.space.md, fontSize: vars.font.size.h4 },
  },
});

globalStyle(`${content} .ProseMirror h3`, {
  "@layer": {
    [composite_layer]: { ...HEADING, marginBlockStart: vars.space.sm, fontSize: vars.font.size.h5 },
  },
});

globalStyle(`${content} .ProseMirror ul, ${content} .ProseMirror ol`, {
  "@layer": {
    [composite_layer]: {
      margin: 0,
      marginBlockStart: vars.space.sm,
      paddingInlineStart: vars.space.lg,
    },
  },
});

globalStyle(`${content} .ProseMirror blockquote`, {
  "@layer": {
    [composite_layer]: {
      margin: 0,
      marginBlockStart: vars.space.sm,
      paddingInlineStart: vars.space.sm,
      borderInlineStart: `2px solid ${vars.color.border.strong}`,
      color: vars.color.text.secondary,
    },
  },
});

globalStyle(`${content} .ProseMirror pre`, {
  "@layer": {
    [composite_layer]: {
      margin: 0,
      marginBlockStart: vars.space.sm,
      padding: vars.space.sm,
      borderRadius: vars.radius.sm,
      background: vars.color.surface.sunken,
      fontFamily: vars.font.family.mono,
      fontSize: vars.font.size.body3,
      overflowX: "auto",
      direction: "ltr",
      textAlign: "left",
    },
  },
});

globalStyle(`${content} .ProseMirror code`, {
  "@layer": { [composite_layer]: { fontFamily: vars.font.family.mono, fontSize: "0.9em" } },
});

globalStyle(`${content} .ProseMirror hr`, {
  "@layer": {
    [composite_layer]: {
      margin: 0,
      marginBlock: vars.space.md,
      border: "none",
      borderTop: `1px solid ${vars.color.border.subtle}`,
    },
  },
});

globalStyle(`${content} .ProseMirror a`, {
  "@layer": {
    [composite_layer]: { color: vars.color.primary["600"], textDecoration: "underline" },
  },
});
