import { useEffect, type RefObject } from "react";

import type { SpringConfig } from "@stellaria/nebula-tokens";

export type MomentumAxis = "x" | "y";

export interface UseMomentumScrollOptions {
  enabled?: boolean | undefined;
  axis?: MomentumAxis | undefined;
  spring?: SpringConfig | undefined;
  multiplier?: number | undefined;
}

const DEFAULT_SPRING: SpringConfig = { stiffness: 170, damping: 26, mass: 1 };
const DEFAULT_MULTIPLIER = 1;
const LINE_HEIGHT = 16;
const MAX_STEP = 1 / 30;
const FIRST_STEP = 1 / 60;
const REST_DISTANCE = 0.5;
const REST_VELOCITY = 5;

interface Scroller {
  node: HTMLElement;
  wheel: EventTarget;
  scroll: EventTarget;
}

function ElementScroller(node: HTMLElement): Scroller {
  return { node, wheel: node, scroll: node };
}

function PageScroller(): Scroller | null {
  const node = document.scrollingElement ?? document.documentElement;
  return node instanceof HTMLElement ? { node, wheel: window, scroll: document } : null;
}

function Clamp(value: number, max: number): number {
  return Math.min(Math.max(value, 0), max);
}

function Offset(node: HTMLElement, horizontal: boolean): number {
  return horizontal ? node.scrollLeft : node.scrollTop;
}

function Limit(node: HTMLElement, horizontal: boolean): number {
  return horizontal ? node.scrollWidth - node.clientWidth : node.scrollHeight - node.clientHeight;
}

function Apply(node: HTMLElement, horizontal: boolean, value: number): void {
  if (typeof node.scrollTo === "function") {
    node.scrollTo(
      horizontal ? { left: value, behavior: "instant" } : { top: value, behavior: "instant" },
    );
    return;
  }
  if (horizontal) node.scrollLeft = value;
  else node.scrollTop = value;
}

function Delta(event: WheelEvent, node: HTMLElement, horizontal: boolean): number {
  const raw = horizontal && event.deltaX !== 0 ? event.deltaX : event.deltaY;
  if (event.deltaMode === 1) return raw * LINE_HEIGHT;
  if (event.deltaMode === 2) return raw * (horizontal ? node.clientWidth : node.clientHeight);
  return raw;
}

function OwnedByNested(
  event: WheelEvent,
  node: HTMLElement,
  horizontal: boolean,
  delta: number,
): boolean {
  let current = event.target instanceof Element ? event.target : null;

  while (current !== null && current !== node) {
    if (current instanceof HTMLElement) {
      const overflow = horizontal
        ? getComputedStyle(current).overflowX
        : getComputedStyle(current).overflowY;
      const room = Limit(current, horizontal);
      const at = Offset(current, horizontal);
      const scrollable = overflow === "auto" || overflow === "scroll";
      if (scrollable && room > 0 && ((delta < 0 && at > 0) || (delta > 0 && at < room)))
        return true;
    }
    current = current.parentElement;
  }

  return false;
}

function Subscribe(
  scroller: Scroller,
  axis: MomentumAxis,
  spring: SpringConfig,
  multiplier: number,
): () => void {
  const { node } = scroller;
  const { stiffness, damping, mass } = spring;
  {
    const horizontal = axis === "x";
    let target = Offset(node, horizontal);
    let position = target;
    let velocity = 0;
    let frame = 0;
    let stamp = 0;
    let applied = target;

    const Step = (time: number): void => {
      const elapsed = (time - stamp) / 1000;
      const step = stamp === 0 ? FIRST_STEP : Math.min(Math.max(elapsed, 0), MAX_STEP);
      stamp = time;

      const distance = target - position;
      velocity += ((stiffness * distance - damping * velocity) / mass) * step;
      position += velocity * step;

      const resting =
        Math.abs(target - position) < REST_DISTANCE && Math.abs(velocity) < REST_VELOCITY;
      if (resting) {
        position = target;
        velocity = 0;
        frame = 0;
      }

      Apply(node, horizontal, position);
      applied = Offset(node, horizontal);

      if (!resting) frame = window.requestAnimationFrame(Step);
    };

    const OnWheel = (event: WheelEvent): void => {
      if (event.ctrlKey || event.defaultPrevented) return;

      const delta = Delta(event, node, horizontal) * multiplier;
      if (delta === 0) return;

      const room = Limit(node, horizontal);
      if (room <= 0) return;
      if (OwnedByNested(event, node, horizontal, delta)) return;

      const next = Clamp(target + delta, room);
      if (next === target) return;

      event.preventDefault();
      target = next;

      if (frame === 0) {
        stamp = 0;
        frame = window.requestAnimationFrame(Step);
      }
    };

    const OnScroll = (): void => {
      const current = Offset(node, horizontal);
      if (Math.abs(current - applied) < 1) return;
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
      target = current;
      position = current;
      velocity = 0;
      applied = current;
    };

    scroller.wheel.addEventListener("wheel", OnWheel as EventListener, { passive: false });
    scroller.scroll.addEventListener("scroll", OnScroll, { passive: true });

    return () => {
      scroller.wheel.removeEventListener("wheel", OnWheel as EventListener);
      scroller.scroll.removeEventListener("scroll", OnScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }
}

/**
 * Inercia con muelle sobre la rueda del ratón. `spring` son los tres números del tema
 * (`theme.motion.spring[name]`), de modo que la física es la misma que la de `motion` y Reanimated.
 *
 * No secuestra el gesto cuando no le pertenece: el táctil no genera `wheel` y se queda con la
 * inercia del sistema, `ctrl`+rueda sigue haciendo zoom, un scroller anidado con recorrido se lo
 * queda, y en el tope el evento no se cancela para que el encadenamiento al padre se conserve.
 * Cualquier scroll ajeno —barra arrastrada, teclado, `scrollIntoView`, anclas— resincroniza el
 * destino y mata el muelle. `enabled: false` no suscribe nada.
 */
export function useMomentumScroll(
  ref: RefObject<HTMLElement | null>,
  options: UseMomentumScrollOptions = {},
): void {
  const {
    enabled = true,
    axis = "y",
    spring = DEFAULT_SPRING,
    multiplier = DEFAULT_MULTIPLIER,
  } = options;
  const { stiffness, damping, mass } = spring;

  useEffect(() => {
    const node = ref.current;
    if (!enabled || node === null || typeof window === "undefined") return;
    return Subscribe(ElementScroller(node), axis, { stiffness, damping, mass }, multiplier);
  }, [ref, enabled, axis, stiffness, damping, mass, multiplier]);
}

/**
 * La misma inercia, sobre el scroll de la **página** en vez de sobre un contenedor.
 *
 * El scroller es `document.scrollingElement`, así que `window.scrollY` sigue siendo la fuente de
 * verdad: los efectos anclados al scroll del documento —parallax, scroll-spy, revelado por
 * viewport— no se enteran de que hay un muelle por medio. La única diferencia con
 * `useMomentumScroll` está en dónde escucha: el `wheel` en `window` y el `scroll` en `document`,
 * porque el scroll de la página **no se despacha en `documentElement`**.
 */
export function useMomentumPage(options: UseMomentumScrollOptions = {}): void {
  const {
    enabled = true,
    axis = "y",
    spring = DEFAULT_SPRING,
    multiplier = DEFAULT_MULTIPLIER,
  } = options;
  const { stiffness, damping, mass } = spring;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const scroller = PageScroller();
    if (scroller === null) return;
    return Subscribe(scroller, axis, { stiffness, damping, mass }, multiplier);
  }, [enabled, axis, stiffness, damping, mass, multiplier]);
}
