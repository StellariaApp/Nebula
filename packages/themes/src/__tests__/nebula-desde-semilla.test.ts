import { palettes } from "@stellaria/nebula-tokens";
import { describe, expect, it } from "vitest";

import { baseDark } from "../themes/_base/dark.js";
import { baseLight } from "../themes/_base/light.js";
import { nebulaDark } from "../themes/nebula/dark.js";
import { nebulaLight } from "../themes/nebula/light.js";
import { FlipScale } from "../themes/scales.js";

/**
 * Nebula dejo de estar escrito a mano y sale de su semilla como los otros nueve (ADR-168). Eso solo
 * vale si **no cambia ni un color**: es el tema por defecto y el que el gate de contraste certifica.
 *
 * Su semilla lleva `wash: 0` y `lift: 0`, y con esos dos la formula `Shade` es la identidad. Estas
 * pruebas son lo que impide que alguien los mueva sin darse cuenta.
 */
describe("nebula sale de su semilla sin cambiar nada (ADR-168)", () => {
  it("hereda las superficies de la base, sin teñir", () => {
    expect(nebulaDark.colors.surface).toEqual(baseDark.colors.surface);
    expect(nebulaLight.colors.surface).toEqual(baseLight.colors.surface);
  });

  it("mantiene el suelo de tinta de los oficiales, no el de producto", () => {
    expect(nebulaDark.ink.floor).toBe(2);
    expect(nebulaLight.ink.floor).toBe(2);
  });

  it("conserva la identidad cromatica de ADR-020: indigo y violet", () => {
    expect(nebulaLight.colors.primary).toEqual(palettes.indigo);
    expect(nebulaDark.colors.primary).toEqual(FlipScale(palettes.indigo));
    expect(nebulaLight.colors.accent).toEqual(palettes.violet);
  });

  it("el degradado de marca sigue siendo el eje indigo → violet", () => {
    const stops = nebulaDark.effects.gradients.brand.stops;
    expect(stops[0]?.color).toBe(palettes.indigo["500"]);
    expect(stops.at(-1)?.color).toBe(palettes.violet["500"]);
  });

  it("se sigue llamando nebula, y la base no", () => {
    expect(nebulaDark.meta.name).toBe("nebula");
    expect(baseDark.meta.name).toBe("base");
  });

  it("todo lo que no es color viene igual de la base", () => {
    expect(nebulaDark.radius).toEqual(baseDark.radius);
    expect(nebulaDark.spacing).toEqual(baseDark.spacing);
    expect(nebulaDark.sizes).toEqual(baseDark.sizes);
    expect(nebulaDark.motion).toEqual(baseDark.motion);
    expect(nebulaDark.font).toEqual(baseDark.font);
    expect(nebulaDark.variantMap).toEqual(baseDark.variantMap);
    expect(nebulaDark.breakpoints).toEqual(baseDark.breakpoints);
  });
});
