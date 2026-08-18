import type { ColorScheme } from "@stellaria/nebula-tokens";

import { CompileThemes } from "../../web/compile-theme.js";
import { marte } from "./index.js";

/**
 * Solo este tema, con su base repartida entre sus dos esquemas (ADR-169). Su CSS **no** es
 * intercambiable con el de `/all/web` ni se puede mezclar con el: alli la base se calcula sobre
 * los dieciseis y aqui sobre dos.
 */
const COMPILED = CompileThemes({ marte });

export const CLASSES: Record<ColorScheme, string> = COMPILED.classes["marte"] as Record<
  ColorScheme,
  string
>;

export const CSS = COMPILED.css;
