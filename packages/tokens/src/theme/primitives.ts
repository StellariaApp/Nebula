/**
 * Primitivas del contrato NebulaTheme (docs/02-theming.md §2).
 * Uniones y shapes pequeños sin dependencias — todo lo demás deriva de aquí.
 */

// ── Color ────────────────────────────────────────────────────────────────────

export type ColorScheme = "light" | "dark";

/** Escala cromática 50–950, 11 pasos (ADR-009). */
export type ColorShade =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "950";

/** Una escala completa: 11 pasos → color. Serializable (JSON). */
export type Scale11 = Record<ColorShade, string>;

/** Las 16 paletas base de Stellaria (extensibles a futuro vía Theme Creator). */
export type PaletteName =
  | "indigo"
  | "violet"
  | "green"
  | "yellow"
  | "red"
  | "blue"
  | "orange"
  | "teal"
  | "pink"
  | "cyan"
  | "lime"
  | "grape"
  | "rose"
  | "gold"
  | "light"
  | "dark";

/** Roles de estado semántico. */
export type SemanticStatus = "success" | "warning" | "error" | "info";

/** Superficies por elevación. */
export type SurfaceRole = "base" | "raised" | "overlay" | "sunken";

/** Roles de texto. */
export type TextRole = "primary" | "secondary" | "muted" | "inverted" | "onPrimary";

/** Roles de borde. */
export type BorderRole = "subtle" | "default" | "strong" | "focus";

// ── Tipografía ───────────────────────────────────────────────────────────────

export type FontFamilyName = "sans" | "mono";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type BodyLevel = "body1" | "body2" | "body3";
/** Nombres de la escala tipográfica plana del theme (02 §2.2). */
export type TextSizeName = HeadingLevel | BodyLevel | "button" | "caption";

export type FontWeightName =
  | "thin"
  | "extralight"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

export type FontWeightValue = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type LineHeightName = "tight" | "normal" | "relaxed";
export type LetterSpacingName = "tight" | "normal" | "wide";

// ── Geometría y densidad ─────────────────────────────────────────────────────

export type RadiusName = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "full";

export type SpacingName = "none" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";

// ── Motion ───────────────────────────────────────────────────────────────────

/** Interruptor global de intensidad de motion (02 §2.4). */
export type MotionTier = "minimal" | "standard" | "expressive";

export type DurationName = "instant" | "fast" | "base" | "slow" | "expressive";

/** `emphasized` sustituye al `springSoft` de Stellaria (mismo bezier con overshoot). */
export type EasingName = "standard" | "emphasized" | "decelerate" | "accelerate";

export type SpringName = "gentle" | "default" | "snappy";

/** Configuración física de spring (Reanimated / motion). */
export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

// ── Efectos ──────────────────────────────────────────────────────────────────

export type BlurLevel = "none" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type ShadowLevel = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type GlassLevel = "subtle" | "default" | "strong";

/** Gradientes temables (gap cerrado — no existían en Stellaria). */
export type GradientRole = "brand" | "accent" | "surface";

// ── Layout global ────────────────────────────────────────────────────────────

export type BreakpointName = "phone" | "tablet" | "laptop" | "desktop" | "wide";

export type ZIndexName =
  | "base"
  | "dropdown"
  | "sticky"
  | "overlay"
  | "modal"
  | "popover"
  | "toast"
  | "tooltip";
