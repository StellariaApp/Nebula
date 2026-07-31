import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Points, SparkLine } from "../SparkLine.js";
import { Direction, TrendIndicator } from "../TrendIndicator.js";

afterEach(cleanup);

describe("Points", () => {
  it("una serie vacía no dibuja nada", () => {
    expect(Points([], 100, 20, 2)).toBe("");
  });

  it("un solo punto se dibuja como línea horizontal centrada", () => {
    expect(Points([5], 100, 20, 2)).toBe("2,10 98,10");
  });

  it("reparte en x y invierte el eje y", () => {
    const points = Points([0, 10], 100, 20, 0).split(" ");
    expect(points).toHaveLength(2);
    expect(points[0]).toBe("0.00,20.00");
    expect(points[1]).toBe("100.00,0.00");
  });

  it("una serie plana no divide por cero", () => {
    const points = Points([7, 7, 7], 90, 30, 0);
    expect(points).not.toContain("NaN");
  });
});

describe("SparkLine", () => {
  it("sin label es decorativa", () => {
    const { container } = render(<SparkLine data={[1, 4, 2]} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("con label se anuncia como imagen nombrada", () => {
    render(<SparkLine data={[1, 4, 2]} label="Ventas de la semana" />);
    expect(screen.getByRole("img", { name: "Ventas de la semana" })).toBeDefined();
  });

  it("withArea añade el polígono además de la línea", () => {
    const { container } = render(<SparkLine data={[1, 4, 2]} withArea />);
    expect(container.querySelector("polygon")).not.toBeNull();
    expect(container.querySelector("polyline")).not.toBeNull();
  });
});

describe("Direction", () => {
  it("deriva el sentido del signo", () => {
    expect(Direction(3)).toBe("up");
    expect(Direction(-3)).toBe("down");
    expect(Direction(0)).toBe("flat");
  });
});

describe("TrendIndicator", () => {
  it("formatea con signo y anuncia el sentido para lectores", () => {
    render(<TrendIndicator value={12} />);
    expect(screen.getByText("+12 %")).toBeDefined();
    expect(screen.getByText("al alza")).toBeDefined();
  });

  it("invertColors cambia el color pero no el sentido leído", () => {
    render(<TrendIndicator value={12} invertColors />);
    const node = screen.getByText("+12 %").closest("span[data-trend]");
    expect(node?.getAttribute("data-trend")).toBe("up");
    expect(node?.getAttribute("data-direction")).toBe("down");
  });

  it("acepta un formato propio", () => {
    render(<TrendIndicator value={0.42} format={(value) => `${String(value * 100)} pb`} />);
    expect(screen.getByText("42 pb")).toBeDefined();
  });

  it("el cero se lee como sin cambios", () => {
    render(<TrendIndicator value={0} />);
    expect(screen.getByText("sin cambios")).toBeDefined();
  });
});
