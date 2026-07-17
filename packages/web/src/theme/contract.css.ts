import { createThemeContract } from "@vanilla-extract/css";

/**
 * Contrato de CSS vars (una sola vez, ADR-006/ADR-016). Es la PROYECCIÓN CSS de
 * `NebulaTheme`: solo las hojas materializables como CSS custom property. La data
 * no-CSS (variantMap, motion.spring, motion.tier, effects.glass.enabled, gradient
 * tokens, palettes de identidad, breakpoints) se consume desde el objeto `theme`
 * de JS vía contexto — nunca como var.
 *
 * Cada tema oficial materializa este contrato con `createTheme` (una clase CSS por
 * tema, ver themes.css.ts); los temas dinámicos lo inyectan en runtime con
 * `assignInlineVars` (ver theme-vars.ts + NebulaProvider).
 */
const scale = (): Record<
  "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950",
  null
> => ({
  "50": null,
  "100": null,
  "200": null,
  "300": null,
  "400": null,
  "500": null,
  "600": null,
  "700": null,
  "800": null,
  "900": null,
  "950": null,
});

export const vars = createThemeContract({
  color: {
    primary: scale(),
    accent: scale(),
    gray: scale(),
    semantic: {
      success: scale(),
      warning: scale(),
      error: scale(),
      info: scale(),
    },
    surface: { base: null, raised: null, overlay: null, sunken: null },
    text: { primary: null, secondary: null, muted: null, inverted: null, onPrimary: null },
    border: { subtle: null, default: null, strong: null, focus: null },
  },
  font: {
    family: { sans: null, mono: null },
    size: {
      h1: null,
      h2: null,
      h3: null,
      h4: null,
      h5: null,
      h6: null,
      body1: null,
      body2: null,
      body3: null,
      button: null,
      caption: null,
    },
    weight: {
      thin: null,
      extralight: null,
      light: null,
      regular: null,
      medium: null,
      semibold: null,
      bold: null,
      extrabold: null,
      black: null,
    },
    lineHeight: { tight: null, normal: null, relaxed: null },
    letterSpacing: { tight: null, normal: null, wide: null },
  },
  radius: { xxs: null, xs: null, sm: null, md: null, lg: null, xl: null, xxl: null, full: null },
  space: {
    none: null,
    xxs: null,
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    xxl: null,
    xxxl: null,
  },
  size: { xs: null, sm: null, md: null, lg: null, xl: null },
  motion: {
    duration: { instant: null, fast: null, base: null, slow: null, expressive: null },
    easing: { standard: null, emphasized: null, decelerate: null, accelerate: null },
  },
  blur: { none: null, xxs: null, xs: null, sm: null, md: null, lg: null, xl: null, xxl: null },
  shadow: { xxs: null, xs: null, sm: null, md: null, lg: null, xl: null, xxl: null },
  glass: {
    subtle: { background: null, border: null, backdropFilter: null },
    default: { background: null, border: null, backdropFilter: null },
    strong: { background: null, border: null, backdropFilter: null },
    noiseOpacity: null,
  },
  zIndex: {
    base: null,
    dropdown: null,
    sticky: null,
    overlay: null,
    modal: null,
    popover: null,
    toast: null,
    tooltip: null,
  },
});
