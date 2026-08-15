import { describe, expect, it } from "vitest";

import { palettes } from "@stellaria/nebula-tokens";

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

  it("un peldaño de escala sin opacidad sigue por sprinkles", () => {
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

describe("ExtractStyleProps · opacidad sobre peldaños de escala (ADR-140)", () => {
  it("un peldaño de escala con opacidad sale por style", () => {
    const result = ExtractStyleProps({ bg: "error.400.50" });

    expect(result.className).toBeUndefined();
    expect(result.style?.background).toContain("color-mix(in srgb,");
    expect(result.style?.background).toContain("50%");
    expect(result.style?.background).toContain("transparent");
  });

  it("c acepta opacidad sobre una escala", () => {
    expect(ExtractStyleProps({ c: "primary.600.12" }).style?.color).toContain("12%");
  });

  it("las siete familias del contrato resuelven", () => {
    const families = ["primary", "accent", "gray", "success", "warning", "error", "info"];

    for (const family of families) {
      const result = ExtractStyleProps({ bg: `${family}.500.40` });
      expect(result.style?.background, family).toContain("40%");
    }
  });

  it("un peldaño válido de dos segmentos no se lee como opacidad", () => {
    const result = ExtractStyleProps({ bg: "gray.50" });

    expect(result.className).toBeDefined();
    expect(result.style).toBeUndefined();
  });

  it("una familia semilla resuelve a su hex, no cae cruda", () => {
    const result = ExtractStyleProps({ bg: "red.400.50" });

    expect(result.style?.background).toBe(
      `color-mix(in srgb, ${palettes.red["400"]} 50%, transparent)`,
    );
  });

  it("un nombre que no es color ni semilla sigue cayendo crudo", () => {
    const result = ExtractStyleProps({ bg: "nosuchfamily.400.50" });

    expect(result.style?.background).toBeUndefined();
    expect(result.style).toMatchObject({ "--nb-bg": "nosuchfamily.400.50" });
  });

  it("los literales admiten opacidad", () => {
    expect(ExtractStyleProps({ bg: "currentColor.20" }).style?.background).toContain(
      "color-mix(in srgb, currentColor 20%, transparent)",
    );
  });

  it("bdc alcanza escalas y roles, ambos con alpha", () => {
    expect(ExtractStyleProps({ bdc: "accent.500.40" }).style?.borderColor).toContain("40%");
    expect(ExtractStyleProps({ bdc: "border.subtle.40" }).style?.borderColor).toContain("40%");
  });

  it("un rol de bdc sin alpha sigue saliendo por sprinkles", () => {
    const result = ExtractStyleProps({ bdc: "border.subtle" });

    expect(result.className).toBeDefined();
    expect(result.style).toBeUndefined();
  });

  it("una paleta cruda resuelve a su hex de tokens", () => {
    const result = ExtractStyleProps({ c: "pink.300" });

    expect(palettes.pink["300"]).toMatch(/^#[0-9a-f]{6}$/i);
    expect(result.style).toMatchObject({ "--nb-c": palettes.pink["300"] });
  });

  it("una paleta cruda admite opacidad", () => {
    const result = ExtractStyleProps({ bg: "teal.400.30" });

    expect(result.style?.background).toBe(
      `color-mix(in srgb, ${palettes.teal["400"]} 30%, transparent)`,
    );
  });

  it("un peldaño de paleta cruda no se confunde con una opacidad", () => {
    const result = ExtractStyleProps({ bg: "pink.300" });

    expect(result.style?.background).toBeUndefined();
    expect(result.style).toMatchObject({ "--nb-bg": palettes.pink["300"] });
  });

  it("una familia sin peldaño cae al 600, como ResolveAccent", () => {
    expect(ExtractStyleProps({ c: "teal" }).style).toMatchObject({
      "--nb-c": palettes.teal["600"],
    });
    expect(Object.values(ExtractStyleProps({ c: "primary" }).style ?? {})[0]).toMatch(
      /^var\(--color-primary-600/,
    );
  });

  it("bdc alcanza lo mismo que c: escalas del tema y paletas crudas", () => {
    expect(Object.values(ExtractStyleProps({ bdc: "accent.500" }).style ?? {})[0]).toMatch(
      /^var\(--color-accent-500/,
    );
    expect(ExtractStyleProps({ bdc: "pink.300" }).style).toMatchObject({
      "--nb-bdc": palettes.pink["300"],
    });
    expect(ExtractStyleProps({ bdc: "pink.300.40" }).style?.borderColor).toContain("40%");
  });

  it("los alias largos resuelven sin llegar a sprinkles", () => {
    expect(() => ExtractStyleProps({ borderColor: "pink.300" })).not.toThrow();
    expect(ExtractStyleProps({ borderColor: "pink.300" }).style?.borderColor).toBe(
      palettes.pink["300"],
    );
    expect(ExtractStyleProps({ background: "#3F37C9" }).style?.background).toBe("#3F37C9");
  });

  it("semilla plana y semilla con alpha conviven en la misma etiqueta", () => {
    const result = ExtractStyleProps({
      fz: "body2",
      c: "pink.300",
      bg: "teal.400.30",
      maw: "52ch",
    });

    expect(result.className).toBeDefined();
    expect(result.style).toMatchObject({
      "--nb-c": palettes.pink["300"],
      background: `color-mix(in srgb, ${palettes.teal["400"]} 30%, transparent)`,
      maxWidth: "52ch",
    });
  });

  it("un rol sigue ganando a una semilla con el mismo nombre de peldaño", () => {
    const result = ExtractStyleProps({ bg: "gray.50" });

    expect(result.className).toBeDefined();
    expect(result.style).toBeUndefined();
  });

  it("una escala de espaciado nunca se lee como color", () => {
    const result = ExtractStyleProps({ p: "md.50" });

    expect(Object.values(result.style ?? {})).not.toContain(expect.stringContaining("color-mix"));
    expect(result.style).toMatchObject({ "--nb-p": "md.50" });
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

  it("un lh de valor abierto suprime el acoplamiento sin envenenar la cache del fz", () => {
    const open = ExtractStyleProps({ fz: "h5", lh: "inherit" });
    const plain = ExtractStyleProps({ fz: "h5" });

    expect(open.className).not.toMatch(/lineHeight/);
    expect(open.style).toMatchObject({ "--nb-lh": "inherit" });
    expect(plain.className).toMatch(/lineHeight_h5/);
  });

  it("el orden inverso da el mismo resultado: la clave distingue los dos casos", () => {
    const plain = ExtractStyleProps({ fz: "h6" });
    const open = ExtractStyleProps({ fz: "h6", lh: 1.3 });

    expect(plain.className).toMatch(/lineHeight_h6/);
    expect(open.className).not.toMatch(/lineHeight/);
    expect(open.style).toMatchObject({ "--nb-lh": "1.3" });
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

describe("ExtractStyleProps - un valor abierto no llega a sprinkles", () => {
  const open_cases = [
    { name: "mx auto", props: { mx: "auto" }, key: "mx", value: "auto" },
    { name: "p en px", props: { p: "12px" }, key: "p", value: "12px" },
    { name: "bg en hex", props: { bg: "#ff0000" }, key: "bg", value: "#ff0000" },
    { name: "fz en px", props: { fz: "13px" }, key: "fz", value: "13px" },
  ] as const;

  it.each(open_cases)(
    "$name junto a una prop de sprinkles no lanza y sale por el carril abierto",
    ({ props, key, value }) => {
      const result = ExtractStyleProps({ ...props, display: "flex" });

      expect(result.className).toBeDefined();
      expect(result.style).toHaveProperty(`--nb-${key}`, value);
    },
  );

  it.each(open_cases)("$name a solas tampoco lanza", ({ props, value }) => {
    const result = ExtractStyleProps({ ...props });
    expect(Object.values(result.style ?? {})).toContain(value);
  });

  it("la prop de sprinkles que lo acompaña sigue produciendo su clase atomica", () => {
    const open = ExtractStyleProps({ mx: "auto", display: "flex" });
    const plain = ExtractStyleProps({ display: "flex" });

    expect(open.className).toContain(plain.className ?? "");
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
