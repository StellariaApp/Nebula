import type {
  BorderRole,
  ColorShade,
  GlassLevel,
  GradientRole,
  ShadowLevel,
  SurfaceRole,
  TextRole,
} from "../theme/primitives.js";
import type { ColorExtended } from "./colors.js";
import type { Unit } from "./dimensions.js";

export type Size = "xs" | "sm" | "md" | "lg" | "xl";
export type SizeValue = Size | Unit;

/** Set real de Stellaria (04 §1) — prevalece sobre el set del doc de arquitectura. */
export type Variant =
  | "filled"
  | "outline"
  | "light"
  | "glass"
  | "ghost"
  | "glow"
  | "gradient"
  | "unstyled";

export type Orientation = "horizontal" | "vertical";

// ── VariantRecipe: cómo pinta una variante (temable, serializable) ───────────

/**
 * Referencia de color serializable dentro de una receta:
 * - `scale.<paso>`: paso de la escala semántica activa del componente
 *   (la de `color="primary"` por defecto), con alpha opcional 0–100 (`scale.500.12`).
 * - roles puntuales del tema (`surface.*`, `text.*`, `border.*`).
 */
export type VariantColorRef =
  | "transparent"
  | "currentColor"
  | `scale.${ColorShade}`
  | `scale.${ColorShade}.${number}`
  | `surface.${SurfaceRole}`
  | `text.${TextRole}`
  | `border.${BorderRole}`;

export type VariantBackground = VariantColorRef | `gradient.${GradientRole}`;

/** Receta de color de una variante (02 §2.6): fondo + contenido + borde + extras. */
export interface VariantRecipe {
  background: VariantBackground;
  foreground: VariantColorRef;
  border: VariantColorRef | "none";
  /** Solo variante glass: nivel de `effects.glass.surface` (respeta `glass.enabled`). */
  glass?: GlassLevel;
  /** Solo variante glow: token de `effects.shadows` usado como halo. */
  glow?: ShadowLevel;
}

/** Mapa variant→receta que el theme DEBE proveer completo. */
export type VariantMap = Record<Variant, VariantRecipe>;

// ── Props compartidas ────────────────────────────────────────────────────────

export type VariantProps = {
  variant?: Variant;
  gradient?: { from: ColorExtended; to: ColorExtended; deg?: number; animate?: boolean };
};

export type InteractionProps = {
  disabled?: boolean;
  loading?: boolean;
};

export type DataProps = {
  data?: Record<string, string | number | boolean | undefined>;
};

export type VariantsProps = VariantProps & InteractionProps & DataProps;

/** Fix vs Stellaria: incluye `data` — KeysBase debe cubrir keyof BaseProps exacto. */
export const KeysVariants = ["variant", "gradient", "disabled", "loading", "data"] as const;
