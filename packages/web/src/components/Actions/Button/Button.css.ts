import { keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../../theme/contract.css.js";

import {
  backdropFilter,
  bg,
  bgActive,
  bgHover,
  borderColor,
  borderWidth,
  fg,
  glow,
} from "./Button.vars.css.js";

/**
 * Recipe de Button: SOLO estructura (alturas de `sizes.control`, padding, radius,
 * tipografía, transición). El color llega por las vars locales que resuelve el
 * `variantMap` del tema — ver Button.vars.css.ts y ADR-018 §3.
 */
export const button = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxSizing: "border-box",
    margin: 0,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.font.lineHeight.tight,
    letterSpacing: vars.font.letterSpacing.normal,
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
    userSelect: "none",
    appearance: "none",
    borderRadius: vars.radius.md,
    borderStyle: "solid",
    borderWidth,
    borderColor,
    background: bg,
    color: fg,
    backdropFilter,
    boxShadow: glow,
    // Hot path: solo transform/opacity se animan con spring (motion); color y
    // sombra transicionan por CSS con los tokens del tema (docs/03 §2).
    transitionProperty: "background, border-color, box-shadow, opacity",
    transitionDuration: vars.motion.duration.fast,
    transitionTimingFunction: vars.motion.easing.standard,
    selectors: {
      "&[data-hovered='true']:not([data-disabled='true'])": { background: bgHover },
      "&[data-pressed='true']:not([data-disabled='true'])": { background: bgActive },
      "&[data-focus-visible='true']": {
        outline: `2px solid ${vars.color.border.focus}`,
        outlineOffset: "2px",
      },
      "&[data-disabled='true']": { cursor: "not-allowed", opacity: 0.55 },
      "&[data-loading='true']": { cursor: "progress" },
    },
    "@media": {
      "(prefers-reduced-motion: reduce)": { transitionDuration: "0.01ms" },
    },
  },
  variants: {
    size: {
      xs: {
        height: vars.size.xs,
        paddingInline: vars.space.sm,
        gap: vars.space.xxs,
        fontSize: vars.font.size.body3,
      },
      sm: {
        height: vars.size.sm,
        paddingInline: vars.space.sm,
        gap: vars.space.xs,
        fontSize: vars.font.size.body2,
      },
      md: {
        height: vars.size.md,
        paddingInline: vars.space.md,
        gap: vars.space.xs,
        fontSize: vars.font.size.button,
      },
      lg: {
        height: vars.size.lg,
        paddingInline: vars.space.md,
        gap: vars.space.sm,
        fontSize: vars.font.size.button,
      },
      xl: {
        height: vars.size.xl,
        paddingInline: vars.space.lg,
        gap: vars.space.sm,
        fontSize: vars.font.size.h6,
      },
    },
    fullWidth: {
      true: { width: "100%" },
      false: {},
    },
  },
  defaultVariants: {
    size: "md",
    fullWidth: false,
  },
});

export type ButtonRecipeVariants = NonNullable<RecipeVariants<typeof button>>;

/** Secciones laterales: no se encogen y centran su contenido (iconos). */
export const section = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

/**
 * Atenúa el label mientras carga conservando el ancho del botón.
 *
 * Debe ser `opacity`, NO `visibility: hidden` ni `display: none`: esos sacan el
 * texto del árbol de accesibilidad y dejan al botón sin nombre discernible
 * (violación `button-name` que detectó el gate axe). Con `opacity` el lector de
 * pantalla sigue anunciando la acción, y `aria-busy` comunica la carga.
 */
export const labelLoading = style({
  opacity: 0,
});

const spin = keyframes({
  to: { transform: "rotate(360deg)" },
});

/**
 * Spinner de `loading`. La rotación se mantiene con reduced-motion (es un
 * indicador de progreso, no decoración) pero se ralentiza para reducir el
 * estímulo — docs/03 §2 regla 2.
 */
export const spinner = style({
  position: "absolute",
  width: "1em",
  height: "1em",
  borderRadius: vars.radius.full,
  border: "2px solid currentColor",
  borderTopColor: "transparent",
  animation: `${spin} 700ms linear infinite`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animationDuration: "1800ms",
    },
  },
});
