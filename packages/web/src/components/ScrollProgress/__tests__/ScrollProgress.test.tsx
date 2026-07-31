import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { ScrollProgress } from "../ScrollProgress.js";

afterEach(cleanup);

describe("ScrollProgress", () => {
  it("se anuncia como barra de progreso con rango", () => {
    render(<ScrollProgress />);
    const bar = screen.getByRole("progressbar", { name: "Progreso de lectura" });
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
    expect(bar.getAttribute("aria-valuenow")).toBe("0");
  });

  it("acepta una etiqueta propia", () => {
    render(<ScrollProgress label="Avance del artículo" />);
    expect(screen.getByRole("progressbar", { name: "Avance del artículo" })).toBeDefined();
  });

  it("las tres posiciones se marcan en un data attribute", () => {
    for (const position of ["top", "bottom", "static"] as const) {
      const view = render(<ScrollProgress position={position} />);
      expect(screen.getByRole("progressbar").getAttribute("data-position")).toBe(position);
      view.unmount();
    }
  });

  it("el color y la altura van en vars, no horneados", () => {
    render(<ScrollProgress color="accent.500" height={6} />);
    const style = screen.getByRole("progressbar").getAttribute("style") ?? "";
    expect(style).toMatch(/--color-accent-500/);
    expect(style).toMatch(/6px/);
  });

  it("la pista es opcional", () => {
    const view = render(<ScrollProgress />);
    expect(screen.getByRole("progressbar").getAttribute("data-track")).toBeNull();
    view.unmount();
    render(<ScrollProgress withTrack />);
    expect(screen.getByRole("progressbar").getAttribute("data-track")).toBe("true");
  });
});
