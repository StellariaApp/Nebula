import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Calendar } from "../Calendar.js";
import { RangeCalendar } from "../RangeCalendar.js";

afterEach(cleanup);

function Day(day: number, month = "July", year = 2026): RegExp {
  return new RegExp(`${month} ${String(day)}, ${String(year)}`);
}

function Cell(day: number): HTMLElement {
  const found = screen
    .getAllByRole("button")
    .filter((node) => node.textContent === String(day));
  if (found.length !== 1) {
    throw new Error(`Se esperaba una celda con el día ${String(day)}, hay ${String(found.length)}`);
  }
  return found[0] as HTMLElement;
}

describe("Calendar", () => {
  it("marca como seleccionada la fecha del valor ISO", () => {
    render(<Calendar label="Fecha" value="2026-07-29" />);
    expect(screen.getByRole("button", { name: Day(29) }).getAttribute("data-selected")).toBe("true");
  });

  it("emite un string ISO al elegir un día", async () => {
    const on_change = vi.fn();
    render(<Calendar label="Fecha" defaultValue="2026-07-15" onChange={on_change} />);
    await userEvent.click(screen.getByRole("button", { name: Day(22) }));
    expect(on_change).toHaveBeenCalledWith("2026-07-22");
  });

  it("no renderiza los días de otro mes como celdas enfocables", () => {
    render(<Calendar label="Fecha" value="2026-07-29" />);
    expect(screen.queryByRole("button", { name: Day(29, "June") })).toBeNull();
    expect(screen.queryByRole("button", { name: Day(1, "August") })).toBeNull();
  });

  it("ignora un valor malformado sin romper el render", () => {
    render(<Calendar label="Fecha" value="29/07/2026" />);
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("navega con el teclado y respeta el patrón APG de grid", async () => {
    render(<Calendar label="Fecha" defaultValue="2026-07-15" />);
    screen.getByRole("button", { name: Day(15) }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: Day(16) }));
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: Day(23) }));
  });

  it("no permite seleccionar fuera de minValue/maxValue", async () => {
    const on_change = vi.fn();
    render(
      <Calendar
        label="Fecha"
        defaultValue="2026-07-15"
        minValue="2026-07-10"
        maxValue="2026-07-20"
        onChange={on_change}
      />,
    );
    const out = screen.getByRole("button", { name: Day(25) });
    expect(out.getAttribute("data-disabled")).toBe("true");
    await userEvent.click(out);
    expect(on_change).not.toHaveBeenCalled();
  });

  it("tacha las fechas declaradas no disponibles", () => {
    render(
      <Calendar
        label="Fecha"
        defaultValue="2026-07-15"
        isDateUnavailable={(iso) => iso === "2026-07-18"}
      />,
    );
    expect(screen.getByRole("button", { name: Day(18) }).getAttribute("data-unavailable")).toBe(
      "true",
    );
  });

  it("lee el valor de un NebulaField", () => {
    render(
      <Calendar
        label="Fecha"
        field={{ value: "2026-07-04", setValue: vi.fn(), status: "valid", touched: true }}
      />,
    );
    expect(screen.getByRole("button", { name: Day(4) }).getAttribute("data-selected")).toBe("true");
  });

  it("cambia de mes con los controles de cabecera", async () => {
    render(<Calendar label="Fecha" defaultValue="2026-07-15" />);
    await userEvent.click(screen.getByRole("button", { name: "Mes siguiente" }));
    expect(screen.getByRole("button", { name: Day(15, "August") })).toBeDefined();
  });
});

describe("RangeCalendar", () => {
  it("marca el rango completo entre start y end", () => {
    render(<RangeCalendar label="Rango" value={{ start: "2026-07-10", end: "2026-07-14" }} />);
    expect(Cell(10).closest("td")?.getAttribute("data-range-start")).toBe("true");
    expect(Cell(12).closest("td")?.getAttribute("data-range-selected")).toBe("true");
    expect(Cell(14).closest("td")?.getAttribute("data-range-end")).toBe("true");
    expect(Cell(16).closest("td")?.getAttribute("data-range-selected")).toBeNull();
  });

  it("emite {start,end} en ISO al completar la selección", async () => {
    const on_change = vi.fn();
    render(
      <RangeCalendar
        label="Rango"
        defaultValue={{ start: "2026-07-01", end: "2026-07-02" }}
        onChange={on_change}
      />,
    );
    await userEvent.click(Cell(10));
    await userEvent.click(Cell(14));
    expect(on_change).toHaveBeenLastCalledWith({ start: "2026-07-10", end: "2026-07-14" });
  });
});
