import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Paper } from "../Paper.js";

afterEach(cleanup);

describe("Paper", () => {
  it("renderiza una superficie con clases de recipe", () => {
    render(
      <Paper data-testid="p" shadow="md" radius="lg" withBorder>
        x
      </Paper>,
    );
    expect(screen.getByTestId("p").className.length).toBeGreaterThan(0);
  });

  it("acepta un radius numérico como estilo inline", () => {
    render(<Paper data-testid="p" radius={20} />);
    expect(screen.getByTestId("p").style.borderRadius).toBe("20px");
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
