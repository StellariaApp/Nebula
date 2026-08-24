import { describe, expect, it } from "vitest";

import { BuildProduct } from "../utils/build-product.js";
import { BorderLiftOf, LiftOf } from "../utils/lift.js";
import { BASE_RAMP, GlassOf, RampAt, ShiftRamp, VeilOf } from "../utils/ramp.js";
import { THEMES_SEEDS } from "../themes/_seed/index.js";

/** Una rampa escrita para las cuentas: la de fábrica se calibra a ojo y movería estas cifras. */
const RAMP = [10, 30, 80] as const;

/** Y una semilla escrita, por lo mismo: las del catálogo se están calibrando. */
const SEED = {
  name: "zenit",
  primary: THEMES_SEEDS.zenit.primary,
  accent: THEMES_SEEDS.zenit.accent,
  from: THEMES_SEEDS.zenit.from,
  to: THEMES_SEEDS.zenit.to,
  tint: THEMES_SEEDS.zenit.tint,
  wash: 0.08,
  lift: 12,
} as const;

const Alphas = (levels: ReturnType<typeof GlassOf>): number[] =>
  (["band", "control", "subtle", "default", "strong"] as const).map((level) =>
    Number.parseFloat(/([\d.]+)\)$/.exec(levels[level].background)?.[1] ?? "0"),
  );

describe("La rampa", () => {
  it("reproduce la tabla que el cristal tenia escrita a mano", () => {
    const written = [0.46, 0.48, 0.56, 0.69, 0.9];
    const derived = written.map((_, index) => Math.round(RampAt(46, 90, index, 5)) / 100);

    expect(derived).toEqual(written);
  });

  it("el velo se aparta por esquema, y en dark cae donde ya estaba", () => {
    expect(VeilOf(RAMP, "dark")).toBe(0.05);
    expect(VeilOf(RAMP, "light")).toBe(0.15);
  });

  it("nunca baja de cero por mucho que se recorte la rampa", () => {
    expect(VeilOf([2, 30, 80], "dark")).toBe(0);
  });

  it("una rampa fuera de rango se sujeta: el numero ES la alfa", () => {
    expect(Alphas(GlassOf([10, -20, 50], "dark"))[0]).toBe(0);
    expect(Alphas(GlassOf([10, 60, 140], "dark")).at(-1)).toBe(1);
  });

  it("las tres opciones salen de la misma rampa, subiendo y bajando", () => {
    const ramp = RAMP;

    expect(Alphas(GlassOf(ShiftRamp(ramp, -10, -20), "dark"))).toEqual([0.2, 0.22, 0.29, 0.41, 0.6]);
    expect(Alphas(GlassOf(ramp, "dark"))).toEqual([0.3, 0.32, 0.41, 0.57, 0.8]);
    expect(Alphas(GlassOf(ShiftRamp(ramp, 10, 10), "dark"))).toEqual([0.4, 0.42, 0.51, 0.67, 0.9]);
  });

  it("el tope de cada opcion es suyo: `strong` deja de ser 0.9 en las tres", () => {
    const tops = ([[-10, -20], [0, 0], [10, 10]] as const).map(([floor, ceiling]) =>
      Alphas(GlassOf(ShiftRamp(RAMP, floor, ceiling), "dark")).at(-1),
    );

    expect(new Set(tops).size).toBe(3);
  });

  it("el esquema solo mueve el velo: la rampa tintada es la misma en los dos", () => {
    expect(Alphas(GlassOf(BASE_RAMP, "light"))).toEqual(Alphas(GlassOf(BASE_RAMP, "dark")));
    expect(Alphas(GlassOf(RAMP, "light"))).toEqual(Alphas(GlassOf(RAMP, "dark")));
  });
});

describe("El lift por rol", () => {
  it("un numero mueve las ocho superficies por igual", () => {
    for (const role of ["base", "raised", "overlay", "sunken", "hover"]) {
      expect(LiftOf(12, role)).toBe(12);
    }
  });

  it("un objeto mueve una a una, y lo que no nombra sigue a `base`", () => {
    const lift = { base: 12, overlay: -5 };

    expect(LiftOf(lift, "base")).toBe(12);
    expect(LiftOf(lift, "overlay")).toBe(-5);
    expect(LiftOf(lift, "raised")).toBe(12);
    expect(LiftOf(lift, "hover")).toBe(12);
  });

  it("un cero escrito fija el rol, y no es lo mismo que no nombrarlo", () => {
    expect(LiftOf({ base: 12, raised: 0 }, "raised")).toBe(0);
    expect(LiftOf({ base: 12 }, "raised")).toBe(12);
  });

  it("sin `base`, lo que no se nombra no se mueve", () => {
    expect(LiftOf({ overlay: -5 }, "raised")).toBe(0);
  });

  it("el signo se ocupa del esquema: un negativo oscurece en dark y aclara en light", () => {
    const seed = { ...SEED, lift: { base: 0, overlay: -6 } } as const;
    const dark = BuildProduct(seed, "dark").colors.surface;
    const light = BuildProduct(seed, "light").colors.surface;

    expect(Number.parseInt(dark.overlay.slice(1, 3), 16)).toBeLessThan(
      Number.parseInt(dark.base.slice(1, 3), 16) + 1,
    );
    expect(Number.parseInt(light.overlay.slice(1, 3), 16)).toBeGreaterThan(
      Number.parseInt(BuildProduct({ ...SEED, lift: 0 }, "light").colors.surface.overlay.slice(1, 3), 16) - 1,
    );
  });

  it("el filo sigue a la superficie que bordea, o se invierte", () => {
    const seed = { ...SEED, lift: 12 } as const;
    const dark = BuildProduct(seed, "dark").colors;
    const light = BuildProduct(seed, "light").colors;

    expect(dark.border.default).toBe(dark.surface.raised);
    expect(light.border.default < light.surface.raised).toBe(true);
  });

  it("`border` clava los filos sin tocar la pila", () => {
    const pinned = BuildProduct({ ...SEED, lift: { base: 12, border: 0 } }, "dark").colors;
    const loose = BuildProduct({ ...SEED, lift: 12 }, "dark").colors;

    expect(pinned.surface.base).toBe(loose.surface.base);
    expect(pinned.border.default).not.toBe(loose.border.default);
    expect(BorderLiftOf({ base: 12, border: 0 }, "default")).toBe(0);
  });

  it("`focus` no pasa por ahi: sale de `primary`", () => {
    const theme = BuildProduct({ ...SEED, lift: 12 }, "dark");

    expect(theme.colors.border.focus).toBe(SEED.primary["400"]);
  });

  it("un tema con lift plano sale exactamente igual que antes", () => {
    const flat = BuildProduct(SEED, "dark");

    expect(flat.colors.surface.base).toBe(BuildProduct({ ...SEED }, "dark").colors.surface.base);
    expect(flat.effects.glass.surface.band.background).toContain("0.46");
  });
});
