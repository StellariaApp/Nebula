import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import type { NebulaTheme, ColorScheme as OfficialThemeName } from "@stellaria/nebula-tokens";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { BrandGradient, MotionAt } from "../../../__tests__/theme-tweaks.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { AnimatedGradient } from "../AnimatedGradient.js";

afterEach(cleanup);

function RenderIn(ui: ReactNode, theme: OfficialThemeName | NebulaTheme) {
  return render(
    <NebulaProvider defaultTheme={theme} storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

function DriftIn(node: HTMLElement) {
  return node.querySelector("span[aria-hidden='true'] > span");
}

describe("AnimatedGradient", () => {
  it("renderiza un div y conserva el contenido", () => {
    render(<AnimatedGradient>Ambiente</AnimatedGradient>);
    expect(screen.getByText("Ambiente").tagName).toBe("DIV");
  });

  it("monta la capa que deriva, marcada como decorativa", () => {
    render(<AnimatedGradient data-testid="ag" />);
    const node = screen.getByTestId("ag");
    expect(node.querySelectorAll("span[aria-hidden='true']")).toHaveLength(1);
    expect(DriftIn(node)).not.toBeNull();
  });

  it("anima cuando el tier del tema lo permite", () => {
    render(<AnimatedGradient data-testid="ag" />);
    expect(screen.getByTestId("ag").getAttribute("data-animated")).toBe("true");
  });

  it("se detiene con motion.tier minimal", () => {
    RenderIn(<AnimatedGradient data-testid="ag" />, MotionAt("minimal"));
    const node = screen.getByTestId("ag");
    expect(node.getAttribute("data-animated")).toBe("false");
    expect(DriftIn(node)?.getAttribute("data-animated")).toBe("false");
  });

  it("las tres velocidades resuelven clases distintas", () => {
    const seen = new Set<string>();
    for (const speed of ["slow", "base", "fast"] as const) {
      const view = render(<AnimatedGradient speed={speed} data-testid="ag" />);
      seen.add(DriftIn(screen.getByTestId("ag"))?.className ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(3);
  });

  it("no escribe duraciones ni transformadas en el estilo inline", () => {
    render(<AnimatedGradient data-testid="ag" />);
    const node = screen.getByTestId("ag");
    expect(DriftIn(node)?.getAttribute("style")).toBeNull();
    expect(node.getAttribute("style") ?? "").not.toMatch(/animation|transform/);
  });

  it("interpone el velo cuando se pide scrim", () => {
    render(<AnimatedGradient scrim={0.5} data-testid="ag" />);
    expect(screen.getByTestId("ag").querySelectorAll("span[aria-hidden='true']")).toHaveLength(2);
  });

  it("el eje de marca no cambia de esquema, pero sí con los tokens del tema", () => {
    const seen = new Set<string>();
    for (const theme of ["light", "dark"] as const) {
      const view = RenderIn(<AnimatedGradient data-testid="ag" />, theme);
      seen.add(screen.getByTestId("ag").getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(1);

    const view = RenderIn(
      <AnimatedGradient data-testid="ag" />,
      BrandGradient([
        { color: "#101010", position: 0 },
        { color: "#f0f0f0", position: 100 },
      ]),
    );
    seen.add(screen.getByTestId("ag").getAttribute("style") ?? "");
    view.unmount();
    expect(seen.size).toBe(2);
  });
});
