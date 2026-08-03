import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { GradientBackground } from "../GradientBackground.js";

afterEach(cleanup);

type ThemeName = "light" | "dark" | "sober-light" | "playful";

function RenderIn(ui: ReactNode, theme: ThemeName) {
  return render(
    <NebulaProvider defaultTheme={theme} storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

describe("GradientBackground", () => {
  it("renderiza un div y conserva el contenido", () => {
    render(<GradientBackground>Hero</GradientBackground>);
    expect(screen.getByText("Hero").tagName).toBe("DIV");
  });

  it("es polimórfico", () => {
    render(
      <GradientBackground component="header" data-testid="gbg">
        X
      </GradientBackground>,
    );
    expect(screen.getByTestId("gbg").tagName).toBe("HEADER");
  });

  it("resuelve el gradiente del tema en una var local", () => {
    render(<GradientBackground data-testid="gbg" />);
    expect(screen.getByTestId("gbg").getAttribute("style") ?? "").toMatch(/linear-gradient\(/);
  });

  it("no pinta scrim por defecto", () => {
    render(<GradientBackground data-testid="gbg" />);
    const node = screen.getByTestId("gbg");
    expect(node.getAttribute("data-scrim")).toBeNull();
    expect(node.querySelectorAll("span[aria-hidden='true']")).toHaveLength(0);
  });

  it("interpone el velo cuando se pide scrim", () => {
    render(<GradientBackground scrim={0.4} data-testid="gbg" />);
    const node = screen.getByTestId("gbg");
    expect(node.getAttribute("data-scrim")).toBe("0.4");
    expect(node.querySelectorAll("span[aria-hidden='true']")).toHaveLength(1);
  });

  it("el grano responde a glass.enabled, el gradiente no", () => {
    RenderIn(<GradientBackground grain data-testid="gbg" />, "sober-light");
    const node = screen.getByTestId("gbg");
    expect(node.querySelectorAll("span[aria-hidden='true']")).toHaveLength(0);
    expect(node.getAttribute("style") ?? "").toMatch(/linear-gradient\(/);
  });

  it("pinta el grano en los temas con glass activo", () => {
    render(<GradientBackground grain data-testid="gbg" />);
    expect(screen.getByTestId("gbg").querySelectorAll("span[aria-hidden='true']")).toHaveLength(1);
  });

  it("el eje de marca no cambia de esquema; sober y playful si lo cambian", () => {
    const seen = new Set<string>();
    for (const theme of ["light", "dark", "sober-light", "playful"] as const) {
      const view = RenderIn(<GradientBackground data-testid="gbg" />, theme);
      seen.add(screen.getByTestId("gbg").getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(3);
  });

  it("acepta un gradiente propio y style props", () => {
    render(
      <GradientBackground
        gradient={{ from: "primary.500", to: "accent.400" }}
        p="xl"
        data-testid="gbg"
      />,
    );
    const node = screen.getByTestId("gbg");
    expect(node.getAttribute("style") ?? "").toMatch(/--color-primary-500/);
    expect(node.className).not.toBe("");
  });
});
