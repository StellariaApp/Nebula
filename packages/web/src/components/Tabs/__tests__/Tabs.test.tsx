import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import type { TabItem } from "../Tabs.types.js";
import { Tabs } from "../Tabs.js";

afterEach(cleanup);

const data: TabItem[] = [
  { value: "resumen", label: "Resumen", content: "Movimientos del mes" },
  { value: "facturas", label: "Facturas", content: "CFDI emitidos" },
  { value: "archivo", label: "Archivo", content: "Histórico", disabled: true },
];

describe("Tabs", () => {
  it("expone tablist y tabs con panel vinculado (APG)", () => {
    render(<Tabs data={data} aria-label="Cuenta" />);
    expect(screen.getByRole("tablist", { name: "Cuenta" })).toBeDefined();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tabpanel")).toBeDefined();
  });

  it("sin defaultValue selecciona el primer tab", () => {
    render(<Tabs data={data} aria-label="Cuenta" />);
    expect(screen.getByRole("tab", { name: "Resumen" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Movimientos del mes")).toBeDefined();
  });

  it("defaultValue manda sobre el primero", () => {
    render(<Tabs data={data} defaultValue="facturas" aria-label="Cuenta" />);
    expect(screen.getByRole("tab", { name: "Facturas" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("el click cambia de panel y avisa al consumidor", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Tabs data={data} onChange={OnChange} aria-label="Cuenta" />);

    await user.click(screen.getByRole("tab", { name: "Facturas" }));

    await waitFor(() => {
      expect(OnChange).toHaveBeenCalledWith("facturas");
    });
    expect(screen.getByText("CFDI emitidos")).toBeDefined();
  });

  it("las flechas activan el tab siguiente y saltan los deshabilitados", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Tabs data={data} onChange={OnChange} aria-label="Cuenta" />);

    screen.getByRole("tab", { name: "Resumen" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(OnChange).toHaveBeenLastCalledWith("facturas");

    await user.keyboard("{ArrowRight}");
    expect(OnChange).not.toHaveBeenCalledWith("archivo");
  });

  it("Home y End van a los extremos habilitados", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Tabs data={data} defaultValue="facturas" onChange={OnChange} aria-label="Cuenta" />);

    screen.getByRole("tab", { name: "Facturas" }).focus();
    await user.keyboard("{Home}");
    expect(OnChange).toHaveBeenLastCalledWith("resumen");
  });

  it("un tab deshabilitado no se activa", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Tabs data={data} onChange={OnChange} aria-label="Cuenta" />);

    await user.click(screen.getByRole("tab", { name: "Archivo" }));

    expect(OnChange).not.toHaveBeenCalledWith("archivo");
  });

  it("controlado: el valor externo gobierna la selección", () => {
    render(<Tabs data={data} value="facturas" onChange={() => undefined} aria-label="Cuenta" />);
    expect(screen.getByRole("tab", { name: "Facturas" }).getAttribute("aria-selected")).toBe(
      "true",
    );
    expect(screen.getByRole("tab", { name: "Resumen" }).getAttribute("aria-selected")).toBe(
      "false",
    );
  });
});
