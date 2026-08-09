import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import type { SelectOption } from "../../../collections/options.js";
import { MultiSelect } from "../MultiSelect.js";

afterEach(cleanup);

const DATA: SelectOption[] = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "ar", label: "Argentina", disabled: true },
  { value: "cl", label: "Chile" },
];

describe("MultiSelect", () => {
  it("expone un combobox vinculado al label", () => {
    render(<MultiSelect label="Países" data={DATA} />);
    expect(screen.getByRole("combobox", { name: "Países" })).toBeDefined();
  });

  it("renderiza un chip por valor seleccionado", () => {
    render(
      <MultiSelect label="Países" data={DATA} value={["mx", "cl"]} onChange={() => undefined} />,
    );
    expect(screen.getByText("México")).toBeDefined();
    expect(screen.getByText("Chile")).toBeDefined();
  });

  it("la lista permite selección múltiple", async () => {
    const user = userEvent.setup();
    render(<MultiSelect label="Países" data={DATA} />);
    await user.click(screen.getByRole("button", { name: /Países/ }));
    const listbox = await screen.findByRole("listbox");
    expect(listbox.getAttribute("aria-multiselectable")).toBe("true");
  });

  it("acumula selecciones", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<MultiSelect label="Países" data={DATA} onChange={OnChange} />);

    await user.click(screen.getByRole("button", { name: /Países/ }));
    await screen.findByRole("listbox");
    await user.click(screen.getByRole("option", { name: "México" }));

    await waitFor(() => {
      expect(OnChange).toHaveBeenCalledWith(["mx"]);
    });
  });

  it("quita un valor desde su chip", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<MultiSelect label="Países" data={DATA} value={["mx", "cl"]} onChange={OnChange} />);
    await user.click(screen.getByRole("button", { name: "Remove México" }));
    expect(OnChange).toHaveBeenCalledWith(["cl"]);
  });

  it("filtra al escribir cuando es searchable", async () => {
    const user = userEvent.setup();
    render(<MultiSelect label="Países" data={DATA} />);
    await user.type(screen.getByRole("combobox", { name: "Países" }), "col");
    await screen.findByRole("listbox");
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("maxValues bloquea las opciones no seleccionadas", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        label="Países"
        data={DATA}
        maxValues={1}
        value={["mx"]}
        onChange={() => undefined}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Países/ }));
    await screen.findByRole("listbox");
    expect(screen.getByRole("option", { name: "Chile" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
    expect(screen.getByRole("option", { name: "México" }).getAttribute("aria-disabled")).toBeNull();
  });

  it("marca aria-invalid cuando hay error", () => {
    render(<MultiSelect label="Países" data={DATA} error="Selecciona al menos uno" />);
    expect(screen.getByRole("combobox", { name: "Países" }).getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("searchable=false deja el input de solo lectura", () => {
    render(<MultiSelect label="Países" data={DATA} searchable={false} />);
    expect(screen.getByRole<HTMLInputElement>("combobox", { name: "Países" }).readOnly).toBe(true);
  });
});
