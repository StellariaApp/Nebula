import { DARK_SCHEME, LIGHT_SCHEME } from "@stellaria/nebula-tokens";
import { describe, expect, it } from "vitest";

import { nebulaDark } from "../themes/nebula/dark.js";
import { nebulaLight } from "../themes/nebula/light.js";

const SHADOW_LEVELS = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"] as const;

describe.each([
  ["claro", nebulaLight, LIGHT_SCHEME],
  ["oscuro", nebulaDark, DARK_SCHEME],
] as const)("el CSS de tokens y el tema nebula %s dicen lo mismo", (_name, theme, scheme) => {
  it("superficies, texto y bordes", () => {
    expect(scheme.colors.surface).toEqual(theme.colors.surface);
    expect(scheme.colors.text).toEqual(theme.colors.text);
    expect(scheme.colors.border).toEqual(theme.colors.border);
  });

  it("escalas de marca, grises y semánticas", () => {
    expect(scheme.colors.primary).toEqual(theme.colors.primary);
    expect(scheme.colors.accent).toEqual(theme.colors.accent);
    expect(scheme.colors.gray).toEqual(theme.colors.gray);
    expect(scheme.colors.semantic).toEqual(theme.colors.semantic);
  });

  it("sombras web", () => {
    for (const level of SHADOW_LEVELS) {
      expect(scheme.shadows[level]).toBe(theme.effects.shadows[level].web);
    }
  });
});
