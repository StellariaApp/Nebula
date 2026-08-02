import { createVar, style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const navWidth = createVar();
export const asideWidth = createVar();
export const headHeight = createVar();

export const shell = style({
  "@layer": {
    [baseLayer]: {
      display: "grid",
      gridTemplateAreas: `"header header header" "nav main aside" "footer footer footer"`,
      gridTemplateColumns: `${navWidth} 1fr ${asideWidth}`,
      gridTemplateRows: `${headHeight} 1fr auto`,
      minHeight: "100dvh",
      minWidth: 0,
      background: vars.color.surface.base,
      color: vars.color.text.primary,
      fontFamily: vars.font.family.sans,
    },
  },
});

export const header = style({
  "@layer": {
    [baseLayer]: {
      gridArea: "header",
      position: "sticky",
      insetBlockStart: 0,
      zIndex: vars.zIndex.sticky,
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      paddingInline: vars.space.md,
      background: vars.color.surface.raised,
      borderBlockEnd: `1px solid ${vars.color.border.subtle}`,
      minWidth: 0,
    },
  },
});

export const navbar = style({
  "@layer": {
    [baseLayer]: {
      gridArea: "nav",
      position: "sticky",
      insetBlockStart: headHeight,
      alignSelf: "start",
      blockSize: `calc(100dvh - ${headHeight})`,
      overflowY: "auto",
      overflowX: "hidden",
      borderInlineEnd: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.raised,
      ...motion.layout,
      "@media": {
        "(prefers-reduced-motion: reduce)": motion.still,
      },
    },
  },
});

export const aside = style({
  "@layer": {
    [baseLayer]: {
      gridArea: "aside",
      position: "sticky",
      insetBlockStart: headHeight,
      alignSelf: "start",
      blockSize: `calc(100dvh - ${headHeight})`,
      overflowY: "auto",
      borderInlineStart: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.raised,
    },
  },
});

export const main = style({
  "@layer": {
    [baseLayer]: {
      gridArea: "main",
      minWidth: 0,
      minHeight: 0,
      selectors: {
        "&[data-padded='true']": { padding: vars.space.lg },
      },
    },
  },
});

export const footer = style({
  "@layer": {
    [baseLayer]: {
      gridArea: "footer",
      paddingInline: vars.space.md,
      paddingBlock: vars.space.sm,
      borderBlockStart: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.raised,
      minWidth: 0,
    },
  },
});

export const skip = style({
  "@layer": {
    [baseLayer]: {
      position: "fixed",
      insetBlockStart: vars.space.xs,
      insetInlineStart: vars.space.xs,
      zIndex: vars.zIndex.overlay,
      padding: `${vars.space.xs} ${vars.space.sm}`,
      borderRadius: vars.radius.sm,
      background: vars.color.surface.overlay,
      color: vars.color.text.primary,
      fontSize: vars.font.size.body3,
      textDecoration: "none",
      transform: "translateY(-200%)",
      selectors: {
        "&:focus-visible": { transform: "translateY(0)", ...focus.ring },
      },
    },
  },
});
