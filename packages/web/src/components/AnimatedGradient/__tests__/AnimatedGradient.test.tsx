import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { AnimatedGradient } from "../AnimatedGradient.js";

afterEach(cleanup);

type ThemeName = "light" | "dark" | "sober-light" | "playful";

function RenderIn(ui: ReactNode, theme: ThemeName) {
  return render(
    <NebulaProvider defaultTheme={theme} storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

describe("AnimatedGradient", () => {
  it("renderiza un div y conserva el contenido", () => {
    render(<AnimatedGradient>Ambiente</AnimatedGradient>);
    expect(screen.getByText("Ambiente").tagName).toBe("DIV");
  });

  it("monta la capa que deriva, marcada como decorativa", () => {
    render(<AnimatedGradient data-testid="ag" />);
    const layers = screen.getByTestId("ag").querySelectorAll("span[aria-hidden='true']");
    expect(layers).toHaveLength(1);
  });

  it("anima cuando el tier del tema lo permite", () => {
    render(<AnimatedGradient data-testid="ag" />);
    expect(screen.getByTestId("ag").getAttribute("data-animated")).toBe("true");
  });

  it("se detiene con motion.tier minimal (sober)", () => {
    RenderIn(<AnimatedGradient data-testid="ag" />, "sober-light");
    const node = screen.getByTestId("ag");
    expect(node.getAttribute("data-animated")).toBe("false");
    const layer = node.querySelector("span[aria-hidden='true']");
    expect(layer?.getAttribute("data-animated")).toBe("false");
  });

  it("las tres velocidades resuelven clases distintas", () => {
    const seen = new Set<string>();
    for (const speed of ["slow", "base", "fast"] as const) {
      const view = render(<AnimatedGradient speed={speed} data-testid="ag" />);
      const layer = screen.getByTestId("ag").querySelector("span[aria-hidden='true']");
      seen.add(layer?.className ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(3);
  });

  it("no escribe duraciones ni transformadas en el estilo inline", () => {
    render(<AnimatedGradient data-testid="ag" />);
    const node = screen.getByTestId("ag");
    const layer = node.querySelector("span[aria-hidden='true']");
    expect(layer?.getAttribute("style")).toBeNull();
    expect(node.getAttribute("style") ?? "").not.toMatch(/animation|transform/);
  });

  it("interpone el velo cuando se pide scrim", () => {
    render(<AnimatedGradient scrim={0.5} data-testid="ag" />);
    expect(screen.getByTestId("ag").querySelectorAll("span[aria-hidden='true']")).toHaveLength(2);
  });

  it("resuelve un gradiente distinto por tema", () => {
    const seen = new Set<string>();
    for (const theme of ["light", "dark", "sober-light", "playful"] as const) {
      const view = RenderIn(<AnimatedGradient data-testid="ag" />, theme);
      seen.add(screen.getByTestId("ag").getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(4);
  });
});
