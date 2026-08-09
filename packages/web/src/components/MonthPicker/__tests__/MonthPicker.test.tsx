import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { MonthPicker } from "../MonthPicker.js";
import { YearPicker } from "../YearPicker.js";

afterEach(cleanup);

describe("MonthPicker", () => {
  it("expone los 12 meses como listbox y marca el seleccionado", () => {
    render(<MonthPicker label="Mes" value="2026-07" />);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(12);
    expect(options.filter((o) => o.getAttribute("aria-selected") === "true")).toHaveLength(1);
  });

  it("emite YYYY-MM al elegir un mes", async () => {
    const on_change = vi.fn();
    render(<MonthPicker label="Mes" defaultValue="2026-07" onChange={on_change} />);
    await userEvent.click(screen.getAllByRole("option")[0] as HTMLElement);
    expect(on_change).toHaveBeenCalledWith("2026-01");
  });

  it("navega con flechas respetando las columnas de la grid", async () => {
    render(<MonthPicker label="Mes" defaultValue="2026-01" />);
    const options = screen.getAllByRole("option");
    (options[0] as HTMLElement).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(options[1]);
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(options[4]);
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(options[11]);
  });

  it("deshabilita los meses fuera de minValue/maxValue", () => {
    render(<MonthPicker label="Mes" value="2026-06" minValue="2026-03" maxValue="2026-09" />);
    const options = screen.getAllByRole("option");
    expect(options[0]?.getAttribute("aria-disabled")).toBe("true");
    expect(options[5]?.getAttribute("aria-disabled")).toBeNull();
  });

  it("cambia de año con la cabecera", async () => {
    render(<MonthPicker label="Mes" defaultValue="2026-07" />);
    await userEvent.click(screen.getByRole("button", { name: "Next year" }));
    expect(screen.getByText("2027")).toBeDefined();
  });
});

describe("YearPicker", () => {
  it("pagina los años y emite YYYY", async () => {
    const on_change = vi.fn();
    render(<YearPicker label="Año" defaultValue="2026" onChange={on_change} yearsPerPage={12} />);
    expect(screen.getAllByRole("option")).toHaveLength(12);
    await userEvent.click(screen.getByRole("option", { name: "2026" }));
    expect(on_change).toHaveBeenCalledWith("2026");
  });

  it("avanza de página con la cabecera", async () => {
    render(<YearPicker label="Año" defaultValue="2026" yearsPerPage={12} />);
    await userEvent.click(screen.getByRole("button", { name: "Next years" }));
    expect(screen.getByRole("option", { name: "2032" })).toBeDefined();
  });

  it("lee el valor de un NebulaField", () => {
    render(
      <YearPicker
        label="Año"
        field={{ value: "2030", setValue: vi.fn(), status: "valid", touched: true }}
      />,
    );
    expect(screen.getByRole("option", { name: "2030" }).getAttribute("aria-selected")).toBe("true");
  });
});
