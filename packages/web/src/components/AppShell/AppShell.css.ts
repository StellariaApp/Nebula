import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";
import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { composite_layer } from "../../theme/layers.css.js";
import { SmallerThan } from "../../theme/media.js";

import * as glass_surface_vars from "../GlassSurface/GlassSurface.vars.css.js";
import * as NavLinkStyles from "../NavLink/NavLink.css.js";
import * as variables from "./AppShell.vars.css.js";

const GLASS_EDGE = fallbackVar(glass_surface_vars.borderColor, vars.color.border.default);

export const shell = style({
  "@layer": {
    [composite_layer]: {
      display: "grid",
      gridTemplateAreas: `"header header header" "nav main aside" "footer footer footer"`,
      gridTemplateColumns: `${variables.navWidth} 1fr ${variables.asideWidth}`,
      gridTemplateRows: `${variables.headHeight} 1fr auto`,
      minHeight: "100dvh",
      minWidth: 0,
      color: vars.color.text.primary,
      fontFamily: vars.font.family.sans,
      "@media": {
        [SmallerThan("tablet")]: {
          gridTemplateAreas: `"header" "nav" "main" "aside" "footer"`,
          gridTemplateColumns: "minmax(0, 1fr)",
          gridTemplateRows: `${variables.headHeight} auto 1fr auto auto`,
        },
      },
    },
  },
});

export const main = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
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
    [composite_layer]: {
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
    [composite_layer]: {
      display: "grid",
      gridTemplateAreas: `"rail chrome" "rail main"`,
      gridTemplateColumns: `${variables.railWidth} 1fr`,
      gridTemplateRows: "auto 1fr",
      selectors: {
        "&[data-sidebar-collapsed='true']": {
          gridTemplateColumns: `${variables.railMiniWidth} 1fr`,
        },
      },
      blockSize: "100dvh",
      minWidth: 0,
      background: vars.color.surface.overlay,
      color: vars.color.text.primary,
      fontFamily: vars.font.family.sans,
      isolation: "isolate",
      overflow: "hidden",
      "@media": {
        [SmallerThan("laptop")]: { gridTemplateColumns: `${variables.railMiniWidth} 1fr` },
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

/** ADR-153: retirar el carril es retirar también su hueco, que lo reserva la raíz y no él. */
export const rail_hidden = style({
  "@layer": {
    [composite_layer]: {
      "@media": {
        [SmallerThan("laptop")]: {
          gridTemplateAreas: `"chrome" "main"`,
          gridTemplateColumns: "1fr",
        },
        [SmallerThan("tablet")]: {
          blockSize: "100dvh",
          marginBlockEnd: 0,
        },
      },
    },
  },
});

export const sidebar_hidden = style({
  "@layer": {
    [composite_layer]: {
      "@media": {
        [SmallerThan("laptop")]: { display: "none" },
      },
    },
  },
});

export const bounded = style({
  "@layer": {
    [composite_layer]: {
      maxInlineSize: variables.contentMax,
      marginInline: "auto",
      inlineSize: "100%",
      background: "transparent",
    },
  },
});

export const sidebar = style({
  "@layer": {
    [composite_layer]: {
      gridArea: "rail",
      display: "flex",
      flexDirection: "column",
      blockSize: "100dvh",
      minWidth: 0,
      zIndex: 1,
      overflow: "visible",
      position: "relative",
      "@media": {
        [SmallerThan("tablet")]: {
          gridArea: "auto",
          position: "static",
          blockSize: 0,
          minBlockSize: 0,
        },
      },
    },
  },
});

export const sidebar_container = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      blockSize: "100%",
      overflowY: "auto",
      overflowX: "visible",
      position: "relative",
      zIndex: 0,
      borderInlineEnd: `1px solid ${GLASS_EDGE}`,
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
          border: `1px solid ${vars.color.border.default} !important`,
          overflowX: "auto",
          overflowY: "hidden",
          zIndex: vars.zIndex.sticky,
        },
        "(prefers-reduced-motion: reduce)": motion.still,
      },
    },
  },
});

export const label = style({
  "@layer": {
    [composite_layer]: {
      minWidth: 0,
      selectors: {
        "[data-sidebar-collapsed='true'] &": { display: "none" },
      },
      "@media": {
        [SmallerThan("laptop")]: { display: "none" },
      },
    },
  },
});

export const label_flex = style({
  "@layer": {
    [composite_layer]: {
      flex: 1,
    },
  },
});

export const toggle = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      top: variables.chromeHeight,
      right: 0,
      transform: "translate(50%, -50%) rotate(180deg)",
      zIndex: vars.zIndex.tooltip,
      transition: `transform ${vars.motion.duration.expressive} ${vars.motion.easing.standard}`,
      selectors: {
        "[data-sidebar-collapsed='true'] &": {
          transform: "translate(50%, -50%) rotate(0deg)",
        },
      },
      "@media": { [SmallerThan("laptop")]: { display: "none" } },
    },
  },
});

export const sidebar_slot = style({
  "@layer": {
    [composite_layer]: {
      zIndex: vars.zIndex.sticky,
      position: "sticky",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      gap: vars.space.sm,
      minHeight: variables.chromeHeight,
      paddingInline: vars.space.lg,
      paddingBlock: vars.space.sm,
      flexShrink: 0,
      minWidth: 0,
      selectors: {
        "[data-sidebar-collapsed='true'] &": {
          flexDirection: "column",
          justifyContent: "center",
          blockSize: "auto",
          minBlockSize: variables.chromeHeight,
          paddingInline: vars.space.xxs,
          paddingBlock: vars.space.md,
        },
      },
      "@media": {
        [SmallerThan("laptop")]: {
          flexDirection: "column",
          justifyContent: "center",
          blockSize: "auto",
          minBlockSize: variables.chromeHeight,
          paddingInline: vars.space.xxs,
          paddingBlock: vars.space.md,
        },
        [SmallerThan("tablet")]: {
          minWidth: 64,
          flexDirection: "row",
          inlineSize: "max-content",
          blockSize: "100%",
          minBlockSize: 0,
          paddingInline: vars.space.md,
          paddingBlock: 0,
          borderBlock: "none !important",
        },
      },
    },
  },
});

export const sidebar_header = style({
  "@layer": {
    [composite_layer]: {
      top: 0,
      padding: 0,
      borderBlock: `1px solid ${GLASS_EDGE} !important`,
      "@media": {
        [SmallerThan("tablet")]: {
          left: 0,
          borderBlock: "none !important",
          borderInlineEnd: `1px solid ${GLASS_EDGE} !important`,
        },
      },
    },
  },
});

export const sidebar_footer = style({
  "@layer": {
    [composite_layer]: {
      bottom: 0,
      borderBlockStart: `1px solid ${GLASS_EDGE} !important`,
      justifyContent: "space-between",
      "@media": {
        [SmallerThan("tablet")]: {
          right: 0,
          borderBlockStart: "none !important",
          borderInlineStart: `1px solid ${GLASS_EDGE} !important`,
        },
      },
    },
  },
});

export const sidebar_body = style({
  "@layer": {
    [composite_layer]: {
      flex: 1,
      minHeight: "max-content",
      overflow: "hidden",
      padding: 0,
      "@media": {
        [SmallerThan("tablet")]: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: vars.space.xs,
          inlineSize: "max-content",
          blockSize: "100%",
          minBlockSize: 0,
          paddingInline: 0,
          paddingBlock: 0,
          overflowY: "hidden",
          overflowX: "auto",
        },
      },
    },
  },
});

export const sidebar_bottom = style({
  "@layer": {
    [composite_layer]: {
      marginBlockStart: "auto",
      borderBlockStart: `1px solid ${vars.color.border.default}`,
    },
  },
});

export const links = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      gap: vars.space.xxs,
      paddingBlockStart: vars.space.md,
      selectors: {
        "[data-sidebar-collapsed='true'] &": {
          alignItems: "center",
          paddingBlockStart: 0,
        },
      },
      "@media": {
        [SmallerThan("laptop")]: { alignItems: "center", paddingBlock: 0 },
        [SmallerThan("tablet")]: {
          flexDirection: "row",
          alignItems: "center",
          height: "100%",
          minWidth: "max-content",
        },
      },
    },
  },
});

const links_first = `${sidebar_body} > ${links}:not(${links} ~ *)`;
const links_last = `${sidebar_body} > ${links}:not(:has(~ ${links}))`;

const EDGE_NONE = { paddingBlockStart: 0, paddingBlockEnd: 0 };

globalStyle(links_first, {
  "@layer": {
    [composite_layer]: {
      "@media": {
        [SmallerThan("laptop")]: EDGE_NONE,
      },
    },
  },
});

globalStyle(links_last, {
  "@layer": {
    [composite_layer]: {
      "@media": {
        [SmallerThan("laptop")]: EDGE_NONE,
      },
    },
  },
});

globalStyle(`[data-sidebar-collapsed='true'] ${links_first}`, {
  "@layer": { [composite_layer]: EDGE_NONE },
});

globalStyle(`[data-sidebar-collapsed='true'] ${links_last}`, {
  "@layer": { [composite_layer]: EDGE_NONE },
});

export const links_header = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.xs,
      minWidth: 0,
      paddingInline: vars.space.md,
      selectors: {
        "[data-sidebar-collapsed='true'] &": { display: "none" },
      },
      "@media": { [SmallerThan("laptop")]: { display: "none" } },
    },
  },
});

export const links_content = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      minWidth: 0,
      paddingInline: vars.space.md,
      paddingBlockEnd: vars.space.md,
      borderBlockEnd: `1px solid ${vars.color.border.default}`,
      selectors: {
        "[data-sidebar-collapsed='true'] &": {
          width: "stretch",
          alignItems: "center",
          paddingBlock: vars.space.md,
          paddingInline: vars.space.xs,
          gap: vars.space.xxs,
        },
      },
      "@media": {
        [SmallerThan("laptop")]: {
          width: "stretch",
          alignItems: "center",
          paddingBlock: vars.space.md,
          paddingInline: vars.space.sm,
          gap: vars.space.xxs,
        },
        [SmallerThan("tablet")]: {
          flexDirection: "row",
          alignItems: "center",
          paddingBlock: 0,
          paddingInline: vars.space.md,
          gap: vars.space.sm,
          height: "100%",
          inlineSize: "max-content",
          borderBlock: "none !important",
          borderInlineEnd: `1px solid ${vars.color.border.default} !important`,
        },
      },
    },
  },
});

export const links_deep = style({
  "@layer": {
    [composite_layer]: {
      borderBlockEnd: "none !important",
      selectors: {
        "[data-sidebar-collapsed='true'] &": {
          paddingBlock: "0 !important",
        },
      },
      "@media": {
        [SmallerThan("laptop")]: { paddingBlock: "0 !important" },
        [SmallerThan("tablet")]: {
          paddingInline: "0 !important",
          paddingBlock: "0 !important",
          borderBlock: "none !important",
          borderInlineEnd: "none !important",
        },
      },
    },
  },
});

export const link = style({
  "@layer": {
    [composite_layer]: {
      paddingBlock: 0,
      minHeight: 44,
      selectors: {
        "[data-sidebar-collapsed='true'] &": {
          justifyContent: "center",
          width: "100%",
        },
      },
      "@media": {
        [SmallerThan("laptop")]: {
          justifyContent: "center",
          width: "100%",
        },
        [SmallerThan("tablet")]: {
          justifyContent: "center",
          width: "100%",
          paddingBlock: vars.space.xs,
        },
      },
    },
  },
});

globalStyle(`${link} > ${NavLinkStyles.body}`, {
  "@media": {
    [SmallerThan("laptop")]: { display: "none" },
  },
});

globalStyle(`[data-sidebar-collapsed='true'] ${NavLinkStyles.body}`, {
  display: "none",
});

globalStyle(`${link} > ${NavLinkStyles.section_right}`, {
  "@media": {
    [SmallerThan("laptop")]: {
      position: "absolute",
      top: vars.space.u2_5,
      right: vars.space.xs,
      transform: "translateY(-50%)",
    },
  },
});

globalStyle(`[data-sidebar-collapsed='true'] ${NavLinkStyles.section_right}`, {
  position: "absolute",
  top: vars.space.u2_5,
  right: vars.space.xs,
  transform: "translateY(-50%)",
});

export const chrome = style({
  "@layer": {
    [composite_layer]: {
      gridArea: "chrome",
      minWidth: 0,
      zIndex: 2,
    },
  },
});

export const section = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      width: "stretch",
    },
  },
});

export const section_content = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      "@media": {
        [SmallerThan("tablet")]: {
          width: "100%",
        },
      },
    },
  },
});

export const section_header = style({
  "@layer": {
    [composite_layer]: {
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.md,
      minHeight: variables.chromeHeight,
      paddingInline: vars.space.lg,
      paddingBlock: vars.space.md,
      minWidth: 0,
      borderInline: "none !important",
      borderBlockEnd: `1px solid ${GLASS_EDGE}`,
      "@media": {
        [SmallerThan("tablet")]: {
          alignItems: "flex-end",
          flexDirection: "column",
          paddingInline: vars.space.md,
          gap: vars.space.sm,
        },
      },
    },
  },
});

export const section_sub = style({
  "@layer": {
    [composite_layer]: {
      paddingInline: vars.space.lg,
      paddingBlock: vars.space.sm,
      borderBlockEnd: `1px solid ${GLASS_EDGE}`,
      borderBlockStart: "none !important",
      borderInline: "none !important",
      minWidth: 0,
    },
  },
});

export const content = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      width: "stretch",
      padding: vars.space.lg,
    },
  },
});

/** Las regiones heredadas son partes: traen su semántica y su área de la rejilla. */
export const navbar = style({
  "@layer": {
    [composite_layer]: {
      gridArea: "nav",
      position: "sticky",
      insetBlockStart: variables.headHeight,
      alignSelf: "start",
      blockSize: `calc(100dvh - ${variables.headHeight})`,
      overflowY: "auto",
      overflowX: "hidden",
      minWidth: 0,
      borderInlineEnd: `1px solid ${GLASS_EDGE}`,
      ...motion.layout,
      "@media": {
        "(prefers-reduced-motion: reduce)": motion.still,
        [SmallerThan("tablet")]: { position: "static", blockSize: "auto", alignSelf: "stretch" },
      },
    },
  },
});

export const aside_region = style({
  "@layer": {
    [composite_layer]: {
      gridArea: "aside",
      position: "sticky",
      insetBlockStart: variables.headHeight,
      alignSelf: "start",
      blockSize: `calc(100dvh - ${variables.headHeight})`,
      overflowY: "auto",
      minWidth: 0,
      borderInlineStart: `1px solid ${GLASS_EDGE}`,
      "@media": {
        [SmallerThan("tablet")]: { position: "static", blockSize: "auto", alignSelf: "stretch" },
      },
    },
  },
});

export const footer = style({
  "@layer": {
    [composite_layer]: {
      gridArea: "footer",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      paddingInline: vars.space.lg,
      paddingBlock: vars.space.sm,
      minWidth: 0,
      borderBlockStart: `1px solid ${GLASS_EDGE}`,
    },
  },
});

const FOOTER_CONTENT_HIDDEN = { display: "none !important" };

export const footer_content = style({
  "@layer": {
    [composite_layer]: {
      minWidth: 0,
      selectors: {
        "[data-sidebar-collapsed='true'] &": FOOTER_CONTENT_HIDDEN,
      },
      "@media": {
        [SmallerThan("laptop")]: FOOTER_CONTENT_HIDDEN,
      },
    },
  },
});

/** La cabecera vale en los dos montajes: como región de la rejilla o dentro de una sección. */
export const header_sticky = style({
  "@layer": {
    [composite_layer]: {
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
    [composite_layer]: {
      top: 0,
      position: "sticky",
      zIndex: vars.zIndex.sticky,
    },
  },
});

/** La subbarra se apila justo debajo de la cabecera, no encima de ella. */
export const sticky_sub = style({
  "@layer": {
    [composite_layer]: {
      top: 0,
      position: "sticky",
      insetBlockStart: variables.chromeHeight,
      zIndex: `calc(${vars.zIndex.sticky} - 1)`,
    },
  },
});

export const scroll_shadow = style({
  "@layer": {
    [composite_layer]: {
      position: "sticky",
      insetBlockStart: variables.shadowOffset,
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

globalStyle(`${links_content} > *`, {
  "@media": {
    [SmallerThan("tablet")]: { inlineSize: "max-content", flex: "0 0 auto" },
  },
});
