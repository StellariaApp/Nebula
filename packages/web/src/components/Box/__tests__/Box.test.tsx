import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Box } from "../Box.js";

afterEach(cleanup);

describe("Box", () => {
  it("renderiza un div por defecto", () => {
    render(<Box data-testid="box">contenido</Box>);
    expect(screen.getByTestId("box").tagName).toBe("DIV");
  });

  it("es polimórfico vía `component` (ADR-018 §2)", () => {
    render(
      <Box component="section" data-testid="box">
        contenido
      </Box>,
    );
    expect(screen.getByTestId("box").tagName).toBe("SECTION");
  });

  it("traduce style props tokenizadas a clases atómicas, no a estilos inline", () => {
    render(
      <Box data-testid="box" p="md" bg="surface.raised">
        x
      </Box>,
    );
    const box = screen.getByTestId("box");
    expect(box.className.length).toBeGreaterThan(0);
    expect(box.getAttribute("style")).toBeNull();
  });

  it("aplica los valores libres como estilo inline", () => {
    render(<Box data-testid="box" w={240} mah="50vh" />);
    const box = screen.getByTestId("box");
    expect(box.style.width).toBe("240px");
    expect(box.style.maxHeight).toBe("50vh");
  });

  it("conserva la className del consumidor junto a las de sprinkles", () => {
    render(<Box data-testid="box" p="sm" className="propia" />);
    expect(screen.getByTestId("box").className).toContain("propia");
  });

  it("pasa las props del DOM al elemento", () => {
    render(<Box component="button" data-testid="box" type="button" aria-label="acción" />);
    const box = screen.getByTestId("box");
    expect(box.getAttribute("type")).toBe("button");
    expect(box.getAttribute("aria-label")).toBe("acción");
  });

  it("expone el ref del elemento renderizado", () => {
    let node: Element | null = null;
    render(
      <Box
        component="section"
        ref={(el: Element | null) => {
          node = el;
        }}
      />,
    );
    expect(node).not.toBeNull();
  });
});
