import type { SpringConfig } from "@stellaria/nebula-tokens";

/**
 * Un muelle del tema, escrito como easing de CSS.
 *
 * Existe para que una animacion pueda tener la fisica del tema SIN un bucle de JavaScript por
 * elemento. `linear()` acepta una lista de puntos y el navegador interpola entre ellos, asi que
 * muestreando la respuesta del muelle se obtiene la misma curva —rebote incluido— corriendo en el
 * compositor. Es lo que permite que `Reveal` deje de montar un componente de motion.
 *
 * Lo que NO resuelve, y por eso `Transition` se queda con motion: una transicion de CSS no puede
 * animar un desmontaje, y no se puede interrumpir a mitad para volver con la velocidad que llevaba.
 * Para una entrada que se dispara una vez al entrar en pantalla, ninguna de las dos cosas importa.
 */

/** Cuantos puntos se emiten. Con menos se ve el troceado en un rebote; con mas solo crece el CSS. */
const SAMPLES = 36;

/**
 * Cuanto desplazamiento residual se tolera para darlo por llegado.
 *
 * `0.005` sobre un recorrido de 24 px es 0.12 px: por debajo del pixel, o sea invisible. Afinarlo
 * mas solo alarga la transicion manteniendo ocupado al compositor para no mover nada.
 */
const SETTLED = 0.005;

/** Techo de seguridad: un muelle absurdo del tema no puede colgar el muestreo. */
const MAX_MS = 4000;

export interface SpringEasing {
  /** El valor de `animation-timing-function` / `transition-timing-function`. */
  easing: string;
  /** Lo que dura la curva, en milisegundos. Sale del muelle, no se elige. */
  duration: number;
}

/**
 * Desplazamiento normalizado de un segundo orden en reposo que arranca en 0 y termina en 1.
 *
 * Las tres ramas no son un caso especial cada una: son la misma solucion segun el discriminante.
 * Con `zeta < 1` la raiz es compleja y sale el coseno amortiguado —el rebote—, con `zeta = 1` la
 * raiz es doble, y con `zeta > 1` son dos reales y la respuesta se arrastra sin pasarse.
 */
function Displacement(t: number, omega: number, zeta: number): number {
  if (zeta < 1) {
    const damped = omega * Math.sqrt(1 - zeta * zeta);
    const decay = Math.exp(-zeta * omega * t);
    return 1 - decay * (Math.cos(damped * t) + ((zeta * omega) / damped) * Math.sin(damped * t));
  }

  if (zeta === 1) {
    return 1 - (1 + omega * t) * Math.exp(-omega * t);
  }

  const root = omega * Math.sqrt(zeta * zeta - 1);
  const a = -zeta * omega + root;
  const b = -zeta * omega - root;
  return 1 - (b * Math.exp(a * t) - a * Math.exp(b * t)) / (b - a);
}

/**
 * Cuando el muelle deja de moverse de forma perceptible, en segundos.
 *
 * Se busca el ULTIMO instante fuera de tolerancia, no el primero dentro. Un muelle que rebota cruza
 * su destino de subida, asi que en ese cruce el error es cero y quedarse ahi corta la curva antes
 * del rebote — que es justamente lo que se estaba muestreando.
 */
function SettleTime(omega: number, zeta: number): number {
  const step = 1 / 240;
  const cap = MAX_MS / 1000;
  let last = step;

  for (let t = step; t < cap; t += step) {
    if (Math.abs(1 - Displacement(t, omega, zeta)) >= SETTLED) last = t;
  }

  return Math.min(last + step, cap);
}

/**
 * Convierte un muelle en `linear(...)` y su duracion.
 *
 * La duracion no es un parametro: un muelle tarda lo que tarda, y forzarla lo desvirtua. Quien
 * quiera mandar sobre el tiempo pide un tween con `duration`, que es otra cosa y esta bien que lo
 * sea.
 */
export function SpringToEasing(config: SpringConfig): SpringEasing {
  const { stiffness, damping, mass } = config;
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));

  const seconds = SettleTime(omega, zeta);
  const points: string[] = [];

  for (let i = 0; i <= SAMPLES; i += 1) {
    const progress = i / SAMPLES;
    const value = i === SAMPLES ? 1 : Displacement(progress * seconds, omega, zeta);
    // Tres decimales bastan: por debajo de eso el navegador ya no distingue un pixel.
    points.push(Number(value.toFixed(3)).toString());
  }

  return { easing: `linear(${points.join(",")})`, duration: Math.round(seconds * 1000) };
}
