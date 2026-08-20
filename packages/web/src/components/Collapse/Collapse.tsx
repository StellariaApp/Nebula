"use client";

import { type CSSProperties, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { m, useReducedMotion, type MotionStyle } from "motion/react";

import { Spring, Tween } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import type { CollapseProps } from "./Collapse.types.js";

const HIDDEN: CSSProperties = { overflow: "hidden" };

export function Collapse(props: CollapseProps): ReactElement {
  const { in: is_open = false, duration, className, style, children, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();

  const motion_context = { theme, reduced: prefers_reduced === true };
  const transition =
    duration === undefined
      ? Spring("default", motion_context)
      : Tween(duration, "decelerate", motion_context);

  /*
   * ESTE SE QUEDA CON MOTION, Y NO POR PEREZA.
   *
   * Anima `height` entre `0` y `auto`, o sea hacia un alto INTRINSECO, que es justo lo que una
   * transicion de CSS no interpola: sin saber a cuanto llega, no hay nada entre medias. Las dos
   * salidas conocidas tienen un pero cada una y ninguno compensa todavia:
   *
   *  - `grid-template-rows: 0fr -> 1fr` funciona en todos lados, pero exige un envoltorio dentro,
   *    o sea cambiar el DOM que el consumidor ya estiliza.
   *  - `interpolate-size: allow-keywords` lo resuelve en una linea y sin tocar el marcado, pero
   *    donde no esta soportado la transicion no degrada a mas lenta: degrada a instantanea.
   *
   * El resto del catalogo si salio: lo que quedaba eran giros, desvanecidos y desplazamientos entre
   * dos estados conocidos, y eso el compositor lo hace mejor y sin un bucle por instancia.
   */
  return (
    <m.div
      className={cx(sprinkle_class, className)}
      style={{ ...HIDDEN, ...sprinkle_style, ...style } as MotionStyle}
      initial={false}
      animate={{ height: is_open ? "auto" : 0, opacity: is_open ? 1 : 0 }}
      transition={transition}
      aria-hidden={is_open ? undefined : true}
      {...(is_open ? {} : { inert: true })}
    >
      {children}
    </m.div>
  );
}

Collapse.displayName = "Collapse";
