import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import type { SelectOption } from "../../../collections/options.js";
import { Select } from "../Select.js";

afterEach(cleanup);

const DATA: SelectOption[] = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "ar", label: "Argentina", disabled: true },
  { value: "cl", label: "Chile" },
];

describe("Select", () => {
  it("vincula el label y muestra el placeholder", () => {
    render(<Select label="País" data={DATA} placeholder="Elige país" />);
    expect(screen.getByRole("button", { name: /País/ })).toBeDefined();
    expect(screen.getByText("Elige país")).toBeDefined();
  });

  it("no monta el listbox cerrado", () => {
    render(<Select label="País" data={DATA} />);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("abre con click y expone las opciones", async () => {
    const user = userEvent.setup();
    render(<Select label="País" data={DATA} />);
    await user.click(screen.getByRole("button", { name: /País/ }));
    expect(await screen.findByRole("listbox")).toBeDefined();
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("marca la opción deshabilitada con aria-disabled", async () => {
    const user = userEvent.setup();
    render(<Select label="País" data={DATA} />);
    await user.click(screen.getByRole("button", { name: /País/ }));
    await screen.findByRole("listbox");
    expect(screen.getByRole("option", { name: "Argentina" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("selecciona con teclado y publica el valor", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Select label="País" data={DATA} onChange={OnChange} />);

    await user.tab();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("listbox");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(OnChange).toHaveBeenCalledWith("co");
    });
  });

  it("refleja el valor controlado", () => {
    render(<Select label="País" data={DATA} value="cl" onChange={() => undefined} />);
    expect(screen.getByRole("button", { name: /País/ }).textContent).toContain("Chile");
  });

  it("cierra con Escape", async () => {
    const user = userEvent.setup();
    render(<Select label="País" data={DATA} />);
    await user.click(screen.getByRole("button", { name: /País/ }));
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
    });
  });

  it("marca aria-invalid cuando hay error", () => {
    render(<Select label="País" data={DATA} error="Campo obligatorio" />);
    expect(screen.getByRole("button", { name: /País/ }).getAttribute("aria-invalid")).toBe("true");
  });

  it("no abre si está deshabilitado", async () => {
    const user = userEvent.setup();
    render(<Select label="País" data={DATA} disabled />);
    await user.click(screen.getByRole("button", { name: /País/ }));
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
