import { CompileThemes } from "../web/compile-theme.js";
import { Themes } from "./registry.js";

/**
 * Los diez temas materializados: sus clases y su CSS (ADR-168, ADR-169).
 *
 * Se compilan al importar este modulo, y se reparten: las 445 variables que valen lo mismo en las
 * veinte combinaciones van una sola vez a `:root`, y cada clase lleva sus 182. Emitirlos completos
 * repetia ese 67% diez veces, que es lo que el navegador acaba parseando antes de pintar.
 *
 * Todo va dentro de `@layer nebula.theme`, la capa mas baja: un tema define valores por defecto y
 * cualquier cosa mas especifica —empezando por el catalogo— debe poder pisarlos.
 *
 * Quien solo quiera uno importa `@stellaria/nebula-themes/<tema>/web`. Los dos CSS no son
 * intercambiables: cada conjunto calcula su base sobre lo que contiene.
 */
const COMPILED = CompileThemes(Themes);

export const CLASSES = COMPILED.classes;

export const CSS = COMPILED.css;
