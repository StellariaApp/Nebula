import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Container } from "../Container.js";

afterEach(cleanup);

describe("Container", () => {
  it("publica el max-width como var local", () => {
    render(
      <Container data-testid="c" size="md">
        x
      </Container>,
    );
    const style = screen.getByTestId("c").getAttribute("style") ?? "";
    expect(style).toContain("--");
    expect(style).toContain("960px");
  });

  it("fluid lleva el max-width al 100%", () => {
    render(<Container data-testid="c" fluid />);
    const style = screen.getByTestId("c").getAttribute("style") ?? "";
    expect(style).toContain("100%");
  });

  it("acepta un tamaño libre", () => {
    render(<Container data-testid="c" size={800} />);
    const style = screen.getByTestId("c").getAttribute("style") ?? "";
    expect(style).toContain("800px");
  });

  it("es polimórfico", () => {
    render(<Container data-testid="c" component="main" />);
    expect(screen.getByTestId("c").tagName).toBe("MAIN");
  });
});
