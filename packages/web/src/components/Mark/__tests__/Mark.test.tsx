import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Mark } from "../Mark.js";

afterEach(cleanup);

describe("Mark", () => {
  it("renderiza un elemento mark", () => {
    render(<Mark data-testid="m">resaltado</Mark>);
    expect(screen.getByTestId("m").tagName).toBe("MARK");
  });

  it("resuelve el color a vars locales, no a una clase por escala", () => {
    const { rerender } = render(<Mark data-testid="m">x</Mark>);
    const mark = screen.getByTestId("m");
    const warning_class = mark.className;
    const warning_style = mark.getAttribute("style");

    rerender(
      <Mark data-testid="m" color="success">
        x
      </Mark>,
    );
    expect(screen.getByTestId("m").className).toBe(warning_class);
    expect(screen.getByTestId("m").getAttribute("style")).not.toBe(warning_style);
  });

  it("acepta un ColorExtended fuera de las escalas semánticas", () => {
    render(
      <Mark data-testid="m" color="#ff0000">
        x
      </Mark>,
    );
    expect(screen.getByTestId("m").getAttribute("style")).toContain("#ff0000");
  });
});
