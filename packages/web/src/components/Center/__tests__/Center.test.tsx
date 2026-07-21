import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Center } from "../Center.js";

afterEach(cleanup);

describe("Center", () => {
  it("renderiza un div centrado", () => {
    render(<Center data-testid="c">x</Center>);
    const el = screen.getByTestId("c");
    expect(el.tagName).toBe("DIV");
    expect(el.className.length).toBeGreaterThan(0);
  });

  it("permite override de align/justify", () => {
    render(<Center data-testid="c" align="flex-start" justify="space-between" />);
    expect(screen.getByTestId("c").className.length).toBeGreaterThan(0);
  });

  it("es polimórfico", () => {
    render(<Center data-testid="c" component="span" inline />);
    expect(screen.getByTestId("c").tagName).toBe("SPAN");
  });
});
