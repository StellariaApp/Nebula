import { globalLayer } from "@vanilla-extract/css";

const nebula_layer = globalLayer("nebula");

/** Donde viven las reglas de tema (ADR-169). Va primera: la que menos manda. */
export const theme_layer = globalLayer({ parent: nebula_layer }, "theme");
export const reset_layer = globalLayer({ parent: nebula_layer }, "reset");
export const primitive_layer = globalLayer({ parent: nebula_layer }, "primitive");
export const component_layer = globalLayer({ parent: nebula_layer }, "component");
export const composite_layer = globalLayer({ parent: nebula_layer }, "composite");
export const util_layer = globalLayer({ parent: nebula_layer }, "util");
