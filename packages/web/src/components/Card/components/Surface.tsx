"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { m, useReducedMotion, type MotionStyle } from "motion/react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";
import { MotionOff, Spring } from "../../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../../utils/style-props.js";

import * as styles from "../Card.css.js";
import type { CardProps } from "../Card.types.js";
import * as variables from "../Card.vars.css.js";

const HOVER_LIFT = -2;

/**
 * El nodo raíz de la tarjeta, y lo único que necesita el tema y motion en runtime.
 *
 * Existe para que `Card` pueda ser de servidor: lo que un componente de servidor pasa como
 * `children` a uno de cliente SIGUE SIENDO DE SERVIDOR, así que todo lo que el consumidor mete
 * dentro de una tarjeta se queda fuera del cliente. Solo hidrata esta cáscara.
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
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };
  const is_off = MotionOff(motion_context);

  const interactive = interactive_prop ?? (onPress !== undefined || href !== undefined);

  const resolved =
    variant === undefined ? null : ResolveVariant(variant, color, theme, undefined, glass);
  const refs = variant === undefined ? undefined : VariantRefs(variant, color, theme, undefined, glass);

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

  const root_style = { ...variant_vars, ...sprinkle_style } as MotionStyle;

  const motion_props = {
    style: root_style,
    ...(is_off || !interactive
      ? {}
      : {
          whileHover: { y: HOVER_LIFT },
          whileTap: { scale: 0.995 },
          transition: Spring("gentle", motion_context),
        }),
  };

  return href !== undefined ? (
    <m.a
      {...rest}
      {...motion_props}
      href={href}
      className={class_name}
      {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
    >
      {children}
    </m.a>
  ) : onPress !== undefined ? (
    <m.button
      {...rest}
      {...motion_props}
      type="button"
      className={class_name}
      onClick={onPress}
      {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
    >
      {children}
    </m.button>
  ) : (
    <m.div
      {...rest}
      {...motion_props}
      className={class_name}
      {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
    >
      {children}
    </m.div>
  );
}

CardSurface.displayName = "Card.Surface";
