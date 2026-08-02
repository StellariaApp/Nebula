import { describe, expect, it } from "vitest";

import { ResolveAccent } from "../scale.js";

describe("ResolveAccent · opacidad (ADR-071)", () => {
  it("aplica la opacidad a un rol, que antes se descartaba en silencio", () => {
    const plain = ResolveAccent("border.subtle");
    const faded = ResolveAccent("border.subtle.40");

    expect(faded).toBe(`color-mix(in srgb, ${plain} 40%, transparent)`);
  });

  it("la aplica en los tres grupos de rol", () => {
    expect(ResolveAccent("surface.raised.60")).toContain("60%");
    expect(ResolveAccent("text.primary.70")).toContain("70%");
    expect(ResolveAccent("border.strong.20")).toContain("20%");
  });

  it("sigue aplicándola a los peldaños de escala", () => {
    expect(ResolveAccent("accent.500.12")).toContain("12%");
  });

  it("sin sufijo devuelve el color sin componer", () => {
    expect(ResolveAccent("border.subtle")).not.toContain("color-mix");
    expect(ResolveAccent("accent.500")).not.toContain("color-mix");
  });

  it("un rol inexistente sigue cayendo a transparent", () => {
    expect(ResolveAccent("border.nope" as never)).toBe("transparent");
    expect(ResolveAccent("border.nope.40" as never)).toBe("transparent");
  });

  it("los literales no se tocan", () => {
    expect(ResolveAccent("transparent")).toBe("transparent");
    expect(ResolveAccent("currentColor")).toBe("currentColor");
    expect(ResolveAccent("#abcdef")).toBe("#abcdef");
  });
});
