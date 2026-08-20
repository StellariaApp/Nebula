import { createVar, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Pagination.vars.css.js";

export const root = style({
  "@layer": {
    [primitive_layer]: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      rowGap: vars.space.xxs,
      gap: vars.space.xxs,
      listStyle: "none",
      margin: 0,
      padding: 0,
      fontFamily: vars.font.family.sans,
      // La pildora se posiciona contra la lista, asi que la lista tiene que ser su antecesor.
      position: "relative",
    },
  },
});

export const control = recipe({
  base: {
    "@layer": {
      [primitive_layer]: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        border: "none",
        background: "transparent",
        borderRadius: vars.radius.sm,
        font: "inherit",
        fontWeight: vars.font.weight.semibold,
        lineHeight: vars.font.lineHeight.normal,
        color: vars.color.text.secondary,
        cursor: "pointer",
        ...motion.interaction,
        selectors: {
          "&:hover:not(:disabled):not([data-active='true'])": {
            background: vars.color.surface.hover,
            color: vars.color.text.primary,
          },
          "&[data-active='true']": { color: variables.activeFg },
          "&:disabled": { cursor: "not-allowed", color: vars.color.text.muted },
          "&:focus-visible": {
            ...focus.ring,
          },
        },
        ...motion.reduced_motion,
      },
    },
  },
  variants: {
    size: {
      sm: {
        minWidth: vars.size.control.xs,
        minHeight: vars.size.control.xs,
        fontSize: vars.font.size.body3,
      },
      md: {
        minWidth: vars.size.control.sm,
        minHeight: vars.size.control.sm,
        fontSize: vars.font.size.body2,
      },
      lg: {
        minWidth: vars.size.control.md,
        minHeight: vars.size.control.md,
        fontSize: vars.font.size.body1,
      },
      xl: {
        minWidth: vars.size.control.lg,
        minHeight: vars.size.control.lg,
        fontSize: vars.font.size.body1,
      },
    },
  },
  defaultVariants: { size: "md" },
});

/** Donde esta y cuanto mide el activo. Lo escribe `usePaginationPill` tras medirlo. */
export const pill_x = createVar();
export const pill_y = createVar();
export const pill_width = createVar();
export const pill_height = createVar();

/** La curva del muelle del tema, ya muestreada a `linear()`, y lo que dura. */
export const pill_duration = createVar();
export const pill_easing = createVar();

/**
 * La pildora del activo.
 *
 * Vive en la LISTA y no dentro del boton activo. Dentro del boton solo podia moverse entre uno y
 * otro con la animacion de layout de motion, que obligaba al provider a cargar su juego maximo
 * en toda pagina: 12 kB
 * brotli por este unico uso. Fuera, se mueve con un `transform` y una transicion de CSS.
 */
export const pill = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      top: 0,
      left: 0,
      width: pill_width,
      height: pill_height,
      transform: `translate3d(${pill_x}, ${pill_y}, 0)`,
      borderRadius: vars.radius.sm,
      background: variables.accent,
      zIndex: 0,
      pointerEvents: "none",
      transition: [
        `transform ${pill_duration} ${pill_easing}`,
        `width ${pill_duration} ${pill_easing}`,
        `height ${pill_duration} ${pill_easing}`,
      ].join(", "),

      selectors: {
        // Antes de la primera medida no se sabe donde va, asi que no se pinta ni se anima desde
        // la esquina: aparecer en 0,0 y deslizarse hasta su sitio seria peor que no estar.
        "&[data-ready='false']": {
          opacity: 0,
          transition: "none",
        },
        /*
         * El realce al pasar por encima antes salia de `[data-active='true']:hover &`, que
         * funcionaba porque la pildora era hija del boton. Ahora es su tia, asi que la condicion se
         * evalua desde la lista con `:has()`.
         */
        [`.${root}:has([data-active='true']:hover:not(:disabled)) &`]: {
          background: variables.accentHover,
        },
      },

      "@media": {
        "(prefers-reduced-motion: reduce)": {
          transition: "none",
        },
      },
    },
  },
});
export const value = style({ position: "relative", zIndex: 1 });

export const dots = style({
  "@layer": {
    [primitive_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: vars.size.control.xs,
      color: vars.color.text.muted,
      userSelect: "none",
    },
  },
});
