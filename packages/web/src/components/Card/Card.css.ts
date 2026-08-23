import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "@stellaria/nebula-themes/web";
import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { component_layer } from "../../theme/layers.css.js";
import { PAD_VAR } from "../../utils/style-registry.js";

import * as variables from "./Card.vars.css.js";

export const card_base = style({});

export const card = recipe({
  base: {
    "@layer": {
      [component_layer]: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        background: fallbackVar(variables.bg, vars.color.surface.overlay),
        color: fallbackVar(variables.fg, vars.color.text.primary),
        fontFamily: vars.font.family.sans,
        borderStyle: "solid",
        borderWidth: 0,
        borderColor: fallbackVar(variables.borderColor, vars.color.border.default),
        backdropFilter: fallbackVar(variables.backdropFilter, "none"),
        overflow: "hidden",
        textAlign: "start",
        textDecoration: "none",
        padding: vars.space.lg,
        gap: vars.space.md,
        vars: { [PAD_VAR]: vars.space.lg },
      },
    },
  },
  variants: {
    glowing: {
      true: { "@layer": { [component_layer]: { boxShadow: variables.glow } } },
      false: {},
    },
    shadow: {
      none: {},
      xxs: { boxShadow: vars.shadow.xxs },
      xs: { boxShadow: vars.shadow.xs },
      sm: { boxShadow: vars.shadow.sm },
      md: { boxShadow: vars.shadow.md },
      lg: { boxShadow: vars.shadow.lg },
      xl: { boxShadow: vars.shadow.xl },
      xxl: { boxShadow: vars.shadow.xxl },
    },
    withBorder: {
      true: { "@layer": { [component_layer]: { borderWidth: 1 } } },
      false: {},
    },
    interactive: {
      true: {
        "@layer": {
          [component_layer]: {
            cursor: "pointer",
            ...motion.interaction,
            /*
             * `motion.interaction` deja `transform` fuera —es para color, borde y sombra— asi que
             * la propiedad se rescribe entera aqui para sumarlo. El realce y el hundido eran
             * `whileHover` y `whileTap` de motion, o sea un componente animado por instancia para
             * mover dos pixeles.
             */
            transitionProperty: `${motion.interaction.transitionProperty}, transform`,
            selectors: {
              "&:hover": {
                borderColor: vars.color.border.strong,
                transform: motion.lift_hover,
              },
              // Mas sutil que el `scalePress` del token a proposito: una superficie grande hundida
              // un 2 % se lee como un salto, y una tarjeta ocupa media rejilla.
              "&:active": { transform: "scale(0.995)" },
              "&:focus-visible": {
                ...focus.ring,
              },
              /*
               * El escalon de movimiento del tema no lo puede leer una hoja, asi que llega como
               * atributo desde `CardSurface`. `prefers-reduced-motion` si lo lee, y va abajo.
               */
              "&[data-motion='off']:hover, &[data-motion='off']:active": { transform: "none" },
            },
            "@media": {
              "(prefers-reduced-motion: reduce)": {
                ...motion.still,
                selectors: {
                  "&:hover, &:active": { transform: "none" },
                },
              },
            },
          },
        },
      },
      false: {},
    },
    gradientBorder: {
      true: {
        borderWidth: 0,
      },
      false: {},
    },
  },
  defaultVariants: {
    shadow: "none",
    withBorder: true,
    interactive: false,
    glowing: false,
    gradientBorder: false,
  },
});

/*
 * El relleno lo escribe `p`, que no es de la tarjeta sino de todo el catalogo, asi que la banda no
 * puede saber cuanto es: lo lee de la variable que `p` publica. El `0px` de reserva es para la
 * tarjeta sin relleno, donde no hay nada que cancelar.
 */
const PAD = `var(${PAD_VAR}, 0px)`;

export const section_inset = style({
  marginInline: `calc(${PAD} * -1)`,
  selectors: {
    "&:first-child": { marginBlockStart: `calc(${PAD} * -1)` },
    "&:last-child": { marginBlockEnd: `calc(${PAD} * -1)` },
  },
});

export const section_border = style({
  "@layer": {
    [component_layer]: {
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: vars.color.border.subtle,
      selectors: { "&:last-child": { borderBottomWidth: 0 } },
    },
  },
});

export const meta = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: vars.space.xs,
      fontSize: vars.font.size.caption,
      color: vars.color.text.secondary,
    },
  },
});

export const badges = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.space.xxs,
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.space.xs,
  marginBlockStart: "auto",
  paddingBlockStart: vars.space.xs,
});

globalStyle(`${section_inset} > img`, { display: "block", width: "100%" });
