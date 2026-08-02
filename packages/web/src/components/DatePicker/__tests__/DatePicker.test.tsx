import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { DateRangePicker } from "../../DateRangePicker/DateRangePicker.js";
import { DateTimePicker } from "../../DateTimePicker/DateTimePicker.js";
import { TimeInput } from "../../TimeInput/TimeInput.js";
import { DatePicker } from "../DatePicker.js";
import { DatePickerInput } from "../DatePickerInput.js";

afterEach(cleanup);

function Cell(day: number): HTMLElement {
  const found = screen.getAllByRole("button").filter((n) => n.textContent === String(day));
  if (found.length !== 1) {
    throw new Error(`Se esperaba una celda ${String(day)}, hay ${String(found.length)}`);
  }
  return found[0] as HTMLElement;
}

describe("DatePicker", () => {
  it("vincula el label y expone los segmentos editables", () => {
    render(<DatePicker label="Fecha de alta" value="2026-07-29" />);
    expect(screen.getByText("Fecha de alta")).toBeDefined();
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThanOrEqual(3);
  });

  it("abre el calendario y emite ISO al elegir un día", async () => {
    const on_change = vi.fn();
    render(<DatePicker label="Fecha" defaultValue="2026-07-15" onChange={on_change} />);
    await userEvent.click(screen.getByRole("button", { name: /Abrir calendario/ }));
    await waitFor(() => {
      expect(Cell(22)).toBeDefined();
    });
    await userEvent.click(Cell(22));
    expect(on_change).toHaveBeenCalledWith("2026-07-22");
  });

  it("cierra el popover con Escape", async () => {
    render(<DatePicker label="Fecha" defaultValue="2026-07-15" />);
    await userEvent.click(screen.getByRole("button", { name: /Abrir calendario/ }));
    await waitFor(() => {
      expect(Cell(15)).toBeDefined();
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(
      () => {
        expect(screen.queryByRole("dialog")).toBeNull();
      },
      { timeout: 3000 },
    );
  });

  it("marca aria-invalid y anuncia el error", () => {
    render(<DatePicker label="Fecha" error="Fecha obligatoria" errorDisplay="text" />);
    expect(screen.getByRole("alert").textContent).toBe("Fecha obligatoria");
  });

  it("no abre el calendario deshabilitado", async () => {
    render(<DatePicker label="Fecha" disabled defaultValue="2026-07-15" />);
    const trigger = screen.getByRole("button", { name: /Abrir calendario/ });
    await userEvent.click(trigger);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("acepta las cuatro superficies de ADR-042", () => {
    const { unmount } = render(<DatePicker label="F" surface="filled" value="2026-07-29" />);
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThan(0);
    unmount();
    render(<DatePicker label="F" surface="underline" value="2026-07-29" />);
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThan(0);
  });
});

describe("DateTimePicker", () => {
  it("añade segmentos de hora y emite fecha-hora ISO", () => {
    render(<DateTimePicker label="Cita" value="2026-07-29T14:30" />);
    const segments = screen.getAllByRole("spinbutton");
    expect(segments.length).toBeGreaterThanOrEqual(5);
  });
});

describe("TimeInput", () => {
  it("emite HH:mm al escribir en los segmentos", async () => {
    const on_change = vi.fn();
    render(<TimeInput label="Hora" defaultValue="09:00" onChange={on_change} />);
    const segments = screen.getAllByRole("spinbutton");
    (segments[0] as HTMLElement).focus();
    await userEvent.keyboard("11");
    expect(on_change).toHaveBeenCalled();
    const last = on_change.mock.calls.at(-1)?.[0] as string;
    expect(last).toMatch(/^\d{2}:\d{2}$/);
  });

  it("ignora un valor de hora malformado", () => {
    render(<TimeInput label="Hora" value="25:99" />);
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThan(0);
  });
});

describe("DatePickerInput", () => {
  it("muestra el placeholder cuando no hay valor y conserva el nombre del campo", () => {
    render(<DatePickerInput label="Fecha" placeholder="Elige una fecha" />);
    const trigger = screen.getByRole("button", { name: "Fecha" });
    expect(trigger.textContent).toBe("Elige una fecha");
    expect(trigger.getAttribute("data-placeholder")).toBe("true");
  });

  it("formatea el valor según el locale", () => {
    render(<DatePickerInput label="Fecha" value="2026-07-29" locale="es-ES" />);
    const trigger = screen.getByRole("button", { name: "Fecha" });
    expect(trigger.textContent).toMatch(/2026/);
  });
});

describe("DateRangePicker", () => {
  it("expone dos grupos de segmentos", () => {
    render(<DateRangePicker label="Periodo" value={{ start: "2026-07-01", end: "2026-07-31" }} />);
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThanOrEqual(6);
  });

  it("emite {start,end} en ISO", async () => {
    const on_change = vi.fn();
    render(
      <DateRangePicker
        label="Periodo"
        defaultValue={{ start: "2026-07-01", end: "2026-07-02" }}
        onChange={on_change}
        visibleMonths={1}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Abrir calendario/ }));
    await waitFor(() => {
      expect(Cell(10)).toBeDefined();
    });
    await userEvent.click(Cell(10));
    await userEvent.click(Cell(14));
    expect(on_change).toHaveBeenLastCalledWith({ start: "2026-07-10", end: "2026-07-14" });
  });
});
