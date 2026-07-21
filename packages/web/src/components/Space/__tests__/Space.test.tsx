import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Space } from "../Space.js";

afterEach(cleanup);

describe("Space", () => {
  it("aplica width/height desde tokens de espacio como var", () => {
    render(<Space data-testid="sp" h="xl" />);
    const style = screen.getByTestId("sp").getAttribute("style") ?? "";
    expect(style).toContain("var(--");
  });

  it("acepta un valor libre", () => {
    render(<Space data-testid="sp" w={40} />);
    expect(screen.getByTestId("sp").style.width).toBe("40px");
  });

  it("queda fuera del árbol de accesibilidad", () => {
    render(<Space data-testid="sp" h="md" />);
    expect(screen.getByTestId("sp").getAttribute("aria-hidden")).toBe("true");
  });
});
