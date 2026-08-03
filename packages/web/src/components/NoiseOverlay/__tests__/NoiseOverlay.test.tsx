import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { NoiseOverlay } from "../NoiseOverlay.js";

afterEach(cleanup);

type ThemeName = "light" | "dark" | "sober-light" | "playful";

function RenderIn(ui: ReactNode, theme: ThemeName) {
  return render(
    <NebulaProvider defaultTheme={theme} storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

describe("NoiseOverlay", () => {
  it("es siempre decorativo", () => {
    render(<NoiseOverlay data-testid="no" />);
    expect(screen.getByTestId("no").getAttribute("aria-hidden")).toBe("true");
  });

  it("toma la opacidad del tema cuando no se pasa la prop", () => {
    render(<NoiseOverlay data-testid="no" />);
    const node = screen.getByTestId("no");
    expect(node.getAttribute("style") ?? "").toMatch(/0\.02/);
    expect(node.getAttribute("data-noise")).toBe("on");
  });

  it("playful sube el grano por tema, sin cambiar props", () => {
    RenderIn(<NoiseOverlay data-testid="no" />, "playful");
    expect(screen.getByTestId("no").getAttribute("style") ?? "").toMatch(/0\.03/);
  });

  it("acepta un override explícito de opacidad", () => {
    render(<NoiseOverlay opacity={0.08} data-testid="no" />);
    expect(screen.getByTestId("no").getAttribute("style") ?? "").toMatch(/0\.08/);
  });

  it("anula el override cuando el tema apaga glass (sober)", () => {
    RenderIn(<NoiseOverlay opacity={0.08} data-testid="no" />, "sober-light");
    const node = screen.getByTestId("no");
    expect(node.getAttribute("data-noise")).toBe("off");
    expect(node.getAttribute("style") ?? "").not.toMatch(/0\.08/);
  });

  it("acepta radius, fixed y zIndex", () => {
    render(<NoiseOverlay radius="xl" fixed zIndex={3} data-testid="no" />);
    const node = screen.getByTestId("no");
    expect(node.className).not.toBe("");
    expect(node.getAttribute("style") ?? "").toMatch(/z-index:\s*3/);
  });
});
