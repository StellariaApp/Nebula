import { cleanup, render, screen } from "../../../__tests__/render.js";
import { afterEach, describe, expect, it } from "vitest";

import { Paper } from "../Paper.js";

afterEach(cleanup);

describe("Paper", () => {
  it("renderiza una superficie con clases de recipe", () => {
    render(
      <Paper data-testid="p" shadow="md" r="lg" withBorder>
        x
      </Paper>,
    );
    expect(screen.getByTestId("p").className.length).toBeGreaterThan(0);
  });

  it("acepta un radio numérico por la style prop (ADR-119)", () => {
    render(<Paper data-testid="p" r={20} />);
    expect(screen.getByTestId("p").style.getPropertyValue("--nb-r")).toBe("20px");
  });

  it("permite pisar el fondo con una style prop de Box (base en @layer)", () => {
    render(<Paper data-testid="p" bg="surface.sunken" />);
    expect(screen.getByTestId("p").className.length).toBeGreaterThan(0);
  });

  it("es polimórfico", () => {
    render(<Paper data-testid="p" component="article" />);
    expect(screen.getByTestId("p").tagName).toBe("ARTICLE");
  });
});
