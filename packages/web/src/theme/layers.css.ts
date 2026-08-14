import { globalLayer } from "@vanilla-extract/css";

const nebula_layer = globalLayer("nebula");

export const reset_layer = globalLayer({ parent: nebula_layer }, "reset");
export const primitive_layer = globalLayer({ parent: nebula_layer }, "primitive");
export const component_layer = globalLayer({ parent: nebula_layer }, "component");
export const composite_layer = globalLayer({ parent: nebula_layer }, "composite");
export const util_layer = globalLayer({ parent: nebula_layer }, "util");
