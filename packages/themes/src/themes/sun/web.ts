import type { ColorScheme } from "@stellaria/nebula-tokens";

import { CompileTheme } from "../../web/compile-theme.js";
import { sunDark } from "./dark.js";
import { sunLight } from "./light.js";

const dark = CompileTheme(sunDark);
const light = CompileTheme(sunLight);

/** La clase de cada esquema, que es lo que el script de arranque necesita para pintar sin parpadeo. */
export const CLASSES: Record<ColorScheme, string> = {
  dark: dark.className,
  light: light.className,
};

/** Las dos reglas. Van a un `<style>`; la libreria no inyecta nada (ADR-164). */
export const CSS = `${dark.css}${light.css}`;
