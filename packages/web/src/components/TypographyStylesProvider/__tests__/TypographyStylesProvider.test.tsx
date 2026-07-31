import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { TypographyStylesProvider } from "../TypographyStylesProvider.js";

afterEach(cleanup);

const HTML = "<h2>Título</h2><p>Un párrafo con <a href='#x'>enlace</a>.</p><ul><li>Uno</li></ul>";

describe("TypographyStylesProvider", () => {
  it("renderiza un div y conserva los hijos", () => {
    render(
      <TypographyStylesProvider data-testid="tsp">
        <p>Contenido</p>
      </TypographyStylesProvider>,
    );
    const node = screen.getByTestId("tsp");
    expect(node.tagName).toBe("DIV");
    expect(screen.getByText("Contenido")).toBeDefined();
  });

  it("es polimórfico", () => {
    render(
      <TypographyStylesProvider component="article" data-testid="tsp">
        <p>x</p>
      </TypographyStylesProvider>,
    );
    expect(screen.getByTestId("tsp").tagName).toBe("ARTICLE");
  });

  it("no interpreta el contenido: estiliza el que le den", () => {
    render(
      <TypographyStylesProvider data-testid="tsp" dangerouslySetInnerHTML={{ __html: HTML }} />,
    );
    const node = screen.getByTestId("tsp");
    expect(node.querySelector("h2")?.textContent).toBe("Título");
    expect(node.querySelectorAll("li")).toHaveLength(1);
  });

  it("aplica una sola clase, no una por etiqueta", () => {
    render(
      <TypographyStylesProvider data-testid="tsp" dangerouslySetInnerHTML={{ __html: HTML }} />,
    );
    const node = screen.getByTestId("tsp");
    expect(node.className.split(" ").length).toBe(1);
    expect(node.querySelector("h2")?.className).toBe("");
  });

  it("acepta style props", () => {
    render(
      <TypographyStylesProvider maw={640} data-testid="tsp">
        <p>x</p>
      </TypographyStylesProvider>,
    );
    expect(screen.getByTestId("tsp").getAttribute("style") ?? "").toMatch(/max-width/);
  });
});
