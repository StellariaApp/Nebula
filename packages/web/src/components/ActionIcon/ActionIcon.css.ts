import { keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./ActionIcon.vars.css.js";

export const action_icon = recipe({
  base: {
    "@layer": {
      [primitive_layer]: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        boxSizing: "border-box",
        padding: 0,
        margin: 0,
        flexShrink: 0,
        appearance: "none",
        cursor: "pointer",
        userSelect: "none",
        borderRadius: vars.radius.md,
        borderStyle: "solid",
        borderWidth: variables.borderWidth,
        borderColor: variables.borderColor,
        background: variables.bg,
        color: variables.fg,
        backdropFilter: variables.backdropFilter,
        boxShadow: variables.glow,
        ...motion.interaction,
        transitionProperty: `${motion.interaction.transitionProperty}, transform`,
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
  
      // 0.94 y no el `scalePress` del token: un icono es pequeño y necesita hundirse más
      // para que el gesto se lea.
      "&[data-animated='true'][data-pressed='true']": { transform: "scale(0.94)" },
        "&[data-animated='true'][data-lifts='true'][data-hovered='true']:not([data-pressed='true'])": {
          transform: motion.lift_hover,
        },
          "&[data-focus-visible='true']": {
            ...focus.ring,
          },
          "&[data-disabled='true']": { cursor: "not-allowed", opacity: 0.55 },
          "&[data-loading='true']": { cursor: "progress" },
        },
        "@media": {
          "(prefers-reduced-motion: reduce)": motion.still,
        },
      },
    },
  },
  variants: {
    size: {
      xs: {
        "@layer": {
          [primitive_layer]: {
            width: vars.size.control.xs,
            height: vars.size.control.xs,
            fontSize: `calc(${vars.size.control.xs} / 2)`,
          },
        },
      },
      sm: {
        "@layer": {
          [primitive_layer]: {
            width: vars.size.control.sm,
            height: vars.size.control.sm,
            fontSize: `calc(${vars.size.control.sm} / 2)`,
          },
        },
      },
      md: {
        "@layer": {
          [primitive_layer]: {
            width: vars.size.control.md,
            height: vars.size.control.md,
            fontSize: `calc(${vars.size.control.md} / 2)`,
          },
        },
      },
      lg: {
        "@layer": {
          [primitive_layer]: {
            width: vars.size.control.lg,
            height: vars.size.control.lg,
            fontSize: `calc(${vars.size.control.lg} / 2)`,
          },
        },
      },
      xl: {
        "@layer": {
          [primitive_layer]: {
            width: vars.size.control.xl,
            height: vars.size.control.xl,
            fontSize: `calc(${vars.size.control.xl} / 2)`,
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type ActionIconRecipeVariants = NonNullable<RecipeVariants<typeof action_icon>>;

export const icon_wrap = style({
  "@layer": {
    [primitive_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 0,
    },
  },
});

export const icon_loading = style({ opacity: 0 });

const SPIN = keyframes({ to: { transform: "rotate(360deg)" } });

export const spinner = style({
  position: "absolute",
  width: "1em",
  height: "1em",
  borderRadius: vars.radius.full,
  border: "2px solid currentColor",
  borderTopColor: "transparent",
  animationName: SPIN,
  animationDuration: vars.motion.duration.expressive,
  animationTimingFunction: vars.motion.easing.standard,
  animationIterationCount: "infinite",
  "@media": {
    "(prefers-reduced-motion: reduce)": motion.still,
  },
});
