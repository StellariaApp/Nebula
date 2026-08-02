import { describe, expect, it } from "vitest";

import { ExtractStyleProps } from "../style-props.js";

describe("ExtractStyleProps", () => {
  it("no muta el style del consumidor", () => {
    const own = { marginInline: "auto" };
    const result = ExtractStyleProps({ style: own, maw: 1180 });

    expect(own).toEqual({ marginInline: "auto" });
    expect(result.style).toEqual({ marginInline: "auto", maxWidth: "1180px" });
  });

  it("sobrevive a un style congelado", () => {
    const own = Object.freeze({ marginInline: "auto" });

    expect(() => ExtractStyleProps({ style: own, maw: 1180 })).not.toThrow();
    expect(ExtractStyleProps({ style: own, maw: 1180 }).style).toEqual({
      marginInline: "auto",
      maxWidth: "1180px",
    });
  });

  it("dos llamadas con el mismo objeto no se contaminan entre sí", () => {
    const shared = { marginInline: "auto" };
    const first = ExtractStyleProps({ style: shared, maw: 100 });
    const second = ExtractStyleProps({ style: shared, mih: 50 });

    expect(first.style).toEqual({ marginInline: "auto", maxWidth: "100px" });
    expect(second.style).toEqual({ marginInline: "auto", minHeight: "50px" });
  });

  it("style no se devuelve también en rest: quien haga spread no lo pisa", () => {
    const result = ExtractStyleProps({ style: { color: "red" }, id: "x" });

    expect(result.rest).toEqual({ id: "x" });
    expect(result.style).toEqual({ color: "red" });
  });

  it("un style sin dimensiones sigue viajando de vuelta", () => {
    expect(ExtractStyleProps({ style: { color: "red" } }).style).toEqual({ color: "red" });
  });

  it("sin style ni dimensiones no inventa un objeto", () => {
    const result = ExtractStyleProps({ id: "x" });

    expect(result.style).toBeUndefined();
    expect(result.className).toBeUndefined();
    expect(result.rest).toEqual({ id: "x" });
  });

  it("las dimensiones ganan al style del consumidor en la misma propiedad", () => {
    const result = ExtractStyleProps({ style: { maxWidth: "10px" }, maw: 900 });
    expect(result.style).toEqual({ maxWidth: "900px" });
  });
});

describe("ExtractStyleProps · opacidad en referencias de color (ADR-071)", () => {
  it("un rol con opacidad sale por style, no por sprinkles", () => {
    const result = ExtractStyleProps({ borderColor: "border.subtle.40" });

    expect(result.className).toBeUndefined();
    expect(result.style?.borderColor).toContain("color-mix(in srgb,");
    expect(result.style?.borderColor).toContain("40%");
  });

  it("un rol sin opacidad sigue saliendo por sprinkles", () => {
    const result = ExtractStyleProps({ borderColor: "border.subtle" });

    expect(result.className).toBeDefined();
    expect(result.style).toBeUndefined();
  });

  it("una superficie con opacidad sale por style", () => {
    const result = ExtractStyleProps({ bg: "surface.raised.60" });

    expect(result.className).toBeUndefined();
    expect(result.style?.background).toContain("60%");
  });

  it("un peldaño de escala no admite opacidad: sigue por sprinkles", () => {
    expect(ExtractStyleProps({ bg: "accent.500" }).className).toBeDefined();
    expect(ExtractStyleProps({ bg: "accent.500" }).style).toBeUndefined();
  });

  it("las shorthands resuelven a la propiedad larga", () => {
    expect(ExtractStyleProps({ c: "text.primary.70" }).style?.color).toContain("70%");
    expect(ExtractStyleProps({ bdc: "border.strong.20" }).style?.borderColor).toContain("20%");
  });

  it("no toca props que no son de color", () => {
    expect(ExtractStyleProps({ id: "a.b.40" }).rest).toEqual({ id: "a.b.40" });
  });
});
