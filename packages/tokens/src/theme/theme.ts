/**
 * Contrato NebulaTheme (docs/02-theming.md §2 — todas las secciones obligatorias).
 * Un tema es DATOS serializables (JSON) que cumplen este contrato; el Zod schema
 * derivado vive en @stellaria/nebula-themes (ADR-006). Los componentes solo leen
 * roles semánticos — nunca paletas crudas ni hex.
 */
import type { Size, Variant, VariantRecipe } from "../types/variants.js";
import type {
  BlurLevel,
  BorderRole,
  BreakpointName,
  ColorScheme,
  DurationName,
  EasingName,
  FontFamilyName,
  FontWeightName,
  GlassLevel,
  GradientRole,
  LetterSpacingName,
  LineHeightName,
  MotionTier,
  PaletteName,
  RadiusName,
  Scale11,
  SemanticStatus,
  ShadowLevel,
  SpacingName,
  SpringConfig,
  SpringName,
  SurfaceRole,
  TextRole,
  TextSizeName,
  ZIndexName,
} from "./primitives.js";

// ── Secciones ────────────────────────────────────────────────────────────────

export interface ThemeMeta {
  name: string;
  scheme: ColorScheme;
  version: string;
}

/** 1. COLOR — roles semánticos sobre escalas 50–950. */
export interface ThemeColors {
  primary: Scale11;
  accent: Scale11;
  gray: Scale11;
  semantic: Record<SemanticStatus, Scale11>;
  surface: Record<SurfaceRole, string>;
  text: Record<TextRole, string>;
  border: Record<BorderRole, string>;
}

/** 2. TIPOGRAFÍA — familia + escala plana + pesos. */
export interface ThemeFont {
  family: Record<FontFamilyName, string>;
  size: Record<TextSizeName, number>;
  weight: Record<FontWeightName, number>;
  lineHeight: Record<LineHeightName, number>;
  letterSpacing: Record<LetterSpacingName, number>;
}

/** 3. GEOMETRÍA Y DENSIDAD. */
export type ThemeRadius = Record<RadiusName, number>;

/**
 * Densidad por unidad: px resueltos = `unit × scale[token]`.
 * compact (unit 3) ↔ default (unit 4) ↔ comfortable (unit 5).
 */
export interface ThemeSpacing {
  unit: number;
  scale: Record<SpacingName, number>;
}

/** Alturas de control compartidas Web/Native. */
export interface ThemeSizes {
  control: Record<Size, number>;
}

/** 4. MOTION — los componentes consumen SIEMPRE vía theme. */
export interface ThemeMotion {
  tier: MotionTier;
  duration: Record<DurationName, number>;
  easing: Record<EasingName, string>;
  spring: Record<SpringName, SpringConfig>;
}

// ── 5. EFECTOS — tokens con guardrails, no valores libres ───────────────────

export interface GlassSurfaceRecipe {
  background: string;
  border: string;
  backdropFilter: string;
}

export interface ThemeGlass {
  surface: Record<GlassLevel, GlassSurfaceRecipe>;
  noiseOpacity: number;
  /** Interruptor de tema: el preset sober lo apaga. */
  enabled: boolean;
}

/** Sombra dual: string CSS en web, elevation map en native (04 §1). */
export interface DualShadow {
  web: string;
  native: {
    elevation: number;
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
  };
}

export interface GradientStop {
  color: string;
  /** Posición 0–100. */
  position: number;
}

export interface GradientToken {
  type: "linear" | "radial";
  /** Grados (solo linear; ignorado en radial). */
  angle: number;
  stops: GradientStop[];
}

export interface ThemeEffects {
  blur: Record<BlurLevel, string>;
  glass: ThemeGlass;
  shadows: Record<ShadowLevel, DualShadow>;
  gradients: Record<GradientRole, GradientToken>;
}

// ── 7. Z-INDEX y BREAKPOINTS ─────────────────────────────────────────────────

export type ThemeZIndex = Record<ZIndexName, number>;
export type ThemeBreakpoints = Record<BreakpointName, number>;

// ── Contrato completo ────────────────────────────────────────────────────────

export interface NebulaTheme {
  meta: ThemeMeta;
  /** Las 16 paletas base (identidad); los roles de `colors` apuntan a ellas. */
  palettes: Record<PaletteName, Scale11>;
  colors: ThemeColors;
  font: ThemeFont;
  radius: ThemeRadius;
  spacing: ThemeSpacing;
  sizes: ThemeSizes;
  motion: ThemeMotion;
  effects: ThemeEffects;
  /** 6. VARIANTES — hasta el significado visual de `variant` es temable. */
  variantMap: Record<Variant, VariantRecipe>;
  zIndex: ThemeZIndex;
  breakpoints: ThemeBreakpoints;
}
