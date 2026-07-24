import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import type { SelectOption } from "../../../collections/options.js";
import { Combobox } from "../Combobox.js";

afterEach(cleanup);

const DATA: SelectOption[] = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "ar", label: "Argentina", disabled: true },
  { value: "cl", label: "Chile" },
];

describe("Combobox", () => {
  it("expone un combobox vinculado al label", () => {
    render(<Combobox label="País" data={DATA} />);
    const input = screen.getByRole("combobox", { name: "País" });
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("filtra las opciones al escribir", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" data={DATA} />);
    await user.type(screen.getByRole("combobox", { name: "País" }), "col");

    await screen.findByRole("listbox");
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]?.textContent).toBe("Colombia");
  });

  it("el filtro es por subcadena, no por prefijo", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" data={DATA} />);
    await user.type(screen.getByRole("combobox", { name: "País" }), "co");

    await screen.findByRole("listbox");
    expect(screen.getAllByRole("option").map((node) => node.textContent)).toEqual([
      "México",
      "Colombia",
    ]);
  });

  it("el filtro ignora acentos y mayúsculas", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" data={DATA} />);
    await user.type(screen.getByRole("combobox", { name: "País" }), "MEXI");

    await screen.findByRole("listbox");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option").textContent).toBe("México");
  });

  it("selecciona con flechas y Enter", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Combobox label="País" data={DATA} onChange={OnChange} />);

    await user.type(screen.getByRole("combobox", { name: "País" }), "col");
    await screen.findByRole("listbox");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(OnChange).toHaveBeenCalledWith("co");
    });
  });

  it("muestra el mensaje vacío cuando no hay coincidencias", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" data={DATA} emptyLabel="Nada por aquí" />);
    await user.type(screen.getByRole("combobox", { name: "País" }), "zzz");
    expect(await screen.findByText("Nada por aquí")).toBeDefined();
  });

  it("el botón de despliegue abre la lista completa", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" data={DATA} />);
    await user.click(screen.getByRole("button", { name: /País/ }));
    await screen.findByRole("listbox");
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("cierra con Escape", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" data={DATA} />);
    await user.click(screen.getByRole("button", { name: /País/ }));
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
    });
  });

  it("marca aria-invalid cuando hay error", () => {
    render(<Combobox label="País" data={DATA} error="Campo obligatorio" />);
    expect(screen.getByRole("combobox", { name: "País" }).getAttribute("aria-invalid")).toBe("true");
  });

  it("refleja el valor controlado en el input", () => {
    render(<Combobox label="País" data={DATA} value="cl" onChange={() => undefined} />);
    expect(screen.getByRole<HTMLInputElement>("combobox", { name: "País" }).value).toBe("Chile");
  });
});
