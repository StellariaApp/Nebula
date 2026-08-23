import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import type { NebulaTheme, ColorScheme as OfficialThemeName } from "@stellaria/nebula-tokens";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { BrandGradient, MotionAt } from "../../../__tests__/theme-tweaks.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { GradientBorder } from "../GradientBorder.js";
import { ResolveBeamRun } from "../use-beam-run.js";

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

  it("monta la cola por piezas dentro de la ventana", () => {
    render(<GradientBorder beam data-testid="gb" />);
    const node = screen.getByTestId("gb");
    const pieces = [...node.querySelectorAll("span > span > span")];

    expect(node.getAttribute("data-beam")).toBe("4");
    expect(pieces.length).toBeGreaterThan(1);

    const fades = pieces.map((piece) => piece.getAttribute("style") ?? "");
    expect(new Set(fades).size).toBe(pieces.length);
  });

  it("la cola es la misma se enciendan los lados que se enciendan", () => {
    const seen = new Set<number>();
    for (const edges of [[1], [1, 3], [1, 2, 3, 4]] as const) {
      const view = render(<GradientBorder beam edges={edges} data-testid="gb" />);
      seen.add(screen.getByTestId("gb").querySelectorAll("span > span > span").length);
      view.unmount();
    }
    expect(seen.size).toBe(1);
  });

  it("edges es una ventana: una franja de máscara por lado encendido", () => {
    render(<GradientBorder beam edges={[1, 3]} data-testid="gb" />);
    const window_box = screen.getByTestId("gb").querySelector("span > span");
    const style = window_box?.getAttribute("style") ?? "";

    expect(style).toMatch(/--beamWindow/);
    expect(style.match(/linear-gradient/g) ?? []).toHaveLength(2);
  });

  it("dos lados contiguos añaden el parche que tapa la entrega en la esquina", () => {
    render(<GradientBorder beam edges={[1, 2]} data-testid="gb" />);
    const style =
      screen.getByTestId("gb").querySelector("span > span")?.getAttribute("style") ?? "";

    expect(style.match(/linear-gradient/g) ?? []).toHaveLength(3);
  });

  it("con los cuatro no hay ventana que recortar y no se escribe ninguna", () => {
    render(<GradientBorder beam data-testid="gb" />);
    const style =
      screen.getByTestId("gb").querySelector("span > span")?.getAttribute("style") ?? "";

    expect(style).not.toMatch(/--beamWindow/);
  });

  it("el orden lo marca el marco, no el de la prop", () => {
    const seen = new Set<string>();
    for (const edges of [[1, 3], [3, 1]] as const) {
      const view = render(<GradientBorder beam edges={edges} data-testid="gb" />);
      seen.add(screen.getByTestId("gb").querySelector("span > span")?.getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(1);
  });

  it("la vuelta dura lo mismo con un lado que con cuatro: la velocidad no cambia", () => {
    const seen = new Set<string>();
    for (const edges of [[1], [1, 2], [1, 2, 3, 4]] as const) {
      const view = render(<GradientBorder beam edges={edges} data-testid="gb" />);
      const style = screen.getByTestId("gb").getAttribute("style") ?? "";
      seen.add(/--beamCycle[^:]*:([^;]+)/.exec(style)?.[1]?.trim() ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(1);
  });

  it("con haz el anillo estático deja de ser el gradiente y pasa al borde normal", () => {
    render(<GradientBorder beam data-testid="gb" />);
    const style = screen.getByTestId("gb").getAttribute("style") ?? "";

    expect(style).toMatch(/--color-border-default/);
    expect(style).not.toMatch(/--gradientImage[^;]*linear-gradient/);
  });

  it("las piezas sí llevan el color de marca, mezclado a lo largo de la cola", () => {
    render(<GradientBorder beam data-testid="gb" />);
    const pieces = [...screen.getByTestId("gb").querySelectorAll("span > span > span")];

    expect(pieces[0]?.getAttribute("style") ?? "").toMatch(/color-mix\(in srgb/);
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
    expect(screen.getByTestId("gb").querySelector("span")?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("GradientBorder — el tramo medido", () => {
  const FRAME = { w: 500, h: 300, r: 20 };
  const TOTAL = 2 * (500 - 40) + 2 * (300 - 40) + 2 * Math.PI * 20;
  const Span = (run: { from: string; to: string } | null) =>
    run === null ? null : Number.parseFloat(run.to) - Number.parseFloat(run.from);

  it("un tramo contiguo acorta el ciclo en su misma proporción", () => {
    const run = ResolveBeamRun([1, 2], FRAME, 0.00385, 32);

    expect(run).not.toBeNull();
    expect(run?.beats).toBeCloseTo((Span(run) ?? 0) / 100, 5);
    expect(run?.beats).toBeGreaterThan(0);
    expect(run?.beats).toBeLessThan(1);
  });

  it("dos lados sueltos no son un tramo: se queda la vuelta entera", () => {
    expect(ResolveBeamRun([1, 3], FRAME, 0.00385, 32)).toBeNull();
  });

  it("los cuatro lados tampoco recortan nada", () => {
    expect(ResolveBeamRun([1, 2, 3, 4], FRAME, 0.00385, 32)).toBeNull();
  });

  it("el tramo que cruza el origen del trazado sigue siendo uno", () => {
    const run = ResolveBeamRun([4, 1], FRAME, 0.00385, 32);

    expect(run).not.toBeNull();
    expect(Number.parseFloat(run?.to ?? "0")).toBeGreaterThan(100);
    expect(run?.beats).toBeLessThan(1);
  });

  it("la boca cae a mitad de curva, no al final del lado", () => {
    const run = ResolveBeamRun([1], FRAME, 0.00385, 32);
    const arc = (Math.PI / 2) * 20;
    const top = 500 - 40 + arc;

    expect(Number.parseFloat(run?.to ?? "0")).toBeCloseTo(((top - arc / 2 + 13) / TOTAL) * 100, 1);
  });

  it("la cola conserva su longitud aunque el recorrido se acorte", () => {
    const run = ResolveBeamRun([1, 2], FRAME, 0.00385, 32);

    expect(run?.gap).toBeCloseTo(0.00385 / (run?.beats ?? 1), 6);
  });

  it("la velocidad no depende de cuánto se encienda: el ciclo sigue al recorrido", () => {
    for (const lit of [[1], [1, 2], [1, 2, 3], [3, 4]] as const) {
      const run = ResolveBeamRun(lit, FRAME, 0.00385, 32);
      expect(run?.beats).toBeCloseTo((Span(run) ?? 0) / 100, 5);
    }
  });
});
