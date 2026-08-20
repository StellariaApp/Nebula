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

/*
 * EL MODELO DE `smooth-scrollbar`, CORREGIDO POR TASA DE REFRESCO.
 *
 * Alli el estado no es una posicion persiguiendo un objetivo, es un RESTO: lo que queda por
 * recorrer. Cada muesca lo aumenta y cada fotograma se consume una fraccion:
 *
 *   nextMomentum = remain * (1 - damping)
 *   position     = position + remain - nextMomentum
 *
 * Tiene dos propiedades que un muelle no da. Es de PRIMER orden, asi que se mueve lo maximo en el
 * primer fotograma en vez de tener que acelerar desde cero — un muelle con una muesca pequeña mueve
 * sub-pixeles durante varios fotogramas y parece que no responde. Y la inercia sale sola: mientras
 * se gira, el resto se acumula; cuando se para, se drena.
 *
 * Su `damping` es por FOTOGRAMA, asi que a 144 Hz el scroll iria mas del doble de rapido que a 60.
 * Aqui se convierte a una constante por segundo, que es lo que lo hace independiente del refresco:
 *
 *   avance = resto * (1 - exp(-lambda * dt))     con  lambda = -ln(1 - damping) * 60
 */

/**
 * La fraccion del resto que se consume por fotograma a 60 Hz.
 *
 * `0.22` y no el `0.1` de la libreria: con una decima la pagina va tan por detras del gesto que se
 * siente como estar terminando el movimiento anterior en vez de acompañar al dedo. Con esto la cola
 * sigue siendo suave y el scroll no se retrasa.
 */
const WHEEL_DAMPING = 0.22;

/** La constante por segundo equivalente, que es la que se usa de verdad. */
const WHEEL_LAMBDA = -Math.log(1 - WHEEL_DAMPING) * 60;
const BOUNCE_EPSILON = 0.05;
const HOLD_MS = 120;

/**
 * Cuanto mas duro es el muelle que devuelve la goma del borde, comparado con el del scroll.
 *
 * `1` y no `4`: con cuatro veces la rigidez la goma volvia de un tiron, y el estiron se perdia
 * antes de haberse visto. Al mismo peldaño que el scroll la vuelta se siente como algo que cede,
 * que es lo que un borde elastico tiene que comunicar.
 */
const BOUNCE_RATE = 1;

/**
 * Cuanto se frena la vuelta, sobre la amortiguacion del scroll.
 *
 * Por encima de uno el retorno es sobreamortiguado: llega sin pasarse y sin temblar. Un rebote que
 * oscila en el borde de una pagina no se lee como elasticidad, se lee como un fallo.
 */
const BOUNCE_DRAG = 1.6;

/**
 * Que parte de la inercia que quedaba se transfiere a la goma al chocar con el borde.
 *
 * Sin esto, llegar al tope lanzado y llegar despacio estiran lo mismo: la velocidad se descartaba
 * en el `Clamp` y el borde no se enteraba de con cuanta fuerza se llego. Es lo que hace que un
 * frenazo fuerte estire mucho mas que un roce.
 */
const BOUNCE_ABSORB = 0.14;

/**
 * Cuanto silencio de rueda hace falta para volver a poder estirar el borde, en milisegundos.
 *
 * MIENTRAS LA RUEDA SIGUE GIRANDO, EL BORDE NO CEDE OTRA VEZ. En cuanto la goma termina de volver,
 * la rueda queda bloqueada para el sobrerrecorrido y solo se libera cuando el usuario para del
 * todo. Sin esto, seguir girando contra el tope reengancha la goma una y otra vez y el borde
 * tiembla en vez de quedarse quieto.
 *
 * Es el mismo mecanismo que `smooth-scrollbar` resuelve con `_lockWheel` y un debounce de 30 ms;
 * aqui se da mas margen porque una rueda de raton entrega muescas mas espaciadas que un trackpad.
 */
const EDGE_LOCK_MS = 90;

/**
 * Cuanto mas lejos manda un tick cuando el gesto ya venia lanzado.
 *
 * El muelle por si solo llega EXACTAMENTE a lo que se pidio, asi que un empujon fuerte recorre lo
 * mismo que la suma de sus muescas, solo que mas suave. Esto es lo unico que lo separa: un gesto
 * rapido termina un poco mas alla, que es lo que se siente como lanzar.
 *
 * `0.2` esta elegido bajo a proposito. Un giro suelto no gana NI UN PIXEL —la velocidad se
 * construye con ticks seguidos, y con uno solo no hay ninguna— y un empujon de ocho muescas termina
 * unos 330 px mas alla. Subirlo hace que la pagina deje de ir donde se le manda.
 */
const FLING_GAIN = 0.2;

/** A que ritmo de rueda, en px/s, se considera que va lanzado del todo. */
const FLING_SPEED = 2600;

/** Cuanto puede tardar el siguiente tick y seguir contando como el mismo gesto, en segundos. */
const FLING_GAP = 0.2;

/** En cuanto tiempo se olvida el ritmo, en segundos. Sin esto quedaria lanzado para siempre. */
const FLING_MEMORY = 0.22;

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
    let rate = 0;
    let tick = 0;
    /** La rueda no puede volver a estirar el borde hasta que el usuario pare. */
    let locked = false;
    let unlock = 0;


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

      rate *= Math.exp(-step / FLING_MEMORY);

      // El resto que queda por recorrer se consume por fracciones. Sin estado de velocidad: por eso
      // responde en el primer fotograma.
      const distance = target - position;
      const advance = distance * (1 - Math.exp(-WHEEL_LAMBDA * step));
      velocity = step > 0 ? advance / step : 0;
      position += advance;

      /*
       * CHOCAR CON EL BORDE TRANSFIERE LA INERCIA A LA GOMA.
       *
       * El `Clamp` de la rueda impide que el objetivo pase del tope, pero la velocidad que el muelle
       * ya llevaba se descartaba ahi: llegar lanzado y llegar rozando estiraban lo mismo. Aqui esa
       * velocidad se convierte en estiron y el muelle se para, que es lo que hace que un frenazo
       * fuerte se sienta como un frenazo.
       *
       * `Rubber` se encarga de que un choque brutal no salga disparado: el estiron es asintotico.
       */
      if (bounce > 0 && !holding && !locked && strain === 0 && Math.abs(velocity) > REST_VELOCITY) {
        const room = Limit(node, horizontal);
        const outward = (target <= 0 && velocity < 0) || (target >= room && velocity > 0);
        if (outward) {
          strain = velocity * BOUNCE_ABSORB;
          recoil = 0;
          velocity = 0;
          Lock();
        }
      }

      if (!holding) {
        const back = stiffness * BOUNCE_RATE;
        const drag = damping * BOUNCE_DRAG;
        recoil += ((-back * strain - drag * recoil) / mass) * step;
        strain += recoil * step;
      }

      // El resto no se pasa de largo, asi que basta con que quede menos de medio pixel.
      const settled = Math.abs(target - position) < REST_DISTANCE;
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

      const raw = Delta(event, node, horizontal) * multiplier;
      if (raw === 0) return;

      /*
       * El ritmo del gesto se CONSTRUYE con ticks seguidos: un giro aislado no es velocidad, es un
       * paso. Si contara, cualquier muesca suelta saldria disparada.
       */
      const now = event.timeStamp;
      const gap = (now - tick) / 1000;
      tick = now;
      if (gap > 0 && gap < FLING_GAP) rate = Math.max(rate, Math.abs(raw) / Math.max(gap, 1 / 120));

      const delta = raw * (1 + FLING_GAIN * Math.min(rate / FLING_SPEED, 1));

      const room = Limit(node, horizontal);
      if (room <= 0) return;
      if (OwnedByNested(event, node, horizontal, delta)) return;

      const next = Clamp(target + delta, room);
      let excess = target + delta - next;

      /*
       * Con el cerrojo echado la rueda sigue contando para el scroll, pero NO para el borde: el
       * sobrerrecorrido se descarta y cada tick renueva el plazo. Asi, girar sin parar contra el
       * tope deja la pagina quieta en vez de haciendo temblar la goma.
       */
      if (locked && excess !== 0) {
        excess = 0;
        window.clearTimeout(unlock);
        unlock = window.setTimeout(Unlock, EDGE_LOCK_MS);
      }

      if (next === target && (bounce <= 0 || excess === 0)) return;

      event.preventDefault();
      target = next;

      if (bounce > 0 && excess !== 0) {
        /*
         * El estiron sale de las dos cosas: lo que la muesca pedia de mas Y la inercia que el
         * muelle ya llevaba. Sin el segundo sumando, frenar en seco desde arriba estira igual que
         * apoyarse en el tope estando parado.
         */
        strain += excess + velocity * BOUNCE_ABSORB;
        recoil = 0;
        holding = true;
        window.clearTimeout(release);
        release = window.setTimeout(Release, HOLD_MS);

        /*
         * EL BORDE CEDE UNA VEZ POR GESTO.
         *
         * En cuanto la goma se estira, la rueda queda bloqueada para el sobrerrecorrido y solo la
         * suelta el silencio. Seguir girando contra el tope ya no vuelve a estirarla: la pagina se
         * frena del todo y se queda quieta, en vez de temblar mientras el usuario insiste.
         */
        Lock();
      }

      Start();
    };

    const Release = (): void => {
      holding = false;
      Start();
    };

    /** El borde acaba de ceder: no vuelve a hacerlo hasta que la rueda calle. */
    const Lock = (): void => {
      locked = true;
      window.clearTimeout(unlock);
      unlock = window.setTimeout(Unlock, EDGE_LOCK_MS);
    };

    /** La rueda paro el tiempo suficiente: el borde vuelve a poder ceder. */
    const Unlock = (): void => {
      locked = false;
    };

    const OnScroll = (): void => {
      const current = Offset(node, horizontal);
      if (Math.abs(current - applied) < 1) return;
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
      target = current;
      position = current;
      velocity = 0;
      rate = 0;
      tick = 0;
      strain = 0;
      recoil = 0;
      holding = false;
      locked = false;
      window.clearTimeout(release);
      window.clearTimeout(unlock);
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
      window.clearTimeout(unlock);
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
