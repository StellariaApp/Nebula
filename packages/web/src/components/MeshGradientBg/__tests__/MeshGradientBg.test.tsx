import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import type { NebulaTheme, ColorScheme as OfficialThemeName } from "@stellaria/nebula-tokens";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { BrandGradient, GlassOff } from "../../../__tests__/theme-tweaks.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { MeshGradientBg } from "../MeshGradientBg.js";

afterEach(cleanup);

function RenderIn(ui: ReactNode, theme: OfficialThemeName | NebulaTheme) {
  return render(
    <NebulaProvider defaultTheme={theme} storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

function CountRadials(style: string): number {
  return style.split("radial-gradient(").length - 1;
}

describe("MeshGradientBg", () => {
  it("renderiza un div y conserva el contenido", () => {
    render(<MeshGradientBg>Portada</MeshGradientBg>);
    expect(screen.getByText("Portada").tagName).toBe("DIV");
  });

  it("compone la malla con cinco capas radiales", () => {
    render(<MeshGradientBg data-testid="mg" />);
    const style = screen.getByTestId("mg").getAttribute("style") ?? "";
    expect(CountRadials(style)).toBe(5);
  });

  it("mantiene las cinco capas con un token de tres stops", () => {
    RenderIn(
      <MeshGradientBg data-testid="mg" />,
      BrandGradient([
        { color: "#101010", position: 0 },
        { color: "#808080", position: 50 },
        { color: "#f0f0f0", position: 100 },
      ]),
    );
    const style = screen.getByTestId("mg").getAttribute("style") ?? "";
    expect(CountRadials(style)).toBe(5);
  });

  it("acepta los tres roles del contrato", () => {
    const seen = new Set<string>();
    for (const role of ["brand", "accent", "surface"] as const) {
      const view = render(<MeshGradientBg gradient={role} data-testid="mg" />);
      seen.add(screen.getByTestId("mg").getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(3);
  });

  it("grain cubre GrainyGradient y responde a glass.enabled", () => {
    render(<MeshGradientBg grain data-testid="mg" />);
    const node = screen.getByTestId("mg");
    expect(node.getAttribute("data-grain")).toBe("on");
    expect(node.querySelectorAll("span[aria-hidden='true']")).toHaveLength(1);
  });

  it("glass apagado quita el grano pero conserva la malla", () => {
    RenderIn(<MeshGradientBg grain data-testid="mg" />, GlassOff());
    const node = screen.getByTestId("mg");
    expect(node.getAttribute("data-grain")).toBe("off");
    expect(node.querySelectorAll("span[aria-hidden='true']")).toHaveLength(0);
    expect(CountRadials(node.getAttribute("style") ?? "")).toBe(5);
  });

  it("interpone el velo cuando se pide scrim", () => {
    render(<MeshGradientBg scrim={0.3} data-testid="mg" />);
    expect(screen.getByTestId("mg").querySelectorAll("span[aria-hidden='true']")).toHaveLength(1);
  });

  it("el eje de marca no cambia de esquema, pero sí con los tokens del tema", () => {
    const seen = new Set<string>();
    for (const theme of ["light", "dark"] as const) {
      const view = RenderIn(<MeshGradientBg data-testid="mg" />, theme);
      seen.add(screen.getByTestId("mg").getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(1);

    const view = RenderIn(
      <MeshGradientBg data-testid="mg" />,
      BrandGradient([
        { color: "#101010", position: 0 },
        { color: "#f0f0f0", position: 100 },
      ]),
    );
    seen.add(screen.getByTestId("mg").getAttribute("style") ?? "");
    view.unmount();
    // Desde ADR-171 la malla se compone con las referencias que el tema publica —edge y tip—, asi
    // que el style es el MISMO en todos los temas y quien lo resuelve es la clase. La composicion
    // de los cinco radiales sigue siendo del componente; del tema solo vienen sus dos colores.
    expect(seen.size).toBe(1);
  });

  it("es determinista: el mismo tema produce la misma malla", () => {
    const first = render(<MeshGradientBg data-testid="mg" />);
    const a = screen.getByTestId("mg").getAttribute("style") ?? "";
    first.unmount();
    render(<MeshGradientBg data-testid="mg" />);
    expect(screen.getByTestId("mg").getAttribute("style") ?? "").toBe(a);
  });
});
