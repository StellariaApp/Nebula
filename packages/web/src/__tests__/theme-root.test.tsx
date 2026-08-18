import { act, cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import { useTheme } from "@stellaria/nebula-hooks";

import { ThemeScript } from "../provider/theme-script.js";
import { NebulaProvider } from "../provider/nebula-provider.js";
import { THEME_CLASSES } from "@stellaria/nebula-themes/web";

afterEach(() => {
  cleanup();
  const root = document.documentElement;
  for (const name of Object.values(THEME_CLASSES)) root.classList.remove(name);
  root.removeAttribute("data-theme");
  root.removeAttribute("data-scheme");
});

function Switcher() {
  const { setTheme } = useTheme();
  return (
    <button
      type="button"
      data-testid="to-light"
      onClick={() => {
        setTheme("light");
      }}
    >
      light
    </button>
  );
}

describe("applyTheme='root' — el tema vive en <html> (ADR-117)", () => {
  it("no deja clase ni atributos de tema en el envoltorio del provider", () => {
    const { container } = render(
      <NebulaProvider storage={null} applyTheme="root">
        <span>hola</span>
      </NebulaProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe("");
    expect(wrapper.getAttribute("data-theme")).toBeNull();
    expect(wrapper.getAttribute("data-scheme")).toBeNull();
  });

  it("pone la clase, los atributos y el color-scheme en <html>", () => {
    render(
      <NebulaProvider storage={null} applyTheme="root">
        <span>hola</span>
      </NebulaProvider>,
    );
    const root = document.documentElement;
    expect(root.classList.contains(THEME_CLASSES["dark"])).toBe(true);
    expect(root.getAttribute("data-theme")).toBe("nebula");
    expect(root.getAttribute("data-scheme")).toBe("dark");
    expect(root.style.colorScheme).toBe("dark");
  });

  it("setTheme reemplaza la clase de <html> sin acumular la anterior", () => {
    const { getByTestId } = render(
      <NebulaProvider storage={null} applyTheme="root">
        <Switcher />
      </NebulaProvider>,
    );
    const root = document.documentElement;

    act(() => {
      getByTestId("to-light").click();
    });

    expect(root.classList.contains(THEME_CLASSES["light"])).toBe(true);
    expect(root.classList.contains(THEME_CLASSES["dark"])).toBe(false);
    expect(root.getAttribute("data-scheme")).toBe("light");
  });

  it("el modo por defecto sigue siendo 'wrapper' y no toca <html>", () => {
    const { container } = render(
      <NebulaProvider storage={null}>
        <span>hola</span>
      </NebulaProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe(THEME_CLASSES["dark"]);
    expect(document.documentElement.getAttribute("data-theme")).toBeNull();
  });

  it("ThemeScript serializa el mapa de clases para pintar antes del primer frame", () => {
    const html = renderToStaticMarkup(<ThemeScript defaultTheme="dark" />);
    expect(html).toContain(THEME_CLASSES["dark"]);
    expect(html).toContain(THEME_CLASSES["light"]);
    expect(html).toContain("classList.add");
  });
});
