import { keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { component_layer } from "../../theme/layers.css.js";

import * as variables from "./Button.vars.css.js";

const GRADIENT_SHIFT = keyframes({
  "0%": { backgroundPosition: "0% 50%" },
  "50%": { backgroundPosition: "100% 50%" },
  "100%": { backgroundPosition: "0% 50%" },
});

const GLOW_PULSE = keyframes({
  "0%": { opacity: 0.45 },
  "50%": { opacity: 0.7 },
  "100%": { opacity: 0.45 },
});

export const button = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxSizing: "border-box",
    margin: 0,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.semibold,
    lineHeight: vars.font.lineHeight.tight,
    letterSpacing: vars.font.letterSpacing.normal,
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
    userSelect: "none",
    appearance: "none",
    borderRadius: vars.radius.md,
    borderStyle: "solid",
    borderWidth: variables.borderWidth,
    borderColor: variables.borderColor,
    background: variables.bg,
    color: variables.fg,
    backdropFilter: variables.backdropFilter,
    ...motion.interaction,
    transitionProperty: `${motion.interaction.transitionProperty}, transform`,
    "::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      zIndex: -1,
      borderRadius: "inherit",
      boxShadow: variables.glow,
      opacity: 0,
      pointerEvents: "none",
      ...motion.interaction,
    },
    selectors: {
      "&[data-hovered='true']:not([data-disabled='true'])": { background: variables.bgHover },
      "&[data-pressed='true']:not([data-disabled='true'])": { background: variables.bgActive },
      /*
       * El hundido al pulsar y el realce al pasar por encima. Eran `animate={{ scale, y }}` con un
       * muelle de motion, o sea un componente animado por instancia — y esta es de las que se
       * instancian decenas de veces por pagina.
       *
       * `data-animated` y `data-lifts` los decide el componente porque la hoja no puede: el primero
       * sale de la variante resuelta contra el tema, el segundo de si el fondo ya cambia al pasar
       * por encima, en cuyo caso el color es la respuesta y levantar seria decirlo dos veces.
       */
      "&[data-animated='true'][data-pressed='true']": { transform: motion.scale_press },
      "&[data-animated='true'][data-lifts='true'][data-hovered='true']:not([data-pressed='true'])": {
        transform: motion.lift_hover,
      },
      "&[data-focus-visible='true']": {
        ...focus.ring,
      },
      "&[data-disabled='true']": { cursor: "not-allowed", opacity: 0.55 },
      "&[data-loading='true']": { cursor: "progress" },
      "&[data-gradient-animated='true']": {
        backgroundSize: "200% 200%",
        animationName: GRADIENT_SHIFT,
        animationDuration: `calc(${vars.motion.duration.expressive} * 12)`,
        animationTimingFunction: vars.motion.easing.standard,
        animationIterationCount: "infinite",
      },
      "&[data-variant='glow']::after": { opacity: 0.55 },
      "&[data-glow-idle='true']::after": {
        animationName: GLOW_PULSE,
        animationDuration: `calc(${vars.motion.duration.expressive} * 6)`,
        animationTimingFunction: vars.motion.easing.standard,
        animationIterationCount: "infinite",
      },
      "&[data-variant='glow'][data-hovered='true']::after": {
        animationName: "none",
        opacity: 1,
      },
    },
    "@media": {
      "(prefers-reduced-motion: reduce)": motion.still,
    },
  },
  variants: {
    size: {
      xs: {
        minHeight: vars.size.control.xs,
        paddingInline: vars.space.sm,
        gap: vars.space.xxs,
        fontSize: vars.font.size.body3,
      },
      sm: {
        minHeight: vars.size.control.sm,
        paddingInline: vars.space.md,
        gap: vars.space.xs,
        fontSize: vars.font.size.body3,
      },
      md: {
        minHeight: vars.size.control.md,
        paddingInline: vars.space.lg,
        gap: vars.space.xs,
        fontSize: vars.font.size.button,
      },
      lg: {
        minHeight: vars.size.control.lg,
        paddingInline: vars.space.xl,
        gap: vars.space.sm,
        fontSize: vars.font.size.body1,
      },
      xl: {
        minHeight: vars.size.control.xl,
        paddingInline: vars.space.xxl,
        gap: vars.space.sm,
        fontSize: vars.font.size.body1,
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

export const section = style({
  "@layer": {
    [component_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
  },
});

export const label_loading = style({
  opacity: 0,
});

const SPIN = keyframes({
  to: { transform: "rotate(360deg)" },
});

export const spinner = style({
  position: "absolute",
  width: "1em",
  height: "1em",
  borderRadius: vars.radius.full,
  borderStyle: "solid",
  borderWidth: `calc(1em / 8)`,
  borderColor: "currentColor",
  borderTopColor: "transparent",
  animationName: SPIN,
  animationDuration: `calc(${vars.motion.duration.fast} * 6)`,
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      ...motion.still,
      borderTopColor: "currentColor",
      opacity: 0.5,
    },
  },
});
