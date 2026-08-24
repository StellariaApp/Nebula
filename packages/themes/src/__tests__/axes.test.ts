import { describe, expect, it } from "vitest";

import { baseDark } from "../themes/_base/dark.js";
import { THEMES_SEEDS } from "../themes/_seed/index.js";
import { CORNERS, RadiusOf } from "../utils/axes.js";
import { BuildProduct } from "../utils/build-product.js";

/** Una semilla escrita: las del catálogo se están calibrando y moverían estas cuentas. */
const APOLO = {
  name: "apolo",
  primary: THEMES_SEEDS.apolo.primary,
  accent: THEMES_SEEDS.apolo.accent,
  from: THEMES_SEEDS.apolo.from,
  to: THEMES_SEEDS.apolo.to,
  tint: THEMES_SEEDS.apolo.tint,
  wash: 0.009,
  lift: 6,
} as const;

describe("Los cuatro ejes se declaran en la semilla", () => {
  it("el tema los trae puestos, que es lo que hace que el panel los enseñe solos", () => {
    const theme = BuildProduct(
      { ...APOLO, corner: "crisp", density: "compact", motion: "minimal", glass: "milky" },
      "dark",
    );

    expect(theme.radius.md).toBe(RadiusOf(baseDark.radius, "crisp").md);
    expect(theme.spacing.unit).toBe(3);
    expect(theme.motion.tier).toBe("minimal");
    expect(theme.effects.glass.enabled).toBe(true);
  });

  it("sin declararlos, el tema es el de la base", () => {
    const theme = BuildProduct(APOLO, "dark");

    expect(theme.radius).toBe(baseDark.radius);
    expect(theme.spacing.unit).toBe(baseDark.spacing.unit);
    expect(theme.effects.glass.surface).toBe(baseDark.effects.glass.surface);
  });

  it("`off` apaga el material sin inventarle otro", () => {
    expect(BuildProduct({ ...APOLO, glass: "off" }, "dark").effects.glass.enabled).toBe(false);
  });

  it("el cristal de la semilla sale de SU rampa, no de una tabla suelta", () => {
    const sheer = BuildProduct({ ...APOLO, ramp: [10, 20, 60], glass: "sheer" }, "dark");
    const milky = BuildProduct({ ...APOLO, ramp: [10, 20, 60], glass: "milky" }, "dark");

    expect(sheer.effects.glass.surface.band.background).toContain("0.1)");
    expect(milky.effects.glass.surface.band.background).toContain("0.3)");
  });
});

describe("Los cinco peldaños de esquina", () => {
  it("son cinco y ninguno repite radio", () => {
    const sizes = CORNERS.map((corner) => RadiusOf(baseDark.radius, corner).md);

    expect(CORNERS).toHaveLength(5);
    expect(new Set(sizes).size).toBe(5);
  });

  it("los dos nuevos caen entre los tres de siempre, y en orden", () => {
    const [sharp, crisp, soft, plush, round] = CORNERS.map(
      (corner) => RadiusOf(baseDark.radius, corner).md,
    );

    expect(sharp).toBe(0);
    expect(soft).toBe(baseDark.radius.md);
    expect(crisp).toBeGreaterThan(sharp as number);
    expect(crisp).toBeLessThan(soft as number);
    expect(plush).toBeGreaterThan(soft as number);
    expect(plush).toBeLessThan(round as number);
  });

  it("la píldora no se interpola: media píldora no significa nada", () => {
    for (const corner of CORNERS) {
      if (corner === "sharp") continue;
      expect(RadiusOf(baseDark.radius, corner).full).toBe(baseDark.radius.full);
    }
  });
});
