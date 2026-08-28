"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";

import { useMediaQuery, useTheme } from "@stellaria/nebula-hooks";
import type { SpringName } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { MotionOff, StaggerDelay } from "../../utils/motion.js";
import { SpringToEasing } from "../../utils/spring-easing.js";

import * as styles from "./Reveal.css.js";
import type { RevealInitial, RevealPreset } from "./Reveal.types.js";

const REDUCED = "(prefers-reduced-motion: reduce)";

/** Lo que recorre un `slide-*` cuando nadie dice otra cosa. */
export const REVEAL_DISTANCE = 24;

export const REVEAL_SPRING: SpringName = "gentle";
export const REVEAL_AMOUNT = 0.2;

/** Que parte del recorrido tarda la opacidad. Ver donde se usa. */
const FADE_RATIO = 0.65;
/**
 * Cuanto se ADELANTA el disparo respecto al borde del viewport.
 *
 * Era `-8%`, que ENCOGE la caja de observacion por abajo y por tanto dispara TARDE: el elemento ya
 * estaba dentro y a la vista cuando empezaba a entrar, asi que se veia aparecer en vez de llegar.
 * En positivo la caja se agranda hacia abajo y la entrada arranca mientras el elemento todavia
 * asoma, que es cuando no se nota el mecanismo y solo se nota el movimiento.
 */
export const REVEAL_ROOT_MARGIN = "0px 0px 12% 0px";

/**
 * De donde entra cada preset, como `transform` de CSS.
 *
 * La distancia no vive aqui: llega aparte, porque es el mando que mas cambia entre un producto y
 * otro, y tenerla clavada obligaba a un `className` por encima del componente para moverla.
 *
 * `translate3d` y no `translateY`: fuerza la capa propia y deja el desplazamiento en el compositor.
 */
export function RevealTransform(preset: RevealPreset, distance: number): string {
  switch (preset) {
    case "scale":
      return "scale(0.96)";
    case "pop":
      return "scale(0.86)";
    case "slide-up":
      return `translate3d(0, ${String(distance)}px, 0)`;
    case "slide-down":
      return `translate3d(0, ${String(-distance)}px, 0)`;
    case "slide-left":
      return `translate3d(${String(distance)}px, 0, 0)`;
    case "slide-right":
      return `translate3d(${String(-distance)}px, 0, 0)`;
    default:
      return "none";
  }
}

export interface UseRevealOptions {
  preset?: RevealPreset | undefined;
  spring?: SpringName | undefined;
  duration?: number | undefined;
  once?: boolean | undefined;
  amount?: number | undefined;
  rootMargin?: string | undefined;
  index?: number | undefined;
  distance?: number | undefined;
  initial?: RevealInitial | undefined;
}

export interface UseRevealResult {
  ref: RefObject<HTMLElement | null>;
  /**
   * Si la entrada esta montada. Con el movimiento apagado, sin `IntersectionObserver` o antes del
   * primer efecto vale `false`, y entonces el elemento no lleva ni clase ni atributo: esta ahi.
   */
  armed: boolean;
  shown: boolean;
  className: string | undefined;
  style: Record<string, string> | undefined;
  "data-reveal": "shown" | "hidden" | undefined;
}

export function useReveal(options: UseRevealOptions = {}): UseRevealResult {
  const {
    preset = "slide-up",
    spring: spring_name,
    duration,
    once = true,
    amount = REVEAL_AMOUNT,
    rootMargin = REVEAL_ROOT_MARGIN,
    index,
    distance = REVEAL_DISTANCE,
    initial = "hidden",
  } = options;

  const { theme } = useTheme();
  const reduced = useMediaQuery(REDUCED);

  /*
   * El escalon de movimiento del tema se conoce en el SERVIDOR, asi que decide ahi mismo si esta
   * pieza se anima o no. `prefers-reduced-motion` no: eso solo lo sabe el navegador, y por eso
   * viaja en la consulta de medios de la hoja en vez de aqui.
   */
  const tier_animates = !MotionOff({ theme, reduced: false });
  const is_off = MotionOff({ theme, reduced });

  const ref = useRef<HTMLElement | null>(null);
  const [shown, set_shown] = useState(false);

  useLayoutEffect(() => {
    /*
     * Nada de comprobar aqui si el elemento cae dentro del viewport.
     *
     * El contrato es: OCULTO desde el primer pintado, este dentro o fuera, y cuando ya esta todo
     * montado se compara y se anima. Adelantar la comparacion a este efecto haria que lo que ya
     * estaba en pantalla apareciera sin animarse, que es justo lo que no se quiere.
     *
     * Lo unico que se resuelve aqui es la salida de emergencia: sin escalon de movimiento o sin
     * `IntersectionObserver` no hay nada que esperar, asi que se muestra y se acabo.
     */
    if (is_off || typeof IntersectionObserver === "undefined") set_shown(true);
  }, [is_off]);

  useEffect(() => {
    const element = ref.current;
    // La guarda de `IntersectionObserver` va AQUI y no solo en el efecto de layout: sin ella el
    // constructor lanza en un entorno que no lo tiene y se lleva por delante el efecto entero.
    if (!tier_animates || is_off || element === null) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry === undefined) return;
        if (entry.isIntersecting) {
          set_shown(true);
          if (once) observer.disconnect();
          return;
        }
        if (!once) set_shown(false);
      },
      { threshold: amount, rootMargin },
    );

    observer.observe(element);

    /*
     * PRIMERA COMPROBACION AL MONTAR, sin esperar a que el usuario haga scroll.
     *
     * `observe()` programa una primera llamada con el estado actual, pero llega en otra tarea y
     * depende del observador. Esto la adelanta y la hace determinista: lo que ya esta en pantalla
     * cuando termina el montaje entra ahora, no cuando alguien mueva la rueda.
     *
     * Va en un `useEffect` y no en el de layout a proposito: para cuando corre, el elemento ya se
     * pinto oculto, asi que el cambio a mostrado dispara la transicion. Adelantarlo antes del
     * pintado lo dejaria visible de golpe y sin animar.
     */
    const rect = element.getBoundingClientRect();
    const view = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom > 0 && rect.top < view) set_shown(true);

    return () => {
      observer.disconnect();
    };
  }, [tier_animates, is_off, once, amount, rootMargin]);

  /*
   * Muestrear un muelle recorre ~960 pasos para encontrar donde asienta. Es barato una vez y caro
   * en cada render, asi que se memoriza por curva.
   */
  const timing = useMemo(() => {
    if (duration !== undefined) {
      return { ms: duration, easing: theme.motion.easing.decelerate };
    }
    const sampled = SpringToEasing(theme.motion.spring[spring_name ?? REVEAL_SPRING]);
    return { ms: sampled.duration, easing: sampled.easing };
  }, [duration, spring_name, theme]);

  const delay = StaggerDelay(index ?? 0, { theme, reduced });

  const style = useMemo(
    () =>
      assignInlineVars({
        [styles.from]: RevealTransform(preset, distance),
        [styles.duration]: `${String(timing.ms)}ms`,
        [styles.easing]: timing.easing,
        [styles.delay]: `${String(Math.round(delay * 1000))}ms`,
        /*
         * EL DESVANECIDO TERMINA ANTES QUE EL MOVIMIENTO, Y ESE DESFASE ES EL EFECTO.
         *
         * Con los dos igualados el elemento seguia translucido mientras se colocaba, y eso se lee
         * como que APARECE. Acabando la opacidad al 65 % del recorrido, el ultimo tercio del viaje
         * pasa ya opaco: lo que se ve entonces no es algo materializandose, es algo que LLEGA.
         *
         * Con `duration.slow` fijo —lo que habia— el desfase dependia de que muelle tocara: con uno
         * lento la opacidad acababa a mitad de camino y con uno rapido despues del final. Como
         * fraccion, la proporcion se mantiene sea cual sea la curva.
         */
        [styles.fade_duration]: `${String(Math.round(timing.ms * FADE_RATIO))}ms`,
        [styles.fade_easing]: theme.motion.easing.decelerate,
      }) as Record<string, string>,
    [preset, distance, timing, delay, theme],
  );

  /*
   * La clase y las variables viajan YA en el HTML del servidor: son las que la hoja necesita para
   * esconder el elemento en su primer pintado. Sin ellas habria un fotograma en el que el contenido
   * se ve en su sitio antes de ocultarse, que es el parpadeo que esto viene a quitar.
   *
   * Con `initial="settled"` no se emite nada hasta que el observador dice que si: el contenido nace
   * visible y solo se anima lo que entra despues. Cuesta la animacion de lo que ya estaba en
   * pantalla y a cambio no retrasa el pintado de lo que marca el LCP.
   */
  const hides_first = initial !== "settled";

  if (!tier_animates) {
    return {
      ref,
      armed: false,
      shown: true,
      className: undefined,
      style: undefined,
      "data-reveal": undefined,
    };
  }

  if (!hides_first && !shown) {
    return { ref, armed: true, shown, className: undefined, style: undefined, "data-reveal": undefined };
  }

  return {
    ref,
    armed: true,
    shown,
    className: styles.reveal,
    style,
    "data-reveal": shown ? "shown" : "hidden",
  };
}
