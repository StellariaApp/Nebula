import { palettes } from "@stellaria/nebula-tokens";
import { describe, expect, it } from "vitest";

import { baseDark } from "../themes/_base/dark.js";
import { baseLight } from "../themes/_base/light.js";
import { THEMES_SEEDS, type ThemeSeed } from "../themes/_seed/index.js";
import { BuildProduct } from "../utils/build-product.js";

const PALE: ThemeSeed = {
  name: "pale",
  primary: palettes.cyan,
  accent: palettes.blue,
  from: palettes.cyan["500"],
  to: palettes.blue["300"],
  tint: palettes.cyan["900"],
  wash: 0.05,
  lift: 0,
};

describe("la tinta sobre el primario y sobre el degradado la elige la semilla (ADR-202)", () => {
  it("sin ink nada cambia: la tinta de la base, sin declaracion y sin ink en el degradado", () => {
    for (const [scheme, base] of [
      ["dark", baseDark],
      ["light", baseLight],
    ] as const) {
      const theme = BuildProduct(PALE, scheme);
      expect(theme.ink).toEqual({ floor: 2 });
      expect(theme.colors.text.onPrimary).toBe(base.colors.text.onPrimary);
      expect(theme.colors.text.onGradient).toBe(base.colors.text.onGradient);
      expect(theme.effects.gradients.brand.ink).toBeUndefined();
    }
  });

  it("ink.primary = dark declara la tinta y pone la oscura de la base clara en los dos esquemas", () => {
    for (const scheme of ["dark", "light"] as const) {
      const theme = BuildProduct({ ...PALE, ink: { primary: "dark" } }, scheme);
      expect(theme.ink.primary).toBe("dark");
      expect(theme.colors.text.onPrimary).toBe(baseLight.colors.text.primary);
      expect(theme.colors.text.onGradient).toBe(
        (scheme === "dark" ? baseDark : baseLight).colors.text.onGradient,
      );
      expect(theme.effects.gradients.brand.ink).toBeUndefined();
    }
  });

  it("ink.gradient llega al token del degradado de marca, que es lo que lee el provider (ADR-089)", () => {
    for (const scheme of ["dark", "light"] as const) {
      const theme = BuildProduct({ ...PALE, ink: { gradient: "dark" } }, scheme);
      expect(theme.effects.gradients.brand.ink).toBe("dark");
      expect(theme.colors.text.onGradient).toBe(baseLight.colors.text.primary);
      expect(theme.ink).toEqual({ floor: 2 });
    }
  });

  it("ink light escribe la tinta clara de la base clara, tambien en dark", () => {
    const theme = BuildProduct({ ...PALE, ink: { primary: "light", gradient: "light" } }, "dark");
    expect(theme.ink.primary).toBe("light");
    expect(theme.colors.text.onPrimary).toBe(baseLight.colors.text.onPrimary);
    expect(theme.effects.gradients.brand.ink).toBe("light");
  });

  it("ninguno de los dieciseis declara tinta", () => {
    for (const seed of Object.values(THEMES_SEEDS)) {
      expect("ink" in seed).toBe(false);
      expect(BuildProduct(seed, "dark").ink.primary).toBeUndefined();
    }
  });
});
