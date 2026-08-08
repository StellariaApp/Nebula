import { assignInlineVars } from "@vanilla-extract/dynamic";
import { describe, expect, it } from "vitest";

import { nebulaLight } from "@stellaria/nebula-themes";

import { vars } from "../theme/contract.css.js";
import { ThemeToVars } from "../theme/theme-vars.js";

describe("ThemeToVars", () => {
  it("proyecta roles de color tal cual y aplica las unidades correctas", () => {
    const v = ThemeToVars(nebulaLight);
    expect(v.color.surface.base).toBe(nebulaLight.colors.surface.base);
    expect(v.color.primary["600"]).toBe(nebulaLight.colors.primary["600"]);
    expect(v.font.size.h1).toBe(`${String(nebulaLight.font.size.h1)}px`);
    expect(v.motion.duration.base).toBe(`${String(nebulaLight.motion.duration.base)}ms`);
    expect(v.radius.md).toBe(`${String(nebulaLight.radius.md)}px`);
    expect(v.zIndex.modal).toBe(String(nebulaLight.zIndex.modal));
    expect(v.shadow.md).toBe(nebulaLight.effects.shadows.md.web);
  });

  it("resuelve `space` como unit × scale en px (densidad temable por tema)", () => {
    const Density = (unit: number) =>
      ThemeToVars({ ...nebulaLight, spacing: { ...nebulaLight.spacing, unit } }).space.md;

    expect(ThemeToVars(nebulaLight).space.md).toBe("16px"); // unit 4 × 4
    expect(Density(3)).toBe("12px"); // compacto
    expect(Density(5)).toBe("20px"); // cómodo
  });

  it("assignInlineVars materializa el contrato como objeto {--var: valor}", () => {
    const style = assignInlineVars(vars, ThemeToVars(nebulaLight));
    expect(Object.keys(style).length).toBeGreaterThan(0);
    expect(Object.keys(style).every((k) => k.startsWith("--"))).toBe(true);
    expect(Object.values(style)).toContain(nebulaLight.colors.surface.base);
  });
});
