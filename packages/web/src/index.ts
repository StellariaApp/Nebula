// @stellaria/nebula-web — runtime de theming web (W1.2) + componentes (W1.4+).
// Consume roles semánticos vía CSS vars del contrato (ADR-002/ADR-016).

// ── Componentes ──────────────────────────────────────────────────────────────
export { Box } from "./components/Layout/Box/index.js";
export type { BoxOwnProps, BoxProps } from "./components/Layout/Box/index.js";
export { Text } from "./components/Typography/Text/index.js";
export type { TextOwnProps, TextProps } from "./components/Typography/Text/index.js";
export { Button } from "./components/Actions/Button/index.js";
export type { ButtonProps } from "./components/Actions/Button/index.js";

// ── Theming ──────────────────────────────────────────────────────────────────
export { vars } from "./theme/contract.css.js";
export { themeClass, type OfficialThemeName } from "./theme/themes.css.js";
export { themeToVars } from "./theme/theme-vars.js";
export {
  NebulaProvider,
  type NebulaProviderProps,
  type ThemeStorage,
} from "./provider/nebula-provider.js";
export { ColorSchemeScript, type ColorSchemeScriptProps } from "./provider/color-scheme-script.js";
export { resolveVariant, type ResolvedVariant } from "./theme/resolve-variant.js";

// `useTheme` vive en @stellaria/nebula-hooks (cross-platform); reexportado aquí por
// conveniencia de consumo web.
export { useTheme } from "@stellaria/nebula-hooks";
