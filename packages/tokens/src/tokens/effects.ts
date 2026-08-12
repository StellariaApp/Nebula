import type { BlurLevel, GlassLevel, ShadowLevel } from "../theme/primitives.js";
import type { DualShadow, GlassSurfaceRecipe, ThemeInk } from "../theme/theme.js";

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

export const glass = {
  surface: {
    veil: {
      background: "rgba(255, 255, 255, 0.30)",
      backdropFilter: `blur(${blur.xxs}) saturate(120%)`,
      borderColor: "#dedede",
    },
    band: {
      background: "rgba(255, 255, 255, 0.78)",
      backdropFilter: `blur(${blur.xxs}) saturate(110%)`,
      borderColor: "#e9e9ea",
    },
    control: {
      background: "rgba(255, 255, 255, 0.81)",
      backdropFilter: `blur(${blur.xs}) saturate(120%)`,
      borderColor: "#e9e9ea",
    },
    subtle: {
      background: "rgba(255, 255, 255, 0.84)",
      backdropFilter: `blur(${blur.sm}) saturate(130%)`,
      borderColor: "#e9e9ea",
    },
    default: {
      background: "rgba(255, 255, 255, 0.87)",
      backdropFilter: `blur(${blur.lg}) saturate(140%)`,
      borderColor: "#e9e9ea",
    },
    strong: {
      background: "rgba(255, 255, 255, 0.90)",
      backdropFilter: `blur(${blur.xl}) saturate(140%)`,
      borderColor: "#e9e9ea",
    },
  } satisfies Record<GlassLevel, GlassSurfaceRecipe>,
  noiseOpacity: 0.02,
} as const;

export const shadows = {
  xxs: {
    web: "0 1px 1px rgba(9, 9, 11, 0.04)",
    native: {
      elevation: 1,
      shadowColor: "#09090b",
      shadowOpacity: 0.04,
      shadowRadius: 1,
      shadowOffset: { width: 0, height: 1 },
    },
  },
  xs: {
    web: "0 1px 2px rgba(9, 9, 11, 0.06), 0 1px 1px rgba(9, 9, 11, 0.04)",
    native: {
      elevation: 2,
      shadowColor: "#09090b",
      shadowOpacity: 0.06,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
    },
  },
  sm: {
    web: "0 2px 5px rgba(9, 9, 11, 0.07), 0 1px 2px rgba(9, 9, 11, 0.05)",
    native: {
      elevation: 4,
      shadowColor: "#09090b",
      shadowOpacity: 0.07,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },
  },
  md: {
    web: "0 8px 20px rgba(9, 9, 11, 0.09), 0 2px 6px rgba(9, 9, 11, 0.06)",
    native: {
      elevation: 6,
      shadowColor: "#09090b",
      shadowOpacity: 0.09,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
  },
  lg: {
    web: "0 14px 32px rgba(9, 9, 11, 0.12), 0 4px 10px rgba(9, 9, 11, 0.07)",
    native: {
      elevation: 10,
      shadowColor: "#09090b",
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 7 },
    },
  },
  xl: {
    web: "0 22px 44px rgba(9, 9, 11, 0.16), 0 6px 14px rgba(9, 9, 11, 0.08)",
    native: {
      elevation: 14,
      shadowColor: "#09090b",
      shadowOpacity: 0.16,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 11 },
    },
  },
  xxl: {
    web: "0 32px 68px rgba(9, 9, 11, 0.24), 0 10px 22px rgba(9, 9, 11, 0.10)",
    native: {
      elevation: 20,
      shadowColor: "#09090b",
      shadowOpacity: 0.24,
      shadowRadius: 34,
      shadowOffset: { width: 0, height: 16 },
    },
  },
} as const satisfies Record<ShadowLevel, DualShadow>;

export const effects = {
  blur,
  glass,
  shadows,
} as const;

export const ink = {
  floor: 2,
} as const satisfies ThemeInk;
