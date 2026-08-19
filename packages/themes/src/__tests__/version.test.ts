import { describe, expect, it } from "vitest";

import { baseDark } from "../themes/_base/dark.js";
import { baseLight } from "../themes/_base/light.js";
import { THEMES_SEEDS } from "../themes/_seed/index.js";
import { Themes, THEME_NAMES } from "../themes/registry.js";
import { BuildProduct } from "../utils/build-product.js";
import { THEME_VERSION } from "../version.js";

/**
 * `meta.version` estaba escrito tres veces y se quedo en `0.1.0` cuando el paquete salio a `1.0.0`,
 * asi que los dieciseis temas mentian sobre su propia version. Aqui se comprueba que las tres siguen
 * siendo una sola; que esa una sea la del `package.json` lo garantiza `scripts/release.mjs`, porque
 * el `rootDir` del paquete deja el manifiesto fuera del alcance de un test.
 */
describe("todos los temas declaran una sola version", () => {
  it("las dos bases usan la constante", () => {
    expect(baseDark.meta.version).toBe(THEME_VERSION);
    expect(baseLight.meta.version).toBe(THEME_VERSION);
  });

  it("lo que construye BuildProduct la lleva", () => {
    expect(BuildProduct(THEMES_SEEDS.nebula, "dark").meta.version).toBe(THEME_VERSION);
    expect(BuildProduct(THEMES_SEEDS.eclipse, "light").meta.version).toBe(THEME_VERSION);
  });

  it("ninguno de los dieciseis declara otra cosa", () => {
    for (const name of THEME_NAMES) {
      expect(Themes[name].dark.meta.version).toBe(THEME_VERSION);
      expect(Themes[name].light.meta.version).toBe(THEME_VERSION);
    }
  });
});
