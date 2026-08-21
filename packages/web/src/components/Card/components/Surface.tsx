"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";
import { MotionOff } from "../../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";
import { GradientBorder } from "../../GradientBorder/GradientBorder.js";

import * as styles from "../Card.css.js";
import type { CardGradientBorder, CardProps } from "../Card.types.js";
import * as variables from "../Card.vars.css.js";

/**
 * Normaliza lo que llega en `gradientBorder`.
 *
 * `true` es el anillo por defecto, una cadena es el nombre de un degradado del tema, un objeto con
 * `from` es un par literal, y cualquier otro objeto es configuracion del anillo. Se distingue por
 * la clave y no por el tipo porque en ejecucion los dos ultimos son objetos.
 */
type Ring = Exclude<NonNullable<CardProps["gradientBorder"]>, false>;

function RingProps(value: Ring): CardGradientBorder {
  if (value === true) return {};
  if (typeof value === "string") return { gradient: value };
  if ("from" in value) return { gradient: value };
  return value;
}

const SPACE_ORDER = ["none", "xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"] as const;

function StepDown(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const index = SPACE_ORDER.indexOf(value as (typeof SPACE_ORDER)[number]);
  return index === -1 ? undefined : SPACE_ORDER[Math.max(index - 1, 0)];
}

/**
 * El hueco entre las partes, un escalon por debajo del relleno.
 *
 * Iba pegado a la variante `padding` de la receta, y al pasar el relleno a `p` la pareja se habria
 * roto sin ruido: un `p="none"` habria dejado el aire de una tarjeta de veinticuatro. Se vuelve a
 * atar aqui, y solo cuando el consumidor no trajo `gap` suyo — un relleno que no sale de la escala
 * (`p={20}`) tampoco mueve el hueco, que se queda en el de la base.
 */
function GapForPad(pad: unknown): unknown {
  if (typeof pad === "object" && pad !== null && !Array.isArray(pad)) {
    const levels = pad as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const level in levels) {
      const step = StepDown(levels[level]);
      if (step !== undefined) out[level] = step;
    }
    return Object.keys(out).length === 0 ? undefined : out;
  }
  return StepDown(pad);
}

/**
 * El nodo raíz de la tarjeta, y lo único que necesita el tema en runtime.
 *
 * Existe para que `Card` pueda ser de servidor: lo que un componente de servidor pasa como
 * `children` a uno de cliente SIGUE SIENDO DE SERVIDOR, así que todo lo que el consumidor mete
 * dentro de una tarjeta se queda fuera del cliente. Solo hidrata esta cáscara.
 *
 * Su raíz es un `Box` y no un elemento suelto, y eso no es cosmético: es lo que le da `reveal` sin
 * reimplementarlo, porque el observador y la transición viven en la cáscara de `Box`.
 *
 * El realce al pasar por encima y el hundido al pulsar eran `whileHover` y `whileTap` de motion, o
 * sea un componente animado por instancia para mover dos píxeles. Ahora son dos reglas de CSS sobre
 * `:hover` y `:active`, con la receta `press` que ya estaba escrita en `styles/motion.css.ts`.
 */
export function CardSurface(props: CardProps): ReactElement {
  const {
    children,
    variant,
    color = "primary",
    r = "lg",
    shadow = "none",
    withBorder = true,
    glass = "subtle",
    interactive: interactive_prop,
    onPress,
    href,
    className,
    reveal,
    gradientBorder,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const derived_gap = style_rest.gap === undefined ? GapForPad(style_rest.p) : undefined;

  const {
    className: sprinkle_class,
    style: sprinkle_style,
    rest,
  } = ExtractStyleProps({
    r,
    ...(derived_gap === undefined ? {} : { gap: derived_gap }),
    ...style_rest,
  });

  const { theme } = useTheme();

  /*
   * Solo el escalon del tema, no `prefers-reduced-motion`: eso lo lleva la hoja con su consulta de
   * medios, que ademas no necesita un listener por tarjeta. Aqui queda lo que el CSS no puede leer.
   */
  const motion_off = MotionOff({ theme, reduced: false });

  const interactive = interactive_prop ?? (onPress !== undefined || href !== undefined);

  const resolved =
    variant === undefined ? null : ResolveVariant(variant, color, theme, undefined, glass);
  const refs =
    variant === undefined ? undefined : VariantRefs(variant, color, theme, undefined, glass);

  const class_name = cx(
    styles.card_base,
    styles.card({
      shadow,
      withBorder: withBorder || resolved?.borderWidth === "1px",
      interactive,
      glowing: resolved !== null && resolved.glow !== "none",
    }),
    sprinkle_class,
    className,
  );

  const variant_vars =
    resolved === null
      ? {}
      : assignInlineVars({
          [variables.bg]: refs?.background ?? resolved.background,
          [variables.fg]: refs?.foreground ?? resolved.foreground,
          [variables.borderColor]: refs?.borderColor ?? resolved.borderColor,
          [variables.backdropFilter]: refs?.backdropFilter ?? resolved.backdropFilter,
          [variables.glow]: refs?.glow ?? resolved.glow,
        });

  const element = href !== undefined ? "a" : onPress !== undefined ? "button" : "div";

  return (
    <Box
      {...rest}
      component={
        gradientBorder === undefined || gradientBorder === false ? element : GradientBorder
      }
      className={class_name}
      style={{ ...variant_vars, ...sprinkle_style }}
      data-motion={motion_off ? "off" : undefined}
      {...(reveal === undefined ? {} : { reveal })}
      {...(href === undefined ? {} : { href })}
      {...(element === "button" ? { type: "button" as const, onClick: onPress } : {})}
      {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
      {...(gradientBorder === undefined || gradientBorder === false
        ? {}
        : RingProps(gradientBorder))}
    >
      {children}
    </Box>
  );
}

CardSurface.displayName = "Card.Surface";
