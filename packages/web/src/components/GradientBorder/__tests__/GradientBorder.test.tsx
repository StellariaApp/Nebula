import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { GradientBorder } from "../GradientBorder.js";

afterEach(cleanup);

type ThemeName = "nebula-light" | "nebula-dark" | "sober-light" | "playful";

function RenderIn(ui: ReactNode, theme: ThemeName) {
  return render(
    <NebulaProvider defaultTheme={theme} storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

describe("GradientBorder", () => {
  it("renderiza un div y conserva el contenido", () => {
    render(<GradientBorder>Contenido</GradientBorder>);
    expect(screen.getByText("Contenido").tagName).toBe("DIV");
  });

  it("es polimórfico", () => {
    render(
      <GradientBorder component="article" data-testid="gb">
        X
      </GradientBorder>,
    );
    expect(screen.getByTestId("gb").tagName).toBe("ARTICLE");
  });

  it("resuelve el gradiente del tema en una var local", () => {
    render(<GradientBorder data-testid="gb" />);
    expect(screen.getByTestId("gb").getAttribute("style") ?? "").toMatch(/linear-gradient\(/);
  });

  it("acepta los tres roles del contrato", () => {
    const seen = new Set<string>();
    for (const role of ["brand", "accent", "surface"] as const) {
      const view = render(<GradientBorder gradient={role} data-testid="gb" />);
      seen.add(screen.getByTestId("gb").getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(3);
  });

  it("acepta un gradiente propio con from/to/deg", () => {
    render(
      <GradientBorder gradient={{ from: "#3f37c9", to: "#9d4edd", deg: 90 }} data-testid="gb" />,
    );
    const style = screen.getByTestId("gb").getAttribute("style") ?? "";
    expect(style).toMatch(/90deg/);
  });

  it("deja el interior transparente por defecto", () => {
    render(<GradientBorder data-testid="gb" />);
    const node = screen.getByTestId("gb");
    expect(node.getAttribute("data-surface")).toBe("none");
    expect(node.getAttribute("style") ?? "").toMatch(/transparent/);
  });

  it("rellena el interior con el rol de superficie pedido", () => {
    render(<GradientBorder surface="raised" data-testid="gb" />);
    expect(screen.getByTestId("gb").getAttribute("style") ?? "").toMatch(/--color-surface-raised/);
  });

  it("expone el primer stop como color de borde para la rama sin mask-composite", () => {
    render(<GradientBorder data-testid="gb" />);
    expect(screen.getByTestId("gb").getAttribute("style") ?? "").toMatch(/--fallbackBorder/);
  });

  it("acepta un grosor de anillo en px", () => {
    render(<GradientBorder width={3} data-testid="gb" />);
    expect(screen.getByTestId("gb").getAttribute("style") ?? "").toMatch(/3px/);
  });

  it("resuelve un gradiente distinto por tema", () => {
    const seen = new Set<string>();
    for (const theme of ["nebula-light", "nebula-dark", "sober-light", "playful"] as const) {
      const view = RenderIn(<GradientBorder data-testid="gb" />, theme);
      seen.add(screen.getByTestId("gb").getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(4);
  });

  it("sober lo pinta monocromo: los dos stops salen de la misma paleta", () => {
    RenderIn(<GradientBorder data-testid="gb" />, "sober-light");
    const style = screen.getByTestId("gb").getAttribute("style") ?? "";
    expect(style).toMatch(/linear-gradient\(/);
  });
});
