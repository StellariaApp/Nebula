import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Mark } from "../Mark.js";

afterEach(cleanup);

describe("Mark", () => {
  it("renderiza un elemento mark", () => {
    render(<Mark data-testid="m">resaltado</Mark>);
    expect(screen.getByTestId("m").tagName).toBe("MARK");
  });

  it("aplica una clase por color semántico", () => {
    const { rerender } = render(<Mark data-testid="m">x</Mark>);
    const warning_class = screen.getByTestId("m").className;
    rerender(
      <Mark data-testid="m" color="success">
        x
      </Mark>,
    );
    expect(screen.getByTestId("m").className).not.toBe(warning_class);
  });
});
