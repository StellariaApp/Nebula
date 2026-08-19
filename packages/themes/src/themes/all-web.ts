import { CompileThemes } from "../web/compile-theme.js";
import { Themes } from "./registry.js";

/**
 * Los dieciséis temas materializados: sus clases y su CSS (ADR-168, ADR-169, ADR-175).
 *
 * **Una sola llamada, no dieciséis.** Cada `CompileThemes` emite su propia regla `:root`, así que
 * concatenar dieciséis compilaciones sueltas deja dieciséis `:root` y gana el último: todos los temas
 * acaban pintando el degradado del que cerraba la lista. Con una sola llamada la base es una y cada
 * clase lleva lo suyo.
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

/**
 * La base, y la rebanada de cada tema.
 *
 * `BASE` lleva `nebula` entero, así que ya es un tema completo por sí sola: quien incruste
 * `BASE + SLICES[x]` pinta `x` bien y cualquier otro tema degrada a `nebula` en vez de quedarse sin
 * color. Eso es lo que permite mandar uno en el HTML y traer el resto cuando hagan falta.
 */
export const BASE = COMPILED.base;

export const SLICES = COMPILED.slices;
