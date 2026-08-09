import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import type { SelectOption } from "../../../collections/options.js";
import { Select } from "../../Select/Select.js";
import { Drawer } from "../Drawer.js";

afterEach(cleanup);

const ROLES: SelectOption[] = [
  { value: "admin", label: "Administrador" },
  { value: "op", label: "Operador" },
];

describe("Drawer", () => {
  it("expone un diálogo con su título", () => {
    render(
      <Drawer opened onClose={() => undefined} title="Filters">
        <span>contenido</span>
      </Drawer>,
    );
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeDefined();
  });

  it("marca data-drawer para el layout lateral", () => {
    render(
      <Drawer opened onClose={() => undefined} title="Filters">
        <span>contenido</span>
      </Drawer>,
    );
    expect(screen.getByRole("dialog").getAttribute("data-drawer")).toBe("true");
  });

  it("cierra desde el botón de cierre", async () => {
    const OnClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer opened onClose={OnClose} title="Filters">
        <span>contenido</span>
      </Drawer>,
    );
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(OnClose).toHaveBeenCalledTimes(1);
  });

  it("el desplegable de un Select interior queda dentro del diálogo", async () => {
    const user = userEvent.setup();
    render(
      <Drawer opened onClose={() => undefined} title="Invitar al estudio">
        <Select label="Papel" data={ROLES} />
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: /Papel/ }));
    const listbox = await screen.findByRole("listbox");

    expect(screen.getByRole("dialog").contains(listbox)).toBe(true);
  });
});
