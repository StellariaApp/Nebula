/**
 * Efectos base migrados de Stellaria (04 §1: blur/glass/shadows "tal cual") con
 * la extensión mandada: sombras DUALES (string CSS web / elevation map native).
 * Los `gradients` del contrato (02 §2.5) son cromáticos: sus valores llegan con
 * los temas (F1) — aquí solo existe el tipo.
 */
import type { BlurLevel, GlassLevel, ShadowLevel } from "../theme/primitives.js";
import type { DualShadow, GlassSurfaceRecipe } from "../theme/theme.js";

export const blur = {
  none: "0px",
  xxs: "1px",
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  xxl: "24px",
} as const satisfies Record<BlurLevel, string>;

/**
 * Recetas glass del scheme light (las duales por tema llegan en F1).
 * `enabled` es un interruptor por-tema (ThemeGlass), no un token base.
 */
export const glass = {
  surface: {
    subtle: {
      background: "rgba(255, 255, 255, 0.48)",
      border: "1px solid rgba(255, 255, 255, 0.24)",
      backdropFilter: `blur(${blur.sm})`,
    },
    default: {
      background: "rgba(255, 255, 255, 0.58)",
      border: "1px solid rgba(255, 255, 255, 0.28)",
      backdropFilter: `blur(${blur.md})`,
    },
    strong: {
      background: "rgba(255, 255, 255, 0.68)",
      border: "1px solid rgba(255, 255, 255, 0.34)",
      backdropFilter: `blur(${blur.lg})`,
    },
  } satisfies Record<GlassLevel, GlassSurfaceRecipe>,
  noiseOpacity: 0.02,
} as const;

// Web: strings CSS exactos de Stellaria. Native: equivalencias provisionales
// (elevation/radius/offset) — TODO(calibración F1/F2) en device real.
export const shadows = {
  xxs: {
    web: "0 1px 2px rgba(9, 9, 11, 0.05)",
    native: {
      elevation: 1,
      shadowColor: "#09090b",
      shadowOpacity: 0.05,
      shadowRadius: 1,
      shadowOffset: { width: 0, height: 1 },
    },
  },
  xs: {
    web: "0 1px 2px rgba(9, 9, 11, 0.05)",
    native: {
      elevation: 1,
      shadowColor: "#09090b",
      shadowOpacity: 0.05,
      shadowRadius: 1,
      shadowOffset: { width: 0, height: 1 },
    },
  },
  sm: {
    web: "0 1px 2px rgba(9, 9, 11, 0.05)",
    native: {
      elevation: 2,
      shadowColor: "#09090b",
      shadowOpacity: 0.05,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
    },
  },
  md: {
    web: "0 8px 20px rgba(9, 9, 11, 0.08)",
    native: {
      elevation: 6,
      shadowColor: "#09090b",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
  },
  lg: {
    web: "0 14px 32px rgba(9, 9, 11, 0.12)",
    native: {
      elevation: 10,
      shadowColor: "#09090b",
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 7 },
    },
  },
  xl: {
    web: "0 22px 40px rgba(9, 9, 11, 0.16)",
    native: {
      elevation: 14,
      shadowColor: "#09090b",
      shadowOpacity: 0.16,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 11 },
    },
  },
  xxl: {
    web: "0 32px 64px rgba(9, 9, 11, 0.24)",
    native: {
      elevation: 20,
      shadowColor: "#09090b",
      shadowOpacity: 0.24,
      shadowRadius: 32,
      shadowOffset: { width: 0, height: 16 },
    },
  },
} as const satisfies Record<ShadowLevel, DualShadow>;

export const effects = {
  blur,
  glass,
  shadows,
} as const;
