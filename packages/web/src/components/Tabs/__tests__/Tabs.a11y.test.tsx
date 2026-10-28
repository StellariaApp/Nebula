import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { Tabs } from "../Tabs.js";

afterEach(cleanup);

const DATA = [
  { value: "resumen", label: "Resumen", content: <p>Movimientos del mes</p> },
  { value: "facturas", label: "Facturas", content: <p>Listado de facturas</p> },
  { value: "ajustes", label: "Ajustes", disabled: true, content: <p>Ajustes</p> },
  { value: "equipo", label: "Equipo", content: <p>Personas con acceso</p> },
];

describe("Tabs · accesibilidad", () => {
  it("sin violaciones de axe", async () => {
    const { container } = render(<Tabs data={DATA} aria-label="Cuenta" />);
    await ExpectNoViolations(container);
  });

  it("la pestaña activa lleva aria-selected y el panel se nombra con ella", () => {
    render(<Tabs data={DATA} aria-label="Cuenta" />);
    expect(screen.getByRole("tab", { name: "Resumen" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "Facturas" }).getAttribute("aria-selected")).toBe(
      "false",
    );
    expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).not.toBeNull();
  });

  it("solo la pestaña activa está en el orden de Tab", async () => {
    const user = userEvent.setup();
    render(<Tabs data={DATA} aria-label="Cuenta" />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Resumen" }));
  });

  it("las flechas, Inicio y Fin recorren las pestañas sin caer en la deshabilitada", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(<Tabs data={DATA} aria-label="Cuenta" onChange={on_change} />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Facturas" }));
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Equipo" }));
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Resumen" }));
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Equipo" }));
  });

  it("la deshabilitada se anuncia como tal", () => {
    render(<Tabs data={DATA} aria-label="Cuenta" />);
    const disabled = screen.getByRole("tab", { name: "Ajustes" });
    expect(
      disabled.getAttribute("aria-disabled") ?? String(disabled.hasAttribute("disabled")),
    ).toBe("true");
  });
});
