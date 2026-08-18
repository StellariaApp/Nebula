import { describe, expect, it } from "vitest";

import { Themes } from "../../index.js";

import { vars } from "../contract.css.js";
import { ResolveVariant } from "../resolve-variant.js";

const theme = Themes.nebula.dark;

describe("el cristal es una receta por clase de superficie (ADR-078)", () => {
  it("sin pedir nivel manda el que declara el variantMap", () => {
    const resolved = ResolveVariant("glass", "primary", theme);

    expect(resolved.backdropFilter).toBe(vars.glass.veil.backdropFilter);
    expect(resolved.background).toBe(vars.glass.veil.background);
  });

  it("una superficie usa la de superficie, aunque la variante sea la misma", () => {
    const resolved = ResolveVariant("glass", "primary", theme, undefined, "subtle");

    expect(resolved.backdropFilter).toBe(vars.glass.subtle.backdropFilter);
    expect(resolved.background).toBe(vars.glass.subtle.background);
  });

  it("las tres clases no comparten receta", () => {
    const control = ResolveVariant("glass", "primary", theme);
    const surface = ResolveVariant("glass", "primary", theme, undefined, "subtle");
    const chrome = ResolveVariant("glass", "primary", theme, undefined, "default");

    const filters = [control.backdropFilter, surface.backdropFilter, chrome.backdropFilter];
    expect(new Set(filters).size).toBe(3);
  });

  it("el componente puede pedir otra, y entonces gana la suya", () => {
    // El nivel POR DEFECTO lo declara el tema: los tres accionables lo traian a mano y pisaban al
    // variantMap, que existe justamente para que el tema decida como se pinta una variante. Lo que
    // este test sigue probando es que pedir uno distinto sigue siendo posible.
    expect(theme.variantMap.glass.glass).toBe("veil");

    const surface = ResolveVariant("glass", "primary", theme, undefined, "subtle");
    expect(surface.backdropFilter).not.toBe(vars.glass.veil.backdropFilter);
  });
});
