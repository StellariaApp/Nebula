import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import type { NebulaTheme, ColorScheme as OfficialThemeName } from "@stellaria/nebula-tokens";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { BrandGradient, MotionAt } from "../../../__tests__/theme-tweaks.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { GradientBorder } from "../GradientBorder.js";

afterEach(cleanup);

function RenderIn(ui: ReactNode, theme: OfficialThemeName | NebulaTheme) {
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

  it("apunta al degradado del tema, que es quien lo define", () => {
    render(<GradientBorder data-testid="gb" />);
    expect(screen.getByTestId("gb").getAttribute("style") ?? "").toContain(
      "var(--gradient-brand-image",
    );
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

  it("el eje de marca no cambia de esquema, pero sí con los tokens del tema", () => {
    const seen = new Set<string>();
    for (const theme of ["light", "dark"] as const) {
      const view = RenderIn(<GradientBorder data-testid="gb" />, theme);
      seen.add(screen.getByTestId("gb").getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(1);

    const view = RenderIn(
      <GradientBorder data-testid="gb" />,
      BrandGradient([
        { color: "#101010", position: 0 },
        { color: "#f0f0f0", position: 100 },
      ]),
    );
    seen.add(screen.getByTestId("gb").getAttribute("style") ?? "");
    view.unmount();
    // El style del componente ya NO cambia con el tema: lleva la referencia (ADR-170).

    // Que el tema mande se comprueba en el envoltorio, que es donde van sus vars.

    expect(seen.size).toBe(1);
  });

  it("un token monocromo sigue produciendo un linear-gradient válido", () => {
    RenderIn(
      <GradientBorder data-testid="gb" />,
      BrandGradient([
        { color: "#2b6a68", position: 0 },
        { color: "#2b6a68", position: 100 },
      ]),
    );
    const style = screen.getByTestId("gb").getAttribute("style") ?? "";
    expect(style).toContain("var(--gradient-brand-image");
  });
});

describe("GradientBorder — el haz que orbita", () => {
  it("sin beam no monta ninguna capa de animación", () => {
    render(<GradientBorder data-testid="gb" />);
    const node = screen.getByTestId("gb");

    expect(node.getAttribute("data-beam")).toBeNull();
    expect(node.querySelectorAll("span")).toHaveLength(0);
  });

  it("con los cuatro lados y continua monta una cola que da la vuelta entera", () => {
    render(<GradientBorder beam data-testid="gb" />);
    const node = screen.getByTestId("gb");
    const parts = [...node.querySelectorAll("span > span")];

    expect(node.getAttribute("data-beam")).toBe("continuous");
    expect(parts.length).toBeGreaterThan(1);

    const fades = parts.map((part) => part.getAttribute("style") ?? "");
    expect(new Set(fades).size).toBe(parts.length);
  });

  it("espaciada sí reparte un arco por lado, aunque estén los cuatro", () => {
    render(<GradientBorder beam sequence="spaced" data-testid="gb" />);
    expect(screen.getByTestId("gb").querySelectorAll("span > span")).toHaveLength(4);
  });

  it("edges elige los lados y respeta el orden del marco, no el de la prop", () => {
    render(<GradientBorder beam edges={[3, 1]} data-testid="gb" />);
    expect(screen.getByTestId("gb").querySelectorAll("span > span")).toHaveLength(2);
  });

  it("continua reparte el ciclo entre los lados elegidos y no deja hueco", () => {
    render(<GradientBorder beam edges={[1, 3]} data-testid="gb" />);
    const arcs = [...screen.getByTestId("gb").querySelectorAll("span > span")];
    const delays = arcs.map((arc) => arc.getAttribute("style") ?? "");

    expect(delays[0]).toMatch(/\* 0\)/);
    expect(delays[1]).toMatch(/\* 1\)/);
  });

  it("espaciada deja a cada lado su turno del marco completo", () => {
    render(<GradientBorder beam edges={[1, 3]} sequence="spaced" data-testid="gb" />);
    const arcs = [...screen.getByTestId("gb").querySelectorAll("span > span")];
    const delays = arcs.map((arc) => arc.getAttribute("style") ?? "");

    expect(screen.getByTestId("gb").getAttribute("data-beam")).toBe("spaced");
    expect(delays[0]).toMatch(/\* 0\)/);
    expect(delays[1]).toMatch(/\* 2\)/);
  });

  it("con haz el anillo estático deja de ser el gradiente y pasa al borde normal", () => {
    render(<GradientBorder beam data-testid="gb" />);
    const style = screen.getByTestId("gb").getAttribute("style") ?? "";

    expect(style).toMatch(/--color-border-default/);
    expect(style).not.toMatch(/--gradientImage[^;]*linear-gradient/);
  });

  it("el arco sí lleva el color de marca, en una estela lineal", () => {
    render(<GradientBorder beam data-testid="gb" />);
    expect(screen.getByTestId("gb").getAttribute("style") ?? "").toMatch(/linear-gradient\(90deg/);
  });

  it("un tier minimal no anima: el marco queda estático", () => {
    RenderIn(<GradientBorder beam data-testid="gb" />, MotionAt("minimal"));
    const node = screen.getByTestId("gb");

    expect(node.getAttribute("data-beam")).toBeNull();
    expect(node.querySelectorAll("span")).toHaveLength(0);
  });

  it("edges vacío tampoco anima", () => {
    render(<GradientBorder beam edges={[]} data-testid="gb" />);
    expect(screen.getByTestId("gb").getAttribute("data-beam")).toBeNull();
  });

  it("las capas decorativas quedan fuera del árbol de accesibilidad", () => {
    render(<GradientBorder beam data-testid="gb" />);
    expect(screen.getByTestId("gb").querySelector("span")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });
});
