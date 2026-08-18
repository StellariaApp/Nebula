import type { NebulaTheme } from "@stellaria/nebula-tokens";
import { describe, expect, it } from "vitest";

import { LoadTheme, ThemeValidationError } from "../load-theme.js";
import { nebulaLight } from "../themes/nebula/light.js";

function BaseTheme(): NebulaTheme {
  return JSON.parse(JSON.stringify(nebulaLight)) as NebulaTheme;
}

describe("LoadTheme", () => {
  it("acepta un tema válido y lo devuelve intacto", () => {
    expect(LoadTheme(BaseTheme())).toEqual(nebulaLight);
  });

  it("rechaza entradas que no son objeto", () => {
    expect(() => LoadTheme(null)).toThrow(ThemeValidationError);
    expect(() => LoadTheme("nebula")).toThrow(ThemeValidationError);
  });

  it("una sección obligatoria ausente produce un error que nombra la sección", () => {
    const broken: unknown = { ...BaseTheme(), colors: undefined };
    expect(() => LoadTheme(broken)).toThrow(/colors/);
  });

  it("un enum inválido produce un error que nombra la ruta", () => {
    const base = BaseTheme();
    const broken: unknown = { ...base, meta: { ...base.meta, scheme: "sepia" } };
    expect(() => LoadTheme(broken)).toThrow(/scheme/);
  });

  it("una clave desconocida es rechazada (objetos estrictos)", () => {
    const broken: unknown = { ...BaseTheme(), colours: {} };
    expect(() => LoadTheme(broken)).toThrow(/colours/);
  });

  it("una ref de variante fuera del contrato es rechazada", () => {
    const base = BaseTheme();
    const broken: unknown = {
      ...base,
      variantMap: {
        ...base.variantMap,
        filled: { ...base.variantMap.filled, background: "scale.601" },
      },
    };
    expect(() => LoadTheme(broken)).toThrow(ThemeValidationError);
  });

  it("un alpha fuera de 0–100 en `scale.<paso>.<alpha>` es rechazado", () => {
    const base = BaseTheme();
    const broken: unknown = {
      ...base,
      variantMap: {
        ...base.variantMap,
        light: { ...base.variantMap.light, background: "scale.500.140" },
      },
    };
    expect(() => LoadTheme(broken)).toThrow(ThemeValidationError);
  });

  it("expone los issues crudos de Zod en ThemeValidationError", () => {
    try {
      LoadTheme({});
      expect.unreachable("debió lanzar");
    } catch (error) {
      expect(error).toBeInstanceOf(ThemeValidationError);
      if (error instanceof ThemeValidationError) {
        expect(error.issues.length).toBeGreaterThan(0);
        expect(error.message).toContain("NebulaTheme");
      }
    }
  });
});
