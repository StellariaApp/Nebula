import type { ColorScheme } from "@stellaria/nebula-tokens";

import { CompileThemes } from "../../web/compile-theme.js";
import { rosette } from "./index.js";

/**
 * Solo este tema, con su base repartida entre sus dos esquemas (ADR-169). Su CSS NO es
 * intercambiable con el de `/all/web`: alli la base se calcula sobre los diez.
 */
const COMPILED = CompileThemes({ rosette });

export const CLASSES: Record<ColorScheme, string> = COMPILED.classes["rosette"] as Record<
  ColorScheme,
  string
>;

export const CSS = COMPILED.css;
