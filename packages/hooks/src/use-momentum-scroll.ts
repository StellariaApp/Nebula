import { useEffect, useRef, type RefObject } from "react";

import { animation, type SpringConfig } from "@stellaria/nebula-tokens";

import { RubberOffset } from "./rubber.js";

export type MomentumAxis = "x" | "y";

export interface UseMomentumScrollOptions {
  enabled?: boolean | undefined;
  axis?: MomentumAxis | undefined;
  spring?: SpringConfig | undefined;
  multiplier?: number | undefined;
  bounce?: number | undefined;
  onBounce?: ((offset: number) => void) | undefined;
}

const DEFAULT_SPRING: SpringConfig = animation.spring.default;
const DEFAULT_MULTIPLIER = 1;
const LINE_HEIGHT = 16;
const MAX_STEP = 1 / 30;
const FIRST_STEP = 1 / 60;
const REST_DISTANCE = 0.5;
const REST_VELOCITY = 5;
const BOUNCE_EPSILON = 0.05;
const HOLD_MS = 120;
const BOUNCE_RATE = 4;

interface Scroller {
  node: HTMLElement;
  wheel: EventTarget;
  scroll: EventTarget;
}

function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
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
  bounce: number,
  onBounce: ((offset: number) => void) | undefined,
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
    let strain = 0;
    let recoil = 0;
    let reported = 0;
    let holding = false;
    let release = 0;

    const Report = (): void => {
      const offset = bounce <= 0 ? 0 : RubberOffset(strain, bounce);
      if (Math.abs(offset - reported) < BOUNCE_EPSILON) return;
      reported = offset;
      onBounce?.(offset);
    };

    const Start = (): void => {
      if (frame !== 0) return;
      stamp = 0;
      frame = window.requestAnimationFrame(Step);
    };

    const Step = (time: number): void => {
      const elapsed = (time - stamp) / 1000;
      const step = stamp === 0 ? FIRST_STEP : Math.min(Math.max(elapsed, 0), MAX_STEP);
      stamp = time;

      const distance = target - position;
      velocity += ((stiffness * distance - damping * velocity) / mass) * step;
      position += velocity * step;

      if (!holding) {
        const back = stiffness * BOUNCE_RATE;
        const drag = damping * Math.sqrt(BOUNCE_RATE);
        recoil += ((-back * strain - drag * recoil) / mass) * step;
        strain += recoil * step;
      }

      const settled =
        Math.abs(target - position) < REST_DISTANCE && Math.abs(velocity) < REST_VELOCITY;
      const slack =
        holding || (Math.abs(strain) < REST_DISTANCE && Math.abs(recoil) < REST_VELOCITY);

      if (settled) {
        position = target;
        velocity = 0;
      }
      if (slack && !holding) {
        strain = 0;
        recoil = 0;
      }

      Apply(node, horizontal, position);
      applied = Offset(node, horizontal);
      Report();

      if (settled && slack) frame = 0;
      else frame = window.requestAnimationFrame(Step);
    };

    const OnWheel = (event: WheelEvent): void => {
      if (event.ctrlKey || event.defaultPrevented) return;

      const delta = Delta(event, node, horizontal) * multiplier;
      if (delta === 0) return;

      const room = Limit(node, horizontal);
      if (room <= 0) return;
      if (OwnedByNested(event, node, horizontal, delta)) return;

      const next = Clamp(target + delta, room);
      const excess = target + delta - next;

      if (next === target && (bounce <= 0 || excess === 0)) return;

      event.preventDefault();
      target = next;

      if (bounce > 0 && excess !== 0) {
        strain += excess;
        recoil = 0;
        holding = true;
        window.clearTimeout(release);
        release = window.setTimeout(Release, HOLD_MS);
      }

      Start();
    };

    const Release = (): void => {
      holding = false;
      Start();
    };

    const OnScroll = (): void => {
      const current = Offset(node, horizontal);
      if (Math.abs(current - applied) < 1) return;
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
      target = current;
      position = current;
      velocity = 0;
      strain = 0;
      recoil = 0;
      holding = false;
      window.clearTimeout(release);
      applied = current;
      Report();
    };

    scroller.wheel.addEventListener("wheel", OnWheel as EventListener, { passive: false });
    scroller.scroll.addEventListener("scroll", OnScroll, { passive: true });

    return () => {
      scroller.wheel.removeEventListener("wheel", OnWheel as EventListener);
      scroller.scroll.removeEventListener("scroll", OnScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.clearTimeout(release);
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
    bounce = 0,
    onBounce,
  } = options;
  const { stiffness, damping, mass } = spring;
  const report = useLatest(onBounce);

  useEffect(() => {
    const node = ref.current;
    if (!enabled || node === null || typeof window === "undefined") return;
    return Subscribe(
      ElementScroller(node),
      axis,
      { stiffness, damping, mass },
      multiplier,
      bounce,
      (offset) => report.current?.(offset),
    );
  }, [ref, report, enabled, axis, stiffness, damping, mass, multiplier, bounce]);
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
export interface UseAnchorSpringOptions {
  enabled?: boolean | undefined;
  spring?: SpringConfig | undefined;
}

/**
 * Lleva los saltos de ancla con el **muelle del tema** en vez de con `scroll-behavior: smooth`, cuya
 * curva la decide el navegador y no se puede calibrar. Así la rueda y los enlaces comparten física, y
 * `spring` gobierna las dos.
 *
 * Solo se queda los clics que puede resolver: ancla interna, con destino existente y sin modificador.
 * Descuenta el `scroll-padding-top` del documento, de modo que la sección no queda debajo de una
 * barra fija, y al llegar publica el hash para que quien escuche `hashchange` se entere.
 */
export function useAnchorSpring(options: UseAnchorSpringOptions = {}): void {
  const { enabled = true, spring = DEFAULT_SPRING } = options;
  const { stiffness, damping, mass } = spring;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let frame = 0;
    let stamp = 0;

    const Stop = (): void => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const Glide = (to: number, href: string): void => {
      const root = document.scrollingElement ?? document.documentElement;
      if (!(root instanceof HTMLElement)) return;

      let position = window.scrollY;
      let velocity = 0;
      stamp = 0;

      const Step = (time: number): void => {
        const elapsed = (time - stamp) / 1000;
        const step = stamp === 0 ? FIRST_STEP : Math.min(Math.max(elapsed, 0), MAX_STEP);
        stamp = time;

        const distance = to - position;
        velocity += ((stiffness * distance - damping * velocity) / mass) * step;
        position += velocity * step;

        const resting =
          Math.abs(to - position) < REST_DISTANCE && Math.abs(velocity) < REST_VELOCITY;
        if (resting) position = to;

        window.scrollTo({ top: position, behavior: "instant" });

        if (resting) {
          frame = 0;
          return;
        }
        frame = window.requestAnimationFrame(Step);
      };

      Stop();
      window.history.pushState(null, "", href);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      frame = window.requestAnimationFrame(Step);
    };

    const OnClick = (event: MouseEvent): void => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = event.target instanceof Element ? event.target.closest("a[href^='#']") : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href");
      if (href === null || href === "#") return;

      const node = document.getElementById(href.slice(1));
      if (node === null) return;

      const root = document.documentElement;
      const pad = Number.parseFloat(getComputedStyle(root).scrollPaddingTop);
      const gutter = Number.isFinite(pad) ? pad : 0;
      const limit = root.scrollHeight - window.innerHeight;
      const to = Math.min(
        Math.max(node.getBoundingClientRect().top + window.scrollY - gutter, 0),
        Math.max(limit, 0),
      );

      event.preventDefault();
      Glide(to, href);
    };

    window.addEventListener("click", OnClick);
    window.addEventListener("wheel", Stop, { passive: true });
    window.addEventListener("touchstart", Stop, { passive: true });

    return () => {
      window.removeEventListener("click", OnClick);
      window.removeEventListener("wheel", Stop);
      window.removeEventListener("touchstart", Stop);
      Stop();
    };
  }, [enabled, stiffness, damping, mass]);
}

export function useMomentumPage(options: UseMomentumScrollOptions = {}): void {
  const {
    enabled = true,
    axis = "y",
    spring = DEFAULT_SPRING,
    multiplier = DEFAULT_MULTIPLIER,
    bounce = 0,
    onBounce,
  } = options;
  const { stiffness, damping, mass } = spring;
  const report = useLatest(onBounce);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const scroller = PageScroller();
    if (scroller === null) return;
    return Subscribe(scroller, axis, { stiffness, damping, mass }, multiplier, bounce, (offset) =>
      report.current?.(offset),
    );
  }, [report, enabled, axis, stiffness, damping, mass, multiplier, bounce]);
}
