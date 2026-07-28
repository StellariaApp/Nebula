import type { DualShadow, ShadowLevel } from "@stellaria/nebula-tokens";

const RIM = "inset 0 1px 0 0";

export const darkShadows = {
  xxs: {
    web: `${RIM} rgba(255, 255, 255, 0.04), 0 1px 2px rgba(0, 0, 0, 0.40)`,
    native: {
      elevation: 1,
      shadowColor: "#000000",
      shadowOpacity: 0.4,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
    },
  },
  xs: {
    web: `${RIM} rgba(255, 255, 255, 0.05), 0 2px 4px rgba(0, 0, 0, 0.45)`,
    native: {
      elevation: 2,
      shadowColor: "#000000",
      shadowOpacity: 0.45,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
  },
  sm: {
    web: `${RIM} rgba(255, 255, 255, 0.06), 0 4px 10px rgba(0, 0, 0, 0.50)`,
    native: {
      elevation: 4,
      shadowColor: "#000000",
      shadowOpacity: 0.5,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
  },
  md: {
    web: `${RIM} rgba(255, 255, 255, 0.06), 0 10px 24px rgba(0, 0, 0, 0.55)`,
    native: {
      elevation: 6,
      shadowColor: "#000000",
      shadowOpacity: 0.55,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 10 },
    },
  },
  lg: {
    web: `${RIM} rgba(255, 255, 255, 0.07), 0 18px 42px rgba(0, 0, 0, 0.60)`,
    native: {
      elevation: 10,
      shadowColor: "#000000",
      shadowOpacity: 0.6,
      shadowRadius: 42,
      shadowOffset: { width: 0, height: 18 },
    },
  },
  xl: {
    web: `${RIM} rgba(255, 255, 255, 0.08), 0 26px 58px rgba(0, 0, 0, 0.66)`,
    native: {
      elevation: 14,
      shadowColor: "#000000",
      shadowOpacity: 0.66,
      shadowRadius: 58,
      shadowOffset: { width: 0, height: 26 },
    },
  },
  xxl: {
    web: `${RIM} rgba(255, 255, 255, 0.09), 0 36px 84px rgba(0, 0, 0, 0.72)`,
    native: {
      elevation: 20,
      shadowColor: "#000000",
      shadowOpacity: 0.72,
      shadowRadius: 84,
      shadowOffset: { width: 0, height: 36 },
    },
  },
} as const satisfies Record<ShadowLevel, DualShadow>;
