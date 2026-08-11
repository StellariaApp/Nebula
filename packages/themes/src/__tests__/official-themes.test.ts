import type { NebulaTheme } from "@stellaria/nebula-tokens";
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

  it("incluye las 19 paletas de identidad sin invertir", () => {
    expect(Object.keys(theme.palettes)).toHaveLength(19);
    expect(theme.palettes.indigo["50"]).toBe("#f4f6ff");
  });
});

describe("semántica de escalas por scheme (decisión W1.1)", () => {
  it("en dark las escalas de roles se invierten (600 = crudo 400)", () => {
    const dark = officialThemes["dark"];
    expect(dark.colors.primary["600"]).toBe(dark.palettes.indigo["400"]);
    expect(dark.colors.semantic.success["700"]).toBe(dark.palettes.green["300"]);
    expect(dark.colors.primary["500"]).toBe(dark.palettes.indigo["500"]);
  });

  it("en light las escalas de roles son las crudas", () => {
    const light = officialThemes["light"];
    expect(light.colors.primary).toEqual(light.palettes.indigo);
  });
});

describe("tinta declarada de un degradado (ADR-089)", () => {
  const WithInk = (ink: unknown): unknown => {
    const theme: unknown = JSON.parse(JSON.stringify(officialThemes["dark"]));
    (theme as { effects: { gradients: { brand: Record<string, unknown> } } }).effects.gradients.brand[
      "ink"
    ] = ink;
    return theme;
  };

  it.each(["light", "dark"])("el schema acepta ink=%s, que el contrato TS declara", (ink) => {
    expect(LoadTheme(WithInk(ink)).effects.gradients.brand.ink).toBe(ink);
  });

  it("sigue siendo opcional: los oficiales no lo declaran", () => {
    for (const name of officialThemeNames) {
      const theme: NebulaTheme = officialThemes[name];
      expect(theme.effects.gradients.brand.ink).toBeUndefined();
    }
  });

  it("rechaza un valor fuera del par light/dark", () => {
    expect(() => LoadTheme(WithInk("auto"))).toThrow();
  });
});

describe("rol de placeholder (ADR-052)", () => {
  it("los dos temas lo declaran como color literal", () => {
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

  it("light lo atenúa respecto a muted; dark está en su suelo", () => {
    const light = officialThemes["light"].colors;
    expect(light.text.muted).toBe(light.gray["800"]);
    expect(light.text.placeholder).toBe(light.gray["700"]);

    const dark = officialThemes["dark"].colors;
    expect(dark.text.placeholder).toBe(dark.text.muted);
  });
});
