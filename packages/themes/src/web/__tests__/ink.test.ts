import { describe, expect, it } from "vitest";

import { Themes } from "../../index.js";
import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { INK_DARK, INK_LIGHT, OnColor, WorstInk } from "../ink.js";
import { ThemeToVars } from "../theme-vars.js";

const YELLOW = "#dbbd00";
const INDIGO = "#5e63f8";

const WithFloor = (name: "light" | "dark", floor: number): NebulaTheme => ({
  ...Themes.nebula[name],
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
      expect(ThemeToVars(Themes.nebula[name]).color.text.onGradient).toBe(INK_LIGHT);
    }
  });
});

describe("la tinta declarada sobre el primario manda sobre el suelo (ADR-202)", () => {
  const Declared = (primary: "light" | "dark"): NebulaTheme => ({
    ...Themes.nebula.dark,
    ink: { floor: 2, primary },
  });

  it("dark pone tinta oscura sobre un indigo que por suelo llevaria clara", () => {
    const { color } = ThemeToVars(Declared("dark"));
    expect(color.ink.primary).toBe(INK_DARK);
    expect(color.text.onPrimary).toBe(INK_DARK);
  });

  it("solo toca primary: accent y las semanticas siguen por el suelo", () => {
    const { color } = ThemeToVars(Declared("dark"));
    for (const scale of ["accent", "gray", "success", "error", "info"] as const) {
      expect(color.ink[scale]).toBe(INK_LIGHT);
    }
    expect(color.ink.warning).toBe(INK_DARK);
  });

  it("light deja lo que ya habia", () => {
    expect(ThemeToVars(Declared("light")).color.ink.primary).toBe(INK_LIGHT);
  });

  it("el degradado no la hereda: sigue con su peor extremo o con su propio ink", () => {
    expect(ThemeToVars(Declared("dark")).color.text.onGradient).toBe(INK_LIGHT);
  });
});
