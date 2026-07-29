import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import type { LoaderType } from "../Loader.types.js";
import { Loader } from "../Loader.js";

afterEach(cleanup);

const types: LoaderType[] = ["spinner", "dots", "bars"];

describe("Loader", () => {
  it("es un status con nombre accesible por defecto", () => {
    render(<Loader />);
    expect(screen.getByRole("status", { name: "Cargando" })).toBeDefined();
  });

  it("el label es inyectable para no meter copy de negocio en el core", () => {
    render(<Loader label="Sincronizando movimientos" />);
    expect(screen.getByRole("status", { name: "Sincronizando movimientos" })).toBeDefined();
  });

  it("los tres tipos conservan el status y ocultan sus piezas", () => {
    for (const type of types) {
      const { unmount } = render(<Loader type={type} />);
      const root = screen.getByRole("status");
      expect(root.getAttribute("data-type")).toBe(type);
      for (const piece of Array.from(root.children)) {
        expect(piece.getAttribute("aria-hidden")).toBe("true");
      }
      unmount();
    }
  });

  it("traduce los tamaños del contrato a la var local", () => {
    const { unmount } = render(<Loader size="xs" />);
    expect(screen.getByRole("status").getAttribute("style")).toContain("14px");
    unmount();
    render(<Loader size={60} />);
    expect(screen.getByRole("status").getAttribute("style")).toContain("60px");
  });

  it("el color sale del tema, no de un hex", () => {
    render(<Loader color="warning" />);
    const style = screen.getByRole("status").getAttribute("style") ?? "";
    expect(style).toContain("var(");
    expect(style).not.toMatch(/#[0-9a-f]{6}/i);
  });
});
