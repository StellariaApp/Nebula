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

export const chromeHeight = createVar();
export const railWidth = createVar();

/** Modo carril: la barra ocupa la altura completa y cada sección lleva su propia cabecera. */
export const rail = style({
  "@layer": {
    [baseLayer]: {
      display: "grid",
      gridTemplateAreas: `"rail main"`,
      gridTemplateColumns: `${railWidth} 1fr`,
      blockSize: "100dvh",
      minWidth: 0,
      background: vars.color.surface.base,
      color: vars.color.text.primary,
      fontFamily: vars.font.family.sans,
      isolation: "isolate",
    },
  },
});

export const sidebar = style({
  "@layer": {
    [baseLayer]: {
      gridArea: "rail",
      display: "flex",
      flexDirection: "column",
      blockSize: "100dvh",
      minWidth: 0,
      overflowY: "auto",
      overflowX: "hidden",
      zIndex: 1,
      borderInlineEnd: `1px solid ${vars.glass.default.borderColor}`,
    },
  },
});

export const sidebarSlot = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      blockSize: chromeHeight,
      paddingInline: vars.space.lg,
      flexShrink: 0,
      minWidth: 0,
    },
  },
});

export const sidebarTop = style({
  "@layer": {
    [baseLayer]: { borderBlockEnd: `1px solid ${vars.glass.default.borderColor}` },
  },
});

export const sidebarBody = style({
  "@layer": {
    [baseLayer]: { flex: 1, minHeight: 0, overflowY: "auto" },
  },
});

export const sidebarBottom = style({
  "@layer": {
    [baseLayer]: {
      marginBlockStart: "auto",
      borderBlockStart: `1px solid ${vars.glass.default.borderColor}`,
    },
  },
});

export const railMain = style({
  "@layer": {
    [baseLayer]: {
      gridArea: "main",
      minWidth: 0,
      minHeight: 0,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      zIndex: 1,
    },
  },
});

export const section = style({
  "@layer": {
    [baseLayer]: { display: "flex", flexDirection: "column", minWidth: 0 },
  },
});

export const sectionHeader = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.md,
      blockSize: chromeHeight,
      paddingInline: vars.space.lg,
      minWidth: 0,
      borderBlock: `1px solid ${vars.glass.default.borderColor}`,
      borderInline: "none",
    },
  },
});

export const sectionSub = style({
  "@layer": {
    [baseLayer]: {
      paddingInline: vars.space.lg,
      paddingBlock: vars.space.sm,
      borderBlockEnd: `1px solid ${vars.glass.control.borderColor}`,
      minWidth: 0,
    },
  },
});

export const content = style({
  "@layer": {
    [baseLayer]: { padding: vars.space.lg, minWidth: 0 },
  },
});

/** Las regiones heredadas son partes: traen su semántica y su área de la rejilla. */
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
      minWidth: 0,
      borderInlineEnd: `1px solid ${vars.glass.default.borderColor}`,
      ...motion.layout,
      "@media": { "(prefers-reduced-motion: reduce)": motion.still },
    },
  },
});

export const asideRegion = style({
  "@layer": {
    [baseLayer]: {
      gridArea: "aside",
      position: "sticky",
      insetBlockStart: headHeight,
      alignSelf: "start",
      blockSize: `calc(100dvh - ${headHeight})`,
      overflowY: "auto",
      minWidth: 0,
      borderInlineStart: `1px solid ${vars.glass.default.borderColor}`,
    },
  },
});

export const footer = style({
  "@layer": {
    [baseLayer]: {
      gridArea: "footer",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      paddingInline: vars.space.lg,
      paddingBlock: vars.space.sm,
      minWidth: 0,
      borderBlockStart: `1px solid ${vars.glass.default.borderColor}`,
    },
  },
});

/** La cabecera vale en los dos montajes: como región de la rejilla o dentro de una sección. */
export const headerSticky = style({
  "@layer": {
    [baseLayer]: {
      gridArea: "header",
      position: "sticky",
      insetBlockStart: 0,
      zIndex: vars.zIndex.sticky,
    },
  },
});
