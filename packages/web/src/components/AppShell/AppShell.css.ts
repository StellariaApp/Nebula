import { globalStyle, style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";
import { SmallerThan } from "../../theme/media.js";

import { asideWidth, chromeHeight, headHeight, navWidth, railMiniWidth, railWidth, shadowOffset } from "./AppShell.vars.css.js";

export const shell = style({
  "@layer": {
    [base_layer]: {
      display: "grid",
      gridTemplateAreas: `"header header header" "nav main aside" "footer footer footer"`,
      gridTemplateColumns: `${navWidth} 1fr ${asideWidth}`,
      gridTemplateRows: `${headHeight} 1fr auto`,
      minHeight: "100dvh",
      minWidth: 0,
      color: vars.color.text.primary,
      fontFamily: vars.font.family.sans,
    },
  },
});

export const main = style({
  "@layer": {
    [base_layer]: {
      gridArea: "main",
      minWidth: 0,
      minHeight: 0,
      zIndex: 0,
      overflowY: "auto",
      selectors: {
        "&[data-padded='true']": { padding: vars.space.lg },
      },
    },
  },
});

export const skip = style({
  "@layer": {
    [base_layer]: {
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

const RAIL_BAR_HEIGHT = "70px";
const RAIL_BAR_GAP = "12px";
const RAIL_BAR_SPACE = `calc(${RAIL_BAR_HEIGHT} + (2 * ${RAIL_BAR_GAP}))`;

/** Modo carril: la barra ocupa la altura completa y cada sección lleva su propia cabecera. */
export const rail = style({
  "@layer": {
    [base_layer]: {
      display: "grid",
      gridTemplateAreas: `"rail chrome" "rail main"`,
      gridTemplateColumns: `${railWidth} 1fr`,
      gridTemplateRows: "auto 1fr",
      selectors: {
        "&[data-rail-collapsed='true']": { gridTemplateColumns: `${railMiniWidth} 1fr` },
      },
      blockSize: "100dvh",
      minWidth: 0,
      background: vars.color.surface.overlay,
      color: vars.color.text.primary,
      fontFamily: vars.font.family.sans,
      isolation: "isolate",
      overflow: "hidden",
      "@media": {
        [SmallerThan("laptop")]: { gridTemplateColumns: `${railMiniWidth} 1fr` },
        [SmallerThan("tablet")]: {
          gridTemplateAreas: `"chrome" "main"`,
          gridTemplateColumns: "1fr",
          blockSize: `calc(100dvh - ${RAIL_BAR_SPACE})`,
          marginBlockEnd: RAIL_BAR_SPACE,
        },
      },
    },
  },
});

export const sidebar = style({
  "@layer": {
    [base_layer]: {
      gridArea: "rail",
      display: "flex",
      flexDirection: "column",
      blockSize: "100dvh",
      minWidth: 0,
      zIndex: 1,
      overflow: "visible",
      position: "relative",
    },
  },
});

export const sidebar_container = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      blockSize: "100%",
      overflowY: "auto",
      overflowX: "visible",
      position: "relative",
      zIndex: 0,
      borderInlineEnd: `1px solid ${vars.glass.default.borderColor}`,
      borderInlineStart: "none !important",
      borderBlock: "none !important",
      "@media": {
        [SmallerThan("tablet")]: {
          position: "fixed",
          insetBlockStart: "auto",
          insetBlockEnd: RAIL_BAR_GAP,
          insetInline: RAIL_BAR_GAP,
          inlineSize: "auto",
          blockSize: RAIL_BAR_HEIGHT,
          maxBlockSize: RAIL_BAR_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          borderRadius: `${vars.radius.md} !important`,
          border: `1px solid ${vars.glass.strong.borderColor} !important`,
          overflowX: "auto",
          overflowY: "hidden",
          gap: vars.space.xs,
          zIndex: vars.zIndex.sticky,
        },
        "(prefers-reduced-motion: reduce)": motion.still,
      },
    },
  },
});

/** Lo que desaparece al encoger el carril: rótulos, secciones y todo lo que necesite ancho. */
export const rail_label = style({
  "@layer": {
    [base_layer]: {
      minWidth: 0,
      selectors: {
        "[data-rail-collapsed='true'] &": { display: "none" },
      },
      "@media": {
        [SmallerThan("laptop")]: { display: "none" },
      },
    },
  },
});

export const toggle = style({
  "@layer": {
    [base_layer]: {
      position: "absolute",
      top: chromeHeight,
      right: 0,
      transform: "translate(50%, -50%) rotate(180deg)",
      zIndex: vars.zIndex.tooltip,
      transition: `transform ${vars.motion.duration.expressive} ${vars.motion.easing.standard}`,
      selectors: {
        "[data-rail-collapsed='true'] &": {
          transform: "translate(50%, -50%) rotate(0deg)",
        },
      },
      "@media": { [SmallerThan("laptop")]: { display: "none" } },
    },
  },
});

export const sidebar_slot = style({
  "@layer": {
    [base_layer]: {
      zIndex: vars.zIndex.sticky,
      position: "sticky",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      gap: vars.space.sm,
      minHeight: chromeHeight,
      paddingInline: vars.space.lg,
      flexShrink: 0,
      minWidth: 0,
      selectors: {
        "[data-rail-collapsed='true'] &": {
          flexDirection: "column",
          justifyContent: "center",
          blockSize: "auto",
          minBlockSize: chromeHeight,
          paddingInline: vars.space.xxs,
          paddingBlock: vars.space.xs,
          gap: vars.space.xxs,
        },
      },
      "@media": {
        [SmallerThan("laptop")]: {
          flexDirection: "column",
          justifyContent: "center",
          blockSize: "auto",
          minBlockSize: chromeHeight,
          paddingInline: vars.space.xxs,
          paddingBlock: vars.space.xs,
          gap: vars.space.xxs,
        },
        [SmallerThan("tablet")]: {
          flexDirection: "row",
          inlineSize: "max-content",
          blockSize: "100%",
          minBlockSize: 0,
          paddingInline: vars.space.sm,
          paddingBlock: 0,
          borderBlock: "none !important",
        },
      },
    },
  },
});

export const sidebar_header = style({
  "@layer": {
    [base_layer]: {
      top: 0,
      borderBlock: `1px solid ${vars.glass.default.borderColor} !important`,
    },
  },
});

export const sidebar_footer = style({
  "@layer": {
    [base_layer]: {
      bottom: 0,
      borderBlockStart: `1px solid ${vars.glass.default.borderColor} !important`,
    },
  },
});

export const sidebar_body = style({
  "@layer": {
    [base_layer]: {
      flex: 1,
      minHeight: "max-content",
      overflow: "hidden",
      backgroundColor: vars.color.surface.overlay,
      selectors: {
        "[data-rail-collapsed='true'] &": { paddingInline: vars.space.xxs },
      },
      "@media": {
        [SmallerThan("tablet")]: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: vars.space.xs,
          inlineSize: "max-content",
          paddingInline: vars.space.xs,
          overflowY: "hidden",
        },
      },
    },
  },
});

export const sidebar_bottom = style({
  "@layer": {
    [base_layer]: {
      marginBlockStart: "auto",
      borderBlockStart: `1px solid ${vars.glass.default.borderColor}`,
    },
  },
});

/** Cada grupo de enlaces: su rótulo, su acción y su lista. */
export const link_group = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      "@media": {
        [SmallerThan("tablet")]: { flexDirection: "row", alignItems: "center", inlineSize: "auto" },
      },
    },
  },
});

export const link_group_head = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.xs,
      minWidth: 0,
      paddingInline: vars.space.md,
      paddingBlockStart: vars.space.md,
      paddingBlockEnd: vars.space.xs,
      selectors: {
        "[data-rail-collapsed='true'] &": { display: "none" },
      },
      "@media": { [SmallerThan("laptop")]: { display: "none" } },
    },
  },
});

/** La lista de enlaces del carril: columna, y fila de iconos en la barra móvil. */
export const rail_nav = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      minWidth: 0,
      paddingInline: vars.space.md,
      selectors: {
        "[data-rail-collapsed='true'] &": { paddingInline: vars.space.xxs },
      },
      "@media": {
        [SmallerThan("laptop")]: { paddingInline: vars.space.xxs },
        [SmallerThan("tablet")]: {
          flexDirection: "row",
          alignItems: "center",
          gap: vars.space.md,
          paddingInline: 0,
          inlineSize: "max-content",
        },
      },
    },
  },
});

export const rail_chrome = style({
  "@layer": {
    [base_layer]: {
      gridArea: "chrome",
      minWidth: 0,
      zIndex: 2,
    },
  },
});

export const section = style({
  "@layer": {
    [base_layer]: { display: "flex", flexDirection: "column", minWidth: 0 },
  },
});

export const section_header = style({
  "@layer": {
    [base_layer]: {
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.md,
      blockSize: chromeHeight,
      paddingInline: vars.space.lg,
      minWidth: 0,
      borderBlock: `1px solid ${vars.glass.default.borderColor}`,
      borderInline: "none !important",
    },
  },
});

export const section_sub = style({
  "@layer": {
    [base_layer]: {
      paddingInline: vars.space.lg,
      paddingBlock: vars.space.sm,
      borderBlockEnd: `1px solid ${vars.glass.control.borderColor}`,
      borderBlockStart: "none !important",
      borderInline: "none !important",
      minWidth: 0,
    },
  },
});

export const content = style({
  "@layer": {
    [base_layer]: { padding: vars.space.lg, minWidth: 0 },
  },
});

/** Las regiones heredadas son partes: traen su semántica y su área de la rejilla. */
export const navbar = style({
  "@layer": {
    [base_layer]: {
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

export const aside_region = style({
  "@layer": {
    [base_layer]: {
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
    [base_layer]: {
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
export const header_sticky = style({
  "@layer": {
    [base_layer]: {
      top: 0,
      gridArea: "header",
      position: "sticky",
      insetBlockStart: 0,
      zIndex: vars.zIndex.sticky,
    },
  },
});

export const sticky_chrome = style({
  "@layer": {
    [base_layer]: {
      top: 0,
      position: "sticky",
      zIndex: vars.zIndex.sticky,
    },
  },
});

/** La subbarra se apila justo debajo de la cabecera, no encima de ella. */
export const sticky_sub = style({
  "@layer": {
    [base_layer]: {
      top: 0,
      position: "sticky",
      insetBlockStart: chromeHeight,
      zIndex: `calc(${vars.zIndex.sticky} - 1)`,
    },
  },
});

export const scroll_shadow = style({
  "@layer": {
    [base_layer]: {
      position: "sticky",
      insetBlockStart: shadowOffset,
      zIndex: `calc(${vars.zIndex.sticky} - 2)`,
      blockSize: 0,
      overflow: "visible",
      pointerEvents: "none",
      selectors: {
        "&::after": {
          content: "",
          display: "block",
          blockSize: "24px",
          background: `linear-gradient(to bottom, ${vars.glass.strong.background}, transparent)`,
          opacity: 0.6,
        },
      },
    },
  },
});

globalStyle(`${rail_nav} > *`, {
  "@media": {
    [SmallerThan("tablet")]: { inlineSize: "max-content", flex: "0 0 auto" },
  },
});
