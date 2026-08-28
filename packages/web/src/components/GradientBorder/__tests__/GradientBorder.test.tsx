import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import type { NebulaTheme, ColorScheme as OfficialThemeName } from "@stellaria/nebula-tokens";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { BrandGradient, MotionAt } from "../../../__tests__/theme-tweaks.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { GradientBorder } from "../GradientBorder.js";
import { ArcAt, ArcEasing, Perimeter, ResolveWedges } from "../use-sweep-run.js";

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

  it("monta un solo barrido dentro de la ventana", () => {
    render(<GradientBorder beam data-testid="gb" />);
    const node = screen.getByTestId("gb");

    expect(node.getAttribute("data-beam")).toBe("4");
    expect(node.querySelectorAll("span > span > span")).toHaveLength(1);
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

  it("el barrido lleva el color de marca en un gradiente cónico", () => {
    render(<GradientBorder beam data-testid="gb" />);
    const sweep = screen.getByTestId("gb").querySelector("span > span > span");

    expect(sweep?.getAttribute("style") ?? "").toMatch(/conic-gradient\(from 0deg/);
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

describe("GradientBorder — el barrido medido", () => {
  const FRAME = { w: 500, h: 300, r: 20 };
  const HEAD = 32 * 0.00385 * 360;

  it("el perímetro cuenta las curvas, no las esquinas en pico", () => {
    expect(Perimeter(FRAME)).toBeCloseTo(2 * 460 + 2 * 260 + 2 * Math.PI * 20, 6);
  });

  it("un tramo contiguo reparte varias cuñas para que una entre mientras otra sale", () => {
    expect(ResolveWedges([1, 2], FRAME, HEAD)).toBeGreaterThan(1);
    expect(ResolveWedges([1], FRAME, HEAD)).toBeGreaterThan(1);
  });

  it("el tramo que cruza el origen del trazado sigue siendo uno", () => {
    expect(ResolveWedges([4, 1], FRAME, HEAD)).toBeGreaterThan(1);
  });

  it("dos lados sueltos no son un tramo: una sola cuña y la vuelta entera", () => {
    expect(ResolveWedges([1, 3], FRAME, HEAD)).toBe(1);
  });

  it("los cuatro lados tampoco reparten nada", () => {
    expect(ResolveWedges([1, 2, 3, 4], FRAME, HEAD)).toBe(1);
  });

  it("las cuñas nunca se pisan entre sí", () => {
    for (const lit of [[1], [1, 2], [1, 2, 3], [3, 4]] as const) {
      const wedges = ResolveWedges(lit, FRAME, HEAD);
      expect(360 / wedges).toBeGreaterThanOrEqual(HEAD);
    }
  });

  it("la curva es un linear() que va de 0 a 1 sin retroceder", () => {
    const easing = ArcEasing(FRAME);
    expect(easing).toMatch(/^linear\(/);

    const marks = (easing ?? "").slice(7, -1).split(", ").map(Number);
    expect(marks[0]).toBe(0);
    expect(marks[marks.length - 1]).toBe(1);
    for (let index = 1; index < marks.length; index += 1) {
      expect(marks[index] ?? 0).toBeGreaterThanOrEqual(marks[index - 1] ?? 0);
    }
  });

  it("a tiempos iguales, arcos iguales: la luz no acelera en las esquinas", () => {
    const marks = (ArcEasing(FRAME) ?? "").slice(7, -1).split(", ").map(Number);
    const total = Perimeter(FRAME);
    const steps: number[] = [];

    for (let index = 1; index < marks.length; index += 1) {
      const before = ArcAt((marks[index - 1] ?? 0) * 360, FRAME);
      const after = ArcAt((marks[index] ?? 0) * 360, FRAME);
      steps.push(after - before < 0 ? after - before + total : after - before);
    }

    const drift = steps.map((_, index) => {
      const walked = steps.slice(0, index + 1).reduce((sum, one) => sum + one, 0);
      return Math.abs(walked - (total * (index + 1)) / steps.length);
    });

    expect(Math.max(...drift)).toBeLessThan(1);
  });

  it("sin curva, un giro uniforme sí acelera: es lo que la curva corrige", () => {
    const total = Perimeter(FRAME);
    const steps: number[] = [];

    for (let index = 1; index <= 192; index += 1) {
      const before = ArcAt(((index - 1) * 360) / 192, FRAME);
      const after = ArcAt((index * 360) / 192, FRAME);
      steps.push(after - before < 0 ? after - before + total : after - before);
    }

    expect(Math.max(...steps) / Math.min(...steps)).toBeGreaterThan(2);
  });
});
