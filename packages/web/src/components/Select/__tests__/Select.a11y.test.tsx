import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";

import { Select } from "../Select.js";

afterEach(cleanup);

const DATA = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "pe", label: "Perú" },
];

describe("Select · accesibilidad", () => {
  it("cerrado, con error y deshabilitado: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <Select label="País" data={DATA} />
        <Select label="Región" data={DATA} error="Elige una región" />
        <Select label="Ciudad" data={DATA} disabled />
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("el listbox lleva el nombre de la etiqueta del campo", async () => {
    const user = userEvent.setup();
    render(<Select label="País" data={DATA} />);
    await user.click(screen.getByRole("button", { name: /País/ }));
    expect(await screen.findByRole("listbox", { name: "País" })).toBeDefined();
  });

  it("abierto: el listbox y sus opciones no tienen violaciones", async () => {
    const user = userEvent.setup();
    render(<Select label="País" data={DATA} />);
    await user.click(screen.getByRole("button", { name: /País/ }));
    await screen.findByRole("listbox");
    await ExpectNoViolations();
  });

  it("Escape cierra la lista y devuelve el foco al botón", async () => {
    const user = userEvent.setup();
    render(<Select label="País" data={DATA} />);
    const trigger = screen.getByRole("button", { name: /País/ });
    await user.click(trigger);
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("elige con flechas y Enter", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(<Select label="País" data={DATA} onChange={on_change} />);
    await user.tab();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("listbox");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(on_change).toHaveBeenCalledTimes(1);
  });

  it("el botón anuncia el estado expandido", async () => {
    const user = userEvent.setup();
    render(<Select label="País" data={DATA} />);
    const trigger = screen.getByRole("button", { name: /País/ });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await user.click(trigger);
    await screen.findByRole("listbox");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });
});
