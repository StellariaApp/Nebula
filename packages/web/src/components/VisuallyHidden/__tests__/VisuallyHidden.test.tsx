import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { VisuallyHidden } from "../VisuallyHidden.js";

afterEach(cleanup);

describe("VisuallyHidden", () => {
  it("renderiza un span por defecto con texto accesible", () => {
    render(<VisuallyHidden>cargando</VisuallyHidden>);
    const el = screen.getByText("cargando");
    expect(el.tagName).toBe("SPAN");
    expect(el.className.length).toBeGreaterThan(0);
  });

  it("es polimórfico", () => {
    render(
      <VisuallyHidden component="h2" data-testid="vh">
        título oculto
      </VisuallyHidden>,
    );
    expect(screen.getByTestId("vh").tagName).toBe("H2");
  });
});
