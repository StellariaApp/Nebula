import { act, cleanup, render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { useTheme } from "@stellaria/nebula-hooks";
import { nebulaDark } from "@stellaria/nebula-themes";
import {
  palettes,
  type ColorScheme,
  type NebulaTheme,
  type ThemeChoice,
} from "@stellaria/nebula-tokens";

import { NebulaProvider, type ThemeStorage } from "../provider/nebula-provider.js";
import { vars } from "../theme/contract.css.js";
import { themeClass } from "../theme/themes.css.js";

afterEach(() => {
  cleanup();
  const root = document.documentElement;
  for (const name of Object.values(themeClass)) root.classList.remove(name);
  root.removeAttribute("style");
  root.removeAttribute("data-theme");
  root.removeAttribute("data-scheme");
});

const rosette: NebulaTheme = {
  ...nebulaDark,
  meta: { name: "rosette", scheme: "dark", version: "0.1.0" },
  colors: { ...nebulaDark.colors, primary: palettes.rose },
};

const rosette_light: NebulaTheme = {
  ...nebulaDark,
  meta: { name: "rosette", scheme: "light", version: "0.1.0" },
  colors: { ...nebulaDark.colors, primary: palettes.rose },
};

function VarName(reference: string): string {
  return reference.replace(/^var\(/, "").replace(/\)$/, "");
}

interface MemoryStorage extends ThemeStorage {
  data: Record<string, string>;
}

function MakeMemoryStorage(): MemoryStorage {
  const data: Record<string, string> = {};
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

function Switcher({ to }: { to: ColorScheme | ThemeChoice | NebulaTheme }) {
  const { setTheme, themeName, scheme } = useTheme();
  return (
    <button
      type="button"
      data-testid="probe"
      data-name={themeName}
      data-scheme={scheme}
      onClick={() => {
        setTheme(to);
      }}
    >
      switch
    </button>
  );
}

describe("setTheme con un tema entero (ADR-121)", () => {
  it("aplica el tema custom por vars inline y expone su meta en el contexto", () => {
    const { container, getByTestId } = render(
      <NebulaProvider storage={null}>
        <Switcher to={rosette} />
      </NebulaProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;

    act(() => {
      getByTestId("probe").click();
    });

    expect(getByTestId("probe").getAttribute("data-name")).toBe("rosette");
    expect(wrapper.getAttribute("data-theme")).toBe("rosette");
    expect(wrapper.className).toBe("");
    expect(wrapper.style.getPropertyValue(VarName(vars.color.primary["500"]))).toBe(
      palettes.rose["500"],
    );
  });

  it("persiste los dos ejes de un tema custom, aunque no pueda reconstruirlo", () => {
    const storage = MakeMemoryStorage();
    const { getByTestId } = render(
      <NebulaProvider storage={storage} storageKeys={{ theme: "k-theme", scheme: "k-scheme" }}>
        <Switcher to={rosette_light} />
      </NebulaProvider>,
    );

    act(() => {
      getByTestId("probe").click();
    });

    expect(getByTestId("probe").getAttribute("data-scheme")).toBe("light");
    expect(storage.data["k-scheme"]).toBe("light");
    expect(storage.data["k-theme"]).toBe("rosette");
  });

  it("en applyTheme='root' escribe las vars en <html> y las limpia al volver a un tema oficial", () => {
    function Both() {
      const { setTheme } = useTheme();
      return (
        <>
          <button
            type="button"
            data-testid="to-custom"
            onClick={() => {
              setTheme(rosette);
            }}
          >
            custom
          </button>
          <button
            type="button"
            data-testid="to-official"
            onClick={() => {
              setTheme("light");
            }}
          >
            official
          </button>
        </>
      );
    }
    const { getByTestId } = render(
      <NebulaProvider storage={null} applyTheme="root">
        <Both />
      </NebulaProvider>,
    );
    const root = document.documentElement;
    const primary = VarName(vars.color.primary["500"]);

    act(() => {
      getByTestId("to-custom").click();
    });

    expect(root.style.getPropertyValue(primary)).toBe(palettes.rose["500"]);
    expect(root.classList.contains(themeClass["dark"])).toBe(false);
    expect(root.getAttribute("data-theme")).toBe("rosette");

    act(() => {
      getByTestId("to-official").click();
    });

    expect(root.style.getPropertyValue(primary)).toBe("");
    expect(root.classList.contains(themeClass["light"])).toBe(true);
  });

  it("un nombre desconocido sigue lanzando: ensanchar el tipo no relaja la validación", () => {
    function Wrapper({ children }: { children: ReactNode }) {
      return <NebulaProvider storage={null}>{children}</NebulaProvider>;
    }
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });
    expect(() => {
      result.current.setTheme({ theme: "rosette", scheme: "dark" });
    }).toThrow(/Tema desconocido/);
  });
});
