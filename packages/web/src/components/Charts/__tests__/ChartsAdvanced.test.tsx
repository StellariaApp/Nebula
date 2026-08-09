import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { ChartLegend } from "../ChartLegend.js";
import { ChartPanel } from "../ChartPanel.js";
import { ChartTooltip } from "../ChartTooltip.js";
import { RadarChart } from "../RadarChart.js";

afterEach(cleanup);

const DATA = [
  { eje: "Velocidad", equipo: 80, media: 60 },
  { eje: "Calidad", equipo: 95, media: 70 },
  { eje: "Coste", equipo: 55, media: 65 },
];

const SERIES = [
  { key: "equipo", label: "Equipo" },
  { key: "media", label: "Media" },
];

describe("RadarChart", () => {
  it("expone el título como nombre de la figura", () => {
    render(<RadarChart data={DATA} series={SERIES} angleKey="eje" title="Capacidades" />);
    expect(screen.getByText("Capacidades")).toBeDefined();
  });

  it("ofrece la tabla de datos como alternativa accesible", () => {
    render(
      <RadarChart
        data={DATA}
        series={SERIES}
        angleKey="eje"
        title="Capacidades"
        withDataTable
        dataTableLabel="Ver los datos"
      />,
    );
    expect(screen.getByText("Ver los datos")).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Equipo" })).toBeDefined();
    expect(screen.getByRole("cell", { name: "Velocidad" })).toBeDefined();
  });

  it("usa el angleKey como primera columna de la tabla", () => {
    render(<RadarChart data={DATA} series={SERIES} angleKey="eje" withDataTable />);
    expect(screen.getByRole("columnheader", { name: "eje" })).toBeDefined();
  });

  it("muestra el vacío declarado", () => {
    render(<RadarChart data={[]} series={SERIES} angleKey="eje" empty="No data" />);
    expect(screen.getByText("No data")).toBeDefined();
  });
});

describe("ChartLegend", () => {
  const ENTRIES = [
    { key: "a", label: "Serie A", color: "#3f37c9" },
    { key: "b", label: "Serie B", color: "#9d4edd" },
  ];

  it("pinta una entrada por serie en una lista", () => {
    render(<ChartLegend entries={ENTRIES} label="Series" />);
    expect(screen.getByRole("list", { name: "Series" })).toBeDefined();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("sin onToggle las entradas no son interactivas", () => {
    render(<ChartLegend entries={ENTRIES} />);
    const button = screen.getByRole("button", { name: "Serie A" });
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.getAttribute("aria-pressed")).toBeNull();
  });

  it("con onToggle son botones de dos estados", async () => {
    const user = userEvent.setup();
    const on_toggle = vi.fn();
    render(<ChartLegend entries={ENTRIES} hidden={["b"]} onToggle={on_toggle} />);

    expect(screen.getByRole("button", { name: "Serie A" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
    expect(screen.getByRole("button", { name: "Serie B" }).getAttribute("aria-pressed")).toBe(
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Serie A" }));
    expect(on_toggle).toHaveBeenCalledWith("a");
  });

  it("el color va en una var, no horneado en la clase", () => {
    render(<ChartLegend entries={ENTRIES} />);
    const swatch = screen.getByRole("button", { name: "Serie A" }).querySelector("span");
    expect(swatch?.getAttribute("style") ?? "").toMatch(/#3f37c9/);
  });
});

describe("ChartTooltip", () => {
  const ITEMS = [
    { key: "a", label: "Serie A", value: 1200, color: "#3f37c9" },
    { key: "b", label: "Serie B", value: 800, color: "#9d4edd" },
  ];

  it("se anuncia como tooltip", () => {
    render(<ChartTooltip title="Enero" items={ITEMS} />);
    expect(screen.getByRole("tooltip")).toBeDefined();
    expect(screen.getByText("Enero")).toBeDefined();
  });

  it("pinta cada serie con su valor", () => {
    render(<ChartTooltip items={ITEMS} />);
    expect(screen.getByText("1200")).toBeDefined();
    expect(screen.getByText("800")).toBeDefined();
  });

  it("acepta un formateador", () => {
    render(<ChartTooltip items={ITEMS} format={(value) => `${String(value)} €`} />);
    expect(screen.getByText("1200 €")).toBeDefined();
  });
});

describe("ChartPanel", () => {
  const PANELS = [
    { id: "a", title: "Colocación", content: <p>Gráfico A</p> },
    { id: "b", title: "Morosidad", description: "Últimos 12 meses", content: <p>Gráfico B</p> },
    { id: "c", content: <p>Gráfico sin título</p>, span: 2 as const },
  ];

  it("cada panel con título es una región etiquetada", () => {
    render(<ChartPanel panels={PANELS} label="Panel" />);
    expect(screen.getByRole("region", { name: "Colocación" })).toBeDefined();
    expect(screen.getByRole("region", { name: "Morosidad" })).toBeDefined();
  });

  it("un panel sin título no reclama etiqueta", () => {
    render(<ChartPanel panels={PANELS} />);
    expect(screen.getByText("Gráfico sin título")).toBeDefined();
    expect(screen.queryAllByRole("region")).toHaveLength(2);
  });

  it("el número de columnas va en una var", () => {
    render(<ChartPanel panels={PANELS} cols={3} label="Panel" />);
    const grid = screen.getByRole("group", { name: "Panel" });
    expect(grid.getAttribute("style") ?? "").toMatch(/3/);
  });

  it("un span mayor que las columnas se recorta", () => {
    render(<ChartPanel panels={[{ id: "x", content: <p>x</p>, span: 3 }]} cols={1} label="P" />);
    expect(screen.getByText("x")).toBeDefined();
  });

  it("pinta la descripción y la acción", () => {
    render(
      <ChartPanel
        panels={[
          {
            id: "a",
            title: "T",
            description: "D",
            action: <button type="button">A</button>,
            content: <p>c</p>,
          },
        ]}
      />,
    );
    expect(screen.getByText("D")).toBeDefined();
    expect(screen.getByRole("button", { name: "A" })).toBeDefined();
  });
});
