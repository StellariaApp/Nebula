import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Stat } from "../index.js";

afterEach(cleanup);

describe("Stat", () => {
  it("el rótulo va en versalitas por defecto", () => {
    render(<Stat label="Ingresos" value="68 700" />);
    const label = screen.getByText("Ingresos");
    expect(label.getAttribute("data-uppercase")).toBe("true");
  });

  it("con uppercase={false} el rótulo va en caja normal y sin la clase de versalitas (ADR-200)", () => {
    render(<Stat label="Ingresos" value="68 700" uppercase />);
    const upper = screen.getByText("Ingresos").className;
    cleanup();
    render(<Stat label="Ingresos" value="68 700" uppercase={false} />);
    const label = screen.getByText("Ingresos");
    expect(label.getAttribute("data-uppercase")).toBeNull();
    expect(label.className.split(" ").length).toBeLessThan(upper.split(" ").length);
    for (const name of label.className.split(" ")) expect(upper).toContain(name);
  });

  it("el cambio de caja no toca la cifra ni el pie", () => {
    render(<Stat label="Cancelaciones" value="14" diff="3,1 %" trend="down" uppercase={false} />);
    expect(screen.getByText("14")).toBeDefined();
    expect(screen.getByText("3,1 %").closest("[data-trend]")?.getAttribute("data-trend")).toBe(
      "down",
    );
  });
});
