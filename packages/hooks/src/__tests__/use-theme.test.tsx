import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { ThemeContext, type ThemeContextValue } from "../theme/theme-context.js";
import { useTheme } from "../theme/use-theme.js";

afterEach(cleanup);

const fakeTheme = {
  meta: { name: "nebula-light", scheme: "light", version: "0.0.0" },
} as unknown as NebulaTheme;

function MakeWrapper(value: ThemeContextValue) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
  };
}

describe("useTheme", () => {
  it("devuelve el valor del contexto de theming", () => {
    const value: ThemeContextValue = {
      theme: fakeTheme,
      themeName: "nebula-light",
      setTheme: vi.fn(),
      scheme: "light",
      systemScheme: "light",
    };
    const { result } = renderHook(() => useTheme(), { wrapper: MakeWrapper(value) });

    expect(result.current.themeName).toBe("nebula-light");
    expect(result.current.scheme).toBe("light");
    expect(result.current.theme).toBe(fakeTheme);
  });

  it("lanza un error legible fuera de <NebulaProvider>", () => {
    expect(() => renderHook(() => useTheme())).toThrow(/NebulaProvider/);
  });
});
