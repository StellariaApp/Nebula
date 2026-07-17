/**
 * loadTheme: rechaza estructuras inválidas con errores legibles (ruta incluida)
 * y expone los issues crudos de Zod para tooling (Theme Creator).
 */
import type { NebulaTheme } from "@stellaria/nebula-tokens";
import { describe, expect, it } from "vitest";

import { loadTheme, ThemeValidationError } from "../load-theme.js";
import { nebulaLight } from "../themes/nebula-light.js";

/** Base serializada estructuralmente válida para mutar en cada caso. */
function baseTheme(): NebulaTheme {
  return JSON.parse(JSON.stringify(nebulaLight)) as NebulaTheme;
}

describe("loadTheme", () => {
  it("acepta un tema válido y lo devuelve intacto", () => {
    expect(loadTheme(baseTheme())).toEqual(nebulaLight);
  });

  it("rechaza entradas que no son objeto", () => {
    expect(() => loadTheme(null)).toThrow(ThemeValidationError);
    expect(() => loadTheme("nebula")).toThrow(ThemeValidationError);
  });

  it("una sección obligatoria ausente produce un error que nombra la sección", () => {
    const broken: unknown = { ...baseTheme(), colors: undefined };
    expect(() => loadTheme(broken)).toThrow(/colors/);
  });

  it("un enum inválido produce un error que nombra la ruta", () => {
    const base = baseTheme();
    const broken: unknown = { ...base, meta: { ...base.meta, scheme: "sepia" } };
    expect(() => loadTheme(broken)).toThrow(/scheme/);
  });

  it("una clave desconocida es rechazada (objetos estrictos)", () => {
    const broken: unknown = { ...baseTheme(), colours: {} };
    expect(() => loadTheme(broken)).toThrow(/colours/);
  });

  it("una ref de variante fuera del contrato es rechazada", () => {
    const base = baseTheme();
    const broken: unknown = {
      ...base,
      variantMap: {
        ...base.variantMap,
        filled: { ...base.variantMap.filled, background: "scale.601" },
      },
    };
    expect(() => loadTheme(broken)).toThrow(ThemeValidationError);
  });

  it("un alpha fuera de 0–100 en `scale.<paso>.<alpha>` es rechazado", () => {
    const base = baseTheme();
    const broken: unknown = {
      ...base,
      variantMap: {
        ...base.variantMap,
        light: { ...base.variantMap.light, background: "scale.500.140" },
      },
    };
    expect(() => loadTheme(broken)).toThrow(ThemeValidationError);
  });

  it("expone los issues crudos de Zod en ThemeValidationError", () => {
    try {
      loadTheme({});
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
