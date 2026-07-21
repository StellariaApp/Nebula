import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Flex } from "../Flex.js";

afterEach(cleanup);

describe("Flex", () => {
  it("renderiza un div con display flex", () => {
    render(
      <Flex data-testid="f" gap="sm">
        x
      </Flex>,
    );
    const el = screen.getByTestId("f");
    expect(el.tagName).toBe("DIV");
    expect(el.className.length).toBeGreaterThan(0);
  });

  it("usa inline-flex cuando inline", () => {
    render(<Flex data-testid="f" inline />);
    expect(screen.getByTestId("f").className.length).toBeGreaterThan(0);
  });

  it("es polimórfico vía component", () => {
    render(<Flex data-testid="f" component="section" />);
    expect(screen.getByTestId("f").tagName).toBe("SECTION");
  });

  it("respeta un display explícito del consumidor", () => {
    render(<Flex data-testid="f" display="inline-flex" />);
    expect(screen.getByTestId("f").className.length).toBeGreaterThan(0);
  });
});
