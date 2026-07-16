/**
 * Motion base migrado de Stellaria (04 §1: duration/easing se conservan) y
 * extendido con presets `spring` para ThemeMotion (02 §2.4).
 * `transforms`/`transition`/`keyframes` se conservan como tokens base
 * (web/CSS-oriented; NO forman parte del contrato NebulaTheme).
 */
import type { DurationName, EasingName, SpringConfig, SpringName } from "../theme/primitives.js";

const duration = {
  instant: 80,
  fast: 120,
  base: 180,
  slow: 280,
  expressive: 420,
} as const satisfies Record<DurationName, number>;

/** `emphasized` reemplaza al `springSoft` de Stellaria (mismo bezier con overshoot). */
const easing = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  emphasized: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  decelerate: "cubic-bezier(0, 0, 0, 1)",
  accelerate: "cubic-bezier(0.3, 0, 1, 1)",
} as const satisfies Record<EasingName, string>;

// TODO(calibración F1/F2): valores provisionales (roadmap, supuesto 4).
const spring = {
  gentle: { stiffness: 120, damping: 22, mass: 1 },
  default: { stiffness: 170, damping: 26, mass: 1 },
  snappy: { stiffness: 260, damping: 24, mass: 0.9 },
} as const satisfies Record<SpringName, SpringConfig>;

const transforms = {
  scalePress: "scale(0.98)",
  liftHover: "translateY(-2px)",
  fadeSlideUp: "translateY(6px)",
} as const;

const transition = {
  interaction: `transform ${duration.fast}ms ${easing.standard}, opacity ${duration.fast}ms ${easing.standard}, background-color ${duration.fast}ms ${easing.standard}, border-color ${duration.fast}ms ${easing.standard}`,
  layout: `transform ${duration.base}ms ${easing.decelerate}, opacity ${duration.base}ms ${easing.standard}`,
  overlay: `transform ${duration.slow}ms ${easing.emphasized}, opacity ${duration.base}ms ${easing.standard}`,
} as const;

const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeSlideInUp: {
    from: { opacity: 0, transform: transforms.fadeSlideUp },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  pulseSoft: {
    from: { opacity: 0.8 },
    to: { opacity: 1 },
  },
} as const;

export const animation = {
  duration,
  easing,
  spring,
  transforms,
  transition,
  keyframes,
} as const;
