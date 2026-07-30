import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { bg, blur, borderColor, fg } from "./Banderole.vars.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      width: "100%",
      boxSizing: "border-box",
      paddingBlock: vars.space.sm,
      paddingInline: vars.space.md,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      background: bg,
      color: fg,
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: borderColor,
      backdropFilter: blur,
    },
  },
});

export const sticky = style({
  "@layer": {
    [baseLayer]: { position: "sticky", top: 0, zIndex: vars.zIndex.sticky },
  },
});

export const icon = style({
  "@layer": {
    [baseLayer]: { display: "inline-flex", flexShrink: 0, lineHeight: 0 },
  },
});

export const body = style({
  "@layer": {
    [baseLayer]: { flex: "1 1 auto", minWidth: 0 },
  },
});

export const actions = style({
  "@layer": {
    [baseLayer]: { display: "flex", alignItems: "center", gap: vars.space.xs, flexShrink: 0 },
  },
});
