import { animation } from "@stellaria/nebula-tokens";
import { vars } from "@stellaria/nebula-themes/web";

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * El realce al pasar por encima y el hundido al pulsar, tal cual los declara el token.
 *
 * Estaban escritos en `@stellaria/nebula-tokens` desde el principio —`liftHover` es
 * `translateY(-2px)` y `scalePress` es `scale(0.98)`— y los componentes los reimplementaban con
 * `whileHover` y `whileTap` de motion, que monta un componente animado por instancia para mover dos
 * pixeles. Aqui vuelven a ser lo que son: dos cadenas de CSS.
 *
 * No salen del tema porque no lo son: son estructura de la libreria, como los puntos de ruptura de
 * ADR-174. Un producto retine el color de un boton, no cuanto se hunde al pulsarlo.
 */
export const lift_hover = animation.transforms.liftHover;
export const scale_press = animation.transforms.scalePress;

export const interaction = {
  transitionProperty: "background, border-color, color, text-decoration-color, box-shadow, opacity",
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,
} as const;

/**
 * La transicion de una interaccion que MUEVE: el realce y el hundido.
 *
 * `interaction` deja fuera `transform` a proposito —es para color, borde y sombra— asi que hacia
 * falta esta. Mismo peldano de tiempo y misma curva: una respuesta al puntero tiene que sentirse
 * inmediata, y para 120 ms un muelle y un bezier son indistinguibles.
 */
export const press = {
  transitionProperty: "transform",
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,
} as const;

export const layout = {
  transitionProperty: "transform, opacity",
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.decelerate,
} as const;

export const overlay = {
  transitionProperty: "opacity, transform",
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.standard,
} as const;

export const confirm = {
  transitionProperty: "opacity, transform",
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.emphasized,
} as const;

export const value = {
  transitionProperty: "width, stroke-dashoffset",
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.decelerate,
} as const;

export const still = {
  transitionProperty: "none",
  animationName: "none",
} as const;

export const reduced_motion = {
  "@media": { [REDUCED]: still },
} as const;

export const reduced_media = REDUCED;
