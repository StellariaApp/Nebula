import { describe, expect, it } from "vitest";

import { officialThemes } from "@stellaria/nebula-themes";
import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { INK_DARK, INK_LIGHT, OnColor, WorstInk } from "../ink.js";
import { ThemeToVars } from "../theme-vars.js";

const YELLOW = "#dbbd00";
const INDIGO = "#5e63f8";

const WithFloor = (name: "light" | "dark", floor: number): NebulaTheme => ({
  ...officialThemes[name],
  ink: { floor },
});

describe("la tinta clara manda salvo que caiga bajo el suelo del tema", () => {
  it("un relleno oscuro lleva tinta clara con cualquier suelo", () => {
    expect(OnColor(INDIGO, 0)).toBe(INK_LIGHT);
    expect(OnColor(INDIGO, 4.5)).toBe(INK_LIGHT);
  });

  it("un relleno claro cede a tinta oscura solo cuando el suelo lo obliga", () => {
    expect(OnColor(YELLOW, 0)).toBe(INK_LIGHT);
    expect(OnColor(YELLOW, 2)).toBe(INK_DARK);
  });

  it("con suelo 0 nada baja a tinta oscura, que es la elección del producto", () => {
    for (const fill of [YELLOW, INDIGO, "#ffffff", "#00c7af"]) {
      expect(OnColor(fill, 0)).toBe(INK_LIGHT);
    }
  });

  it("el suelo de un degradado se mide en su peor extremo, no en el primero", () => {
    const stops = [INDIGO, YELLOW];
    expect(WorstInk(stops, 0)).toBe(INK_LIGHT);
    expect(WorstInk(stops, 2)).toBe(INK_DARK);
  });
});

describe("el suelo llega a las vars que pinta el provider", () => {
  it("con el suelo oficial solo warning sale en tinta oscura", () => {
    const inks = ThemeToVars(WithFloor("light", 2)).color.ink;

    expect(inks.warning).toBe(INK_DARK);
    for (const scale of ["primary", "accent", "gray", "success", "error", "info"] as const) {
      expect(inks[scale]).toBe(INK_LIGHT);
    }
  });

  it("con suelo 0 warning también sale en blanca", () => {
    expect(ThemeToVars(WithFloor("light", 0)).color.ink.warning).toBe(INK_LIGHT);
  });

  it("el degradado de marca de los oficiales va en tinta clara", () => {
    for (const name of ["light", "dark"] as const) {
      expect(ThemeToVars(officialThemes[name]).color.text.onGradient).toBe(INK_LIGHT);
    }
  });
});
