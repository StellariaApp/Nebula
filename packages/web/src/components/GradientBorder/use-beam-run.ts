"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TRAIL_SPAN } from "./GradientBorder.css.js";
import type { GradientBorderEdge } from "./GradientBorder.types.js";

const PREV_EDGE = { 1: 4, 2: 1, 3: 2, 4: 3 } as const satisfies Record<
  GradientBorderEdge,
  GradientBorderEdge
>;
const NEXT_EDGE = { 1: 2, 2: 3, 3: 4, 4: 1 } as const satisfies Record<
  GradientBorderEdge,
  GradientBorderEdge
>;

const EDGE_COUNT = 4;
const QUARTER = Math.PI / 2;
const TAIL_ROOM = 0.9;

interface Frame {
  w: number;
  h: number;
  r: number;
}

export interface BeamRun {
  from: string;
  to: string;
  beats: number;
  gap: number;
}

interface Measured {
  Track: (node: HTMLElement | null) => void;
  run: BeamRun | null;
}

function Piece(w: number, h: number): number {
  return Math.min(TRAIL_SPAN.max, Math.max(TRAIL_SPAN.min, (w + h) * TRAIL_SPAN.ratio));
}

/**
 * El recorrido que le toca a un tramo encendido, en porcentaje del trazado.
 *
 * `offset-path: border-box` arranca en la tangente superior izquierda y va en sentido horario, y cada
 * lado se lleva su recta **más la curva en la que acaba** — de ahí que un rectángulo redondeado mida
 * `2w + 2h - (8 - 2π)r` y no la suma de los lados rectos.
 *
 * La ventana, en cambio, corta a mitad de curva, así que las bocas van media curva por delante del
 * final de cada lado. Y el salto de vuelta se esconde metiéndolo `lead` más allá de las dos bocas,
 * donde la máscara ya no deja ver nada.
 */
export function ResolveBeamRun(
  lit: readonly GradientBorderEdge[],
  frame: Frame,
  gap: number,
  parts: number,
): BeamRun | null {
  if (lit.length === 0 || lit.length === EDGE_COUNT) return null;

  const heads = lit.filter((edge) => !lit.includes(PREV_EDGE[edge]));
  const [start] = heads;
  if (heads.length !== 1 || start === undefined) return null;

  let end = start;
  while (lit.includes(NEXT_EDGE[end]) && NEXT_EDGE[end] !== start) end = NEXT_EDGE[end];

  const r = Math.max(0, Math.min(frame.r, frame.w / 2, frame.h / 2));
  const arc = QUARTER * r;
  const wide = Math.max(0, frame.w - 2 * r) + arc;
  const tall = Math.max(0, frame.h - 2 * r) + arc;
  const span = [wide, tall, wide, tall];
  const total = 2 * wide + 2 * tall;
  if (total <= 0) return null;

  const Upto = (edge: number): number =>
    span.slice(0, edge).reduce((sum, one) => sum + one, 0) - arc / 2;

  let from = Upto(start - 1);
  let to = Upto(end);
  if (to <= from) to += total;

  const lead = Math.max(0, Math.min(Piece(frame.w, frame.h), (total - (to - from)) / 2 - 1));
  from -= lead;
  to += lead;

  const beats = (to - from) / total;
  if (beats >= 1) return null;

  const Percent = (value: number): string =>
    `${String(Math.round((value / total) * 1000000) / 10000)}%`;

  return {
    from: Percent(from),
    to: Percent(to),
    beats,
    gap: Math.min(gap / beats, TAIL_ROOM / Math.max(1, parts)),
  };
}

/**
 * Mide el marco para que el haz pueda saltarse los lados apagados sin cambiar de velocidad.
 *
 * Hace falta medir porque en CSS una duración no se deriva de una longitud: para que el ciclo se
 * acorte **en la misma proporción** que el tramo encendido, alguien tiene que saber cuánto mide ese
 * tramo, y eso solo se sabe con la caja delante. Sin medida —servidor, primer pintado, o lados
 * sueltos que no forman un tramo— sale la vuelta entera, que es el comportamiento de siempre.
 */
export function UseBeamRun(
  lit: readonly GradientBorderEdge[],
  gap: number,
  parts: number,
  enabled: boolean,
): Measured {
  const node = useRef<HTMLElement | null>(null);
  const [frame, set_frame] = useState<Frame | null>(null);

  const Measure = useCallback(() => {
    const el = node.current;
    if (el === null) return;
    const rect = el.getBoundingClientRect();
    const radius = Number.parseFloat(window.getComputedStyle(el).borderTopLeftRadius) || 0;
    set_frame((prev) =>
      prev !== null && prev.w === rect.width && prev.h === rect.height && prev.r === radius
        ? prev
        : { w: rect.width, h: rect.height, r: radius },
    );
  }, []);

  const Track = useCallback(
    (el: HTMLElement | null) => {
      node.current = el;
      if (el !== null) Measure();
    },
    [Measure],
  );

  useEffect(() => {
    const el = node.current;
    if (!enabled || el === null) {
      set_frame(null);
      return;
    }
    Measure();
    const observer = new ResizeObserver(Measure);
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [enabled, Measure]);

  return {
    Track,
    run: enabled && frame !== null ? ResolveBeamRun(lit, frame, gap, parts) : null,
  };
}
