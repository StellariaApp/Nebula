import { act, cleanup, render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { useTheme } from "@stellaria/nebula-hooks";
import { Dark as nebulaDark, Light as nebulaLight } from "@stellaria/nebula-themes";
import { palettes, type NebulaTheme } from "@stellaria/nebula-tokens";

import { CompileTheme, ThemeScriptMap, THEME_CLASSES, type ThemeVariants } from "@stellaria/nebula-themes/web";
import { NebulaProvider, type ThemeStorage } from "../provider/nebula-provider.js";

afterEach(cleanup);

const rosette_dark: NebulaTheme = {
  ...nebulaDark,
  meta: { name: "rosette", scheme: "dark", version: "0.1.0" },
  colors: { ...nebulaDark.colors, primary: palettes.rose },
};

const rosette_light: NebulaTheme = {
  ...nebulaLight,
  meta: { name: "rosette", scheme: "light", version: "0.1.0" },
  colors: { ...nebulaLight.colors, primary: palettes.rose },
};

const rosette: ThemeVariants = {
  dark: { theme: rosette_dark, className: "rosette_d" },
  light: { theme: rosette_light, className: "rosette_l" },
};

const PRODUCTS = { rosette };

function MakeStorage(theme?: string, scheme?: string): ThemeStorage & {
  data: Record<string, string>;
} {
  const data: Record<string, string> = {};
  if (theme !== undefined) data["k-theme"] = theme;
  if (scheme !== undefined) data["k-scheme"] = scheme;
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

function Wrap(children: ReactNode, storage: ThemeStorage | null, seed?: string) {
  return (
    <NebulaProvider
      storage={storage}
      storageKeys={{ theme: "k-theme", scheme: "k-scheme" }}
      themes={PRODUCTS}
      defaultTheme={seed === undefined ? { theme: "rosette", scheme: "dark" } : "dark"}
    >
      {children}
    </NebulaProvider>
  );
}

describe("identidad y esquema son ejes distintos (ADR-166)", () => {
  it("los dos temas oficiales comparten identidad y se distinguen por esquema", () => {
    expect(nebulaDark.meta.name).toBe("nebula");
    expect(nebulaLight.meta.name).toBe("nebula");
    expect(nebulaDark.meta.scheme).toBe("dark");
    expect(nebulaLight.meta.scheme).toBe("light");
  });

  it("setTheme con un esquema conserva la identidad del producto", () => {
    function Probe() {
      const { setTheme, themeName, scheme } = useTheme();
      return (
        <button
          type="button"
          data-testid="p"
          data-name={themeName}
          data-scheme={scheme}
          onClick={() => {
            setTheme("light");
          }}
        >
          x
        </button>
      );
    }
    const { getByTestId, container } = render(Wrap(<Probe />, null));
    const wrapper = container.firstElementChild as HTMLElement;

    expect(getByTestId("p").getAttribute("data-name")).toBe("rosette");
    expect(wrapper.className).toBe("rosette_d");

    act(() => {
      getByTestId("p").click();
    });

    expect(getByTestId("p").getAttribute("data-name")).toBe("rosette");
    expect(getByTestId("p").getAttribute("data-scheme")).toBe("light");
    expect(wrapper.className).toBe("rosette_l");
  });

  it("un tema de producto registrado sobrevive a la recarga", () => {
    const storage = MakeStorage("rosette", "light");
    function Probe() {
      const { themeName, scheme } = useTheme();
      return <span data-testid="p" data-name={themeName} data-scheme={scheme} />;
    }
    const { getByTestId } = render(Wrap(<Probe />, storage, "seeded"));

    expect(getByTestId("p").getAttribute("data-name")).toBe("rosette");
    expect(getByTestId("p").getAttribute("data-scheme")).toBe("light");
  });

  it("guarda los dos ejes", () => {
    const storage = MakeStorage();
    function Probe() {
      const { setTheme } = useTheme();
      return (
        <button
          type="button"
          data-testid="p"
          onClick={() => {
            setTheme("light");
          }}
        >
          x
        </button>
      );
    }
    render(Wrap(<Probe />, storage));
    act(() => {
      document.querySelector<HTMLButtonElement>('[data-testid="p"]')?.click();
    });
    expect(storage.data["k-theme"]).toBe("rosette");
  });

  it("el esquema solo, sin identidad guardada, cae en los oficiales", () => {
    const storage = MakeStorage(undefined, "light");
    function Probe() {
      const { themeName, scheme } = useTheme();
      return <span data-testid="p" data-name={themeName} data-scheme={scheme} />;
    }
    const { getByTestId } = render(
      <NebulaProvider storage={storage} storageKeys={{ theme: "k-theme", scheme: "k-scheme" }} defaultTheme="dark">
        <Probe />
      </NebulaProvider>,
    );
    expect(getByTestId("p").getAttribute("data-name")).toBe("nebula");
    expect(getByTestId("p").getAttribute("data-scheme")).toBe("light");
  });

  it("una identidad sin registrar cae en los oficiales SIN perder el esquema", () => {
    const storage = MakeStorage("fantasma", "dark");
    function Probe() {
      const { themeName, scheme } = useTheme();
      return <span data-testid="p" data-name={themeName} data-scheme={scheme} />;
    }
    const { getByTestId } = render(
      <NebulaProvider storage={storage} storageKeys={{ theme: "k-theme", scheme: "k-scheme" }} defaultTheme="dark">
        <Probe />
      </NebulaProvider>,
    );
    expect(getByTestId("p").getAttribute("data-name")).toBe("nebula");
    expect(getByTestId("p").getAttribute("data-scheme")).toBe("dark");
  });

  it("un tema materializado no inyecta vars en linea", () => {
    function Probe() {
      return <span data-testid="p" />;
    }
    const { container } = render(
      <NebulaProvider storage={null} defaultTheme={rosette.dark} themes={PRODUCTS}>
        <Probe />
      </NebulaProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe("rosette_d");
    expect(wrapper.getAttribute("style")).toBeNull();
  });

  it("el mapa del script se deriva del registro y lleva siempre a los oficiales", () => {
    const map = ThemeScriptMap(PRODUCTS);
    expect(map["rosette"]).toEqual({ dark: "rosette_d", light: "rosette_l" });
    expect(map["nebula"]).toEqual({ dark: THEME_CLASSES.dark, light: THEME_CLASSES.light });
  });

  it("una identidad desconocida en setTheme lanza y nombra las registradas", () => {
    function Wrapper({ children }: { children: ReactNode }) {
      return (
        <NebulaProvider storage={null} themes={PRODUCTS}>
          {children}
        </NebulaProvider>
      );
    }
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });
    expect(() => {
      result.current.setTheme({ theme: "no-existe", scheme: "dark" });
    }).toThrow(/rosette/);
  });
});

describe("CompileTheme materializa en caliente (ADR-164)", () => {
  it("es determinista: el mismo tema da la misma clase", () => {
    expect(CompileTheme(rosette_dark).className).toBe(CompileTheme(rosette_dark).className);
  });

  it("dos temas distintos dan clases distintas", () => {
    expect(CompileTheme(rosette_dark).className).not.toBe(CompileTheme(rosette_light).className);
  });

  it("devuelve una regla CSS con su propia clase y las vars del contrato", () => {
    const compiled = CompileTheme(rosette_dark);
    expect(compiled.css.startsWith(`.${compiled.className}{`)).toBe(true);
    expect(compiled.css.endsWith("}")).toBe(true);
    expect(compiled.css).toContain("--");
    expect(compiled.theme).toBe(rosette_dark);
  });

  it("lo que devuelve entra directo en el provider sin inyectar vars", () => {
    const compiled = CompileTheme(rosette_dark);
    const { container } = render(
      <NebulaProvider storage={null} defaultTheme={compiled}>
        <span />
      </NebulaProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe(compiled.className);
    expect(wrapper.getAttribute("style")).toBeNull();
  });
});

describe("el provider adopta lo que el script ya pinto (ADR-169)", () => {
  function Probe() {
    const { themeName, scheme } = useTheme();
    return <span data-testid="p" data-name={themeName} data-scheme={scheme} />;
  }

  afterEach(() => {
    const root = document.documentElement;
    root.removeAttribute("data-theme");
    root.removeAttribute("data-scheme");
  });

  it("acaba en el tema pintado, y sin discrepancia de hidratacion", () => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "rosette");
    root.setAttribute("data-scheme", "light");

    const { getByTestId } = render(
      <NebulaProvider storage={null} themes={PRODUCTS} defaultTheme="dark" applyTheme="root">
        <Probe />
      </NebulaProvider>,
    );

    // El estado inicial es defaultTheme —tiene que coincidir con el servidor— y un layout effect
    // lo adopta antes del primer pintado. Nacer ya en el pintado provocaba discrepancia: los
    // componentes que resuelven color en JS salian distintos en servidor y cliente.
    expect(getByTestId("p").getAttribute("data-name")).toBe("rosette");
    expect(getByTestId("p").getAttribute("data-scheme")).toBe("light");
  });

  it("no adopta una identidad que no esta registrada", () => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "fantasma");
    root.setAttribute("data-scheme", "light");

    const { getByTestId } = render(
      <NebulaProvider storage={null} themes={PRODUCTS} defaultTheme="dark" applyTheme="root">
        <Probe />
      </NebulaProvider>,
    );

    expect(getByTestId("p").getAttribute("data-name")).toBe("nebula");
  });

  it("en applyTheme=wrapper no mira el documento: ese <html> no es suyo", () => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "rosette");
    root.setAttribute("data-scheme", "light");

    const { getByTestId } = render(
      <NebulaProvider storage={null} themes={PRODUCTS} defaultTheme="dark">
        <Probe />
      </NebulaProvider>,
    );

    expect(getByTestId("p").getAttribute("data-name")).toBe("nebula");
    expect(getByTestId("p").getAttribute("data-scheme")).toBe("dark");
  });
});
