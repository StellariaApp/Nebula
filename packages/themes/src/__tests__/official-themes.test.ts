/**
 * Criterio W1.1: los 4 temas oficiales validan contra themeSchema, y son DATOS
 * serializables (ADR-006) — el round-trip JSON debe ser sin pérdida.
 */
import { describe, expect, it } from "vitest";

import { loadTheme } from "../load-theme.js";
import { officialThemeNames, officialThemes } from "../themes/official.js";

describe.each(officialThemeNames)("tema oficial %s", (name) => {
  const theme = officialThemes[name];

  it("valida contra themeSchema tras round-trip JSON, sin pérdida", () => {
    const roundTripped: unknown = JSON.parse(JSON.stringify(theme));
    expect(loadTheme(roundTripped)).toEqual(theme);
  });

  it("meta.name coincide con la clave del registro", () => {
    expect(theme.meta.name).toBe(name);
  });

  it("incluye las 16 paletas de identidad sin invertir", () => {
    expect(Object.keys(theme.palettes)).toHaveLength(16);
    expect(theme.palettes.indigo["50"]).toBe("#f4f6ff");
  });
});

describe("semántica de escalas por scheme (decisión W1.1)", () => {
  it("en dark las escalas de roles se invierten (600 = crudo 400)", () => {
    const dark = officialThemes["nebula-dark"];
    expect(dark.colors.primary["600"]).toBe(dark.palettes.indigo["400"]);
    expect(dark.colors.semantic.success["700"]).toBe(dark.palettes.green["300"]);
    expect(dark.colors.primary["500"]).toBe(dark.palettes.indigo["500"]);
  });

  it("en light las escalas de roles son las crudas", () => {
    const light = officialThemes["nebula-light"];
    expect(light.colors.primary).toEqual(light.palettes.indigo);
  });
});

describe("interruptores de preset (docs/02 §2 punto 2)", () => {
  it("sober-light apaga glass y baja motion a minimal", () => {
    const sober = officialThemes["sober-light"];
    expect(sober.effects.glass.enabled).toBe(false);
    expect(sober.motion.tier).toBe("minimal");
    expect(sober.spacing.unit).toBe(3);
  });

  it("playful sube motion a expressive y usa gradiente en filled", () => {
    const theme = officialThemes.playful;
    expect(theme.motion.tier).toBe("expressive");
    expect(theme.variantMap.filled.background).toBe("gradient.brand");
    expect(theme.spacing.unit).toBe(5);
  });
});
