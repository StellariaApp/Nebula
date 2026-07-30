import { describe, expect, it } from "vitest";

import { LoadTheme } from "../load-theme.js";
import { officialThemeNames, officialThemes } from "../themes/official.js";

describe.each(officialThemeNames)("tema oficial %s", (name) => {
  const theme = officialThemes[name];

  it("valida contra themeSchema tras round-trip JSON, sin pérdida", () => {
    const round_tripped: unknown = JSON.parse(JSON.stringify(theme));
    expect(LoadTheme(round_tripped)).toEqual(theme);
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

describe("rol de placeholder (ADR-052)", () => {
  it("los cuatro temas lo declaran como color literal", () => {
    for (const name of officialThemeNames) {
      expect(officialThemes[name].colors.text.placeholder).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("nunca es el mismo peldaño que el valor escrito", () => {
    for (const name of officialThemeNames) {
      const { text } = officialThemes[name].colors;
      expect(text.placeholder).not.toBe(text.primary);
    }
  });

  it("solo nebula-light y playful lo atenúan respecto a muted; dark y sober-light están en su suelo", () => {
    for (const name of ["nebula-light", "playful"] as const) {
      const { text, gray } = officialThemes[name].colors;
      expect(text.muted).toBe(gray["700"]);
      expect(text.placeholder).toBe(gray["600"]);
    }

    for (const name of ["nebula-dark", "sober-light"] as const) {
      const { text } = officialThemes[name].colors;
      expect(text.placeholder).toBe(text.muted);
    }
  });
});
