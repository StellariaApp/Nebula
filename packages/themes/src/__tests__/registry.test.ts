import type { ColorScheme, NebulaTheme } from "@stellaria/nebula-tokens";
import { describe, expect, it } from "vitest";

import { LoadTheme } from "../load-theme.js";
import { DEFAULT_THEME, THEME_NAMES, Themes } from "../themes/registry.js";

const SCHEMES: readonly ColorScheme[] = ["dark", "light"];

const PAIRS: readonly (readonly [(typeof THEME_NAMES)[number], ColorScheme])[] = THEME_NAMES.flatMap(
  (name) => SCHEMES.map((scheme) => [name, scheme] as const),
);

describe("el registro lleva los dos ejes (ADR-166)", () => {
  it("cada tema trae sus dos esquemas", () => {
    for (const name of THEME_NAMES) {
      expect(Object.keys(Themes[name]).sort()).toEqual(["dark", "light"]);
    }
  });

  it("nebula es el tema por defecto y esta en la lista", () => {
    expect(DEFAULT_THEME).toBe("nebula");
    expect(THEME_NAMES).toContain(DEFAULT_THEME);
  });
});

describe.each(PAIRS)("tema %s, esquema %s", (name, scheme) => {
  const theme: NebulaTheme = Themes[name][scheme];

  it("valida contra el schema tras round-trip JSON, sin perdida", () => {
    const round_tripped: unknown = JSON.parse(JSON.stringify(theme));
    expect(LoadTheme(round_tripped)).toEqual(theme);
  });

  it("su meta dice los dos ejes que dice su ruta", () => {
    expect(theme.meta.name).toBe(name);
    expect(theme.meta.scheme).toBe(scheme);
  });

  it("incluye las 19 paletas de identidad sin invertir", () => {
    expect(Object.keys(theme.palettes)).toHaveLength(19);
    expect(theme.palettes.indigo["50"]).toBe("#f4f6ff");
  });

  it("no declara la tinta del degradado: sigue siendo opcional (ADR-089)", () => {
    expect(theme.effects.gradients.brand.ink).toBeUndefined();
  });
});

describe("semantica de escalas por scheme (decision W1.1)", () => {
  it("en dark las escalas de roles se invierten (600 = crudo 400)", () => {
    const dark = Themes.nebula.dark;
    expect(dark.colors.primary["600"]).toBe(dark.palettes.indigo["400"]);
    expect(dark.colors.semantic.success["700"]).toBe(dark.palettes.green["300"]);
    expect(dark.colors.primary["500"]).toBe(dark.palettes.indigo["500"]);
  });

  it("en light las escalas de roles son las crudas", () => {
    const light = Themes.nebula.light;
    expect(light.colors.primary).toEqual(light.palettes.indigo);
  });
});

describe("tinta declarada de un degradado (ADR-089)", () => {
  const WithInk = (ink: unknown): unknown => {
    const theme: unknown = JSON.parse(JSON.stringify(Themes.nebula.dark));
    (theme as { effects: { gradients: { brand: Record<string, unknown> } } }).effects.gradients.brand[
      "ink"
    ] = ink;
    return theme;
  };

  it.each(["light", "dark"])("el schema acepta ink=%s, que el contrato TS declara", (ink) => {
    expect(LoadTheme(WithInk(ink)).effects.gradients.brand.ink).toBe(ink);
  });

  it("rechaza un valor fuera del par light/dark", () => {
    expect(() => LoadTheme(WithInk("auto"))).toThrow();
  });
});
