import { CompileThemes } from "../web/compile-theme.js";
import { Themes } from "./registry.js";

/**
 * Los catorce temas materializados: sus clases y su CSS (ADR-168, ADR-169).
 *
 * **Una sola llamada, no catorce.** Cada `CompileThemes` emite su propia regla `:root` con lo que
 * comparten los temas que recibe, asi que concatenar catorce compilaciones sueltas deja catorce
 * `:root` y gana el ultimo: todos los temas acaban pintando el degradado del que cerraba la lista.
 * Con una sola llamada la base es lo que comparten LOS CATORCE y cada clase lleva lo suyo.
 *
 * Todo va dentro de `@layer nebula.theme`, la capa mas baja: un tema define valores por defecto y
 * cualquier cosa mas especifica —empezando por el catalogo— debe poder pisarlos.
 *
 * Quien solo quiera uno importa `@stellaria/nebula-themes/<tema>/web`. Los dos CSS no son
 * intercambiables ni se pueden mezclar: cada conjunto calcula su base sobre lo que contiene.
 */
const COMPILED = CompileThemes(Themes);

export const CLASSES = COMPILED.classes;

export const CSS = COMPILED.css;
