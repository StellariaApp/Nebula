import type { NebulaTheme } from "@stellaria/nebula-tokens";

/**
 * Mapea un `NebulaTheme` a los valores de las CSS vars del contrato (contract.css.ts).
 * Fuente única de verdad de la proyección CSS: la usan `createTheme` (build, temas
 * oficiales) y `assignInlineVars` (runtime, temas dinámicos), de modo que ambos
 * caminos producen exactamente las mismas variables.
 *
 * Convenciones de unidad (ADR-016): px para dimensiones (font.size, radius, space,
 * size, letterSpacing — punto RN ≈ px web), ms para duraciones, unitless para
 * weight/lineHeight/zIndex/noiseOpacity. `space` se resuelve a px = `unit × scale`.
 */
function mapValues<K extends string, V, R>(
  record: Record<K, V>,
  fn: (value: V) => R,
): Record<K, R> {
  const out = {} as Record<K, R>;
  for (const key of Object.keys(record) as K[]) {
    out[key] = fn(record[key]);
  }
  return out;
}

const px = (n: number): string => `${n}px`;
const ms = (n: number): string => `${n}ms`;
const num = (n: number): string => String(n);

export function themeToVars(theme: NebulaTheme) {
  const { colors, font, radius, spacing, sizes, motion, effects, zIndex } = theme;
  return {
    color: {
      primary: colors.primary,
      accent: colors.accent,
      gray: colors.gray,
      semantic: {
        success: colors.semantic.success,
        warning: colors.semantic.warning,
        error: colors.semantic.error,
        info: colors.semantic.info,
      },
      surface: colors.surface,
      text: colors.text,
      border: colors.border,
    },
    font: {
      family: font.family,
      size: mapValues(font.size, px),
      weight: mapValues(font.weight, num),
      lineHeight: mapValues(font.lineHeight, num),
      letterSpacing: mapValues(font.letterSpacing, px),
    },
    radius: mapValues(radius, px),
    space: mapValues(spacing.scale, (mult) => px(spacing.unit * mult)),
    size: mapValues(sizes.control, px),
    motion: {
      duration: mapValues(motion.duration, ms),
      easing: motion.easing,
    },
    blur: effects.blur,
    shadow: mapValues(effects.shadows, (s) => s.web),
    glass: {
      subtle: effects.glass.surface.subtle,
      default: effects.glass.surface.default,
      strong: effects.glass.surface.strong,
      noiseOpacity: num(effects.glass.noiseOpacity),
    },
    zIndex: mapValues(zIndex, num),
  };
}
