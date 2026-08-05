import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Banderole.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      width: "100%",
      boxSizing: "border-box",
      paddingBlock: vars.space.sm,
      paddingInline: vars.space.md,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      background: variables.bg,
      color: variables.fg,
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: variables.borderColor,
      backdropFilter: variables.blur,
    },
  },
});

export const sticky = style({
  "@layer": {
    [base_layer]: { position: "sticky", top: 0, zIndex: vars.zIndex.sticky },
  },
});

export const icon = style({
  "@layer": {
    [base_layer]: { display: "inline-flex", flexShrink: 0, lineHeight: 0 },
  },
});

export const body = style({
  "@layer": {
    [base_layer]: { flex: "1 1 auto", minWidth: 0 },
  },
});

export const actions = style({
  "@layer": {
    [base_layer]: { display: "flex", alignItems: "center", gap: vars.space.xs, flexShrink: 0 },
  },
});
