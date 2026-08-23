import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GradientRole } from "@stellaria/nebula-tokens";

import { type GradientProp } from "@stellaria/nebula-themes/web";
import type { BoxOwnProps } from "../Box/Box.types.js";

export type GradientBorderSurface = "none" | "base" | "raised" | "overlay" | "sunken";

export type GradientBorderEdge = 1 | 2 | 3 | 4;

export type GradientBorderSequence = "continuous" | "spaced";

/**
 * Los tres ejes de la cola del haz. Son independientes a propósito: `parts` es resolución y `gap` es
 * longitud, y confundirlos —alargar subiendo el tamaño de las piezas— es lo que la vuelve tosca.
 */
export interface GradientBorderTrail {
  /**
   * Cuántas piezas la forman. Cada una es una muestra del gradiente, así que subirlo afina la rampa
   * de color sin alargar nada; también es lo que cuesta nodos.
   * @default 32
   */
  parts?: number | undefined;
  /**
   * Separación entre piezas, en fracción de vuelta. La cola mide `parts * gap` del perímetro, de modo
   * que crece con el marco en vez de quedarse corta en los grandes. Subirlo sin subir `parts` la
   * alarga y la deja rala.
   * @default 0.00385
   */
  gap?: number | undefined;
  /**
   * Desenfoque del conjunto, en px. Funde las piezas entre sí; su trabajo es tapar el troceado, no
   * crear halo. Pasado el grosor del anillo empieza a deslavar la luz en vez de suavizarla.
   * @default 0.5
   */
  bloom?: number | undefined;
}

/**
 * A gradient ring around the content, without tinting its inside.
 *
 * GUARDRAIL: it is a brand accent (docs/06 §6). One ring per region, not one per row of a list.
 */
export interface GradientBorderOwnProps extends Omit<BoxOwnProps, "component"> {
  /** The element it paints. @default "div" */
  component?: ElementType | undefined;
  /**
   * A theme gradient role, or a literal `{ from, to }` pair. With `beam` running it stops painting
   * the ring — the ring drops to the plain border colour and the gradient moves into the travelling
   * arc, which is the only way the arc is visible against it.
   * @default "brand"
   */
  gradient?: GradientRole | GradientProp | undefined;
  /** Thickness of the ring, as a raw length. @default 2 */
  width?: number | undefined;
  /**
   * What fills the inside of the ring. `"none"` leaves it transparent, which is what keeps this a
   * ring drawn around existing content rather than a card with a gradient edge.
   * @default "none"
   */
  surface?: GradientBorderSurface | undefined;
  /**
   * Sends a tail of light orbiting the ring. It needs the theme's `motion.tier` above `minimal` and
   * at least one side left in `edges`; failing either, the static gradient ring is what you get.
   * @default false
   */
  beam?: boolean | undefined;
  /**
   * Which sides the light is seen on, clockwise from the top. It is a window, not a route: the light
   * always orbits the whole frame at one speed, and the sides left out only hide it — so it slides in
   * and out of the corners instead of appearing already there, and dropping sides never makes it
   * faster. Read only while `beam` runs.
   * @default [1, 2, 3, 4]
   */
  edges?: readonly GradientBorderEdge[] | undefined;
  /**
   * What the light does with the sides that are off. `"continuous"` skips them: the cycle is only as
   * long as the run that is lit, so the light comes straight back round instead of waiting out the
   * dark stretch — at the same speed either way. `"spaced"` keeps the whole turn, so every side that
   * is off costs its share of the cycle in darkness.
   *
   * Skipping needs the frame measured, so it lands on the client and only when the lit sides form one
   * unbroken run; a broken one — `edges={[1, 3]}` — takes the whole turn whatever this says.
   * @default "continuous"
   */
  sequence?: GradientBorderSequence | undefined;
  /**
   * Tunes the tail. Read in every configuration — `edges` only decides where the tail is seen, never
   * how it is built.
   * @default { parts: 32, gap: 0.00385, bloom: 0.5 }
   */
  trail?: GradientBorderTrail | undefined;
}

export type GradientBorderProps<C extends ElementType = "div"> = GradientBorderOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GradientBorderOwnProps | "component">;
