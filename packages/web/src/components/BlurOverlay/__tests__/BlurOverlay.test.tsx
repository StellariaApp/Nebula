import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { GlassOff } from "../../../__tests__/theme-tweaks.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import type { OfficialThemeName } from "../../../theme/themes.css.js";
import { BlurOverlay } from "../BlurOverlay.js";

afterEach(cleanup);

function RenderIn(ui: ReactNode, theme: OfficialThemeName | NebulaTheme) {
  return render(
    <NebulaProvider defaultTheme={theme} storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

describe("BlurOverlay", () => {
  it("es decorativo cuando no lleva contenido", () => {
    render(<BlurOverlay data-testid="bo" />);
    expect(screen.getByTestId("bo").getAttribute("aria-hidden")).toBe("true");
  });

  it("deja de ser decorativo y centra cuando lleva contenido", () => {
    render(<BlurOverlay data-testid="bo">Desbloquear</BlurOverlay>);
    const node = screen.getByTestId("bo");
    expect(node.getAttribute("aria-hidden")).toBeNull();
    expect(node.getAttribute("data-center")).toBe("true");
    expect(screen.getByText("Desbloquear")).toBeDefined();
  });

  it("aplica el blur del tema por token y no un valor libre", () => {
    render(<BlurOverlay blur="lg" data-testid="bo" />);
    const style = screen.getByTestId("bo").getAttribute("style") ?? "";
    expect(style).toMatch(/--blur-lg/);
    expect(style).not.toMatch(/blur\(\d/);
  });

  it("renderiza siempre el velo, con o sin contenido", () => {
    render(<BlurOverlay data-testid="bo" />);
    expect(screen.getByTestId("bo").querySelectorAll("span[aria-hidden='true']")).toHaveLength(1);
  });

  it("cierra el velo con blur=none en vez de quedarse translúcido", () => {
    render(<BlurOverlay blur="none" opacity={0.3} data-testid="bo" />);
    const node = screen.getByTestId("bo");
    expect(node.getAttribute("data-blur")).toBe("off");
    expect(node.getAttribute("style") ?? "").toMatch(/0\.94/);
  });

  it("degrada a scrim opaco con effects.glass.enabled=false", () => {
    RenderIn(<BlurOverlay data-testid="bo" />, GlassOff());
    const node = screen.getByTestId("bo");
    expect(node.getAttribute("data-blur")).toBe("off");
    expect(node.getAttribute("style") ?? "").toMatch(/0\.94/);
  });

  it("conserva el blur en los temas con glass activo", () => {
    for (const theme of ["light", "dark"] as const) {
      const view = RenderIn(<BlurOverlay data-testid="bo" />, theme);
      expect(screen.getByTestId("bo").getAttribute("data-blur")).toBe("md");
      view.unmount();
    }
  });

  it("acepta fixed, radius y zIndex", () => {
    render(<BlurOverlay fixed radius="lg" zIndex={40} data-testid="bo" />);
    const node = screen.getByTestId("bo");
    expect(node.getAttribute("data-fixed")).toBe("true");
    expect(node.getAttribute("style") ?? "").toMatch(/z-index:\s*40/);
  });

  it("no hornea los tokens como valores literales", () => {
    render(<BlurOverlay data-testid="bo" />);
    const style = screen.getByTestId("bo").getAttribute("style") ?? "";
    expect(style).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});
