import { act, cleanup, render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { useTheme } from "@stellaria/nebula-hooks";

import { NebulaProvider } from "../provider/nebula-provider.js";
import { themeClass } from "../theme/themes.css.js";

afterEach(cleanup);

function ThemeProbe() {
  const { themeName, scheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      data-testid="probe"
      data-name={themeName}
      data-scheme={scheme}
      onClick={() => {
        setTheme("nebula-dark");
      }}
    >
      switch
    </button>
  );
}

describe("NebulaProvider — switch de tema por clase", () => {
  it("aplica la clase del tema por defecto y expone el contexto", () => {
    const { container, getByTestId } = render(
      <NebulaProvider storage={null}>
        <ThemeProbe />
      </NebulaProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe(themeClass["nebula-light"]);
    expect(wrapper.getAttribute("data-scheme")).toBe("light");
    expect(getByTestId("probe").getAttribute("data-name")).toBe("nebula-light");
  });

  it("setTheme reconfigura el subárbol cambiando SOLO la clase", () => {
    const { container, getByTestId } = render(
      <NebulaProvider storage={null}>
        <ThemeProbe />
      </NebulaProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe(themeClass["nebula-light"]);

    act(() => {
      getByTestId("probe").click();
    });

    expect(wrapper.className).toBe(themeClass["nebula-dark"]);
    expect(wrapper.getAttribute("data-scheme")).toBe("dark");
    expect(getByTestId("probe").getAttribute("data-name")).toBe("nebula-dark");
    // Cada tema es una clase distinta ⇒ distinta materialización de las vars.
    expect(themeClass["nebula-light"]).not.toBe(themeClass["nebula-dark"]);
  });

  it("demo: cicla los 4 temas oficiales reconfigurando SOLO la clase del contenedor", () => {
    const names = ["nebula-light", "nebula-dark", "sober-light", "playful"] as const;
    function Cycler() {
      const { setTheme } = useTheme();
      return (
        <>
          {names.map((n) => (
            <button
              key={n}
              type="button"
              data-testid={n}
              onClick={() => {
                setTheme(n);
              }}
            >
              {n}
            </button>
          ))}
        </>
      );
    }
    const { container, getByTestId } = render(
      <NebulaProvider storage={null}>
        <Cycler />
      </NebulaProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;

    for (const n of names) {
      act(() => {
        getByTestId(n).click();
      });
      expect(wrapper.className).toBe(themeClass[n]);
      expect(wrapper.getAttribute("data-nebula-theme")).toBe(n);
    }
  });

  it("setTheme lanza un error legible ante un nombre de tema desconocido", () => {
    function Wrapper({ children }: { children: ReactNode }) {
      return <NebulaProvider storage={null}>{children}</NebulaProvider>;
    }
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });
    expect(() => {
      result.current.setTheme("no-existe");
    }).toThrow(/Tema desconocido/);
  });
});
