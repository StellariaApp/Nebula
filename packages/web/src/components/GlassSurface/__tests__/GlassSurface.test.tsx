import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { GlassSurface } from "../GlassSurface.js";

afterEach(cleanup);

type ThemeName = "nebula-light" | "nebula-dark" | "sober-light" | "playful";

function RenderIn(ui: ReactNode, theme: ThemeName) {
  return render(
    <NebulaProvider defaultTheme={theme} storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

describe("GlassSurface", () => {
  it("renderiza un div por defecto y conserva el contenido", () => {
    render(<GlassSurface>Panel</GlassSurface>);
    const node = screen.getByText("Panel");
    expect(node.tagName).toBe("DIV");
  });

  it("es polimórfico", () => {
    render(
      <GlassSurface component="section" data-testid="gs">
        Resumen
      </GlassSurface>,
    );
    expect(screen.getByTestId("gs").tagName).toBe("SECTION");
  });

  it("resuelve los tres niveles de glass en vars distintas", () => {
    const seen = new Set<string>();
    for (const level of ["subtle", "default", "strong"] as const) {
      const view = render(<GlassSurface level={level} data-testid="gs" />);
      seen.add(screen.getByTestId("gs").getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(3);
  });

  it("marca data-glass=on cuando el tema tiene glass habilitado", () => {
    render(<GlassSurface data-testid="gs" />);
    expect(screen.getByTestId("gs").getAttribute("data-glass")).toBe("on");
  });

  it("degrada a superficie sólida con effects.glass.enabled=false (sober)", () => {
    RenderIn(<GlassSurface data-testid="gs" />, "sober-light");
    const node = screen.getByTestId("gs");
    const style = node.getAttribute("style") ?? "";
    expect(node.getAttribute("data-glass")).toBe("off");
    expect(style).toMatch(/--color-surface-overlay/);
    expect(style).not.toMatch(/blur\(/);
    expect(style).not.toMatch(/--glass-/);
  });

  it("respeta fallbackSurface al degradar", () => {
    RenderIn(<GlassSurface fallbackSurface="raised" data-testid="gs" />, "sober-light");
    expect(screen.getByTestId("gs").getAttribute("style") ?? "").toMatch(/--color-surface-raised/);
  });

  it("no pinta la capa de grano cuando el tema apaga glass", () => {
    RenderIn(
      <GlassSurface noise data-testid="gs">
        <span>hijo</span>
      </GlassSurface>,
      "sober-light",
    );
    expect(screen.getByTestId("gs").querySelectorAll("span[aria-hidden='true']")).toHaveLength(0);
  });

  it("pinta la capa de grano cuando glass está activo", () => {
    render(<GlassSurface noise data-testid="gs" />);
    expect(screen.getByTestId("gs").querySelectorAll("span[aria-hidden='true']")).toHaveLength(1);
  });

  it("resuelve vars distintas por tema", () => {
    const seen = new Set<string>();
    for (const theme of ["nebula-light", "nebula-dark", "sober-light", "playful"] as const) {
      const view = RenderIn(<GlassSurface data-testid="gs" />, theme);
      seen.add(screen.getByTestId("gs").getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it("no hornea los tokens como valores literales en el estilo inline", () => {
    render(<GlassSurface data-testid="gs" />);
    const style = screen.getByTestId("gs").getAttribute("style") ?? "";
    expect(style).not.toMatch(/rgba?\(/);
    expect(style).not.toMatch(/#[0-9a-f]{3,8}/i);
  });

  it("acepta style props y las compone con las vars", () => {
    render(<GlassSurface p="lg" maw={480} data-testid="gs" />);
    const node = screen.getByTestId("gs");
    expect(node.className).not.toBe("");
    expect(node.getAttribute("style") ?? "").toMatch(/max-width/);
  });
});
