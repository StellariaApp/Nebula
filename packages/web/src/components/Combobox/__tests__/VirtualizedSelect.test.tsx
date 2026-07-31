import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { VirtualizedSelect } from "../VirtualizedSelect.js";

afterEach(cleanup);

function Options(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    value: `v${String(index)}`,
    label: `Opción ${String(index)}`,
  }));
}

describe("VirtualizedSelect", () => {
  it("por debajo del umbral pinta todas las opciones", async () => {
    const user = userEvent.setup();
    render(<VirtualizedSelect data={Options(10)} label="Sucursal" />);
    await user.click(screen.getByRole("button", { name: /Sucursal/ }));
    expect(screen.getAllByRole("option")).toHaveLength(10);
  });

  it("a partir del umbral solo pinta la ventana visible", async () => {
    const user = userEvent.setup();
    render(<VirtualizedSelect data={Options(400)} label="Sucursal" />);
    await user.click(screen.getByRole("button", { name: /Sucursal/ }));
    const rendered = screen.getAllByRole("option");
    expect(rendered.length).toBeGreaterThan(0);
    expect(rendered.length).toBeLessThan(60);
  });

  it("marca la lista como virtualizada", async () => {
    const user = userEvent.setup();
    render(<VirtualizedSelect data={Options(400)} label="Sucursal" />);
    await user.click(screen.getByRole("button", { name: /Sucursal/ }));
    expect(screen.getByRole("listbox").getAttribute("data-windowed")).toBe("true");
  });

  it("acepta un umbral propio", async () => {
    const user = userEvent.setup();
    render(<VirtualizedSelect data={Options(20)} virtualizeFrom={10} label="Sucursal" />);
    await user.click(screen.getByRole("button", { name: /Sucursal/ }));
    expect(screen.getByRole("listbox").getAttribute("data-windowed")).toBe("true");
  });

  it("las opciones fuera de la ventana no ocupan el árbol de accesibilidad", async () => {
    const user = userEvent.setup();
    render(<VirtualizedSelect data={Options(400)} label="Sucursal" />);
    await user.click(screen.getByRole("button", { name: /Sucursal/ }));
    expect(screen.queryByRole("option", { name: "Opción 399" })).toBeNull();
  });

  it("sigue filtrando por texto como cualquier Combobox", async () => {
    const user = userEvent.setup();
    render(<VirtualizedSelect data={Options(400)} label="Sucursal" />);
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("Opción 123");
    expect(screen.getByRole("option", { name: "Opción 123" })).toBeDefined();
  });
});
