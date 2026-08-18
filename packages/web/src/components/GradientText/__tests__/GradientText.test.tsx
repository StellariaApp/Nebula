import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { GradientText } from "../GradientText.js";

afterEach(cleanup);

describe("GradientText", () => {
  it("renderiza un span por defecto y conserva el texto", () => {
    render(<GradientText>Nebula</GradientText>);
    const node = screen.getByText("Nebula");
    expect(node.tagName).toBe("SPAN");
  });

  it("es polimórfico para titulares", () => {
    render(
      <GradientText component="h1" data-testid="hero">
        Hero
      </GradientText>,
    );
    expect(screen.getByTestId("hero").tagName).toBe("H1");
  });

  it("resuelve el gradiente del tema en una var local", () => {
    render(<GradientText data-testid="gt">Marca</GradientText>);
    const style = screen.getByTestId("gt").getAttribute("style") ?? "";
    expect(style).toContain("var(--gradient-brand-image");
  });

  it("acepta los tres roles de gradiente del contrato", () => {
    const seen = new Set<string>();
    for (const role of ["brand", "accent", "surface"] as const) {
      const view = render(
        <GradientText gradient={role} data-testid="gt">
          X
        </GradientText>,
      );
      seen.add(screen.getByTestId("gt").getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(3);
  });

  it("acepta un gradiente propio con from/to/deg", () => {
    render(
      <GradientText gradient={{ from: "#3f37c9", to: "#9d4edd", deg: 90 }} data-testid="gt">
        Custom
      </GradientText>,
    );
    const style = screen.getByTestId("gt").getAttribute("style") ?? "";
    expect(style).toMatch(/90deg/);
    expect(style).toMatch(/#3f37c9/);
  });

  it("expone el color de fallback como var para las degradaciones CSS", () => {
    render(
      <GradientText fallbackColor="text.inverted" data-testid="gt">
        Fallback
      </GradientText>,
    );
    const style = screen.getByTestId("gt").getAttribute("style") ?? "";
    expect(style).toMatch(/--color-text-inverted/);
  });

  it("no hornea el gradiente como color inline (queda en la var, no en color)", () => {
    render(<GradientText data-testid="gt">Zero runtime</GradientText>);
    const style = screen.getByTestId("gt").getAttribute("style") ?? "";
    expect(style).not.toMatch(/(^|;)\s*color:/);
  });

  it("emite la misma referencia sea cual sea el tema: decide la clase", () => {
    const dark = render(<GradientText data-testid="gt">T</GradientText>);
    const dark_style = screen.getByTestId("gt").getAttribute("style") ?? "";
    dark.unmount();
    expect(dark_style).toContain("var(--gradient-brand-image");
  });

  it("acepta style props y las compone con las vars", () => {
    render(
      <GradientText fz="h1" fw="bold" data-testid="gt">
        Grande
      </GradientText>,
    );
    expect(screen.getByTestId("gt").className).not.toBe("");
  });
});
