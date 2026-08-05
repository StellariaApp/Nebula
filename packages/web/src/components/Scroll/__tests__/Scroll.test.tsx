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

  it("sin shadows no añade clase de indicador", () => {
    const { unmount } = render(<Scroll data-testid="plain" />);
    const plain = screen.getByTestId("plain").className;
    unmount();

    render(<Scroll data-testid="shaded" shadows />);
    expect(screen.getByTestId("shaded").className).not.toBe(plain);
  });

  it("el indicador del eje inline es distinto del de bloque", () => {
    const { unmount } = render(<Scroll data-testid="block" shadows axis="y" />);
    const block = screen.getByTestId("block").className;
    unmount();

    render(<Scroll data-testid="inline" shadows axis="x" />);
    expect(screen.getByTestId("inline").className).not.toBe(block);
  });

  it("xy indica los cuatro bordes con su propia clase", () => {
    const { unmount: drop_y } = render(<Scroll data-testid="y" shadows axis="y" />);
    const block = screen.getByTestId("y").className;
    drop_y();

    const { unmount: drop_x } = render(<Scroll data-testid="x" shadows axis="x" />);
    const inline = screen.getByTestId("x").className;
    drop_x();

    render(<Scroll data-testid="xy" shadows axis="xy" />);
    const both = screen.getByTestId("xy").className;
    expect(both).not.toBe(block);
    expect(both).not.toBe(inline);
    expect(both.includes("both_shadows")).toBe(true);
  });

  it("smooth cambia la clase del recipe", () => {
    const { unmount } = render(<Scroll data-testid="plain" />);
    const plain = screen.getByTestId("plain").className;
    unmount();

    render(<Scroll data-testid="smooth" smooth />);
    expect(screen.getByTestId("smooth").className).not.toBe(plain);
  });

  it("ni shadows ni smooth ensucian el DOM con atributos sueltos", () => {
    render(<Scroll data-testid="s" shadows smooth />);
    const node = screen.getByTestId("s");
    expect(node.getAttribute("shadows")).toBeNull();
    expect(node.getAttribute("smooth")).toBeNull();
  });
});
