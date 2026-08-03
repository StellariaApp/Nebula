import { describe, expect, it } from "vitest";

import { officialThemes } from "@stellaria/nebula-themes";

import { vars } from "../contract.css.js";
import { ResolveVariant } from "../resolve-variant.js";

const theme = officialThemes["nebula-dark"];

describe("el cristal es una receta por clase de superficie (ADR-078)", () => {
  it("un control usa la receta de control", () => {
    const resolved = ResolveVariant("glass", "primary", theme);

    expect(resolved.backdropFilter).toBe(vars.glass.control.backdropFilter);
    expect(resolved.background).toBe(vars.glass.control.background);
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

  it("la clase la decide el componente, no el variantMap", () => {
    expect(theme.variantMap.glass.glass).toBe("control");

    const surface = ResolveVariant("glass", "primary", theme, undefined, "subtle");
    expect(surface.backdropFilter).not.toBe(vars.glass.control.backdropFilter);
  });
});
