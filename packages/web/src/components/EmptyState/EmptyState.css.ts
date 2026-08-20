import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "@stellaria/nebula-themes/web";
import { component_layer } from "../../theme/layers.css.js";

export const root = recipe({
  base: {
    "@layer": {
      [component_layer]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxSizing: "border-box",
        fontFamily: vars.font.family.sans,
        color: vars.color.text.primary,

        /*
         * Entra al montar. Era `initial={{ opacity: 0, y: 8 }}` con un muelle de motion, para un
         * componente que aparece una vez y no se vuelve a mover. `@starting-style` declara de donde
         * viene y el reposo sigue siendo visible: sin JavaScript el vacio se ve, que es justo lo
         * que un estado vacio tiene que hacer.
         */
        transitionProperty: "opacity, transform",
        transitionDuration: vars.motion.duration.base,
        transitionTimingFunction: vars.motion.easing.decelerate,
        "@starting-style": {
          opacity: 0,
          transform: "translateY(8px)",
        },
        selectors: {
          "&[data-motion='off']": { transitionProperty: "none" },
        },
      },
    },
  },
  variants: {
    size: {
      sm: { gap: vars.space.xs, paddingBlock: vars.space.lg, paddingInline: vars.space.md },
      md: { gap: vars.space.sm, paddingBlock: vars.space.xxl, paddingInline: vars.space.lg },
      lg: { gap: vars.space.md, paddingBlock: vars.space.xxxl, paddingInline: vars.space.xl },
    },
  },
  defaultVariants: { size: "md" },
});

export const icon = style({
  "@layer": {
    [component_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: vars.color.text.muted,
      fontSize: vars.font.size.h2,
      lineHeight: 1,
    },
  },
});

export const title = style({
  "@layer": {
    [component_layer]: {
      margin: 0,
      fontSize: vars.font.size.h6,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
      color: vars.color.text.primary,
    },
  },
});

export const description = style({
  "@layer": {
    [component_layer]: {
      margin: 0,
      maxWidth: "42ch",
      fontSize: vars.font.size.body2,
      lineHeight: vars.font.lineHeight.relaxed,
      color: vars.color.text.secondary,
    },
  },
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.xs,
  justifyContent: "center",
  marginBlockStart: vars.space.xs,
});
