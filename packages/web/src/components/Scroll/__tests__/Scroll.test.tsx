import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Scroll } from "../Scroll.js";

afterEach(cleanup);

describe("Scroll", () => {
  it("renderiza un contenedor con clase de recipe", () => {
    render(
      <Scroll data-testid="s" axis="y">
        x
      </Scroll>,
    );
    expect(screen.getByTestId("s").className.length).toBeGreaterThan(0);
  });

  it("aplica scrollbarSize como var local", () => {
    render(<Scroll data-testid="s" scrollbarSize={12} />);
    const style = screen.getByTestId("s").getAttribute("style") ?? "";
    expect(style).toContain("12px");
  });

  it("soporta los tres ejes", () => {
    for (const axis of ["x", "y", "xy"] as const) {
      const { unmount } = render(<Scroll data-testid="s" axis={axis} />);
      expect(screen.getByTestId("s").className.length).toBeGreaterThan(0);
      unmount();
    }
  });
});
