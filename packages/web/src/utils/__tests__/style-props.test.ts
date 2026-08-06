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

describe("ExtractStyleProps - cache de la clase de sprinkles", () => {
  it("el mismo juego de props devuelve la misma clase", () => {
    const first = ExtractStyleProps({ p: "md", bg: "surface.raised" });
    const second = ExtractStyleProps({ p: "md", bg: "surface.raised" });

    expect(first.className).toBe(second.className);
    expect(first.className).toBeDefined();
  });

  it("juegos distintos no comparten clase", () => {
    const a = ExtractStyleProps({ p: "md" }).className;
    const b = ExtractStyleProps({ p: "lg" }).className;

    expect(a).not.toBe(b);
  });

  it("dos valores responsive distintos no colisionan en la cache", () => {
    const a = ExtractStyleProps({ p: { base: "sm", tablet: "lg" } }).className;
    const b = ExtractStyleProps({ p: { base: "sm", tablet: "xl" } }).className;

    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect(a).not.toBe(b);
  });

  it("la clave distingue la prop, no solo el valor", () => {
    const pad = ExtractStyleProps({ p: "md" }).className;
    const mar = ExtractStyleProps({ m: "md" }).className;

    expect(pad).not.toBe(mar);
  });

  it("dos props intercambiadas no comparten clase", () => {
    const a = ExtractStyleProps({ p: "md", m: "lg" }).className;
    const b = ExtractStyleProps({ p: "lg", m: "md" }).className;

    expect(a).not.toBe(b);
  });

  it("el acoplamiento fz -> lh sobrevive a la cache", () => {
    const first = ExtractStyleProps({ fz: "body2" });
    const second = ExtractStyleProps({ fz: "body2" });
    const explicit = ExtractStyleProps({ fz: "body2", lh: "tight" });

    expect(first.className).toBe(second.className);
    expect(first.className).not.toBe(explicit.className);
  });
});

describe("ExtractStyleProps - camino rapido sin style props", () => {
  it("devuelve el propio objeto de props cuando no hay nada que repartir", () => {
    const props = { children: "x", id: "a", role: "row" };
    const result = ExtractStyleProps(props);

    expect(result.className).toBeUndefined();
    expect(result.style).toBeUndefined();
    expect(result.rest).toBe(props);
  });

  it("una prop de estilo con valor invalido no se cuela en rest", () => {
    const result = ExtractStyleProps({ id: "x", w: true });

    expect(result.rest).toEqual({ id: "x" });
    expect(result.rest).not.toHaveProperty("w");
  });

  it("un style propio impide el camino rapido y sigue viajando aparte", () => {
    const props = { id: "x", style: { color: "red" } };
    const result = ExtractStyleProps(props);

    expect(result.rest).not.toBe(props);
    expect(result.rest).toEqual({ id: "x" });
    expect(result.style).toEqual({ color: "red" });
  });
});

describe("ExtractStyleProps - via abierta: valores crudos", () => {
  it("un numero en una prop de espaciado sale por la via abierta", () => {
    const result = ExtractStyleProps({ p: 10 });

    expect(result.className).toBeDefined();
    expect(Object.values(result.style ?? {})).toContain("10px");
  });

  it("un hex en bg ya no revienta y sale por la via abierta", () => {
    const result = ExtractStyleProps({ bg: "#3F37C9" });

    expect(result.className).toBeDefined();
    expect(Object.values(result.style ?? {})).toContain("#3F37C9");
  });

  it("un token sigue saliendo por sprinkles, sin style", () => {
    const result = ExtractStyleProps({ p: "md" });

    expect(result.className).toBeDefined();
    expect(result.style).toBeUndefined();
  });

  it("una longitud en cadena se respeta tal cual", () => {
    const result = ExtractStyleProps({ maw: "60ch" });
    expect(Object.values(result.style ?? {})).toContain("60ch");
  });
});

describe("ExtractStyleProps - via abierta: responsive", () => {
  it("una prop de dimension acepta objeto responsive", () => {
    const result = ExtractStyleProps({ w: { base: 100, tablet: 200 } });
    const values = Object.values(result.style ?? {});

    expect(result.className).toBeDefined();
    expect(values).toContain("100px");
    expect(values).toContain("200px");
  });

  it("una prop que sprinkles no hace responsive lo consigue por la via abierta", () => {
    const result = ExtractStyleProps({ position: { base: "static", tablet: "sticky" } });
    const values = Object.values(result.style ?? {});

    expect(result.className).toBeDefined();
    expect(values).toContain("static");
    expect(values).toContain("sticky");
  });

  it("un responsive de tokens sobre prop responsive sigue en sprinkles", () => {
    const result = ExtractStyleProps({ p: { base: "sm", tablet: "lg" } });

    expect(result.className).toBeDefined();
    expect(result.style).toBeUndefined();
  });

  it("un responsive mixto token/crudo cae entero en la via abierta", () => {
    const result = ExtractStyleProps({ p: { base: "sm", tablet: 24 } });
    const values = Object.values(result.style ?? {});

    expect(values).toContain("24px");
    expect(values.length).toBe(2);
  });
});

describe("ExtractStyleProps - props nuevas del registro", () => {
  it("bd acepta el atajo completo", () => {
    const result = ExtractStyleProps({ bd: "1px solid #fffeed" });
    expect(Object.values(result.style ?? {})).toContain("1px solid #fffeed");
  });

  it("cursor existe y no cae en rest", () => {
    const result = ExtractStyleProps({ cursor: "pointer", id: "x" });

    expect(result.rest).toEqual({ id: "x" });
    expect(Object.values(result.style ?? {})).toContain("pointer");
  });

  it("las esquinas sueltas existen", () => {
    const result = ExtractStyleProps({ rtl: 8 });
    expect(Object.values(result.style ?? {})).toContain("8px");
  });

  it("el borde logico usa el nombre CSS completo", () => {
    const result = ExtractStyleProps({ borderBlockStartStyle: "dashed" });
    expect(Object.values(result.style ?? {})).toContain("dashed");
  });

  it("una prop desconocida sigue yendo a rest", () => {
    expect(ExtractStyleProps({ notAProp: 1 }).rest).toEqual({ notAProp: 1 });
  });
});
