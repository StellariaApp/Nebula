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
    padding = "lg",
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
  const {
    className: sprinkle_class,
    style: sprinkle_style,
    rest,
  } = ExtractStyleProps({
    r,
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
      padding,
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

  const surface = (
    <Box
      {...rest}
      component={element}
      className={class_name}
      style={{ ...variant_vars, ...sprinkle_style }}
      data-motion={motion_off ? "off" : undefined}
      {...(reveal === undefined ? {} : { reveal })}
      {...(href === undefined ? {} : { href })}
      {...(element === "button" ? { type: "button" as const, onClick: onPress } : {})}
      {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
    >
      {children}
    </Box>
  );

  if (gradientBorder === undefined || gradientBorder === false) return surface;

  // El anillo hereda el radio de la tarjeta: es lo que el patron a mano tenia que cuadrar aparte.
  return (
    <GradientBorder r={r} {...RingProps(gradientBorder)}>
      {surface}
    </GradientBorder>
  );
}

CardSurface.displayName = "Card.Surface";
