// @stellaria/nebula-web — runtime de theming web (W1.2). Los componentes llegan
// desde W1.4. Consume roles semánticos vía CSS vars del contrato (ADR-002/ADR-016).
export { vars } from "./theme/contract.css.js";
export { themeClass, type OfficialThemeName } from "./theme/themes.css.js";
export { themeToVars } from "./theme/theme-vars.js";
export {
  NebulaProvider,
  type NebulaProviderProps,
  type ThemeStorage,
} from "./provider/nebula-provider.js";
export { ColorSchemeScript, type ColorSchemeScriptProps } from "./provider/color-scheme-script.js";

// `useTheme` vive en @stellaria/nebula-hooks (cross-platform); reexportado aquí por
// conveniencia de consumo web.
export { useTheme } from "@stellaria/nebula-hooks";
