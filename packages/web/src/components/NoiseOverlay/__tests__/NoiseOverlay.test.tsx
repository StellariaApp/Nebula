import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { GlassOff, NoiseAt } from "../../../__tests__/theme-tweaks.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import type { OfficialThemeName } from "../../../theme/themes.css.js";
import { NoiseOverlay } from "../NoiseOverlay.js";

afterEach(cleanup);

function RenderIn(ui: ReactNode, theme: OfficialThemeName | NebulaTheme) {
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

  it("el grano lo fija el tema, sin cambiar props", () => {
    RenderIn(<NoiseOverlay data-testid="no" />, NoiseAt(0.03));
    expect(screen.getByTestId("no").getAttribute("style") ?? "").toMatch(/0\.03/);
  });

  it("acepta un override explícito de opacidad", () => {
    render(<NoiseOverlay opacity={0.08} data-testid="no" />);
    expect(screen.getByTestId("no").getAttribute("style") ?? "").toMatch(/0\.08/);
  });

  it("anula el override cuando el tema apaga glass", () => {
    RenderIn(<NoiseOverlay opacity={0.08} data-testid="no" />, GlassOff());
    const node = screen.getByTestId("no");
    expect(node.getAttribute("data-noise")).toBe("off");
    expect(node.getAttribute("style") ?? "").not.toMatch(/0\.08/);
  });

  it("acepta r, fixed y zIndex", () => {
    render(<NoiseOverlay r="xl" fixed zIndex={3} data-testid="no" />);
    const node = screen.getByTestId("no");
    expect(node.className).not.toBe("");
    expect(node.getAttribute("style") ?? "").toMatch(/z-index:\s*3/);
  });
});
